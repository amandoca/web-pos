export interface AppConfig {
  brandName: string;
  brandLogo: string;
  systemTitle: string;
}

const appConfig: AppConfig = {
  brandName: "Pine & Dine",
  brandLogo: "/images/eat.png",
  systemTitle: "WEB POS",
};

// Entrega as configurações visuais fixas da aplicação.
export function getAppConfig(): AppConfig {
  return appConfig;
}
