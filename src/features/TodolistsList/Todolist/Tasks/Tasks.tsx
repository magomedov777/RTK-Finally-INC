import { TaskType } from 'features/TodolistsList/api/tasks.api-types'
import { Task } from '../Task/Task'
import { TodolistDomainType } from 'features/TodolistsList/model/todolists.reducer'
import React from 'react'
import { TaskStatuses } from 'common/enums'

type Props = {
  tasks: TaskType[]
  todolist: TodolistDomainType
}

export const Tasks = ({ tasks, todolist }: Props) => {
  const { id, filter } = todolist

  let tasksForTodolist = tasks
  if (filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  return (
    <div>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={id} />
      ))}
    </div>
  )
}
