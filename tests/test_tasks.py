from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.database import get_session
from app.main import app
from app.models import Task

# Setup and TestClient's worker threads must use the same in-memory database.
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


def override_get_session():
    with Session(engine) as session:
        yield session


app.dependency_overrides[get_session] = override_get_session


def setup_function() -> None:
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


client = TestClient(app)


@pytest.mark.parametrize("title", ["First isolated task", "Second isolated task"])
def test_setup_and_requests_share_isolated_database(title: str) -> None:
    # Each parameter gets a fresh schema, even though the engine is shared.
    initial = client.get("/tasks")
    assert initial.status_code == 200
    assert initial.json() == []

    with Session(engine) as session:
        task = Task(title=title)
        session.add(task)
        session.commit()
        session.refresh(task)
        task_id = task.id

    # Read a main-thread write from the request's worker thread.
    fetched = client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == title

    updated = client.patch(f"/tasks/{task_id}", json={"status": "done"})
    assert updated.status_code == 200

    # A new main-thread session must also see the request's committed write.
    with Session(engine) as session:
        saved = session.get(Task, task_id)
        assert saved is not None
        assert saved.status == "done"


def test_task_crud_flow() -> None:
    created = client.post(
        "/tasks",
        json={
            "title": "Build MVP",
            "description": "FastAPI version",
            "priority": "high",
            "status": "todo",
            "due_date": str(date.today()),
        },
    )
    assert created.status_code == 201
    task_id = created.json()["id"]

    fetched = client.get(f"/tasks/{task_id}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Build MVP"

    updated = client.patch(f"/tasks/{task_id}", json={"status": "done"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "done"

    listed = client.get("/tasks", params={"status": "done"})
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    deleted = client.delete(f"/tasks/{task_id}")
    assert deleted.status_code == 204

    missing = client.get(f"/tasks/{task_id}")
    assert missing.status_code == 404


def test_index_page_available() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert "个人任务管理系统" in response.text
