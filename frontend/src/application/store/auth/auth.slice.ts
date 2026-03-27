import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../../../domain/auth/auth.types";

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

// Guarda o estado de autenticação no Redux.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: {
      // Marca a tela como carregando antes da saga tentar o login.
      reducer(state) {
        state.isLoading = true;
        state.errorMessage = null;
      },
      // Empacota usuário e senha no formato esperado pela action.
      prepare(payload: { username: string; password: string }) {
        return { payload };
      },
    },

    // Salva o usuário autenticado quando o login funciona.
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.errorMessage = null;
    },

    // Limpa a sessão e guarda a mensagem quando o login falha.
    loginFailure(state, action: PayloadAction<string>) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.errorMessage = action.payload;
    },

    // A saga escuta essa ação para executar o logout técnico.
    logoutRequest() {},

    // Limpa os dados locais depois que o logout termina.
    logoutSuccess(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.errorMessage = null;
    },

    // Marca a restauração da sessão como carregando.
    restoreSessionRequest(state) {
      state.isLoading = true;
      state.errorMessage = null;
    },

    // Reaproveita a sessão salva quando ela ainda é válida.
    restoreSessionSuccess(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isLoading = false;
      state.errorMessage = null;
    },

    // Limpa a sessão se algo der errado na restauração.
    restoreSessionFailure(state, action: PayloadAction<string>) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
