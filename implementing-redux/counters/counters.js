// Actions
const INCREMENT = 'app/counter/INCREMENT'
const DECREMENT = 'app/counter/DECREMENT'
const RESET = 'app/counter/RESET'

const initialCounterState = parseInt(localStorage.getItem('count'), 10) || 0

// Reducer
export default function reducer(state = initialCounterState, action = {}) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    case RESET:
      return 0
    default:
      return state
  }
}

// Action Creator Functions
export function incrementCounter() {
  return { type: INCREMENT }
}
export function decrementCounter() {
  return { type: DECREMENT }
}
export function resetCounter() {
  return { type: RESET }
}

// Middlewares
export const localStorageMiddleware = store => () => next => action => {
  localStorage.setItem('count', reducer(store.getState(), action))
  next(action)
}
