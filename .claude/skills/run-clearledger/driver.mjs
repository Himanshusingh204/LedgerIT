#!/usr/bin/env node
// Minimal chromium-cli-style REPL driver for Clearledger, built on Playwright
// (chromium-cli itself isn't available on this Windows host, so this talks
// to the already-installed `playwright` package directly).
//
// Usage:
//   node driver.mjs                 # interactive: reads commands from stdin, one per line
//   node driver.mjs < script.txt    # batch: pipe a script exactly like chromium-cli
//
// Commands (one per line, space-separated args):
//   nav <url>                       navigate
//   wait-for text=<substring>       wait until page contains text (visible)
//   wait-for <css-selector>         wait until selector is visible
//   click <css-selector>            click an element
//   click text=<substring>          click the first visible element containing text
//   fill <css-selector> <value...>  fill an input (fires React onChange via Playwright)
//   set-files <css-selector> <path...>  set a file input's files (space-separated absolute paths)
//   press <Key>                     press a key on the currently focused element
//   screenshot [name]                save PNG to screenshots/<name|auto-incrementing>.png
//   screenshot-element <sel> [name] crop screenshot to one element
//   eval <js>                       page.evaluate the given JS, prints the JSON result
//   console                          print buffered console/page-error messages, then clear buffer
//   sleep <ms>                      raw wait (avoid; prefer wait-for)
//   quit                            close the browser and exit
//
// Screenshots land in .claude/skills/run-clearledger/screenshots/
//
// Gotcha: right after a sign-in redirect, the Supabase auth cookie can lag the
// page's own navigation by a beat in headless mode — `nav` immediately after
// a sign-in `wait-for` can race it and bounce back to /sign-in. Put a
// `sleep 500` (or more) between "signed in" and the next `nav` in scripts.

import { chromium } from 'playwright';
import { createInterface } from 'node:readline';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = join(__dirname, 'screenshots');
mkdirSync(SHOT_DIR, { recursive: true });

let shotCount = 0;
const consoleBuffer = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    consoleBuffer.push(`[console.${msg.type()}] ${msg.text()}`);
  }
});
page.on('pageerror', (err) => {
  consoleBuffer.push(`[pageerror] ${err.message}`);
});

function log(...args) {
  process.stdout.write(args.join(' ') + '\n');
}

async function handle(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return true;
  const [cmd, ...rest] = trimmed.split(' ');
  const arg = rest.join(' ');

  try {
    switch (cmd) {
      case 'nav': {
        await page.goto(arg, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Right after a sign-in redirect the auth cookie can lag the browser's own
        // navigation by a beat in headless mode, bouncing a protected nav straight
        // back to /sign-in. If that happened, wait a moment and retry once.
        if (!arg.includes('/sign-in') && page.url().includes('/sign-in?redirectTo=')) {
          await new Promise((r) => setTimeout(r, 1000));
          await page.goto(arg, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
        log('ok nav', page.url());
        break;
      }
      case 'wait-for': {
        if (arg.startsWith('text=')) {
          const text = arg.slice('text='.length);
          await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
        } else {
          await page.locator(arg).first().waitFor({ state: 'visible', timeout: 15000 });
        }
        log('ok wait-for', arg);
        break;
      }
      case 'click': {
        if (arg.startsWith('text=')) {
          const text = arg.slice('text='.length);
          await page.getByText(text, { exact: false }).first().click({ timeout: 15000 });
        } else {
          await page.locator(arg).first().click({ timeout: 15000 });
        }
        log('ok click', arg);
        break;
      }
      case 'fill': {
        const [sel, ...valueParts] = rest;
        const value = valueParts.join(' ');
        await page.locator(sel).first().fill(value, { timeout: 15000 });
        log('ok fill', sel);
        break;
      }
      case 'set-files': {
        const [sel, ...filePaths] = rest;
        await page.locator(sel).first().setInputFiles(filePaths, { timeout: 15000 });
        log('ok set-files', sel, filePaths.join(' '));
        break;
      }
      case 'press': {
        await page.keyboard.press(arg);
        log('ok press', arg);
        break;
      }
      case 'screenshot': {
        const name = arg || `shot-${String(++shotCount).padStart(2, '0')}`;
        const path = join(SHOT_DIR, `${name}.png`);
        await page.screenshot({ path, fullPage: true });
        log('ok screenshot', path);
        break;
      }
      case 'screenshot-element': {
        const [sel, name] = rest;
        const shotName = name || `shot-${String(++shotCount).padStart(2, '0')}`;
        const path = join(SHOT_DIR, `${shotName}.png`);
        await page.locator(sel).first().screenshot({ path });
        log('ok screenshot-element', path);
        break;
      }
      case 'eval': {
        const result = await page.evaluate(arg);
        log('ok eval', JSON.stringify(result));
        break;
      }
      case 'console': {
        if (consoleBuffer.length === 0) {
          log('ok console (none)');
        } else {
          log('ok console:\n' + consoleBuffer.join('\n'));
        }
        consoleBuffer.length = 0;
        break;
      }
      case 'sleep': {
        await new Promise((r) => setTimeout(r, Number(arg) || 0));
        log('ok sleep', arg);
        break;
      }
      case 'quit': {
        return false;
      }
      default:
        log('err unknown-command', cmd);
    }
  } catch (err) {
    log('err', cmd, String(err.message || err).split('\n')[0]);
  }
  return true;
}

const rl = createInterface({ input: process.stdin, terminal: false });
for await (const line of rl) {
  const keepGoing = await handle(line);
  if (!keepGoing) break;
}

await browser.close();
process.exit(0);
