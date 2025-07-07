import { test, expect } from '@playwright/test';

var context;
test.use({
      viewport: { width: 1500, height: 700 },
});

// Utility function to login to Dice
async function loginToDice(page, email, password) {
    await page.goto('https://www.dice.com/login');
    await page.fill('input[name="email"]', email);
    await page.click('button[type="submit"]');
    await page.fill('input[name="password"]', password);
    await page.waitForTimeout(2000);
    await page.click('button[type="submit"]');
}

// Utility function to search for jobs
async function searchJobs(page, jobTitle, location) {
    await page.waitForSelector('input[placeholder="Job title, skill, company, keyword"]', { state: 'visible' });
    await page.waitForTimeout(2000);
    await page.getByRole('combobox', { name: 'Job title, skill, company,' }).fill(jobTitle);
    await page.getByRole('combobox', { name: 'Job title, skill, company,' }).press('Tab');
    await page.waitForTimeout(2000);
    await page.getByRole('combobox', { name: 'Location Field' }).fill(location);
    await page.waitForSelector('//section[@role="group"]//div[@slot="option"]//span[text()="United States"]', { state: 'visible' });
    await page.getByText('United States', { exact: true }).nth(1).click();
    await page.getByTestId('job-search-search-bar-search-button').click();
    await page.getByRole('button', { name: 'All filters' }).click();
    await page.locator('//label[contains(text(),"Last 3 days")]').click();
    await page.getByRole('button', { name: 'Apply filters' }).click();
}

// Utility function to apply to jobs on a single page
async function singlePageApply(easyApplyButtons, resumePath) {
    for (const button of easyApplyButtons) {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            button.click({ force: true })
        ]);
        await newPage.bringToFront();
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForSelector('#applyButton', { state: 'visible' });
        const jobTitle = await newPage.locator('//div[@id="applyButton"]/preceding::h1').textContent();
        console.log("On page with Job Title: " + jobTitle);
        await newPage.click('#applyButton', { force: true });
        await newPage.waitForLoadState('domcontentloaded');
        (await newPage.waitForSelector('seds-icon[icon="cloud-upload"]', { state: 'visible' })).click();
        await newPage.setInputFiles('input[type="file"]', resumePath);
        await newPage.waitForTimeout(4000);
        await newPage.getByRole('button', { name: 'Upload', exact: true }).click();
        await newPage.getByRole('button', { name: 'Next' }).click();
        await newPage.getByRole('button', { name: 'Submit' }).click();
        await newPage.waitForSelector('//h1[text()="Application submitted. We\'re rooting for you."]', { state: 'visible' });
        await newPage.close();
    }
}

test('Login to Dice.com and Search and Apply', async ({ browser }) => {
    // Configure test timeout
    test.setTimeout(30 * 60 * 1000); // 30 minutes
    
    // Open a new browser context with full-screen dimensions
    context = await browser.newContext({
        // viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Login
    await loginToDice(page, '21vinod12@gmail.com', 'Vinod55@');

    // Search jobs
    await searchJobs(page, 'Quality Assurance Engineer', 'United States');

    let currentPage = 1;
    let totalPages = await page.locator('//section[contains(@aria-label,"Page 1 of ")]/span').nth(1).textContent();
    totalPages = parseInt(totalPages);
    console.log(`Total Pages: ${totalPages}`);
    // Loop through all pages
    while (currentPage <= totalPages) {
        console.log(`Current Page: ${currentPage}`);
        //wait for the search results to load
        await page.waitForSelector('div[data-testid="job-search-results-container"]', { state: 'visible' });
        await page.waitForTimeout(5000);
        //collect all easy apply buttons
        const easyApplyButtons1 = await page.$$('//span[text()="Easy Apply"]');
        console.log(`Easy Apply Buttons: ${easyApplyButtons1.length}`);
        if (easyApplyButtons1.length > 0) {
            //apply for each job
            await page.waitForTimeout(5000);
            await singlePageApply(easyApplyButtons1, 'X:/Job applications/QA profile/Own profile/9 years/Sr QA Cover.docx');
        }

        // Click on the page number
        await page.locator('//span[@aria-label="Next"]').click();

        currentPage++;
    }


})
