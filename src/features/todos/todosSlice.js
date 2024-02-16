import { createSelector } from "reselect"
import { client } from "../../api/client"

import { StatusFilters } from "../filters/filtersSlice"

const initialState = {
  status: 'idle',
  entities: {}
}

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo
        }
      }
    }
    case 'todos/todoToggled': {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed
          }
        }
      }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color
          }
        }
      }
    }
    case 'todos/todoDeleted': {
      const newEntities = { ...state.entities }
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/allCompleted': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/completedCleared': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }
    case 'todos/todosLoaded': {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities
      }
    }
    default:
      return state
  }
}

export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos,
  }
}

export const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo,
  }
}

export const todosLoading = () => {
  return {
    type: 'todos/todosLoading',
    payload: {},
  }
}

export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, getState) {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}

const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(
  selectTodoEntities, 
  entities => Object.values(entities)
)

export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}

export const selectFilteredTodos = createSelector(
  selectTodos,
  state => state.filters,
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id)
)