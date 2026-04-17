import { useAuth } from "../../features/auth/hooks/useAuth";

function buildLoginHintMessage(hasFirebaseRoleConfiguration: boolean) {
  if (!hasFirebaseRoleConfiguration) {
    return "Defina os e-mails autorizados antes de liberar o acesso.";
  }

  return "O acesso usa o cadastro do usuário e os e-mails autorizados servem como liberação inicial.";
}

// Controla os feedbacks e a acao principal da tela de login.
export function useLoginScreen() {
  const {
    errorMessage,
    hasAuthorizedEmailsConfigured,
    isFirebaseConfigured,
    isLoading,
    login,
    missingFirebaseKeys,
  } = useAuth();

  const configurationMessage = isFirebaseConfigured
    ? null
    : `Firebase nao configurado. Variaveis ausentes: ${missingFirebaseKeys.join(", ")}.`;
  const loginHintMessage = buildLoginHintMessage(
    hasAuthorizedEmailsConfigured,
  );

  function handleGoogleLogin() {
    login();
  }

  return {
    configurationMessage,
    isLoading,
    errorMessage,
    handleGoogleLogin,
    loginHintMessage,
  };
}
