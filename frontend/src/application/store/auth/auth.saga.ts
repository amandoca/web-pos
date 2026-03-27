import { call, put, takeLatest } from "redux-saga/effects";

import {
  getSessionAction,
  loginAction,
  logoutAction,
} from "../../actions/auth.actions";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutRequest,
  logoutSuccess,
  restoreSessionFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
} from "./auth.slice";

// Orquestra o login e atualiza o Redux com sucesso ou erro.
function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const user: Awaited<ReturnType<typeof loginAction>> = yield call(
      loginAction,
      action.payload.username,
      action.payload.password,
    );

    yield put(loginSuccess(user));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao fazer login.";

    yield put(loginFailure(errorMessage));
  }
}

// Executa o logout técnico e limpa o estado autenticado.
function* handleLogout() {
  yield call(logoutAction);
  yield put(logoutSuccess());
}

// Tenta reabrir a sessão ao carregar a aplicação.
function* handleRestoreSession() {
  try {
    const user: Awaited<ReturnType<typeof getSessionAction>> =
      yield call(getSessionAction);

    yield put(restoreSessionSuccess(user));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao restaurar a sessão.";

    yield put(restoreSessionFailure(errorMessage));
  }
}

// Registra quais ações de autenticação cada saga deve escutar.
export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
  yield takeLatest(restoreSessionRequest.type, handleRestoreSession);
}
