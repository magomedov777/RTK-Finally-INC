import Button from '@mui/material/Button/Button'
import { useActions } from 'common/hooks'
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from 'features/TodolistsList/model/todolists.reducer'
import React from 'react'
import { Fragment } from 'react'

export type Props = {
  todolist: TodolistDomainType
}

export const FilterTasksButton = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const { changeTodolistFilter } = useActions(todolistsActions)

  const changeTasksFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ filter, id })
  }

  return (
    <Fragment>
      <Button
        variant={filter === 'all' ? 'outlined' : 'text'}
        onClick={() => changeTasksFilterHandler('all')}
        color={'inherit'}>
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'outlined' : 'text'}
        onClick={() => changeTasksFilterHandler('active')}
        color={'primary'}>
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'outlined' : 'text'}
        onClick={() => changeTasksFilterHandler('completed')}
        color={'secondary'}>
        Completed
      </Button>
    </Fragment>
  )
}
