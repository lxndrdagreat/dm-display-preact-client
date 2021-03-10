
// const hasFSAccess = 'showOpenFilePicker' in window;

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', ev => {
      if (ev.target?.result) {
        resolve(ev.target.result as string);
      }
      reject('Failed to parse file.');
    });
    reader.readAsText(file);
  });
}

export function downloadDataAsFile(data: string, filename: string): void {
  const opts = {type: 'text/plain'};
  const file = new File([data], '', opts);
  const anchor = document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}