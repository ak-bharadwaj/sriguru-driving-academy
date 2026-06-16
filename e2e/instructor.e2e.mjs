import puppeteer from 'puppeteer';
import assert from 'assert';
import fs from 'fs';

async function runInstructorE2E() {
  console.log('🚀 Starting Instructor Portal E2E Tests...');
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  
  try {
    // 1. Authentication
    console.log('⏳ Step 1: Authentication');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', 'rajesh@sriguru.in');
    await page.type('input[name="password"]', 'instructor123');
    await new Promise(r => setTimeout(r, 2000));
    await page.click('button[type="submit"]');
    
    // Take screenshot after submit for debugging
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'e2e/instructor-after-submit.png' });

    // Wait for redirect to instructor schedule
    await page.waitForFunction(() => window.location.pathname.includes('/instructor/schedule'), { timeout: 20000 });
    console.log('✅ Authentication successful. Redirected to /instructor/schedule.');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/instructor-schedule.png' });
    
    // 2. Schedule Interaction (Filters)
    console.log('⏳ Step 2: Schedule Interaction');
    const [allFilterBtn] = await page.$$('::-p-xpath(//button[contains(., "ALL") or contains(., "All")])');
    if (allFilterBtn) {
      await allFilterBtn.click();
      console.log('✅ Clicked Schedule Filter.');
      await new Promise(r => setTimeout(r, 500));
    }
    
    // 3. Navigation to Roster
    console.log('⏳ Step 3: Navigate to Roster (Students)');
    await page.click('a[href="/instructor/students"]');
    await page.waitForFunction(() => window.location.pathname.includes('/instructor/students'), { timeout: 5000 });
    console.log('✅ Navigated to /instructor/students.');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/instructor-roster.png' });
    
    // 4. Navigation to Coaching Notes
    console.log('⏳ Step 4: Navigate to Coaching Notes');
    await page.click('a[href="/instructor/coaching-notes"]');
    await page.waitForFunction(() => window.location.pathname.includes('/instructor/coaching-notes'), { timeout: 5000 });
    console.log('✅ Navigated to /instructor/coaching-notes.');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/instructor-notes.png' });

    console.log('🎉 Instructor E2E Suite Completed Successfully!');
  } catch (error) {
    console.error('❌ Instructor E2E Suite Failed:', error);
    await page.screenshot({ path: 'e2e/instructor-error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Ensure e2e dir exists
if (!fs.existsSync('e2e')){
    fs.mkdirSync('e2e');
}

runInstructorE2E();
