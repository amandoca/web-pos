import { getAppConfig } from "../config/app-config";

import "./loading-state.css";

const appConfig = getAppConfig();

interface SplashScreenProps {
  message: string;
}

// Exibe a tela inicial enquanto a sessão está sendo restaurada.
export function SplashScreen({ message }: SplashScreenProps) {
  return (
    <main className="loading-state">
      <section className="loading-state-shell" aria-live="polite">
        <div className="loading-state-body">
          <section className="loading-state-panel">
            <header className="loading-state-brand">
              <div className="loading-state-mark">
                <img src={appConfig.brandLogo} alt={appConfig.brandName} />
              </div>

              <div className="loading-state-brand-copy">
                <strong>{appConfig.brandName}</strong>
                <span>{appConfig.systemTitle}</span>
              </div>
            </header>

            <div className="loading-state-copy">
              <h2>Carregando sistema</h2>
              <p>{message}</p>
            </div>

            <div className="loading-state-progress">
              <div className="loading-state-spinner" aria-hidden="true" />
              <span>Aguarde...</span>
            </div>
          </section>

          <aside className="loading-state-visual" aria-hidden="true">
            <div className="loading-state-visual-stage">
              <div className="loading-state-visual-blob" />
              <div className="loading-state-visual-wave" />
              <img
                className="loading-state-visual-image"
                src="/images/login-operator.png"
                alt=""
              />
              <div className="loading-state-visual-counter" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
