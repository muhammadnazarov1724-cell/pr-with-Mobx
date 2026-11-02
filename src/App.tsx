import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { todoStore } from './store/MobX'
import AddDialog from './components/AddDialog'
import './App.css'
import EditDialog from './components/EditDialog'

const App = observer(function App() {
  useEffect(() => {
    todoStore.getTodos().catch(console.error)
  }, [])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">МОЙ ПЛАНЕР</p>
          <h1>Список задач<span className="title-dot">.</span></h1>
          <p className="page-description">Освободите голову — запишите всё здесь.</p>
        </div>
        <AddDialog />
      </header>

      <section aria-labelledby="tasks-heading">
        <div className="section-header">
          <h2 id="tasks-heading">Ваши задачи</h2>
          <span className="task-count">Показано: {todoStore.todos.length}</span>
        </div>

        <div className="task-grid">
          {todoStore.todos.map((todo) => (
            <article className="task-card" key={todo.id}>
              <div className="task-card-header">
                <span className={`task-status ${todo.isCompleted ? 'task-status--done' : 'task-status--pending'}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {todo.isCompleted ? 'Выполнено' : 'В работе'}
                </span>
                <span className="task-id">#{todo.id}</span>
              </div>

              <h3>{todo.name}</h3>
              <p className="task-description">{todo.description}</p>

              {todo.images.length > 0 && (
                <div className="task-images">
                  {todo.images.map((image) => (
                    <img
                      key={image.id}
                      src={`https://to-dos-api.softclub.tj/images/${image.imageName}`}
                    />
                  ))}
                </div>
              )}

              <footer className="task-card-footer">
                <footer className="task-card-footer">
                <EditDialog todo={todo} />

                </footer>
                <button
                  className="button-delete"
                  type="button"
                  onClick={() => todoStore.deleteTodo(todo.id).catch(console.error)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Удалить
                </button>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
})

export default App
