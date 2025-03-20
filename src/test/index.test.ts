import puppeteer, { Browser } from "puppeteer";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { magicSandbox } from "../index";
import { testInBrowser } from "./testInBrowser";
import {
  basicHTML,
  fetchProxy,
  jsScriptTag,
  jsScriptTagTypeModule,
  jsScriptTagTypeModuleMultipleFiles,
  styleTest,
  xmlTest,
  protocolTest,
} from "./fixtures";

let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

afterAll(async () => {
  await browser.close();
});

describe("Magic Sandbox", () => {
  it("should generate srcdoc HTML", () => {
    const srcdoc = magicSandbox(basicHTML);
    expect(srcdoc).toContain("<!DOCTYPE html>");
    expect(srcdoc).toContain("<title>My HTML Document</title>");
    expect(srcdoc).toContain("Hello, World!");
  });

  it("basicHTML", async () => {
    await testInBrowser(browser, basicHTML, "Hello, World!");
  });

  it("jsScriptTag", async () => {
    await testInBrowser(browser, jsScriptTag, "Hello, JS!");
  });

  it.only("jsScriptTagTypeModule", async () => {
    await testInBrowser(browser, jsScriptTagTypeModule, "Hello, ES Module!");
  });

  it("jsScriptTagTypeModuleMultipleFiles", async () => {
    await testInBrowser(
      browser,
      jsScriptTagTypeModuleMultipleFiles,
      "Hello, ES Module!"
    );
  });

  it("fetchProxy", async () => {
    await testInBrowser(browser, fetchProxy, "Hello, Fetch!");
  });

  it("should handle CSS file loading", async () => {
    await testInBrowser(browser, styleTest, "rgb(255, 0, 0)");
  });

  it("should handle XML file loading", async () => {
    await testInBrowser(browser, xmlTest, "root");
  });

  it("should convert protocol-less URLs to https", () => {
    const srcdoc = magicSandbox(protocolTest);
    expect(srcdoc).toContain('href="https://fonts.googleapis.com');
    expect(srcdoc).toContain('src="https://code.jquery.com');
  });
});
