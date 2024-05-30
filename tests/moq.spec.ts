import { expect, test } from '@playwright/test';

const resultPath = './downloads'
const downloadTimeout = 200000;

test.beforeEach(async ({ page }) => {
  while (true) {
    try {
      await page.goto('https://tugas-akhir.farreljordan.com/');
      await page.getByRole('button', { name: 'Start' }).click();
      await page.getByText('click to play').click();

      await expect(page.locator('label.audio.label span')).not.toHaveText('');
      await expect(page.locator('label.video.label span')).not.toHaveText('');
      await expect(page.getByText('click to play')).toBeHidden()

      await page.mouse.wheel(0, 500);
      await page.evaluate("document.body.style.zoom=0.65")

      break;
    } catch (error) {
      console.log('Playing the video failed, retrying...');
    }
  }
  test.setTimeout(downloadTimeout);
});

test('test stream', async ({ page }) => {
  await downloadResults(page, '/stream/')
});

test('test datagram', async ({ page }) => {
  await page.locator("#category").selectOption({value: "1"})
  await downloadResults(page, '/datagram/')
});

test('test hybrid', async ({ page }) => {
  await page.locator("#category").selectOption({value: "2"})
  await downloadResults(page, '/hybrid/')
});

test('test auto', async ({ page }) => {
  await page.locator("#category").selectOption({value: "3"})
  await downloadResults(page, '/auto/')
});

const downloadResults = async (page, path) => {
  const downloadPromise1 = page.waitForEvent('download', { timeout: downloadTimeout });
  const download1 = await downloadPromise1;
  await download1.saveAs(resultPath + path + download1.suggestedFilename());
  
  const downloadPromise2 = page.waitForEvent('download');
  const download2 = await downloadPromise2;
  await download2.saveAs(resultPath + path + download2.suggestedFilename());

  const downloadPromise3 = page.waitForEvent('download');
  const download3 = await downloadPromise3;
  await download3.saveAs(resultPath + path + download3.suggestedFilename());
}

