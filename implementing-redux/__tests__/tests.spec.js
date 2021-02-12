import Dedux from '../dedux'
const { createStore, applyMiddleware } = Dedux

/*======================================================
                          TESTS
======================================================*/
describe('dedux', () => {
  describe('createStore', () => {
    it('errors if no reducer function is passed in', () => {
      expect(() => createStore()).toThrow()
      expect(() => createStore({})).toThrow()
      expect(() => createStore('foo')).toThrow()
      expect(() => createStore(() => ({}))).not.toThrow()
    })
  })

  describe('the store', () => {
    describe('getState', () => {
      it(`returns the reducer's return value`, () => {
        const reducer = () => ({ foo: 'bar' })
        const store = createStore(reducer)
        expect(store.getState().foo).toBe('bar')
      })
    })

    describe('dispatch', () => {
      it('takes an action that conforms to { type: string, ...any }', () => {
        const store = createStore(() => {})

        expect(() => {
          store.dispatch({ randomKey: 'randomValue' })
        }).toThrow()

        expect(() => {
          store.dispatch({ type: 123, randomKey: 'randomValue' })
        }).toThrow()

        expect(() => {
          store.dispatch(null)
        }).toThrow()

        expect(() => {
          store.dispatch({ type: 'TEST_ACTION', randomKey: 'randomValue' })
        }).not.toThrow()
      })

      it(`dispatch should take any dispatched action and run it 
          through the reducer function to produce a new state.`, () => {
        const reducer = (state = { foo: 'bar' }, action = {}) => {
          switch (action.type) {
            case 'BAZIFY':
              return {
                ...state,
                foo: 'baz',
              }
            default:
              return state
          }
        }

        const store = createStore(reducer)

        expect(store.getState().foo).toBe('bar')

        store.dispatch({ type: 'BAZIFY' })

        expect(store.getState().foo).toBe('baz')
      })
    })

    describe('subscribe', () => {
      it(`has a subscribe method that receives updates on any state change`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalledWith(42)
      })

      it(`will return a function that allows you to unsubscribe`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        const unsubscribe = store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalledTimes(1)

        unsubscribe()

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })
        expect(subscriber).toHaveBeenCalledTimes(1)
      })

      it(`will unsubscribe from the correct subscriber`, () => {
        const subscriberOne = jest.fn()
        const subscriberTwo = jest.fn()
        const reducer = (state = 'Jalapeno', action = {}) => {
          switch (action.type) {
            case 'SPICE_IT_UP':
              return 'Habanero'
            case 'COOL_IT_DOWN':
              return 'Ice Cream'
            default:
              return state
          }
        }

        const store = createStore(reducer)

        const unsubOne = store.subscribe(subscriberOne)
        const unsubTwo = store.subscribe(subscriberTwo)

        store.dispatch({ type: 'SPICE_IT_UP' })

        expect(subscriberOne).toHaveBeenCalledTimes(1)
        expect(subscriberTwo).toHaveBeenCalledTimes(1)

        unsubOne()

        store.dispatch({ type: 'COOL_IT_DOWN' })
        expect(subscriberOne).toHaveBeenCalledTimes(1)
        expect(subscriberTwo).toHaveBeenCalledTimes(2)

        unsubTwo()
      })
    })
  })

  describe('applyMiddleware', () => {
    // Don't start this until you've completed part 2 of the challenge
    it('can apply middleware to dispatched actions', () => {
      const reducer = () => null
      const spyA = jest.fn()
      const spyB = jest.fn()

      const middleWareMocker = spy => () => next => action => {
        spy(action)
        // Middleware must call 'next'
        next(action)
      }

      const store = createStore(reducer)

      applyMiddleware(store, [middleWareMocker(spyA), middleWareMocker(spyB)])

      const action = { type: 'ZAP' }

      store.dispatch(action)

      expect(spyA).toHaveBeenCalledWith(action)
      expect(spyB).toHaveBeenCalledWith(action)
    })

    it('can can execute middleware in correct order', () => {
      const reducer = () => null
      const spyA = jest.fn()
      const spyB = jest.fn()

      const action = { type: 'OG_ACTION' }
      const modifiedAction = { type: 'THATS_NOT_MY_ACTON' }

      const middleWareMocker = spy => () => next => action => {
        spy(action)
        if (spy === spyA) {
          next(modifiedAction)
        } else {
          next(action)
        }
      }

      const store = createStore(reducer)

      applyMiddleware(store, [middleWareMocker(spyA), middleWareMocker(spyB)])

      store.dispatch(action)

      expect(spyA).toHaveBeenCalledWith(action)
      expect(spyB).toHaveBeenCalledWith(modifiedAction)
    })
  })
})
