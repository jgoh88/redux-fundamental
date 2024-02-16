import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'

import './api/server'

import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

// console.log('Dispatching action')
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
// console.log('Dispatch complete')
// console.log('State after dispatch: ', store.getState())

store.dispatch(fetchTodos())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
