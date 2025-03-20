import { Browser, Page } from "puppeteer";
import { expect } from "vitest";
import { magicSandbox, FileCollection } from "../index";

const DEBUG = true;

export async function testInBrowser(
  browser: Browser,
  files: FileCollection,
  expectedLog: string
) {
  const page: Page = await browser.newPage();
  try {
    // Capture console.log output
    const logs: string[] = [];
    page.on("console", (message) => logs.push(message.text()));

    // Capture page errors
    page.on("pageerror", (error) => {
      console.error("[testInBrowser] pageerror:", error);
    });

    const html = magicSandbox(files);

    DEBUG && console.log("[testInBrowser] html:", html);

    // Load the HTML
    await page.setContent(html);

    // Wait for the page to load
    await page.waitForSelector("body");

    // Wait a bit for scripts to execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    DEBUG && console.log("[testInBrowser] logs:", logs);

    // Check console output
    expect(logs).toContain(expectedLog);
  } finally {
    await page.close();
  }
}
