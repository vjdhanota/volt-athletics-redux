import Dedux from './dedux.js'
import counterReducer, {
  decrementCounter,
  incrementCounter,
  resetCounter,
  localStorageMiddleware,
} from './counters/counters.js'

const { createStore, applyMiddleware } = Dedux

const store = createStore(counterReducer)
applyMiddleware(store, [localStorageMiddleware(store)])

const countText = document.getElementById('count')
const upBtn = document.getElementById('up')
const downBtn = document.getElementById('down')
const resetBtn = document.getElementById('reset')

// Setup the initial state from local storage if available
countText.innerHTML = store.getState()
store.subscribe(count => {
  countText.innerHTML = count
})

// Setup button click listeners
upBtn.addEventListener('click', () => store.dispatch(incrementCounter()))
downBtn.addEventListener('click', () => store.dispatch(decrementCounter()))
resetBtn.addEventListener('click', () => store.dispatch(resetCounter()))
