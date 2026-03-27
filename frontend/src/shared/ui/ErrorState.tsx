interface ErrorStateProps {
  message: string;
}

// Mostra uma mensagem simples de erro.
export function ErrorState({ message }: ErrorStateProps) {
  return <div style={{ padding: 24, color: "crimson" }}>{message}</div>;
}
