import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Slices
import authReducer from './slices/authSlice'
import modalReducer from './slices/modalSlice'
import adminSettingsReducer from './slices/adminSettingsSlice'

// RTK Query API
import { baseApi } from './api/baseApi'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'adminSettings'], // Persist auth and admin settings
}

const rootReducer = combineReducers({
  // Slices
  auth: authReducer,
  modal: modalReducer,
  adminSettings: adminSettingsReducer,
  // RTK Query API
  [baseApi.reducerPath]: baseApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
