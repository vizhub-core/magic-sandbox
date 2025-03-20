Below is one possible approach for adding ESM support via an inline import map. The main changes are:

Gather all .js file contents into a single import map, mapping each ./filename.js key to its data: URL.
Replace any <script src="filename.js"> occurrences in the HTML with

<script type="module">
  import "./filename.js";
</script>

so that the script is loaded as an ESM module (and points to our import map entry).
Inject the resulting import map into the final HTML via

<script type="importmap">{ ... }</script>

Keep the existing logic for inlining CSS files, protocol fix-ups, and file interception scripts if you still need them.
Below is an updated version of your magicSandbox function illustrating these changes:

import { fixProtocollessUrls } from "./fixProtocollessUrls.js";
import { generateInterceptorScript } from "./generateInterceptorScript.js";
import type { FileCollection } from "./types.js";

export type { FileCollection };

/\*\*

- Escapes special characters in a string for use in regular expressions
  _/
  function escapeRegExp(str: string): string {
  return str.replace(/[._+?^${}()|[\]\\]/g, "\\$&");
  }

/\*\*

- Transforms HTML and files to create a sandboxed environment with ESM support
  \*/
  export function magicSandbox(files: FileCollection): string {
  let template = files["index.html"] || "";
  const { "index.html": \_, ...remainingFiles } = files;

// 1) Fix protocol-less URLs (//example.com) to use HTTPS
template = fixProtocollessUrls(template);

// 2) Prepare data structures:
// - referencedFiles for XHR/fetch interception (non-HTML)
// - importMap to hold .js files as data URLs
const referencedFiles: Record<string, string> = {};
const importMap = { imports: {} as Record<string, string> };

for (const [filename, fileContent] of Object.entries(remainingFiles)) {
if (!fileContent) continue;

    // 3) For JS files, instead of inlining, build an import map entry
    if (filename.endsWith(".js")) {
      // Build a data:application/javascript URL
      const dataUrl = "data:application/javascript;base64," + btoa(fileContent);

      // In the import map, reference "./filename.js" -> data URL
      importMap.imports[`./${filename}`] = dataUrl;

      // Replace <script src="filename.js"> with <script type="module">import "./filename.js"</script>
      const scriptPattern = new RegExp(
        `<script(.*?)src=["']${escapeRegExp(filename)}["'](.*?)>`,
        "g"
      );
      if (template.match(scriptPattern)) {
        template = template.replace(
          scriptPattern,
          `<script$1 type="module"$2>import "./${filename}"</script>`
        );
      }

      // Also track file in the XHR/fetch map if needed
      referencedFiles[filename] = fileContent;
      continue;
    }

    // 4) For CSS files, inline as before
    if (filename.endsWith(".css")) {
      const linkPattern = new RegExp(
        `<link.*?href=["']${escapeRegExp(filename)}["'].*?>`,
        "g"
      );
      if (template.match(linkPattern)) {
        template = template.replace(linkPattern, `<style>${fileContent}</style>`);
        continue;
      }
    }

    // 5) HTML files are skipped for inlining, but track them if needed
    if (!filename.endsWith(".html")) {
      referencedFiles[filename] = fileContent;
    }

}

// 6) Build the final import map script
const importMapScript = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

// 7) Build your XHR/fetch interception script
// (same as your original approach)
const fileNames = Object.keys(referencedFiles);
const filesString = encodeURIComponent(JSON.stringify(referencedFiles));
const interceptor = generateInterceptorScript(fileNames, filesString);

// 8) Assemble final HTML:
// - Add <meta charset="utf-8">
// - Add <script type="importmap"> for ESM
// - Add the file interception script
// - Include the modified template
return `<meta charset="utf-8">${importMapScript}${interceptor}${template}`;
}
How It Works
Collect JS for the Import Map
Each .js file is converted to a base64-encoded data: URL and added to importMap.imports under a key of the form ./filename.js.

Rewrite Script References
Any <script src="filename.js"> element is replaced with an ESM-based script:

<script type="module">
  import "./filename.js";
</script>

This ensures all JavaScript is now loaded via the inline import map.

Embed the Import Map
The entire import map is inlined with:

<script type="importmap">{ ... }</script>

so browsers that support import maps will fetch each module from its corresponding data: URL rather than looking for an actual .js file on the server.

Remaining Logic

CSS inlining is unchanged: <link href="file.css"> is replaced with <style>...</style>.
XHR/fetch interception is still handled by your existing code, via generateInterceptorScript.
With this adjustment, your index.html will rely fully on ESM imports for JavaScript while still preserving the inlining of other resources (CSS, images, etc.) as before.
