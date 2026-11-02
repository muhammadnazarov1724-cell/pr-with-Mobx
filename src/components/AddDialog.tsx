import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { todoStore } from '../store/MobX'

const schema = z.object({
  name: z.string().trim()
    .min(1, 'Введите название')
    .max(100, 'Максимум 100 символов'),

  description: z.string().trim()
    .min(1, 'Введите описание')
    .max(1000, 'Максимум 1000 символов'),

  images: z.instanceof(FileList)
    .refine((files) => files.length > 0, 'Выберите изображение'),
})

type FormValues = z.infer<typeof schema>

export default function AddDialog() {
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

  async function onSubmit(values: FormValues) {
    clearErrors('root')

    const formData = new FormData()

    formData.append('Name', values.name)
    formData.append('Description', values.description)

    Array.from(values.images).forEach((file) => {
      formData.append('Images', file)
    })

    try {
      await todoStore.addTodo(formData)
      reset()
      dialogRef.current?.close()
    } catch {
      setError('root', {
        message: 'Не удалось добавить задачу. Попробуйте ещё раз.',
      })
    }
  }

  return (
    <>
      <button
        className="button-primary button-add"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span aria-hidden="true">+</span> Добавить задачу
      </button>

      <dialog className="add-dialog" ref={dialogRef} aria-labelledby="add-title">
        <p className="eyebrow">НОВАЯ ЗАПИСЬ</p>
        <h2 id="add-title">Добавить задачу</h2>
        <p className="dialog-description">Укажите название, описание и добавьте изображения.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            Название
            <input
              placeholder="Что нужно сделать?"
              {...register('name')}
            />
          </label>
          {errors.name && <p className="form-error" id="name-error">{errors.name.message}</p>}

          <label>
            Описание
            <textarea
              placeholder="Детали задачи…"
              rows={4}
              {...register('description')}
            />
          </label>
          {errors.description && <p className="form-error" id="description-error">{errors.description.message}</p>}

          <label>
            Изображения
            <input
              type="file"
              accept="image/*"
              multiple
              {...register('images')}
            />
          </label>
          {errors.images && <p className="form-error" id="images-error">{errors.images.message}</p>}

          {errors.root && <p className="form-error" role="alert">{errors.root.message}</p>}

          <div className="dialog-actions">
            <button
              className="button-secondary"
              type="button"
              disabled={isSubmitting}
              onClick={() => dialogRef.current?.close()}
            >
              Отмена
            </button>
            <button className="button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение…' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
