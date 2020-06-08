const path = require('path');
const fs = require('fs');
const util = require('util');
const { imgDiff } = require('img-diff-js');

const SCREENSHOT_DIR = 'screenshots';
const TEST_UPDATE_SCREENSHOTS = process.env['TEST_UPDATE_SCREENSHOTS'] === '1';

module.exports.wait = millis => new Promise(res => setTimeout(res, millis));

module.exports.assertScreenshotMatchesPrevious = async function (page, screenshotName) {
  // If a "gold" comparison screenshot exists, save this screenshot to
  // a temporary directory. Otherwise, save this screenshot to the "gold"
  // screenshot directory
  let saveToFilename = path.join(SCREENSHOT_DIR, `${screenshotName}.actual.png`);
  const expectedFilename = path.join(SCREENSHOT_DIR, `${screenshotName}.expected.png`);
  const diffFilename = path.join(SCREENSHOT_DIR, `${screenshotName}.diff.png`);
  const expectedExists = await util.promisify(fs.exists)(expectedFilename);
  if (TEST_UPDATE_SCREENSHOTS || !expectedExists) {
    saveToFilename = expectedFilename;
  }
  await page.screenshot({ path: saveToFilename });

  // Assert that the current screenshot is sufficiently similar to the "gold"
  // comparison.
  const result = await imgDiff({
    actualFilename: saveToFilename,
    expectedFilename: expectedFilename,
    diffFilename: diffFilename
  });

  if (!result.imagesAreSame) {
    throw new Error(`The images are not the same; see ${diffFilename}`);
  }
};
