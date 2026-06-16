import puppeteer from 'puppeteer';
import fs from 'fs';

async function runTest() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Testing Instructor Portal...');
  
  // Login
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.type('input[name="email"]', 'rajesh@sriguru.in');
  await page.type('input[name="password"]', 'instructor123');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'instructor-login-after-submit.png' });
  await page.waitForFunction(() => window.location.pathname.includes('schedule'), { timeout: 10000 });

  // Navigate to Dashboard
  await page.goto('http://localhost:3000/instructor/schedule', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'instructor-dashboard.png' });
  const dashboardContent = await page.content();
  if (dashboardContent.includes('Lorem') || dashboardContent.includes('{t.')) {
    console.log('FAIL: Placeholders found on Instructor Dashboard');
  } else {
    console.log('PASS: No placeholders on Instructor Dashboard');
  }

  // Check language toggle
  await page.click('button[aria-label="Select Language"]');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click the Hindi option
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hindiBtn = buttons.find(b => b.textContent && b.textContent.includes('हिंदी'));
    if (hindiBtn) hindiBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'instructor-dashboard-hindi.png' });

  await browser.close();
  console.log('Instructor test complete. Screenshots saved.');
}

runTest().catch(console.error);
