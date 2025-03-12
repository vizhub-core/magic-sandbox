# magic-sandbox

A powerful library for creating HTML sandboxes that support multiple dynamic files without network requests.

[![npm version](https://img.shields.io/npm/v/magic-sandbox.svg)](https://www.npmjs.com/package/magic-sandbox)

## Overview

The magic-sandbox library allows you to combine multiple HTML, CSS, JavaScript, and data files into a single HTML document that works in any modern browser. It intelligently intercepts network requests to provide a seamless experience for code demonstrations, educational tools, and interactive editors.

Originally extracted from the [Blockbuilder Project](https://github.com/enjalot/blockbuilder) created by Ian Johnson and described in the Medium post [Architecting a Sandbox](https://medium.com/@enjalot/architecting-a-sandbox-97b211937911#.1hz02h1bx).

## Features

- **File Bundling**: Combines multiple files into a single HTML document
- **Request Interception**: Intercepts XMLHttpRequest and fetch calls to load files without network requests
- **Automatic Processing**: Inlines JavaScript and CSS files referenced in HTML
- **Protocol Fix**: Converts protocol-less URLs (//example.com) to HTTPS
- **Multiple File Types**: Supports HTML, CSS, JavaScript, XML, CSV, and other file formats

## Installation

```bash
npm install magic-sandbox
```

## Basic Usage

```typescript
import { magicSandbox, FileCollection } from "magic-sandbox";

// Define your files collection
const files: FileCollection = {
  "index.html": `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Hello, World!</h1>
    <script src="script.js"></script>
  </body>
</html>`,
  "styles.css": "h1 { color: blue; }",
  "script.js": 'console.log("Hello from JavaScript!");',
  "data.json": '{ "message": "This is data that can be fetched" }',
};

// Generate the HTML
const html = magicSandbox(files);

// Use in an iframe
document.getElementById("sandbox").setAttribute("srcdoc", html);
```

## How It Works

magic-sandbox works by:

1. Starting with your `index.html` file as a template
2. Inlining referenced JavaScript and CSS files when possible
3. Injecting a script that intercepts XMLHttpRequest and fetch calls
4. Encoding the contents of other files for access by the interceptor
5. Fixing protocol-less URLs to use HTTPS

The result is a single HTML document that can reference and load multiple files without making any network requests.

## Advanced Example: Interactive Code Editor

```typescript
import { magicSandbox, FileCollection } from "magic-sandbox";

// When files are updated in your editor
function updatePreview(files: FileCollection) {
  const iframe = document.getElementById("preview");
  const html = magicSandbox(files);
  iframe.setAttribute("srcdoc", html);
}

// Example editor setup
const editor = setupCodeEditor(); // Your editor initialization
editor.onChange((files: FileCollection) => {
  updatePreview(files);
});
```

## Use Cases

- **Code Editors**: Create live-preview code editors like CodePen or JSFiddle
- **Educational Platforms**: Build interactive coding exercises for students
- **Demos & Examples**: Showcase code examples with multiple files
- **Documentation**: Provide runnable code samples in documentation

## Browser Compatibility

Works in all modern browsers that support:

- iframes with the srcdoc attribute
- Fetch API
- XMLHttpRequest
- ES6 features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
