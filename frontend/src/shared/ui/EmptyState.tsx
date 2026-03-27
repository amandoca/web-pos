interface EmptyStateProps {
  message: string;
}

// Mostra uma mensagem quando não há conteúdo para exibir.
export function EmptyState({ message }: EmptyStateProps) {
  return <p style={{ margin: 0, color: "inherit" }}>{message}</p>;
}
