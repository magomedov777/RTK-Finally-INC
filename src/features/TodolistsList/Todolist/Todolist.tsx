/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { TodolistDomainType } from 'features/TodolistsList/model/todolists.reducer'
import { tasksThunks } from 'features/TodolistsList/model/tasks.reducer'
import { useActions } from 'common/hooks'
import { AddItemForm } from 'common/components'
import { TaskType } from '../api/tasks.api-types'
import { FilterTasksButton } from './filter-tasks-button/FilterTasksButton'
import { Tasks } from './Tasks/Tasks'
import { TodolistTitle } from './todolist-title/TodolistTitle'

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}

export const Todolist = React.memo(function (props: PropsType) {
  const { fetchTasks, addTask } = useActions(tasksThunks)

  useEffect(() => {
    fetchTasks(props.todolist.id)
  }, [])

  const addTaskCb = (title: string) => {
    return addTask({ title, todolistId: props.todolist.id }).unwrap()
  }

  return (
    <div>
      <TodolistTitle todolist={props.todolist} />
      <AddItemForm addItem={addTaskCb} disabled={props.todolist.entityStatus === 'loading'} />
      <Tasks tasks={props.tasks} todolist={props.todolist} />
      <div style={{ paddingTop: '10px' }}>
        <FilterTasksButton todolist={props.todolist} />
      </div>
    </div>
  )
})
