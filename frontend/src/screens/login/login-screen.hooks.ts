import { useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "../../features/auth/hooks/useAuth";

// Controla os campos e o envio da tela de login.
export function useLoginScreen() {
  const { login, isLoading, errorMessage } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Atualiza o valor digitado no campo de usuário.
  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  // Atualiza o valor digitado no campo de senha.
  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  // Impede o recarregamento da página e tenta fazer login.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login(username, password);
  }

  return {
    username,
    password,
    isLoading,
    errorMessage,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  };
}
