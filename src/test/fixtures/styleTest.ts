export const styleTest = {
  "index.html": `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="test">Test</div>
    <script>
      console.log(window.getComputedStyle(document.getElementById('test')).color);
    </script>
  </body>
</html>`,
  "styles.css": `#test { color: rgb(255, 0, 0); }`,
};
