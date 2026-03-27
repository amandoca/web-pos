interface LoadingStateProps {
  message: string;
}

// Mostra um estado visual de carregamento com texto de apoio.
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        color: "#6a7685",
        fontSize: "0.95rem",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "3px solid rgba(90, 169, 223, 0.22)",
          borderTopColor: "#5aa9df",
          animation: "loading-spin 0.9s linear infinite",
        }}
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}
