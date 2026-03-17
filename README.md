# Personal Task Manager (Python)

一个基于 **FastAPI + SQLModel + SQLite** 的个人任务管理系统 MVP。

## 功能

- 新建任务（标题、描述、截止日期、优先级、状态、分类）
- 任务列表与筛选（按状态、优先级、是否今天到期）
- 查看任务详情
- 更新任务（PATCH）
- 删除任务
- 健康检查接口

## 快速开始

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

访问：`http://127.0.0.1:8000/docs`

## API 概览

- `GET /health`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `PATCH /tasks/{task_id}`
- `DELETE /tasks/{task_id}`

## 测试

```bash
pytest -q
```
