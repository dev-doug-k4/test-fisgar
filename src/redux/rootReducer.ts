import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import sessionReducer from './slices/session';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage: createWebStorage('local'),
  keyPrefix: 'redux-',
  whitelist: [],
};

const sessionPersistConfig = {
  key: 'session',
  storage: createWebStorage('local'),
  keyPrefix: 'redux-',
  whitelist: ['user', 'isAuthenticated', 'address'],
};

const rootReducer = combineReducers({
  session: persistReducer(sessionPersistConfig, sessionReducer),
});

export { rootPersistConfig, rootReducer };
