export const fetchProxy = {
  "index.html": `<!DOCTYPE html>
<html>
  <body>
    <script src="index.js"></script>
  </body>
</html>`,
  "index.js": `fetch("data.csv")
        .then((response) => response.text())
        .then(console.log);`,
  "data.csv": `Hello, Fetch!`,
};
