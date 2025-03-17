export const jsScriptTagTypeModule = {
  "index.html": `<!DOCTYPE html>
  <html>
    <head>
      <script type="importmap">
      {
        "imports": {
          "greeter": "data:text/javascript;charset=utf-8,export const greeting = \\"Hello, ES Module!\\";"
        }
      }
      </script>
    </head>
    <body>
      <script type="module" src="index.js"></script>
    </body>
  </html>`,
  "index.js": `import { greeting } from 'greeter';\nconsole.log(greeting);`,
};
