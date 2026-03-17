# Personal Task Manager (Python)

一个可直接运行的个人任务管理系统成品（MVP），基于 **FastAPI + SQLModel + SQLite**。

## 成品包含

- Web 页面（`/`）：
  - 新建任务
  - 状态/优先级/今天到期筛选
  - 标记完成
  - 删除任务
- API 接口：
  - `GET /health`
  - `POST /tasks`
  - `GET /tasks`
  - `GET /tasks/{task_id}`
  - `PATCH /tasks/{task_id}`
  - `DELETE /tasks/{task_id}`

## 快速开始

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

打开：
- 页面：`http://127.0.0.1:8000/`
- API 文档：`http://127.0.0.1:8000/docs`

## 测试

```bash
pytest -q
```
