import { useMemo, useState } from 'react';

const STATUSES = ['To Do', 'In Progress', 'Done'];

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('ru-RU');
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [filter, setFilter] = useState('All');

  const todayIso = new Date().toISOString().split('T')[0];
  const currentDateText = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const filteredTasks = useMemo(() => {
    const prepared = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
    if (filter === 'All') {
      return prepared;
    }
    return prepared.filter((task) => task.status === filter);
  }, [tasks, filter]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || !deadline) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: trimmedTitle,
      deadline,
      status: 'To Do'
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle('');
    setDeadline('');
  }

  function updateStatus(taskId, newStatus) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  return (
    <div className="page">
      <div className="app">
        <header className="header">
          <div>
            <h1>Менеджер задач</h1>
            <p className="subtitle">Текущая дата: {currentDateText}</p>
          </div>

          <div className="filter-box">
            <label htmlFor="statusFilter">Фильтр по статусу</label>
            <select
              id="statusFilter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">Все</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="panel">
          <h2>Добавить задачу</h2>
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="taskTitle">Название задачи</label>
              <input
                id="taskTitle"
                type="text"
                placeholder="Например: Подготовить отчёт"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="taskDeadline">Дедлайн</label>
              <input
                id="taskDeadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>

            <button type="submit">Добавить</button>
          </form>
        </section>

        <section className="panel">
          <h2>Список задач</h2>

          {filteredTasks.length === 0 ? (
            <p className="empty">Задачи не найдены.</p>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => {
                const isOverdue = task.status !== 'Done' && task.deadline < todayIso;

                return (
                  <article
                    key={task.id}
                    className={`task-card ${isOverdue ? 'task-card-overdue' : ''}`}
                  >
                    <div className="task-info">
                      <h3>{task.title}</h3>
                      <p>
                        <span>Дедлайн:</span> {formatDate(task.deadline)}
                      </p>
                      <p>
                        <span>Статус:</span> {task.status}
                      </p>
                      {isOverdue && <p className="overdue-text">Задача просрочена</p>}
                    </div>

                    <div className="task-actions">
                      <label htmlFor={`status-${task.id}`}>Изменить статус</label>
                      <select
                        id={`status-${task.id}`}
                        value={task.status}
                        onChange={(event) => updateStatus(task.id, event.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
