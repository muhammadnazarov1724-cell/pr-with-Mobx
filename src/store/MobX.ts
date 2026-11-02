import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import type { Todo } from '../types/todo'

const api = 'https://to-dos-api.softclub.tj/api/to-dos'

function createTodoStore() {
  const store = {
    todos: [] as Todo[],

    async getTodos(): Promise<void> {
      const { data } = await axios.get<{ data: Todo[] }>(api)

      runInAction(() => {
        store.todos = data.data
      })
    },

    async deleteTodo(id: number): Promise<void> {
      await axios.delete(api, {
        params: { id },
      })

      await store.getTodos()
    },

    async addTodo(newTodo: FormData): Promise<void> {
      await axios.post(api, newTodo)

      await store.getTodos()
    },

    async editTodo(
      updatedTodo: Pick<Todo, 'id' | 'name' | 'description'>,
    ): Promise<void> {
      await axios.put(api, updatedTodo)

      await store.getTodos()
    },
  }

  return makeAutoObservable(store)
}

export const todoStore = createTodoStore()