const { chromium } = require("@playwright/test");
const path = require("path");

async function generateIcons() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const svgHtml = (size) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #2452eb 0%, #6366f1 100%);
            border-radius: ${Math.round(size * 0.22)}px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .symbol {
            color: white;
            font-size: ${Math.round(size * 0.58)}px;
            font-weight: 800;
            line-height: 1;
            text-shadow: 0 2px 10px rgba(0,0,0,0.25);
          }
        </style>
      </head>
      <body>
        <div class="symbol">C</div>
      </body>
    </html>
  `;

  // 192x192
  await page.setViewportSize({ width: 192, height: 192 });
  await page.setContent(svgHtml(192));
  await page.screenshot({ path: path.join(__dirname, "..", "public", "icon.png"), omitBackground: true });

  // 512x512
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(svgHtml(512));
  await page.screenshot({ path: path.join(__dirname, "..", "public", "icon-512.png"), omitBackground: true });

  // apple-touch-icon
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(svgHtml(180));
  await page.screenshot({ path: path.join(__dirname, "..", "public", "apple-touch-icon.png"), omitBackground: true });

  await browser.close();
  console.log("Icons generated successfully in public/ !");
}

generateIcons().catch(console.error);
