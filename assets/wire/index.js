import { createStore, render, initWebSocket } from 'utils';

import wireReducer from './reducers';
import {getNewsOnlyParam, getReadItems} from './utils';
import WireApp from './components/WireApp';
import { fetchItems, setState, initData, initParams, pushNotification, setView } from './actions';

const store = createStore(wireReducer);

// init data
store.dispatch(initData(window.wireData || {}, getReadItems(), getNewsOnlyParam()));

// init query
const params = new URLSearchParams(window.location.search);
store.dispatch(initParams(params));

// init view
if (localStorage.getItem('view')) {
    store.dispatch(setView(localStorage.getItem('view')));
}

// handle history
window.onpopstate = function(event) {
    store.dispatch(setState(event.state));
};

// fetch items & render
store.dispatch(fetchItems()).then(() =>
    render(store, WireApp, document.getElementById('wire-app'))
);

// initialize web socket listener
initWebSocket(store, pushNotification);
