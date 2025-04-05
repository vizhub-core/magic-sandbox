import { Browser, Page } from "puppeteer";
import { expect } from "vitest";
import { magicSandbox } from "../index";
import { FileCollection } from "@vizhub/viz-types";

export async function testInBrowser(
  browser: Browser,
  files: FileCollection,
  expectedLog: string,
) {
  const page: Page = await browser.newPage();
  try {
    // Capture console.log output
    const logs: string[] = [];
    page.on("console", (message) => logs.push(message.text()));

    // Load the HTML
    await page.setContent(magicSandbox(files));

    // Wait a bit for scripts to execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check console output
    expect(logs).toContain(expectedLog);
  } finally {
    await page.close();
  }
}
