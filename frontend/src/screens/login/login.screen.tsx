import "./login-screen.css";

import { getAppConfig } from "../../shared/config/app-config";

import { useLoginScreen } from "./login-screen.hooks";

const appConfig = getAppConfig();

// Renderiza a tela de entrada do sistema.
export function LoginScreen() {
  const {
    username,
    password,
    isLoading,
    errorMessage,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginScreen();

  return (
    <main className="login-screen">
      <section className="login-shell">
        <div className="login-shell-body">
          <section className="login-panel">
            <header className="login-shell-brand">
              <div className="login-brand-mark">
                <img src={appConfig.brandLogo} alt={appConfig.brandName} />
              </div>

              <div className="login-shell-brand-copy">
                <strong>{appConfig.brandName}</strong>
                <span>{appConfig.systemTitle}</span>
              </div>
            </header>

            <div className="login-copy">
              <h1>Acesso ao sistema</h1>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <span>Usuário</span>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Digite seu usuário"
                />
              </label>

              <label className="login-field">
                <span>Senha</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha"
                />
              </label>

              {errorMessage ? (
                <p className="login-error">{errorMessage}</p>
              ) : null}

              <button
                className="login-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </section>

          <aside className="login-visual" aria-hidden="true">
            <div className="login-visual-stage">
              <div className="login-visual-blob" />
              <div className="login-visual-wave" />
              <img
                className="login-visual-image"
                src="/images/login-operator.png"
                alt=""
              />
              <div className="login-visual-counter" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
