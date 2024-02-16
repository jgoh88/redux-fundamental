import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import rootReducer from "./reducer";
import {includeMeaningOfLife, sayHiOnDispatch} from "./exampleAddons/enhancers";
import { print1, print2, print3 } from "./exampleAddons/middleware";

let preloadedState
const persistedTodosString = localStorage.getItem('todos')

if (persistedTodosString) {
  preloadedState = {
    todos: JSON.parse(persistedTodosString)
  }
}

/*
  Using enhancers to override/replace dispatch and/or getState
*/
// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
// const store = createStore(rootReducer, preloadedState, composedEnhancer)

/*
  Using middlewares to customize dispatch
*/
// const middlewareEnhancer = applyMiddleware(print1, print2, print3)
// const store = createStore(rootReducer, preloadedState, middlewareEnhancer)

/*
  Using middlewares to customize dispatch with redux devtool extension
*/
// const composedEnhancer = composeWithDevTools(
//   applyMiddleware(print1, print2, print3)
// )
// const store = createStore(rootReducer, preloadedState, composedEnhancer)

const composedEnhancer = composeWithDevTools(
  applyMiddleware(thunk)
)
const store = createStore(rootReducer, preloadedState, composedEnhancer)

export default store