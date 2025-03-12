/**
 * Fixes protocol-less URLs to use HTTPS
 */
export function fixProtocollessUrls(html: string): string {
  // Fix link tags
  html = html.replace(/<link.*?href=["']\/\/.*?["'].*?>/g, (match) =>
    match.replace("//", "https://")
  );

  // Fix script tags
  html = html.replace(/<script.*?src=["']\/\/.*?["'].*?>/g, (match) =>
    match.replace("//", "https://")
  );

  return html;
}
