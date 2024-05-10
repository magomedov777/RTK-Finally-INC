/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, FC, memo } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { EditableSpan } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { TaskType } from 'features/TodolistsList/api/tasks.api-types'
import { useActions } from 'common/hooks'
import { tasksThunks } from 'features/TodolistsList/model/tasks.reducer'

type Props = {
  task: TaskType
  todolistId: string
}

export const Task: FC<Props> = memo(({ task, todolistId }) => {
  const { removeTask, updateTask } = useActions(tasksThunks)

  const onClickHandler = () => removeTask({ taskId: task.id, todolistId: todolistId })
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    updateTask({
      taskId: task.id,
      domainModel: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
      todolistId: todolistId,
    })
  }

  const onTitleChangeHandler = (title: string) => {
    updateTask({
      taskId: task.id,
      domainModel: { title },
      todolistId: todolistId,
    })
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
      />

      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})
