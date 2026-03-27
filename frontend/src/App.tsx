import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { isAdminUser } from "./domain/auth/auth.types";
import { useAuth } from "./features/auth/hooks/useAuth";
import { AdminScreen } from "./screens/admin/admin.screen";
import { LoginScreen } from "./screens/login/login.screen";
import { OperatorScreen } from "./screens/operator/operator.screen";
import { SplashScreen } from "./shared/ui/SplashScreen";

// Decide qual tela mostrar com base na sessão e no perfil do usuário.
export function App() {
  const { currentUser, isAuthenticated, isLoading, restoreSession } = useAuth();

  // Tenta recuperar a sessão assim que a aplicação abre.
  useEffect(
    function restoreAuthSession() {
      restoreSession();
    },
    [restoreSession],
  );

  if (isLoading && !currentUser) {
    return <SplashScreen message="Carregando sessão..." />;
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isAdmin = isAdminUser(currentUser);
  const homePath = isAdmin ? "/admin" : "/operator";

  return (
    <Routes>
      {isAdmin ? (
        <Route path="/admin" element={<AdminScreen />} />
      ) : (
        <Route path="/operator" element={<OperatorScreen />} />
      )}
      <Route path="*" element={<Navigate to={homePath} replace />} />
    </Routes>
  );
}
