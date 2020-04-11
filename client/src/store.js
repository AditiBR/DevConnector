import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers/index';  // import rootReducer from './reducers .. we dont have to mention index.js that is fine
import thunk from 'redux-thunk';

const middleware = [thunk];
const store = createStore(
    rootReducer,
    {},
    compose(  //use compose to add multiple enhancements
        applyMiddleware(...middleware), // applyMiddleware is term for business logic  …middleware- spred the existing data and thunk it
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // add this line to debug the store. in prod remove this line
    )
);

export default store;