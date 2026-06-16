import puppeteer from 'puppeteer';
import assert from 'assert';

async function runSimulation() {
  console.log('🚀 Starting Full-Fledged E2E Simulation (Student -> Admin -> Instructor)...');
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  let studentPage, adminPage, instPage;
  try {
    // ==========================================
    // AGENT 1: STUDENT
    // ==========================================
    console.log('⏳ [Student] Logging in to initialize account...');
    const studentContext = await browser.createBrowserContext();
    studentPage = await studentContext.newPage();
    
    await studentPage.goto('http://localhost:3000/login');
    await studentPage.waitForSelector('input[name="email"]');
    await studentPage.type('input[name="email"]', 'student@sriguru.com');
    await studentPage.type('input[name="password"]', 'student123');
    await new Promise(r => setTimeout(r, 6000)); // Increased hydration delay to prevent GET form submission
    await studentPage.click('button[type="submit"]');
    
    await studentPage.waitForFunction(() => window.location.pathname.includes('/student/dashboard'), { timeout: 15000 });
    console.log('✅ [Student] Account active and logged in.');

    // ==========================================
    // AGENT 2: ADMIN
    // ==========================================
    console.log('⏳ [Admin] Logging in to assign instructor...');
    const adminContext = await browser.createBrowserContext();
    adminPage = await adminContext.newPage();
    adminPage.on('pageerror', err => console.error('Browser PageError (Admin):', err));
    adminPage.on('console', msg => {
      if (msg.type() === 'error') console.error('Browser Console Error (Admin):', msg.text());
    });
    
    await adminPage.goto('http://localhost:3000/login');
    await adminPage.waitForSelector('input[name="email"]');
    await adminPage.type('input[name="email"]', 'admin@sriguru.in');
    await adminPage.type('input[name="password"]', 'admin123');
    await new Promise(r => setTimeout(r, 6000)); // Hydration delay
    await adminPage.click('button[type="submit"]');
    
    await adminPage.waitForFunction(() => window.location.pathname.includes('/admin/students'), { timeout: 15000 });
    console.log('✅ [Admin] Logged in successfully. Navigating to student roster...');
    
    // Search for student
    await adminPage.waitForSelector('input[placeholder*="Search"]');
    await adminPage.type('input[placeholder*="Search"]', 'student@sriguru.com');
    await new Promise(r => setTimeout(r, 2000));
    
    // Expand row
    console.log('⏳ [Admin] Expanding student details...');
    const rows = await adminPage.$$('div.p-5.flex');
    for (const r of rows) {
      const text = await adminPage.evaluate(el => el.textContent, r);
      if (text.includes('student@sriguru.com')) {
        await adminPage.evaluate(el => el.click(), r);
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    
    // Click assign button
    console.log('⏳ [Admin] Opening assignment modal...');
    const buttons = await adminPage.$$('button');
    for (const b of buttons) {
      const text = await adminPage.evaluate(el => el.textContent, b);
      if (text.includes('Assign') || text.includes('Change Instructor')) {
        await adminPage.evaluate(el => el.click(), b);
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    
    // Select instructor
    console.log('⏳ [Admin] Assigning first available instructor...');
    const selectValues = await adminPage.evaluate(() => {
      const select = document.querySelector('form select');
      if (!select) return [];
      return Array.from(select.options).map(o => o.value);
    });
    if (selectValues.length > 1) {
      await adminPage.select('form select', selectValues[1]);
    }
    await new Promise(r => setTimeout(r, 1500));
    
    // Submit form
    await adminPage.waitForSelector('form button[type="submit"]');
    await adminPage.click('form button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));
    console.log('✅ [Admin] Instructor assigned successfully!');

    // ==========================================
    // AGENT 3: INSTRUCTOR
    // ==========================================
    console.log('⏳ [Instructor] Logging in to verify assigned roster...');
    const instContext = await browser.createBrowserContext();
    instPage = await instContext.newPage();
    
    await instPage.goto('http://localhost:3000/login');
    await instPage.waitForSelector('input[name="email"]');
    await instPage.type('input[name="email"]', 'rajesh@sriguru.in');
    await instPage.type('input[name="password"]', 'instructor123');
    await new Promise(r => setTimeout(r, 6000)); // Hydration delay
    await instPage.click('button[type="submit"]');
    
    await instPage.waitForFunction(() => window.location.pathname.includes('/instructor/schedule'), { timeout: 15000 });
    
    console.log('⏳ [Instructor] Navigating to assigned students roster...');
    await instPage.goto('http://localhost:3000/instructor/students');
    await new Promise(r => setTimeout(r, 2000));
    
    const assignedStudentFound = await instPage.evaluate(() => {
      const pageText = document.body.innerText;
      return pageText.includes('Simulated Student');
    });
    assert(assignedStudentFound, 'Verification Failed: Instructor did not receive the assigned student in their roster.');
    console.log('✅ [Instructor] Verified: Student successfully appeared in instructor roster!');
    
    // ==========================================
    // AGENT 3: INSTRUCTOR MARKS ATTENDANCE
    // ==========================================
    console.log('⏳ [Instructor] Creating a session and marking attendance...');
    await instPage.goto('http://localhost:3000/instructor/schedule');
    await new Promise(r => setTimeout(r, 2000));
    
    // Click New Session
    const instButtons = await instPage.$$('button');
    for (const b of instButtons) {
      const text = await instPage.evaluate(el => el.textContent, b);
      if (text.includes('New Session') || text.includes('नया सत्र') || text.includes('కొత్త సెషన్')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    
    // Fill session details
    const studentSelectValues = await instPage.evaluate(() => {
      const select = document.querySelector('form select');
      if (!select) return [];
      return Array.from(select.options).map(o => o.value);
    });
    if (studentSelectValues.length > 1) {
      await instPage.select('form select', studentSelectValues[1]);
    }
    await instPage.type('input[type="datetime-local"]', '2026-05-24T10:00');
    await instPage.type('input[type="number"]', '60');
    
    // Find text input for lesson type
    await instPage.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs.length > 0) {
        inputs[0].value = 'E2E Test Session';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await instPage.click('form button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
    
    // Start session
    console.log('⏳ [Instructor] Starting and completing the session...');
    const startBtns = await instPage.$$('button');
    for (const b of startBtns) {
      const text = await instPage.evaluate(el => el.textContent, b);
      if (text.includes('Start Session')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    
    // Mark completed
    const completeBtns = await instPage.$$('button');
    for (const b of completeBtns) {
      const text = await instPage.evaluate(el => el.textContent, b);
      if (text.includes('Mark Completed')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    
    // Submit attendance modal
    await instPage.click('form button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
    console.log('✅ [Instructor] Attendance marked successfully!');
    
    // ==========================================
    // AGENT 1: STUDENT VERIFIES NOTIFICATION
    // ==========================================
    console.log('⏳ [Student] Verifying attendance notification...');
    await studentPage.goto('http://localhost:3000/student/notifications');
    await new Promise(r => setTimeout(r, 2000));
    
    const notificationFound = await studentPage.evaluate(() => {
      const pageText = document.body.innerText;
      return pageText.includes('Attendance Marked');
    });
    
    assert(notificationFound, 'Verification Failed: Student did not receive the attendance notification.');
    console.log('✅ [Student] Verified: Notification received successfully!');

    console.log('🎉 FULL SIMULATION E2E COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Simulation E2E Failed:', error);
    try {
      if (adminPage) await adminPage.screenshot({ path: 'e2e/sim-admin-error.png' });
      if (studentPage) await studentPage.screenshot({ path: 'e2e/sim-student-error.png' });
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSimulation();
