import { createInterface } from 'readline';

const io = createInterface({
  input: process.stdin,
  output: process.stdout
});

export function gets(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    io.question(prompt, resolve);
  });
}

export function repl(
  prompt: string,
  cb: (answer: string, exit: () => void) => void
) {
  (async () => {
    let exit = false;

    function exitFn() {
      exit = true;
    }

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      cb(await gets(prompt), exitFn);

      if (exit) {
        break;
      }
    }
  })()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
