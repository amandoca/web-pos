interface AvailabilitySwitchProps {
  isAvailable: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onToggle: (nextValue: boolean) => Promise<void>;
}

// Mostra o botão visual que liga ou desliga a venda do produto.
export function AvailabilitySwitch({
  isAvailable,
  isDisabled = false,
  isLoading = false,
  onToggle,
}: AvailabilitySwitchProps) {
  const isControlDisabled = isDisabled || isLoading;

  // Evita cliques durante loading ou quando a regra não permite alterar.
  async function handleChange() {
    if (isControlDisabled) {
      return;
    }

    await onToggle(!isAvailable);
  }

  return (
    <div className="admin-availability">
      <span className="admin-field-label">
        {isAvailable ? "Disponivel" : "Indisponivel"}
      </span>

      <button
        className={`admin-switch${isAvailable ? " is-active" : ""}`}
        type="button"
        aria-label="Alterar disponibilidade do produto"
        aria-pressed={isAvailable}
        disabled={isControlDisabled}
        onClick={handleChange}
      />
    </div>
  );
}
