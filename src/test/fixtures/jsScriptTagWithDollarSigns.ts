export const jsScriptTagWithDollarSigns = {
  "index.html": `<!DOCTYPE html>
    <html>
      <body>
        <script src="index.js"></script>
      </body>
    </html>
  `,
  "index.js": `
    const x$1 = 1;
    const foo = x$1 + 10;
    const x = 2;
    const bar = x + 20;
    console.log(foo, bar);
  `,
};
