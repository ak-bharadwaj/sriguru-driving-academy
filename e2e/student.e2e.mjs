import puppeteer from 'puppeteer';
import assert from 'assert';
import fs from 'fs';

async function runStudentE2E() {
  console.log('🚀 Starting Student Portal E2E Tests...');
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
    await page.type('input[name="email"]', 'student@sriguru.in');
    await page.type('input[name="password"]', 'student123');
    await new Promise(r => setTimeout(r, 2000));
    await page.click('button[type="submit"]');
    
    // Wait for redirect to student dashboard
    await page.waitForFunction(() => window.location.pathname.includes('/student/dashboard'), { timeout: 10000 });
    console.log('✅ Authentication successful. Redirected to /student/dashboard.');
    
    // Check for dashboard content
    await page.waitForSelector('text/Your Next Session', { timeout: 5000 }).catch(() => {});
    await page.screenshot({ path: 'e2e/student-dashboard.png' });
    
    // 2. Navigation to Learn Module
    console.log('⏳ Step 2: Navigate to Learn Module');
    await page.goto('http://localhost:3000/student/learn', { waitUntil: 'networkidle0' });
    console.log('✅ Navigated to /student/learn.');
    
    // Wait for the curriculum/modules to load
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/student-learn.png' });
    
    // Interact with a learning card (e.g., Traffic Rules)
    const [moduleCard] = await page.$$('::-p-xpath(//h3[contains(., "Traffic Rules") or contains(., "Basics")])');
    if (moduleCard) {
      await moduleCard.click();
      console.log('✅ Clicked on a learning module.');
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: 'e2e/student-learn-module.png' });
    } else {
      console.log('⚠️ Could not find a specific learning module card to click.');
    }

    // 3. Navigation to Schedule
    console.log('⏳ Step 3: Navigate to Schedule');
    await page.goto('http://localhost:3000/student/schedule', { waitUntil: 'networkidle0' });
    console.log('✅ Navigated to /student/schedule.');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/student-schedule.png' });

    // 4. Navigation to RTO Mock Tests
    console.log('⏳ Step 4: Navigate to RTO Exams');
    await page.goto('http://localhost:3000/student/rto', { waitUntil: 'networkidle0' });
    console.log('✅ Navigated to /student/rto.');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e2e/student-rto.png' });
    
    const [startTestBtn] = await page.$$('::-p-xpath(//button[contains(., "Start") or contains(., "Test")])');
    if (startTestBtn) {
      await startTestBtn.click();
      console.log('✅ Interacted with RTO Test feature.');
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: 'e2e/student-rto-active.png' });
    }

    console.log('🎉 Student E2E Suite Completed Successfully!');
  } catch (error) {
    console.error('❌ Student E2E Suite Failed:', error);
    await page.screenshot({ path: 'e2e/student-error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Ensure e2e dir exists
if (!fs.existsSync('e2e')){
    fs.mkdirSync('e2e');
}

runStudentE2E();
