import { test, expect } from '@playwright/test';

test('Multiple browser contexts example', async ({ browser }) => {
  const user1 = await browser.newContext();
  const user2 = await browser.newContext();

  const page1 = await user1.newPage();
  const page2 = await user2.newPage();

  await page1.goto('https://example.com');
  await page2.goto('https://example.com');
  console.log("test");
  // Perform actions separately as different users
});

test('Save authentication state', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
  
    await page.goto('https://example.com/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
  
    await context.storageState({ path: 'auth.json' });
  });

test.use({ storageState: 'auth.json' });

test('Authenticated test', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  expect(await page.title()).toBe('Dashboard');
});

test('Upload file', async ({ page }) => {
    await page.goto('https://example.com/upload');
  
    // Upload a file
    await page.setInputFiles('#file-upload', 'path/to/file.png');
  
    await page.click('#submit-button');
  });

  test('Handle shadow DOM', async ({ page }) => {
    await page.goto('https://example.com');
  
    const shadowHost = page.locator('#shadow-host');
    const shadowElement = shadowHost.locator('text="Inside Shadow DOM"');
  
    await expect(shadowElement).toBeVisible();
  });
  

  test('Handle iframe', async ({ page }) => {
    await page.goto('https://example.com');
  
    const frame = page.frameLocator('#iframe-id');
    await frame.locator('button#click-me').click();
  });
  