import {legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux';
import bugsReducer from '../bugs/reducers/bugsReducer';
import projectsReducer from '../projects/reducer';

// middlewares
import logger from 'redux-logger'
import { thunk } from 'redux-thunk';

// log middleware
/* 
function logMiddlewareFactory(store){
    return function logMiddleware(next) {
        return function logMiddlewareActionProcessor (action) {
            console.group(action.type)
            console.log('Before :', store.getState())
            console.log('Action :', action)
            next(action)
            console.log("After :", store.getState());
            console.groupEnd()
        };
    };
} 
*/

// implementation of 'redux-logger'
const logMiddlewareFactory = ({getState, dispatch}) => next => action => {
    console.group(action.type)
    console.log('Before :', getState())
    console.log('Action :', action)
    next(action)
    console.log("After :", getState());
    console.groupEnd()
}

// implementation of 'redux-thunk'
const asyncMiddlewareFactory = ({getState, dispatch}) => next => action => {
  if (typeof action === 'function'){
    return action(dispatch, getState);
  }
  return next(action);
}

const promiseMiddlewareFactory = ({getState, dispatch}) => next => action => {
  if (action instanceof Promise){
    action
      .then(actionObj => dispatch(actionObj))
      .catch(err => {
        dispatch({ type : 'ERROR_SET', payload : err.toString()})
      })
    return;
  }
  return next(action)
}

function errorReducer(currentState = '', action){
  switch (action.type) {
    case "ERROR_SET":
      return action.payload;
      break;
    case "ERROR_CLEAR":
      return '';
      break;
    default:
      return currentState;
  }
}

const rootReducer = combineReducers({
    bugsState : bugsReducer,
    projectsState : projectsReducer,
    errorState : errorReducer
})

/* 
const preloadedState = {
  bugsState: [
    {
      id: 1,
      name: "Server communication failure",
      isClosed: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "User access denied",
      isClosed: false,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Data integrity checks failed",
      isClosed: true,
      createdAt: new Date(),
    },
  ],
  projectsState: [
    { id: 1, name: "Time Tracker" },
    { id: 2, name: "Expense Tracker" },
  ],
}; 
*/

/* 
const hibernatedState = window.localStorage.getItem('bugStore') 
const preloadedState = hibernatedState ? JSON.parse(hibernatedState) : { bugsState : [], projectsState : []} 
*/
const preloadedState = undefined;
const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(
    /* logMiddlewareFactory, */
    logger,
    /* asyncMiddlewareFactory, */
    thunk,
    promiseMiddlewareFactory
  )
);
export default store;