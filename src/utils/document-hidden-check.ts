export async function whenDocumentBecomesVisible(): Promise<void> {
  if (!document.hidden) {
    return;
  }
  return new Promise((resolve) => {
    const listen = () => {
      if (!document.hidden) {
        document.removeEventListener('visibilitychange', listen);
        resolve();
      }
    };

    document.addEventListener('visibilitychange', listen);
  });
}
