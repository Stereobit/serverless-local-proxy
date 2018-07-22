const devToolsEnhancer = require('remote-redux-devtools').default;

const { createStore, combineReducers } = require('redux');

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state
    }
}

const rootReducer = combineReducers({ testReducer: counter });

const config = (process.env.LOCAL_PROXY_ENABLE_DEV) ? { realtime: true, port: 8001 } : { realtime: false };
const store = createStore(rootReducer, devToolsEnhancer(config));

/*store.subscribe(() =>
    console.log(store.getState())
);*/

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
module.exports = { store };
