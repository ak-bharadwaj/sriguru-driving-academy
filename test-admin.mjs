import puppeteer from 'puppeteer';
import fs from 'fs';

async function runTest() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Testing Admin Portal...');
  
  // Login
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.type('input[name="email"]', 'admin@sriguru.in');
  await page.type('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => window.location.pathname.includes('students'), { timeout: 10000 });

  // Navigate to Dashboard (Students)
  await page.goto('http://localhost:3000/admin/students', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'admin-dashboard.png' });
  const dashboardContent = await page.content();
  if (dashboardContent.includes('Lorem') || dashboardContent.includes('{t.')) {
    console.log('FAIL: Placeholders found on Admin Students Dashboard');
  } else {
    console.log('PASS: No placeholders on Admin Students Dashboard');
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
  await page.screenshot({ path: 'admin-dashboard-hindi.png' });

  await browser.close();
  console.log('Admin test complete. Screenshots saved.');
}

runTest().catch(console.error);
