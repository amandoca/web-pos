import { useCallback, useEffect, useRef, useState } from "react";

type FeedbackType = "success" | "error";

const FEEDBACK_DURATION_MS = 3000;

// Controla mensagens curtas de sucesso e erro na tela.
export function useFeedback() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<FeedbackType>("success");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa o temporizador quando o componente sai da tela.
  useEffect(function clearFeedbackTimerOnUnmount() {
    return function cleanupFeedbackTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Mostra uma mensagem temporária para o usuário.
  const showFeedback = useCallback(function showFeedback(
    feedbackMessage: string,
    feedbackType: FeedbackType,
  ) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setMessage(feedbackMessage);
    setType(feedbackType);

    timerRef.current = setTimeout(function clearScheduledFeedback() {
      setMessage(null);
      timerRef.current = null;
    }, FEEDBACK_DURATION_MS);
  }, []);

  // Esconde a mensagem atual imediatamente.
  const clearFeedback = useCallback(function clearFeedback() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setMessage(null);
  }, []);

  return {
    feedbackMessage: message,
    feedbackType: type,
    showFeedback,
    clearFeedback,
  };
}
