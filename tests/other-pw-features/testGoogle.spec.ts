import {test,Page,expect, chromium} from '@playwright/test';

test('google search', async()=>{

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

   await page.goto('https://www.google.com/');

    await expect(page).toHaveTitle("Google");
    await page.locator("//textarea[@aria-label='Search']").fill("Laptop");
    await page.keyboard.press("Enter"); // Simulate pressing Enter key
    await page.waitForTimeout(2000); // Wait for 2 seconds to simulate user typing delay
    //await page.locator("(//input[@value='Google Search'])[2]").click();
    await expect(page).toHaveTitle("laptop - Google Search");
    const products = await page.locator("(//div[@aria-level='2'])[1]");
    await expect(products).toBeVisible();

await page.close();
await browser.close();

});