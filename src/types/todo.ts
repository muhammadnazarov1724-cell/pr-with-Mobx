export type TodoImage = {
  id: number
  imageName: string
}

export type Todo = {
  id: number
  name: string
  description: string
  isCompleted: boolean
  images: TodoImage[]
}