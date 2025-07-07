import { test, expect, Browser as browser } from '@playwright/test';

test('@smoke Handle multiple windows in Playwright', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://testautomationpractice.blogspot.com/');
  const elm = await page.locator('.start').first(); // Locate the element to take a screenshot of
  //await elm.screenshot({ path: 'screenshot.png' }); // Take a screenshot for verification
  //compare this with the screenshot in the browser
  await elm.screenshot({ path: 'screenshot.png' }); // Take a screenshot for verification
  expect(elm).toHaveScreenshot('screenshot.png'); // Verify the screenshot

  // Click on a link that opens a new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // Wait for new page event
    page.click('button[onclick="myFunction()"]') // Action that triggers new tab
  ]);

  await newPage.waitForLoadState(); // Ensure page is loaded
  console.log(await newPage.title()); // Get the title of the new page

  await newPage.close(); // Close the new tab
  await page.close(); // Close the original tab
 
});

test('Switch between multiple tabs', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
  
    await page.goto('https://testautomationpractice.blogspot.com/');
  
    // Open two new tabs
    const [newPage1] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button[onclick="myFunction()"]') // This button opens a new tab
    ]);
  
    const [newPage2] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button[onclick="myFunction()"]') // This button opens a new tab
    ]);
  
    console.log(await newPage1.title());
    console.log(await newPage2.title());
  
    await newPage1.bringToFront(); // Switch to first tab
    await newPage2.bringToFront(); // Switch to second tab
  
    await newPage1.close();
    await newPage2.close();
  });

  test('Handle pop-up windows', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
  
    await page.goto('https://testautomationpractice.blogspot.com/');
  
    const [popup1] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button[id="PopUp"]') // This button triggers a pop-up
    ]);
  
    await popup1.waitForLoadState();
    console.log(await popup1.url()); // Get URL of pop-up

  
    await popup1.close(); // Close pop-up
    await page.close(); // Close the original tab
  });
  

//   Best Practices for Window Handling in Playwright
// Always use context.waitForEvent('page') when expecting a new tab.

// Use newPage.waitForLoadState() to ensure the new page is fully loaded.

// Use bringToFront() to switch between windows/tabs before interacting with them.

// Close windows after testing to free resources.