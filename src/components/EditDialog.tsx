import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { todoStore } from '../store/MobX'
import type { Todo } from '../types/todo'

const schema = z.object({
  name: z.string().trim()
    .min(1, 'Введите название')
    .max(100, 'Максимум 100 символов'),

  description: z.string().trim()
    .min(1, 'Введите описание')
    .max(1000, 'Максимум 1000 символов'),
})

type FormValues = z.infer<typeof schema>

export default function EditDialog({ todo }: { todo: Todo }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  function openDialog() {
    reset({
      name: todo.name,
      description: todo.description,
    })

    dialogRef.current?.showModal()
  }

  async function onSubmit(values: FormValues) {
    clearErrors('root')

    try {
      await todoStore.editTodo({
        id: todo.id,
        name: values.name,
        description: values.description,
      })

      dialogRef.current?.close()
    } catch {
      setError('root', {
        message: 'Не удалось сохранить изменения.',
      })
    }
  }

  return (
    <>
      <button
        className="button-secondary"
        type="button"
        onClick={openDialog}
      >
        Редактировать
      </button>

      <dialog
        className="add-dialog"
        ref={dialogRef}
      >
        <h2 id={`edit-title-${todo.id}`}>Редактировать задачу</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            Название
            <input {...register('name')} />
          </label>
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}

          <label>
            Описание
            <textarea rows={4} {...register('description')} />
          </label>
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}

          {errors.root && (
            <p className="form-error" role="alert">
              {errors.root.message}
            </p>
          )}

          <div className="dialog-actions">
            <button
              className="button-secondary"
              type="button"
              disabled={isSubmitting}
              onClick={() => dialogRef.current?.close()}
            >
              Отмена
            </button>

            <button
              className="button-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}