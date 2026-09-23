const lighthouse = require("lighthouse").default || require("lighthouse");
const chromeLauncher = require("chrome-launcher");

async function main() {
  console.log("Launching Chrome...");
  const chrome = await chromeLauncher.launch({
    chromePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  console.log(`Chrome started on port ${chrome.port}. Running audit on http://localhost:3000 ...`);
  try {
    const runnerResult = await lighthouse("http://localhost:3000", {
      port: chrome.port,
      output: "json",
      logLevel: "info",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "desktop",
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
    });

    const report = runnerResult.lhr;
    console.log("\n================ LIGHTHOUSE SCORES ================");
    for (const [key, category] of Object.entries(report.categories)) {
      console.log(`${category.title.padEnd(20)}: ${Math.round(category.score * 100)}%`);
    }
    console.log("===================================================\n");

    const issues = [];
    for (const [id, audit] of Object.entries(report.audits)) {
      if (
        audit.score !== null &&
        audit.score < 1 &&
        audit.scoreDisplayMode !== "notApplicable" &&
        audit.scoreDisplayMode !== "informative" &&
        audit.scoreDisplayMode !== "manual"
      ) {
        issues.push({ id, title: audit.title, score: audit.score, details: audit.displayValue || audit.explanation });
      }
    }

    if (issues.length > 0) {
      console.log("Items needing attention:");
      issues.forEach(i => console.log(`- [${i.id}] (${Math.round(i.score * 100)}%): ${i.title} (${i.details || ""})`));
    } else {
      console.log("All audited items scored 100%!");
    }
  } finally {
    await chrome.kill();
  }
}

main().catch(err => {
  console.error("Lighthouse error:", err);
  process.exit(1);
});
