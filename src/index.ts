import { fixProtocollessUrls } from "./fixProtocollessUrls.js";
import { generateInterceptorScript } from "./generateInterceptorScript.js";
import type { FileCollection } from "./types.js";

export type { FileCollection };

/**
 * Magic Sandbox
 *
 * Originally created for Blockbuilder by Ian Johnson (@enjalot)
 * Contributors: Geoffery Miller (@georules), Paweł Kowalski (@pavelloz),
 * Erik Hazzard (@erikhazzard), Curran Kelleher (@curran), Micah Stubbs (@micahstubbs)
 *
 * This utility transforms HTML templates and handles file references to create
 * a sandboxed environment that intercepts file requests.
 */

/**
 * Escapes special characters in a string for use in regular expressions
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Transforms HTML and files to create a sandboxed environment
 */
export function magicSandbox(files: FileCollection): string {
  let template = files["index.html"] || "";
  const { "index.html": _, ...remainingFiles } = files;

  // Fix protocol-less URLs (//example.com) to use HTTPS
  template = fixProtocollessUrls(template);

  // Prepare data structures:
  // - referencedFiles for XHR/fetch interception (non-HTML)
  // - importMap to hold .js files as data URLs
  const referencedFiles: Record<string, string> = {};
  const importMap = { imports: {} as Record<string, string> };

  for (const [filename, fileContent] of Object.entries(remainingFiles)) {
    if (!fileContent) continue;

    // For JS files
    if (filename.endsWith(".js")) {
      // Add the file to importMap (for ES modules) using absolute path for better resolution
      const dataUrl = `data:application/javascript;base64,${btoa(fileContent)}`;
      importMap.imports[`./${filename}`] = dataUrl;

      // Process script tags based on whether they have type="module" or not
      const scriptTagRegex = new RegExp(
        `<script([^>]*)src=["']${escapeRegExp(filename)}["']([^>]*)>(?:.*?</script>)?`,
        "g"
      );

      template = template.replace(scriptTagRegex, (match, attr1, attr2) => {
        // Check if this script has type="module" attribute
        const hasTypeModule =
          attr1.includes('type="module"') || attr2.includes('type="module"');

        if (hasTypeModule) {
          // For ES modules, use import statement with absolute path
          return `<script${attr1}${attr2}>import "./${filename}";</script>`;
        } else {
          // For regular scripts, inline the content (original behavior)
          return `<script${attr1}${attr2}>${fileContent}</script>`;
        }
      });

      // Track file in the XHR/fetch map
      referencedFiles[filename] = fileContent;
      continue;
    }

    // Replace <link href="file.css"> with inline <style>content</style>
    if (filename.endsWith(".css")) {
      const linkPattern = new RegExp(
        `<link.*?href=["']${escapeRegExp(filename)}["'].*?>`,
        "g"
      );
      if (template.match(linkPattern)) {
        template = template.replace(
          linkPattern,
          `<style>${fileContent}</style>`
        );
        continue;
      }
    }

    // Skip HTML files for XHR/fetch interception
    if (!filename.endsWith(".html")) {
      referencedFiles[filename] = fileContent;
    }
  }

  // Create import map script tag
  const importMapScript = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

  // Encode file references for use in the sandboxed environment
  const fileNames = Object.keys(referencedFiles);
  const filesString = encodeURIComponent(JSON.stringify(referencedFiles));

  // Assemble the final HTML with meta tag, import map and override scripts
  return `<meta charset="utf-8">${importMapScript}${generateInterceptorScript(
    fileNames,
    filesString
  )}${template}`;
}
