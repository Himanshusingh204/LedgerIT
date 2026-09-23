const { chromium } = require("@playwright/test");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Take screenshot before scroll
  await page.screenshot({ path: "nav-top.png" });

  // Scroll down 700px
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(600);

  // Take screenshot while scrolled
  await page.screenshot({ path: "nav-scrolled.png" });

  // Test dark mode
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "nav-scrolled-dark.png" });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

run().catch(console.error);
