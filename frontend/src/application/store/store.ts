import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootReducer } from "./root-reducer";
import { rootSaga } from "./root-saga";

// Cria o middleware responsável por executar as sagas.
const sagaMiddleware = createSagaMiddleware();

// Monta a store global da aplicação com Redux Toolkit.
export const store = configureStore({
  reducer: rootReducer,
  // Desligamos o thunk porque o projeto usa saga para efeitos assíncronos.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Inicia as sagas principais assim que a store é criada.
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
