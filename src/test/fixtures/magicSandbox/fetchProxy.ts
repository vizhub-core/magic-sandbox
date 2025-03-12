export const fetchProxy = {
  "index.html": {
    content: `<!DOCTYPE html>
<html>
  <body>
    <script src="index.js"></script>
  </body>
</html>`,
  },
  "index.js": {
    content: `fetch("data.csv")
        .then((response) => response.text())
        .then(console.log);`,
  },
  "data.csv": {
    content: `Hello, Fetch!`,
  },
};
