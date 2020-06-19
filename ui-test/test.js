const puppeteer = require('puppeteer');
const { assertScreenshotMatchesPrevious, wait } = require('./util');

const TEST_HEADLESS = process.env['TEST_HEADLESS'] !== '0';
const DELAY_SWIPE_MS = 300;
const DELAY_GRAPH_MS = 700;
const RESULTS_SELECTOR = '[class*="Results_container"]';
const CARD_STACK_SELECTOR = '[class*="CardStackDisplay_touchArea"]';
const INSTRUCTIONS_SELECTOR = 'button[class*="Instructions_button"]';

async function swipe(page, direction, { times = 1} = {}) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(
      direction === 'left' ? 'ArrowLeft' :
        direction === 'right' ? 'ArrowRight' :
          'Enter'
    );
    await wait(DELAY_SWIPE_MS);
  }
}

async function markNextNKnown(page, numberKnownOf5) {
  if (numberKnownOf5 > 0) {
    await swipe(page, 'right', { times: numberKnownOf5 });
  }
  if (numberKnownOf5 < 5) {
    await swipe(page, 'left', { times: 5 - numberKnownOf5 });
  }
}

async function waitForResults(page) {
  await page.waitForSelector(RESULTS_SELECTOR);
  await wait(DELAY_GRAPH_MS);
}

describe('E2E test', function () {
  let browser;
  let page;

  this.timeout(30000);

  before(async () => {
    browser = await puppeteer.launch({ headless: TEST_HEADLESS });
  });

  beforeEach(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // Wait for cards to load
    await page.waitForSelector(CARD_STACK_SELECTOR);

    // Click to start test
    await page.click(INSTRUCTIONS_SELECTOR);
  });

  afterEach(async () => {
    await page.goto('about:blank');
    await page.close();
  });

  it('fails after the first 5 failures', async () => {
    await markNextNKnown(page, 0);
    await waitForResults(page);
    await assertScreenshotMatchesPrevious(page, 'fail-all');
  });

  it('fails after 2 consecutive failures', async () => {
    await markNextNKnown(page, 5);
    await markNextNKnown(page, 0);
    await markNextNKnown(page, 0);
    await waitForResults(page);
    await assertScreenshotMatchesPrevious(page, 'fail-consecutive');
  });

  it('fails after 2 non-consecutive failures', async () => {
    await markNextNKnown(page, 5);
    await markNextNKnown(page, 0);
    await markNextNKnown(page, 3);
    await markNextNKnown(page, 0);
    await waitForResults(page);
    await assertScreenshotMatchesPrevious(page, 'fail-non-consecutive');
  });

  it('completes a realistic test', async function () {
    await markNextNKnown(page, 5);
    await markNextNKnown(page, 4);
    await markNextNKnown(page, 2);
    await markNextNKnown(page, 5);
    await markNextNKnown(page, 2);
    await markNextNKnown(page, 3);
    await markNextNKnown(page, 1);
    await markNextNKnown(page, 2);
    await markNextNKnown(page, 2);
    await markNextNKnown(page, 1);
    await markNextNKnown(page, 3);
    await markNextNKnown(page, 1);
    await markNextNKnown(page, 0);
    await markNextNKnown(page, 0);
    await waitForResults(page);
    await assertScreenshotMatchesPrevious(page, 'realistic');
  });

  after(async () => {
    await browser.close();
  });
});
