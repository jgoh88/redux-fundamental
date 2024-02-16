import React, { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import TodoListItem from './TodoListItem';
import { StatusFilters } from '../filters/filtersSlice';
import { selectFilteredTodoIds, selectTodoIds } from './todosSlice';

const TodoList = () => {
  // const { colors, status } = useSelector((state) => state.filters)
  // const selectTodoIds = useCallback((state) => {
  //   return state.todos.filter((todo) => {
  //     let matchStatusFilter
  //     switch (status) {
  //       case StatusFilters.Active: {
  //         matchStatusFilter = !todo.completed
  //         break
  //       }
  //       case StatusFilters.Completed: {
  //         matchStatusFilter = todo.completed
  //         break
  //       }
  //       default:
  //         matchStatusFilter = true
  //     }
      
  //     let matchColorFilter = true
  //     if (colors.length) {
  //       matchColorFilter = colors.includes(todo.color)
  //     }

  //     return matchStatusFilter && matchColorFilter
  //   })
  //   .map((todo) => todo.id)
  // }, [status, colors])
  // const todoIds = useSelector(selectTodoIds, shallowEqual)

  const todoIds = useSelector(selectFilteredTodoIds)
  const loadingStatus = useSelector((state) => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
