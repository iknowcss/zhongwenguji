const path = require('path');
const assert = require('assert');
const puppeteer = require('puppeteer');
const imgDiff = require('img-diff-js');

const DELAY_INCREMENT_MS = 300;
const ACTUAL_SCREENSHOT_DIR = process.env['ACTUAL_SCREENSHOT_DIR'];
const EXPECTED_SCREENSHOT_DIR = 'screenshots';

if (!ACTUAL_SCREENSHOT_DIR) {
  throw new Error('Must set ACTUAL_SCREENSHOT_DIR');
}

async function wait(increments = 1) {
  await new Promise(res => setTimeout(res, DELAY_INCREMENT_MS * increments));
}

async function swipe(page, direction, { times = 1} = {}) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(
      direction === 'left' ? 'ArrowLeft' :
        direction === 'right' ? 'ArrowRight' :
        'Enter'
    );
    await wait();
  }
}

async function answerBlock(page, correctOf5) {
  if (correctOf5 > 0) {
    await swipe(page, 'right', { times: correctOf5 });
  }
  if (correctOf5 < 5) {
    await swipe(page, 'left', { times: 5 - correctOf5 });
  }
}

async function screenshotTests(page, screenshotName) {
  await page.waitForSelector('[class*="Results_container"]');
  await wait(2);

  const actualFilename = path.join(ACTUAL_SCREENSHOT_DIR, `${screenshotName}.png`);
  const expectedFilename = path.join(EXPECTED_SCREENSHOT_DIR, `${screenshotName}.png`);
  await page.screenshot({ path: actualFilename });
  const result = await imgDiff({
    actualFilename: actualFilename,
    expectedFilename: expectedFilename,
  });
  assert(result.imagesAreSame);
}

describe('foo', function () {
  let browser;
  let page;

  this.timeout(30000);

  before(async () => {
    browser = await puppeteer.launch({ headless: false });
  });

  beforeEach(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // Wait for cards to load
    await page.waitForSelector('[class*="CardStackDisplay_touchArea"]');

    // Click to start test
    await page.click('button[class*="Instructions_button"]');
  });

  afterEach(async () => {
    await page.goto('about:blank');
    await page.close();
  });

  it('fails after the first 5 failures', async () => {
    await answerBlock(page, 0);
    await screenshotTests(page, 'fail-all');
  });

  it('fails after 2 consecutive failures', async () => {
    await answerBlock(page, 5);
    await answerBlock(page, 0);
    await answerBlock(page, 0);
    await screenshotTests(page, 'fail-consecutive');
  });

  it('fails after 2 non-consecutive failures', async () => {
    await answerBlock(page, 5);
    await answerBlock(page, 0);
    await answerBlock(page, 3);
    await answerBlock(page, 0);
    await screenshotTests(page, 'fail-non-consecutive');
  });

  it('completes a realistic test', async function () {
    await answerBlock(page, 5);
    await answerBlock(page, 4);
    await answerBlock(page, 2);
    await answerBlock(page, 5);
    await answerBlock(page, 2);
    await answerBlock(page, 3);
    await answerBlock(page, 1);
    await answerBlock(page, 2);
    await answerBlock(page, 2);
    await answerBlock(page, 1);
    await answerBlock(page, 3);
    await answerBlock(page, 1);
    await answerBlock(page, 0);
    await answerBlock(page, 0);
    await screenshotTests(page, 'fail-non-consecutive');
  });

  after(async () => {
    await browser.close();
  });
});
