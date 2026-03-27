// Cria uma pequena espera para simular chamadas assíncronas.
export async function fakeDelay(time = 300): Promise<void> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, time);
  });
}
