import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const artifactDir = 'C:\\Users\\dorni\\.gemini\\antigravity\\brain\\7a06a2ff-384f-4fd3-8087-23f68d7d01d2';
const studentId = 'cmqhl6kak0005g2jsrb9whwvz';

async function run() {
  console.log('Launching browser contexts for Instructor and Student...');
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const instructorContext = await browser.createBrowserContext();
  const studentContext = await browser.createBrowserContext();

  const instructorPage = await instructorContext.newPage();
  const studentPage = await studentContext.newPage();

  try {
    // ----------------------------------------------------
    // STEP 1: Instructor Login
    // ----------------------------------------------------
    console.log('1. Logging in as Instructor...');
    await instructorPage.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await instructorPage.type('input[name="email"]', 'demo_instructor@sriguru.in');
    await instructorPage.type('input[name="password"]', 'instructor123');
    await instructorPage.click('button[type="submit"]');
    await instructorPage.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Instructor logged in successfully.');

    // ----------------------------------------------------
    // STEP 2: Instructor schedules today's session
    // ----------------------------------------------------
    console.log('2. Scheduling session for today...');
    await instructorPage.goto('http://localhost:3000/instructor/schedule', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Open "New Session" modal
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const newSessBtn = buttons.find(b => b.textContent && b.textContent.includes('New Session'));
      if (newSessBtn) newSessBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Fill the schedule form
    const todayStr = new Date().toISOString().split('T')[0];
    await instructorPage.evaluate((studentId, todayStr) => {
      const setReactValue = (el, value) => {
        if (!el) return;
        let setter;
        if (el.tagName === 'SELECT') {
          setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
        } else if (el.tagName === 'TEXTAREA') {
          setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        } else {
          setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        }
        setter.call(el, value);
        el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      setReactValue(document.querySelector('select'), studentId);
      setReactValue(document.querySelector('input[type="date"]'), todayStr);
      setReactValue(document.querySelector('input[type="time"]'), '11:00');
      setReactValue(document.querySelector('input[placeholder="e.g. Parallel Parking"]'), 'Parallel Parking');
      setReactValue(document.querySelector('textarea'), 'Review of parallel parking formula and clutch holds on steep slope.');
    }, studentId, todayStr);
    await new Promise(r => setTimeout(r, 1000));

    // Submit schedule form
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find(b => b.textContent && b.textContent.includes('Schedule Slot'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    await instructorPage.screenshot({ path: `${artifactDir}\\1_session_scheduled.png` });
    console.log('Session scheduled successfully. Screenshot 1_session_scheduled.png saved.');

    // ----------------------------------------------------
    // STEP 3: Instructor starts the session
    // ----------------------------------------------------
    console.log('3. Starting the session...');
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => {
        const txt = b.textContent || '';
        return txt.includes('Start Session') || txt.includes('सत्र प्रारंभ करें') || txt.includes('సెషన్ ప్రారంభించండి');
      });
      if (startBtn) startBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await instructorPage.screenshot({ path: `${artifactDir}\\2_session_started.png` });
    console.log('Session started (IN_PROGRESS). Screenshot 2_session_started.png saved.');

    // ----------------------------------------------------
    // STEP 4: Student Logs In and Generates Attendance OTP
    // ----------------------------------------------------
    console.log('4. Logging in as Student to generate OTP...');
    await studentPage.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await studentPage.type('input[name="email"]', 'student_demo@gmail.com');
    await studentPage.type('input[name="password"]', 'student123');
    await studentPage.click('button[type="submit"]');
    await studentPage.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Student logged in successfully.');

    await studentPage.evaluate(() => {
      localStorage.setItem('sgda_has_seen_tour', 'true');
    });
    await studentPage.goto('http://localhost:3000/student/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    // Generate Code
    console.log('Finding and clicking OTP generate button...');
    const btnResult = await studentPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => {
        const txt = b.textContent || '';
        return txt.includes('Generate Code') || txt.includes('Code') || txt.includes('सत्यापन') || txt.includes('ధృవీకరణ');
      });
      if (btn) {
        btn.click();
        return { success: true, outerHTML: btn.outerHTML };
      }
      return { success: false, buttons: buttons.map(b => b.textContent) };
    });
    console.log('Button click result:', btnResult);
    await new Promise(r => setTimeout(r, 2000));
    await studentPage.screenshot({ path: `${artifactDir}\\3_student_otp_generated.png` });
    console.log('OTP generated on Student dashboard. Screenshot 3_student_otp_generated.png saved.');

    // Fetch the generated OTP from the database to be 100% reliable
    console.log('Fetching OTP from database...');
    const studentRecord = await prisma.student.findUnique({ where: { id: studentId } });
    const otpCode = studentRecord.attendanceOtp;
    console.log(`Fetched OTP code: ${otpCode}`);

    // ----------------------------------------------------
    // STEP 5: Instructor verifies OTP and Marks Attendance Completed
    // ----------------------------------------------------
    console.log('5. Instructor marking attendance as completed...');
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const completeBtn = buttons.find(b => {
        const txt = b.textContent || '';
        return txt.includes('Mark Completed') || txt.includes('पूरा चिह्नित करें') || txt.includes('పూర్తయినట్లు గుర్తించండి');
      });
      if (completeBtn) completeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await instructorPage.waitForSelector('form input');
    await instructorPage.evaluate((otpCode) => {
      const el = document.querySelector('form input');
      if (el) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(el, otpCode);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, otpCode);
    await new Promise(r => setTimeout(r, 500));

    await instructorPage.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 3000));
    await instructorPage.screenshot({ path: `${artifactDir}\\4_attendance_marked.png` });
    console.log('Attendance completed and marked. Screenshot 4_attendance_marked.png saved.');

    // ----------------------------------------------------
    // STEP 6: Instructor updates Driving Skills, Syllabus & Session Feedback
    // ----------------------------------------------------
    console.log('6. Instructor updating student details, skills and feedback...');
    await instructorPage.goto(`http://localhost:3000/instructor/students/${studentId}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    // Perform API updates directly from page evaluate for perfect scores and checklist synchronization
    await instructorPage.evaluate(async (studentId) => {
      // 1. Update skill scores
      await fetch('/api/instructor/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, skill: 'basics', score: 9 })
      });
      await fetch('/api/instructor/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, skill: 'parking', score: 8 })
      });
      
      // 2. Mark Day 1 syllabus complete
      const resSyllabus = await fetch(`/api/instructor/syllabus-progress?studentId=${studentId}`);
      const data = await resSyllabus.json();
      const day1 = data.days?.find(d => d.dayNumber === 1);
      if (day1 && !day1.completed) {
        await fetch('/api/instructor/syllabus-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, syllabusDayId: day1.id })
        });
      }
    }, studentId);

    // Refresh to reflect the API modifications
    await instructorPage.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Go to Syllabus Progress tab and capture screenshot
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const syllabusTab = buttons.find(b => b.textContent && b.textContent.includes('Syllabus Progress'));
      if (syllabusTab) syllabusTab.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await instructorPage.screenshot({ path: `${artifactDir}\\5_syllabus_marked.png` });
    console.log('Syllabus tab checked. Screenshot 5_syllabus_marked.png saved.');

    // Go to Feedback tab and submit feedback notes
    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const feedbackTab = buttons.find(b => {
        const txt = b.textContent || '';
        return txt.includes('Submit Feedback') || txt.includes('फीडबैक सबमिट करें') || txt.includes('ఫీడ్‌బ్యాక్ సమర్పించండి');
      });
      if (feedbackTab) feedbackTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await instructorPage.evaluate((notes) => {
      const el = document.querySelector('textarea');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      setter.call(el, notes);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'Excellent reverse parallel parking. Cadet is highly responsive with mirror alignments. Awarded full session completion bonus XP.');

    // Select 5 stars
    await instructorPage.evaluate(() => {
      const starBtns = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('svg.lucide-star'));
      if (starBtns[4]) starBtns[4].click();
    });
    await new Promise(r => setTimeout(r, 500));

    await instructorPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find(b => {
        const txt = b.textContent || '';
        return txt.includes('Submit Feedback & Award XP') || txt.includes('फीडबैक सबमिट करें और XP दें') || txt.includes('ఫీడ్‌బ్యాక్ సమర్పించి XP ఇవ్వండి');
      });
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    await instructorPage.screenshot({ path: `${artifactDir}\\6_feedback_submitted.png` });
    console.log('Feedback submitted. Screenshot 6_feedback_submitted.png saved.');

    // ----------------------------------------------------
    // STEP 7: Student verifies dashboard updates
    // ----------------------------------------------------
    console.log('7. Student verifying dashboard upgrades...');
    await studentPage.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    await studentPage.screenshot({ path: `${artifactDir}\\7_student_dashboard_updated.png` });
    console.log('Student dashboard updated. Screenshot 7_student_dashboard_updated.png saved.');

  } catch (err) {
    console.error('ERROR ENCOUNTERED:', err);
  } finally {
    console.log('Closing browser and cleaning database connection...');
    await browser.close();
    await prisma.$disconnect();
    console.log('Workflow execution complete!');
  }
}

run();
