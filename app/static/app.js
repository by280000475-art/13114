const listEl = document.getElementById('task-list');
const formEl = document.getElementById('task-form');

function q(id) { return document.getElementById(id); }

async function loadTasks() {
  const params = new URLSearchParams();
  if (q('filter-status').value) params.set('status', q('filter-status').value);
  if (q('filter-priority').value) params.set('priority', q('filter-priority').value);
  if (q('filter-due-today').checked) params.set('due_today', 'true');

  const response = await fetch(`/tasks?${params.toString()}`);
  const tasks = await response.json();

  listEl.innerHTML = '';
  if (!tasks.length) {
    listEl.innerHTML = '<li>暂无任务</li>';
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.title}</strong>
      <div>${task.description || ''}</div>
      <div class="meta">状态：${task.status} ｜ 优先级：${task.priority} ｜ 截止：${task.due_date || '无'} ｜ 分类：${task.category || '无'}</div>
      <div class="actions">
        <button class="secondary" data-action="done" data-id="${task.id}">标记完成</button>
        <button class="danger" data-action="delete" data-id="${task.id}">删除</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formEl);
  const payload = Object.fromEntries(formData.entries());
  if (!payload.due_date) delete payload.due_date;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    alert('创建失败，请检查输入');
    return;
  }
  formEl.reset();
  loadTasks();
});

listEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'done') {
    await fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    loadTasks();
  }
  if (btn.dataset.action === 'delete') {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  }
});

['filter-status', 'filter-priority', 'filter-due-today', 'refresh-btn'].forEach((id) => {
  q(id).addEventListener('change', loadTasks);
  q(id).addEventListener('click', loadTasks);
});

loadTasks();
