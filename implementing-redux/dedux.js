export default {
  createStore,
  applyMiddleware,
}

function createStore(reducer) {
  if (typeof reducer !== 'function') {
    throw new Error('No reducer provided')
  }

  let state = reducer()
  let subscribers = []

  function dispatch(action) {
    if (!action || !action.type || typeof action.type !== 'string') {
      throw new Error('Invalid action provided')
    }

    state = reducer(state, action)

    for (const subscriber of subscribers) {
      subscriber(state)
    }
  }

  function subscribe(subscriber) {
    subscribers.push(subscriber)

    function unsubscribe() {
      const subIndex = subscribers.indexOf(subscriber)
      subscribers.splice(subIndex, 1)
    }

    return unsubscribe
  }

  function getState() {
    return state
  }

  return { dispatch, subscribe, getState }
}

function applyMiddleware(store, middlewares) {
  let dispatch = store.dispatch

  // We reverse the input middlewares array so that they are executed in the written order
  const copiedMiddlewares = middlewares.slice().reverse()

  copiedMiddlewares.forEach(middleware => {
    // Link the middlewares
    dispatch = middleware(store)(dispatch)
  })

  // Set the dispatch to the start of the middleware execution
  store.dispatch = dispatch
}
