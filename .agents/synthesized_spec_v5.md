# Synthesized Specification V4.0 (Production-Grade LLD)

**Intent**: Implement features for roles: ['student', 'instructor', 'driving school management']. Archetypes: ['fullstack', 'mobile_hybrid']
**Archetypes**: fullstack, mobile_hybrid | **Scope**: MAJOR
**Gate Result**: BLOCKED (Assumption Weight: 169/150)
**Total Requirements**: 249 | **Version**: v5

## ❓ Questions for Human Review

1. Please clarify the scope and expected behavior for: Driving School Management — Student Enrollment
2. Please clarify the scope and expected behavior for: Driving School Management — Instructor Scheduling
3. Please clarify the scope and expected behavior for: Driving School Management — Exam Tracking
4. Should users be able to self-register, or should only admins create accounts? (Context: Public self-registration requires explicit confirmation. MUST_ASK user.)
5. You mentioned 9 features. Should we prioritize a subset for the initial release, or implement all at once?

## 🗺️ Role-Based Page Spreads & Frontend Sitemap

### Role: STUDENT (7 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Student Dashboard** | `dashboard` | Academic metrics overview, upcoming exams, and announcements |
| `/profile` | **Student Self-Profile** | `profile` | Personal bio, academic details, and security credential editor |
| `/subjects` | **Course & Syllabus View** | `subjects` | Registered subjects, syllabus downloads, and faculty assignments |
| `/results` | **Semester Gradebook** | `gradebook` | SGPA/CGPA transcript viewer, marks breakdown, and revaluation requests |
| `/internships` | **Industrial NOC Hub** | `internships` | Internship NOC applications, mentor logging, and credit conversion |
| `/capstone` | **Capstone Project Board** | `capstone` | Team leader registration, proposal submission, and plagiarism score |
| `/documents` | **Student Document Vault** | `documents` | Uploaded certificates, verified ID proofs, and digital receipts |

### Role: INSTRUCTOR (3 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Instructor Dashboard** | `dashboard` | Main workspace for instructor |
| `/profile` | **Instructor Profile** | `profile` | Account profile and settings for instructor |
| `/documents` | **Instructor Documents** | `documents` | Document manager for instructor |

### Role: DRIVING SCHOOL MANAGEMENT (3 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Driving School Management Dashboard** | `dashboard` | Main workspace for driving school management |
| `/profile` | **Driving School Management Profile** | `profile` | Account profile and settings for driving school management |
| `/documents` | **Driving School Management Documents** | `documents` | Document manager for driving school management |

## 📐 Canonical Low-Level Design (LLD) Specifications

### [STUDENT] Student Dashboard (`/dashboard`)

- **Layout**: `metrics_grid`
- **Composed Sub-Components**: `MetricStatCardGrid`, `UpcomingEventsTimeline`, `QuickActionShortcuts`, `RecentActivityFeed`, `NotificationDrawer`
- **Backing REST Endpoints**: `GET /api/dashboard/metrics`, `GET /api/dashboard/announcements`, `GET /api/notifications`
- **Validation Rules**: Metrics must reflect real store data with zero mock placeholders

**Tab & Form Field Breakdown**:

**Tab: Overview**
- *Fields*: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)
- *User Actions*: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action

### [STUDENT] Student Self-Profile (`/profile`)

- **Layout**: `tabbed_card_layout`
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `AcademicInstitutionalTab`, `SecurityPasswordModal`, `DocumentVaultGrid`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match 10-digit format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), bloodGroup (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Institutional Information**
- *Fields*: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)
- *User Actions*: Download ID Card PDF

**Tab: Security & Credentials**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [STUDENT] Course & Syllabus View (`/subjects`)

- **Layout**: `roster_grid`
- **Composed Sub-Components**: `SubjectRosterTable`, `SyllabusViewerModal`, `FacultyInchargeBadge`, `AttendanceProgressBar`, `SubjectCreditSummary`
- **Backing REST Endpoints**: `GET /api/subjects`, `GET /api/subjects/{id}/syllabus`, `GET /api/subjects/{id}/attendance`
- **Validation Rules**: Total registered credits must not exceed semester maximum quota

**Tab & Form Field Breakdown**:

**Tab: Enrolled Courses**
- *Fields*: courseCode (string), courseTitle (string), department (string), credits (number), facultyInchargeName (string), attendancePercent (progress), syllabusUrl (url)
- *User Actions*: Download Syllabus PDF, View Course Schedule

### [STUDENT] Semester Gradebook (`/results`)

- **Layout**: `master_detail_gradebook`
- **Composed Sub-Components**: `SgpaCgpaSummaryCard`, `SemesterPickerTabs`, `SubjectResultTable`, `MarksBreakdownDrawer`, `TranscriptExporter`, `RevaluationRequestModal`
- **Backing REST Endpoints**: `GET /api/results`, `GET /api/results/{semesterId}`, `POST /api/results/revaluation`, `GET /api/results/transcript-pdf`
- **Validation Rules**: SGPA and CGPA must be computed to 2 decimal places; Revaluation request only permitted within 14 days of publication

**Tab & Form Field Breakdown**:

**Tab: Semester Results**
- *Fields*: semesterId (select), academicYear (string), sgpa (number), cgpa (number), totalCreditsEarned (number), resultStatus (badge)
- *User Actions*: Filter Semester, Export Official Transcript PDF, Request Revaluation

**Tab: Subject Breakdown**
- *Fields*: subjectCode (string), subjectName (string), credits (number), grade (string), gradePoint (number), internalMarks (number), externalMarks (number), totalMarks (number)
- *User Actions*: View Score Breakdown Modal

### [STUDENT] Industrial NOC Hub (`/internships`)

- **Layout**: `form_wizard_and_tracker`
- **Composed Sub-Components**: `NocApplicationWizard`, `EligibilityGuardPill`, `CompanyMentorForm`, `OfferLetterUploadBox`, `CreditConversionCard`
- **Backing REST Endpoints**: `GET /api/internships`, `POST /api/internships/noc-request`, `PATCH /api/internships/{id}/approve-noc`, `PATCH /api/internships/{id}/convert-credits`
- **Validation Rules**: Student must have CGPA >= 6.5 and 0 active backlogs for NOC approval

**Tab & Form Field Breakdown**:

**Tab: NOC Application**
- *Fields*: companyName (string), internshipType (select), stipendMonthlyInr (number), startDate (date), endDate (date), companyMentorName (string), companyMentorEmail (email), offerLetterDoc (file)
- *User Actions*: Submit NOC Request, Upload Offer Letter, Download Issued NOC

**Tab: Credit Conversion**
- *Fields*: weeklyHours (number), mentorFeedbackScore (number), facultySupervisorScore (number), creditsApproved (number)
- *User Actions*: Convert to Academic Credits

### [STUDENT] Capstone Project Board (`/capstone`)

- **Layout**: `project_lifecycle_board`
- **Composed Sub-Components**: `TeamRegistrationForm`, `GuideAllocationPicker`, `PlagiarismScorePill`, `JuryScorecardDrawer`, `MilestoneProgressTracker`
- **Backing REST Endpoints**: `GET /api/capstones`, `POST /api/capstones`, `PATCH /api/capstones/{id}/scores`, `POST /api/capstones/{id}/plagiarism-check`
- **Validation Rules**: Max 4 students per team; Plagiarism similarity must remain under 15% threshold

**Tab & Form Field Breakdown**:

**Tab: Project Workspace**
- *Fields*: projectTitle (string), technicalDomain (select), guideFacultyId (select), teamMemberRollNumbers (array), teamLeadRollNumber (string), plagiarismSimilarityPercent (number), phase1Score (number), phase2Score (number), githubRepoUrl (url), demoVideoUrl (url)
- *User Actions*: Submit Proposal, Run Plagiarism Scan, Submit Milestone Demo, Record Jury Score

### [STUDENT] Student Document Vault (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: ClamAV scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Scan for Viruses, Download Document, Delete Document

### [INSTRUCTOR] Instructor Dashboard (`/dashboard`)

- **Layout**: `metrics_grid`
- **Composed Sub-Components**: `MetricStatCardGrid`, `UpcomingEventsTimeline`, `QuickActionShortcuts`, `RecentActivityFeed`, `NotificationDrawer`
- **Backing REST Endpoints**: `GET /api/dashboard/metrics`, `GET /api/dashboard/announcements`, `GET /api/notifications`
- **Validation Rules**: Metrics must reflect real store data with zero mock placeholders

**Tab & Form Field Breakdown**:

**Tab: Overview**
- *Fields*: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)
- *User Actions*: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action

### [INSTRUCTOR] Instructor Profile (`/profile`)

- **Layout**: `tabbed_card_layout`
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `AcademicInstitutionalTab`, `SecurityPasswordModal`, `DocumentVaultGrid`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match 10-digit format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), bloodGroup (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Institutional Information**
- *Fields*: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)
- *User Actions*: Download ID Card PDF

**Tab: Security & Credentials**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [INSTRUCTOR] Instructor Documents (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: ClamAV scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Scan for Viruses, Download Document, Delete Document

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard (`/dashboard`)

- **Layout**: `metrics_grid`
- **Composed Sub-Components**: `MetricStatCardGrid`, `UpcomingEventsTimeline`, `QuickActionShortcuts`, `RecentActivityFeed`, `NotificationDrawer`
- **Backing REST Endpoints**: `GET /api/dashboard/metrics`, `GET /api/dashboard/announcements`, `GET /api/notifications`
- **Validation Rules**: Metrics must reflect real store data with zero mock placeholders

**Tab & Form Field Breakdown**:

**Tab: Overview**
- *Fields*: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)
- *User Actions*: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile (`/profile`)

- **Layout**: `tabbed_card_layout`
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `AcademicInstitutionalTab`, `SecurityPasswordModal`, `DocumentVaultGrid`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match 10-digit format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), bloodGroup (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Institutional Information**
- *Fields*: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)
- *User Actions*: Download ID Card PDF

**Tab: Security & Credentials**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Documents (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: ClamAV scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Scan for Viruses, Download Document, Delete Document

## Acceptance Criteria

- Verify that Driving School Management — Student Enrollment is functioning as expected.
- Verify that Driving School Management — Instructor Scheduling is functioning as expected.
- Verify that Driving School Management — Exam Tracking is functioning as expected.
- Verify that Provide data management for entity 'ItemEntity' is functioning as expected.
- Verify that Provide data management for entity 'markets_analytics' is functioning as expected.
- Verify that Provide data management for entity 'market_stats_hourly' is functioning as expected.
- Verify that Provide data management for entity 'users' is functioning as expected.
- Verify that Provide data management for entity 'orders' is functioning as expected.
- Verify that Provide data management for entity 'events' is functioning as expected.
- Verify that Provide data management for entity 'User' is functioning as expected.
- Verify that Provide data management for entity 'Student' is functioning as expected.
- Verify that Provide data management for entity 'Instructor' is functioning as expected.
- Verify that Provide data management for entity 'Admin' is functioning as expected.
- Verify that Provide data management for entity 'Session' is functioning as expected.
- Verify that Provide data management for entity 'Attendance' is functioning as expected.
- Verify that Provide data management for entity 'Feedback' is functioning as expected.
- Verify that Provide data management for entity 'CourseFeedback' is functioning as expected.
- Verify that Provide data management for entity 'InstructorLog' is functioning as expected.
- Verify that Provide data management for entity 'LearningCard' is functioning as expected.
- Verify that Provide data management for entity 'LearningProgress' is functioning as expected.
- Verify that Provide data management for entity 'RoadmapNode' is functioning as expected.
- Verify that Provide data management for entity 'StudentRoadmapNode' is functioning as expected.
- Verify that Provide data management for entity 'RTOQuestion' is functioning as expected.
- Verify that Provide data management for entity 'QuizAttempt' is functioning as expected.
- Verify that Provide data management for entity 'XPEvent' is functioning as expected.
- Verify that Provide data management for entity 'Badge' is functioning as expected.
- Verify that Provide data management for entity 'StudentBadge' is functioning as expected.
- Verify that Provide data management for entity 'Slot' is functioning as expected.
- Verify that Provide data management for entity 'Booking' is functioning as expected.
- Verify that Provide data management for entity 'Notification' is functioning as expected.
- Verify that Provide data management for entity 'Inquiry' is functioning as expected.
- Verify that Provide data management for entity 'Payment' is functioning as expected.
- Verify that Provide data management for entity 'DrivingTest' is functioning as expected.
- Verify that Provide data management for entity 'Announcement' is functioning as expected.
- Verify that Provide data management for entity 'ActivityLog' is functioning as expected.
- Verify that Provide data management for entity 'DailyChallenge' is functioning as expected.
- Verify that Provide data management for entity 'StudentDailyChallenge' is functioning as expected.
- Verify that Provide data management for entity 'CoachingNote' is functioning as expected.
- Verify that Provide data management for entity 'SessionNote' is functioning as expected.
- Verify that Provide data management for entity 'Promotion' is functioning as expected.
- Verify that Provide data management for entity 'Vehicle' is functioning as expected.
- Verify that Provide data management for entity 'GalleryImage' is functioning as expected.
- Verify that Provide data management for entity 'StudentCardProgress' is functioning as expected.
- Verify that Provide data management for entity 'SkillMastery' is functioning as expected.
- Verify that Provide data management for entity 'SyllabusDay' is functioning as expected.
- Verify that Provide data management for entity 'StudentSyllabusProgress' is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/bookings/BookingsManagerClient is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/bookings/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/bookings/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/content/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/content/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/content/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/dashboard/AdminDashboardClient is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/dashboard/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/dashboard/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/enquiries/EnquiriesClient is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/enquiries/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/enquiries/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/fleet/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/gamification/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/gamification/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/offers/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/offers/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/settings/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/settings/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/students/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/admin/students/page is functioning as expected.
- Verify that Support existing workspace page module: (admin)/error is functioning as expected.
- Verify that Support existing workspace page module: (admin)/layout is functioning as expected.
- Verify that Support existing workspace page module: (admin)/loading is functioning as expected.
- Verify that Support existing workspace page module: (admin)/slots/page is functioning as expected.
- Verify that Support existing workspace page module: (auth)/admin-portal-login/page is functioning as expected.
- Verify that Support existing workspace page module: (auth)/forgot-password/page is functioning as expected.
- Verify that Support existing workspace page module: (auth)/loading is functioning as expected.
- Verify that Support existing workspace page module: (public)/LandingClient is functioning as expected.
- Verify that Support existing workspace page module: (public)/booking/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/booking/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (public)/fleet/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/gallery/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/layout is functioning as expected.
- Verify that Support existing workspace page module: (public)/loading is functioning as expected.
- Verify that Support existing workspace page module: (public)/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/programs/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/study/page is functioning as expected.
- Verify that Support existing workspace page module: (public)/unauthorized/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/error is functioning as expected.
- Verify that Support existing workspace page module: (student)/layout is functioning as expected.
- Verify that Support existing workspace page module: (student)/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/badges/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/badges/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/badges/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/certificate/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/components/ActivityTimeline is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/components/ConfidenceMeter is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/components/DailyChallengesList is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/components/LearningHeatmap is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/dashboard/DashboardClient is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/dashboard/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/dashboard/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/dashboard/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/flashcards/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/flashcards/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/leaderboard/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/leaderboard/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/learn/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/learn/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/notifications/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/onboarding/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/profile/ProfileClient is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/profile/actions is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/profile/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/profile/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/roadmap/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/roadmap/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/roadmap/page-AK is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/rto/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/rto/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/schedule/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/schedule/page is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/timeline/loading is functioning as expected.
- Verify that Support existing workspace page module: (student)/student/timeline/page is functioning as expected.
- Verify that Support existing workspace page module: api/admin/bookings/approve/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/branding/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/courses/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/enquiries/[id]/resolve/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/gallery/[id]/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/gallery/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/gamification/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/gamification/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/admin/live-feed/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/live-feed/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/admin/offers/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/overview/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/overview/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/admin/roadmap/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/[id]/assign/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/[id]/fee/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/[id]/payments/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/[id]/status/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/[id]/tests/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/create/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/students/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/syllabus/route is functioning as expected.
- Verify that Support existing workspace page module: api/admin/translate/route is functioning as expected.
- Verify that Support existing workspace page module: api/auth/[ is functioning as expected.
- Verify that Support existing workspace page module: api/auth/forgot-password/route is functioning as expected.
- Verify that Support existing workspace page module: api/chat/route is functioning as expected.
- Verify that Support existing workspace page module: api/cron/daily-reminders/route is functioning as expected.
- Verify that Support existing workspace page module: api/cron/prune-logs/route is functioning as expected.
- Verify that Support existing workspace page module: api/cron/reset-streaks/route is functioning as expected.
- Verify that Support existing workspace page module: api/notifications/[id]/read/route is functioning as expected.
- Verify that Support existing workspace page module: api/notifications/read-all/route is functioning as expected.
- Verify that Support existing workspace page module: api/notifications/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/bookings/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/bookings/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/public/courses/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/gallery/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/inquiry/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/offers/route is functioning as expected.
- Verify that Support existing workspace page module: api/public/syllabus/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/attendance-otp/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/badges/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/badges/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/student/course-feedback/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/dashboard/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/gamification/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/leaderboard/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/learning-cards/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/learning-cards/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/student/onboard/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/roadmap/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/roadmap/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/student/rto/weak-topics/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/rto/weak-topics/route-AK is functioning as expected.
- Verify that Support existing workspace page module: api/student/syllabus-progress/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/timeline/route is functioning as expected.
- Verify that Support existing workspace page module: api/student/xp/route is functioning as expected.
- Verify that Support existing workspace page module: api/uploadthing/core is functioning as expected.
- Verify that Support existing workspace page module: api/uploadthing/route is functioning as expected.
- Verify that Support existing workspace page module: app-home/page is functioning as expected.
- Verify that Support existing workspace page module: signs/SignsClient is functioning as expected.
- Verify that Support existing workspace page module: signs/page is functioning as expected.
- Verify that Support existing workspace page module: signs/page-AK is functioning as expected.
- Verify that Support existing workspace page module: test_badge/page is functioning as expected.
- Verify that role 'student' can access all assigned capabilities without permission errors.
- Verify that role 'instructor' can access all assigned capabilities without permission errors.
- Verify that role 'driving school management' can access all assigned capabilities without permission errors.

## Requirements by Type

### EXPLICIT (3)

- **REQ-BASE-0**: Driving School Management — Student Enrollment
- **REQ-BASE-1**: Driving School Management — Instructor Scheduling
- **REQ-BASE-2**: Driving School Management — Exam Tracking

### DERIVED (63)

- **REQ-PAGE-1**: Driving School Management View — Student Enrollment
  - _Role 'driving school management' bound to capability 'student_enrollment'_
  - _Inferred access level 'full_crud' from clause semantics_
  - _Source clause: 'Build driving school management portal with student enrollment, instructor scheduling, and exam trac'_
- **REQ-PAGE-2**: Driving School Management View — Instructor Scheduling
  - _Role 'driving school management' bound to capability 'instructor_scheduling'_
  - _Inferred access level 'full_crud' from clause semantics_
  - _Source clause: 'Build driving school management portal with student enrollment, instructor scheduling, and exam trac'_
- **REQ-PAGE-3**: Driving School Management View — Exam Tracking
  - _Role 'driving school management' bound to capability 'exam_tracking'_
  - _Inferred access level 'full_crud' from clause semantics_
  - _Source clause: 'Build driving school management portal with student enrollment, instructor scheduling, and exam trac'_
- **REQ-LLD-COMP-1**: [STUDENT] Student Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Student Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-2**: [STUDENT] Student Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Student Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-3**: [STUDENT] Student Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Student Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-4**: [STUDENT] Student Self-Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab
  - _Canonical Low-Level Design expansion for Student Self-Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab_
- **REQ-LLD-FIELDS-5**: [STUDENT] Student Self-Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Student Self-Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-6**: [STUDENT] Student Self-Profile (Institutional Information) — Form Fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number) | Actions: Download ID Card PDF
  - _Mandatory field definitions for Student Self-Profile -> Institutional Information_
  - _Input fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)_
  - _Actions: Download ID Card PDF_
- **REQ-LLD-FIELDS-7**: [STUDENT] Student Self-Profile (Security & Credentials) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Student Self-Profile -> Security & Credentials_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-8**: [STUDENT] Student Self-Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Student Self-Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-9**: [STUDENT] Course & Syllabus View — UI Component Hierarchy: SubjectRosterTable, SyllabusViewerModal, FacultyInchargeBadge, AttendanceProgressBar
  - _Canonical Low-Level Design expansion for Course & Syllabus View (/subjects)_
  - _Layout type: roster_grid_
  - _Composed components: SubjectRosterTable, SyllabusViewerModal, FacultyInchargeBadge, AttendanceProgressBar_
- **REQ-LLD-FIELDS-10**: [STUDENT] Course & Syllabus View (Enrolled Courses) — Form Fields: courseCode (string), courseTitle (string), department (string), credits (number), facultyInchargeName (string) | Actions: Download Syllabus PDF, View Course Schedule
  - _Mandatory field definitions for Course & Syllabus View -> Enrolled Courses_
  - _Input fields: courseCode (string), courseTitle (string), department (string), credits (number), facultyInchargeName (string)_
  - _Actions: Download Syllabus PDF, View Course Schedule_
- **REQ-LLD-API-11**: [STUDENT] Course & Syllabus View — Backing REST APIs: GET /api/subjects, GET /api/subjects/{id}/syllabus, GET /api/subjects/{id}/attendance
  - _REST API contract for Course & Syllabus View_
  - _Endpoints: GET /api/subjects, GET /api/subjects/{id}/syllabus, GET /api/subjects/{id}/attendance_
- **REQ-LLD-COMP-12**: [STUDENT] Semester Gradebook — UI Component Hierarchy: SgpaCgpaSummaryCard, SemesterPickerTabs, SubjectResultTable, MarksBreakdownDrawer
  - _Canonical Low-Level Design expansion for Semester Gradebook (/results)_
  - _Layout type: master_detail_gradebook_
  - _Composed components: SgpaCgpaSummaryCard, SemesterPickerTabs, SubjectResultTable, MarksBreakdownDrawer_
- **REQ-LLD-FIELDS-13**: [STUDENT] Semester Gradebook (Semester Results) — Form Fields: semesterId (select), academicYear (string), sgpa (number), cgpa (number), totalCreditsEarned (number) | Actions: Filter Semester, Export Official Transcript PDF, Request Revaluation
  - _Mandatory field definitions for Semester Gradebook -> Semester Results_
  - _Input fields: semesterId (select), academicYear (string), sgpa (number), cgpa (number), totalCreditsEarned (number)_
  - _Actions: Filter Semester, Export Official Transcript PDF, Request Revaluation_
- **REQ-LLD-FIELDS-14**: [STUDENT] Semester Gradebook (Subject Breakdown) — Form Fields: subjectCode (string), subjectName (string), credits (number), grade (string), gradePoint (number) | Actions: View Score Breakdown Modal
  - _Mandatory field definitions for Semester Gradebook -> Subject Breakdown_
  - _Input fields: subjectCode (string), subjectName (string), credits (number), grade (string), gradePoint (number)_
  - _Actions: View Score Breakdown Modal_
- **REQ-LLD-API-15**: [STUDENT] Semester Gradebook — Backing REST APIs: GET /api/results, GET /api/results/{semesterId}, POST /api/results/revaluation
  - _REST API contract for Semester Gradebook_
  - _Endpoints: GET /api/results, GET /api/results/{semesterId}, POST /api/results/revaluation_
- **REQ-LLD-COMP-16**: [STUDENT] Industrial NOC Hub — UI Component Hierarchy: NocApplicationWizard, EligibilityGuardPill, CompanyMentorForm, OfferLetterUploadBox
  - _Canonical Low-Level Design expansion for Industrial NOC Hub (/internships)_
  - _Layout type: form_wizard_and_tracker_
  - _Composed components: NocApplicationWizard, EligibilityGuardPill, CompanyMentorForm, OfferLetterUploadBox_
- **REQ-LLD-FIELDS-17**: [STUDENT] Industrial NOC Hub (NOC Application) — Form Fields: companyName (string), internshipType (select), stipendMonthlyInr (number), startDate (date), endDate (date) | Actions: Submit NOC Request, Upload Offer Letter, Download Issued NOC
  - _Mandatory field definitions for Industrial NOC Hub -> NOC Application_
  - _Input fields: companyName (string), internshipType (select), stipendMonthlyInr (number), startDate (date), endDate (date)_
  - _Actions: Submit NOC Request, Upload Offer Letter, Download Issued NOC_
- **REQ-LLD-FIELDS-18**: [STUDENT] Industrial NOC Hub (Credit Conversion) — Form Fields: weeklyHours (number), mentorFeedbackScore (number), facultySupervisorScore (number), creditsApproved (number) | Actions: Convert to Academic Credits
  - _Mandatory field definitions for Industrial NOC Hub -> Credit Conversion_
  - _Input fields: weeklyHours (number), mentorFeedbackScore (number), facultySupervisorScore (number), creditsApproved (number)_
  - _Actions: Convert to Academic Credits_
- **REQ-LLD-API-19**: [STUDENT] Industrial NOC Hub — Backing REST APIs: GET /api/internships, POST /api/internships/noc-request, PATCH /api/internships/{id}/approve-noc
  - _REST API contract for Industrial NOC Hub_
  - _Endpoints: GET /api/internships, POST /api/internships/noc-request, PATCH /api/internships/{id}/approve-noc_
- **REQ-LLD-COMP-20**: [STUDENT] Capstone Project Board — UI Component Hierarchy: TeamRegistrationForm, GuideAllocationPicker, PlagiarismScorePill, JuryScorecardDrawer
  - _Canonical Low-Level Design expansion for Capstone Project Board (/capstone)_
  - _Layout type: project_lifecycle_board_
  - _Composed components: TeamRegistrationForm, GuideAllocationPicker, PlagiarismScorePill, JuryScorecardDrawer_
- **REQ-LLD-FIELDS-21**: [STUDENT] Capstone Project Board (Project Workspace) — Form Fields: projectTitle (string), technicalDomain (select), guideFacultyId (select), teamMemberRollNumbers (array), teamLeadRollNumber (string) | Actions: Submit Proposal, Run Plagiarism Scan, Submit Milestone Demo
  - _Mandatory field definitions for Capstone Project Board -> Project Workspace_
  - _Input fields: projectTitle (string), technicalDomain (select), guideFacultyId (select), teamMemberRollNumbers (array), teamLeadRollNumber (string)_
  - _Actions: Submit Proposal, Run Plagiarism Scan, Submit Milestone Demo_
- **REQ-LLD-API-22**: [STUDENT] Capstone Project Board — Backing REST APIs: GET /api/capstones, POST /api/capstones, PATCH /api/capstones/{id}/scores
  - _REST API contract for Capstone Project Board_
  - _Endpoints: GET /api/capstones, POST /api/capstones, PATCH /api/capstones/{id}/scores_
- **REQ-LLD-COMP-23**: [STUDENT] Student Document Vault — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Student Document Vault (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-24**: [STUDENT] Student Document Vault (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge) | Actions: Upload Document, Scan for Viruses, Download Document
  - _Mandatory field definitions for Student Document Vault -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge)_
  - _Actions: Upload Document, Scan for Viruses, Download Document_
- **REQ-LLD-API-25**: [STUDENT] Student Document Vault — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Student Document Vault_
  - _Endpoints: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}_
- **REQ-LLD-COMP-26**: [INSTRUCTOR] Instructor Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Instructor Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-27**: [INSTRUCTOR] Instructor Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Instructor Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-28**: [INSTRUCTOR] Instructor Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Instructor Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-29**: [INSTRUCTOR] Instructor Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab
  - _Canonical Low-Level Design expansion for Instructor Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab_
- **REQ-LLD-FIELDS-30**: [INSTRUCTOR] Instructor Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Instructor Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-31**: [INSTRUCTOR] Instructor Profile (Institutional Information) — Form Fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number) | Actions: Download ID Card PDF
  - _Mandatory field definitions for Instructor Profile -> Institutional Information_
  - _Input fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)_
  - _Actions: Download ID Card PDF_
- **REQ-LLD-FIELDS-32**: [INSTRUCTOR] Instructor Profile (Security & Credentials) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Instructor Profile -> Security & Credentials_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-33**: [INSTRUCTOR] Instructor Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Instructor Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-34**: [INSTRUCTOR] Instructor Documents — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Instructor Documents (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-35**: [INSTRUCTOR] Instructor Documents (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge) | Actions: Upload Document, Scan for Viruses, Download Document
  - _Mandatory field definitions for Instructor Documents -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge)_
  - _Actions: Upload Document, Scan for Viruses, Download Document_
- **REQ-LLD-API-36**: [INSTRUCTOR] Instructor Documents — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Instructor Documents_
  - _Endpoints: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}_
- **REQ-LLD-COMP-37**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Driving School Management Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-38**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Driving School Management Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-39**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Driving School Management Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-40**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab
  - _Canonical Low-Level Design expansion for Driving School Management Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, AcademicInstitutionalTab_
- **REQ-LLD-FIELDS-41**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Driving School Management Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-42**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile (Institutional Information) — Form Fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number) | Actions: Download ID Card PDF
  - _Mandatory field definitions for Driving School Management Profile -> Institutional Information_
  - _Input fields: rollNumber / employeeId (string, read-only), department (string, read-only), batchSection (string, read-only), admissionYear / joiningDate (date), currentSemester (number)_
  - _Actions: Download ID Card PDF_
- **REQ-LLD-FIELDS-43**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile (Security & Credentials) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Driving School Management Profile -> Security & Credentials_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorAuthToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-44**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Driving School Management Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-45**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Documents — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Driving School Management Documents (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-46**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Documents (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge) | Actions: Upload Document, Scan for Viruses, Download Document
  - _Mandatory field definitions for Driving School Management Documents -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), virusScanStatus (badge)_
  - _Actions: Upload Document, Scan for Viruses, Download Document_
- **REQ-LLD-API-47**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Documents — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Driving School Management Documents_
  - _Endpoints: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}_
- **REQ-INF-UNI-001**: Implement structured JSON logging across all execution paths
  - _All non-trivial projects require structured logging for debugging_
- **REQ-INF-UNI-002**: Sanitize and validate all external inputs at system boundaries
  - _Input sanitization protects against injection and validation defects_
- **REQ-INF-UNI-003**: Catch unhandled exceptions and return structured error envelopes
  - _Unhandled exceptions lead to process crashes or blank UI screens_
- **REQ-INF-UNI-004**: Maintain unit and integration test coverage for primary workflows
  - _Automated tests guarantee regressions are caught during CI_
- **REQ-INF-UNI-005**: Decouple configuration from code using environment variables
  - _Hardcoded secrets/config violate 12-Factor app methodology_
- **REQ-INF-WEB-003**: Implement RBAC middleware and client route guards
  - _Multi-role applications require server & client access control_
- **REQ-INF-WEB-004**: Wrap page views in Error Boundary components and empty-state fallbacks
  - _Error boundaries prevent white-screen crashes on client errors_
- **REQ-INF-WEB-007**: Use state-machine workflow API endpoints over raw CRUD for controlled entities
  - _Controlled entities need explicit state transitions_
- **REQ-INF-API-001**: Enforce rate limiting on public API endpoints
  - _Rate limiting protects API endpoints against abuse and DDoS_
- **REQ-INF-MOBILE-001**: Implement local SQLite/IndexedDB caching for offline resilience
  - _Mobile apps must handle network connectivity loss gracefully_
- **REQ-INF-XCUT-001**: Configure CSP, HSTS, and X-Frame-Options security headers
  - _Security headers mitigate XSS and clickjacking_
- **REQ-INF-XCUT-002**: Configure explicit CORS origin whitelisting
  - _Unrestricted CORS exposes API endpoints to unauthorized domains_
- **REQ-INF-XCUT-003**: Ensure ARIA tags, color contrast compliance, and keyboard focus states
  - _UI applications must be accessible to users with screen readers_

### SUPPORTED (182)

- **REQ-EXP-4**: Provide data management for entity 'ItemEntity'
  - _Entity 'ItemEntity' discovered in project workspace schema_
  - _Fields: id, title, description, tags, status_
- **REQ-EXP-5**: Provide data management for entity 'markets_analytics'
  - _Entity 'markets_analytics' discovered in project workspace schema_
  - _Fields: date, market_id, market_name, volume, trades_
- **REQ-EXP-6**: Provide data management for entity 'market_stats_hourly'
  - _Entity 'market_stats_hourly' discovered in project workspace schema_
  - _Fields: hour, market_id, total_volume, total_trades, PARTITION_
- **REQ-EXP-7**: Provide data management for entity 'users'
  - _Entity 'users' discovered in project workspace schema_
  - _Fields: id, name, email, role, metadata_
- **REQ-EXP-8**: Provide data management for entity 'orders'
  - _Entity 'orders' discovered in project workspace schema_
  - _Fields: id, account_id, status, total, created_at_
- **REQ-EXP-9**: Provide data management for entity 'events'
  - _Entity 'events' discovered in project workspace schema_
  - _Fields: id, payload, event_type, GENERATED, For_
- **REQ-EXP-10**: Provide data management for entity 'User'
  - _Entity 'User' discovered in project workspace schema_
  - _Fields: id, email, phone, passwordHash, role_
- **REQ-EXP-11**: Provide data management for entity 'Student'
  - _Entity 'Student' discovered in project workspace schema_
  - _Fields: id, userId, user, instructorId, instructor_
- **REQ-EXP-12**: Provide data management for entity 'Instructor'
  - _Entity 'Instructor' discovered in project workspace schema_
  - _Fields: id, userId, user, bio, specialization_
- **REQ-EXP-13**: Provide data management for entity 'Admin'
  - _Entity 'Admin' discovered in project workspace schema_
  - _Fields: id, userId, user_
- **REQ-EXP-14**: Provide data management for entity 'Session'
  - _Entity 'Session' discovered in project workspace schema_
  - _Fields: id, studentId, student, instructorId, instructor_
- **REQ-EXP-15**: Provide data management for entity 'Attendance'
  - _Entity 'Attendance' discovered in project workspace schema_
  - _Fields: id, sessionId, session, studentId, student_
- **REQ-EXP-16**: Provide data management for entity 'Feedback'
  - _Entity 'Feedback' discovered in project workspace schema_
  - _Fields: id, studentId, student, instructorId, tag_
- **REQ-EXP-17**: Provide data management for entity 'CourseFeedback'
  - _Entity 'CourseFeedback' discovered in project workspace schema_
  - _Fields: id, studentId, student, rating, comment_
- **REQ-EXP-18**: Provide data management for entity 'InstructorLog'
  - _Entity 'InstructorLog' discovered in project workspace schema_
  - _Fields: id, instructorId, instructor, date, content_
- **REQ-EXP-19**: Provide data management for entity 'LearningCard'
  - _Entity 'LearningCard' discovered in project workspace schema_
  - _Fields: id, slug, title, category, phase_
- **REQ-EXP-20**: Provide data management for entity 'LearningProgress'
  - _Entity 'LearningProgress' discovered in project workspace schema_
  - _Fields: id, studentId, student, cardId, card_
- **REQ-EXP-21**: Provide data management for entity 'RoadmapNode'
  - _Entity 'RoadmapNode' discovered in project workspace schema_
  - _Fields: id, title, description, phase, orderIndex_
- **REQ-EXP-22**: Provide data management for entity 'StudentRoadmapNode'
  - _Entity 'StudentRoadmapNode' discovered in project workspace schema_
  - _Fields: id, studentId, student, nodeId, node_
- **REQ-EXP-23**: Provide data management for entity 'RTOQuestion'
  - _Entity 'RTOQuestion' discovered in project workspace schema_
  - _Fields: id, question, options, answer, category_
- **REQ-EXP-24**: Provide data management for entity 'QuizAttempt'
  - _Entity 'QuizAttempt' discovered in project workspace schema_
  - _Fields: id, studentId, student, questionId, question_
- **REQ-EXP-25**: Provide data management for entity 'XPEvent'
  - _Entity 'XPEvent' discovered in project workspace schema_
  - _Fields: id, studentId, student, amount, reason_
- **REQ-EXP-26**: Provide data management for entity 'Badge'
  - _Entity 'Badge' discovered in project workspace schema_
  - _Fields: id, type, name, description, icon_
- **REQ-EXP-27**: Provide data management for entity 'StudentBadge'
  - _Entity 'StudentBadge' discovered in project workspace schema_
  - _Fields: id, studentId, student, badgeId, badge_
- **REQ-EXP-28**: Provide data management for entity 'Slot'
  - _Entity 'Slot' discovered in project workspace schema_
  - _Fields: id, instructorId, instructor, trainingType, dayOfWeek_
- **REQ-EXP-29**: Provide data management for entity 'Booking'
  - _Entity 'Booking' discovered in project workspace schema_
  - _Fields: id, studentId, student, slotId, slot_
- **REQ-EXP-30**: Provide data management for entity 'Notification'
  - _Entity 'Notification' discovered in project workspace schema_
  - _Fields: id, userId, user, studentId, student_
- **REQ-EXP-31**: Provide data management for entity 'Inquiry'
  - _Entity 'Inquiry' discovered in project workspace schema_
  - _Fields: id, name, phone, email, message_
- **REQ-EXP-32**: Provide data management for entity 'Payment'
  - _Entity 'Payment' discovered in project workspace schema_
  - _Fields: id, studentId, student, amount, method_
- **REQ-EXP-33**: Provide data management for entity 'DrivingTest'
  - _Entity 'DrivingTest' discovered in project workspace schema_
  - _Fields: id, studentId, student, testDate, testCenter_
- **REQ-EXP-34**: Provide data management for entity 'Announcement'
  - _Entity 'Announcement' discovered in project workspace schema_
  - _Fields: id, title, message, expiryDate, createdAt_
- **REQ-EXP-35**: Provide data management for entity 'ActivityLog'
  - _Entity 'ActivityLog' discovered in project workspace schema_
  - _Fields: id, studentId, student, action, xpEarned_
- **REQ-EXP-36**: Provide data management for entity 'DailyChallenge'
  - _Entity 'DailyChallenge' discovered in project workspace schema_
  - _Fields: id, date, tasks, xpReward_
- **REQ-EXP-37**: Provide data management for entity 'StudentDailyChallenge'
  - _Entity 'StudentDailyChallenge' discovered in project workspace schema_
  - _Fields: id, studentId, student, date, completedTasks_
- **REQ-EXP-38**: Provide data management for entity 'CoachingNote'
  - _Entity 'CoachingNote' discovered in project workspace schema_
  - _Fields: id, sessionId, session, instructorId, instructor_
- **REQ-EXP-39**: Provide data management for entity 'SessionNote'
  - _Entity 'SessionNote' discovered in project workspace schema_
  - _Fields: id, sessionId, session, studentId, student_
- **REQ-EXP-40**: Provide data management for entity 'Promotion'
  - _Entity 'Promotion' discovered in project workspace schema_
  - _Fields: id, title, description, active, expiresAt_
- **REQ-EXP-41**: Provide data management for entity 'Vehicle'
  - _Entity 'Vehicle' discovered in project workspace schema_
  - _Fields: id, name, type, imageKey, features_
- **REQ-EXP-42**: Provide data management for entity 'GalleryImage'
  - _Entity 'GalleryImage' discovered in project workspace schema_
  - _Fields: id, imageKey, caption, uploadedAt_
- **REQ-EXP-43**: Provide data management for entity 'StudentCardProgress'
  - _Entity 'StudentCardProgress' discovered in project workspace schema_
  - _Fields: id, studentId, student, cardKey, studied_
- **REQ-EXP-44**: Provide data management for entity 'SkillMastery'
  - _Entity 'SkillMastery' discovered in project workspace schema_
  - _Fields: id, studentId, student, skillKey, masteryLevel_
- **REQ-EXP-45**: Provide data management for entity 'SyllabusDay'
  - _Entity 'SyllabusDay' discovered in project workspace schema_
  - _Fields: id, trainingType, dayNumber, title, description_
- **REQ-EXP-46**: Provide data management for entity 'StudentSyllabusProgress'
  - _Entity 'StudentSyllabusProgress' discovered in project workspace schema_
  - _Fields: id, studentId, syllabusDayId, completedAt, instructorId_
- **REQ-PAGE-EXISTING-47**: Support existing workspace page module: (admin)/admin/bookings/BookingsManagerClient
  - _Discovered existing route/page file '(admin)/admin/bookings/BookingsManagerClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-48**: Support existing workspace page module: (admin)/admin/bookings/loading
  - _Discovered existing route/page file '(admin)/admin/bookings/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-49**: Support existing workspace page module: (admin)/admin/bookings/page
  - _Discovered existing route/page file '(admin)/admin/bookings/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-50**: Support existing workspace page module: (admin)/admin/content/loading
  - _Discovered existing route/page file '(admin)/admin/content/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-51**: Support existing workspace page module: (admin)/admin/content/page
  - _Discovered existing route/page file '(admin)/admin/content/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-52**: Support existing workspace page module: (admin)/admin/content/page-AK
  - _Discovered existing route/page file '(admin)/admin/content/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-53**: Support existing workspace page module: (admin)/admin/dashboard/AdminDashboardClient
  - _Discovered existing route/page file '(admin)/admin/dashboard/AdminDashboardClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-54**: Support existing workspace page module: (admin)/admin/dashboard/page
  - _Discovered existing route/page file '(admin)/admin/dashboard/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-55**: Support existing workspace page module: (admin)/admin/dashboard/page-AK
  - _Discovered existing route/page file '(admin)/admin/dashboard/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-56**: Support existing workspace page module: (admin)/admin/enquiries/EnquiriesClient
  - _Discovered existing route/page file '(admin)/admin/enquiries/EnquiriesClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-57**: Support existing workspace page module: (admin)/admin/enquiries/loading
  - _Discovered existing route/page file '(admin)/admin/enquiries/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-58**: Support existing workspace page module: (admin)/admin/enquiries/page
  - _Discovered existing route/page file '(admin)/admin/enquiries/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-59**: Support existing workspace page module: (admin)/admin/fleet/page
  - _Discovered existing route/page file '(admin)/admin/fleet/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-60**: Support existing workspace page module: (admin)/admin/gamification/loading
  - _Discovered existing route/page file '(admin)/admin/gamification/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-61**: Support existing workspace page module: (admin)/admin/gamification/page
  - _Discovered existing route/page file '(admin)/admin/gamification/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-62**: Support existing workspace page module: (admin)/admin/offers/loading
  - _Discovered existing route/page file '(admin)/admin/offers/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-63**: Support existing workspace page module: (admin)/admin/offers/page
  - _Discovered existing route/page file '(admin)/admin/offers/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-64**: Support existing workspace page module: (admin)/admin/settings/loading
  - _Discovered existing route/page file '(admin)/admin/settings/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-65**: Support existing workspace page module: (admin)/admin/settings/page
  - _Discovered existing route/page file '(admin)/admin/settings/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-66**: Support existing workspace page module: (admin)/admin/students/loading
  - _Discovered existing route/page file '(admin)/admin/students/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-67**: Support existing workspace page module: (admin)/admin/students/page
  - _Discovered existing route/page file '(admin)/admin/students/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-68**: Support existing workspace page module: (admin)/error
  - _Discovered existing route/page file '(admin)/error' in workspace directory tree_
- **REQ-PAGE-EXISTING-69**: Support existing workspace page module: (admin)/layout
  - _Discovered existing route/page file '(admin)/layout' in workspace directory tree_
- **REQ-PAGE-EXISTING-70**: Support existing workspace page module: (admin)/loading
  - _Discovered existing route/page file '(admin)/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-71**: Support existing workspace page module: (admin)/slots/page
  - _Discovered existing route/page file '(admin)/slots/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-72**: Support existing workspace page module: (auth)/admin-portal-login/page
  - _Discovered existing route/page file '(auth)/admin-portal-login/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-73**: Support existing workspace page module: (auth)/forgot-password/page
  - _Discovered existing route/page file '(auth)/forgot-password/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-74**: Support existing workspace page module: (auth)/loading
  - _Discovered existing route/page file '(auth)/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-75**: Support existing workspace page module: (public)/LandingClient
  - _Discovered existing route/page file '(public)/LandingClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-76**: Support existing workspace page module: (public)/booking/page
  - _Discovered existing route/page file '(public)/booking/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-77**: Support existing workspace page module: (public)/booking/page-AK
  - _Discovered existing route/page file '(public)/booking/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-78**: Support existing workspace page module: (public)/fleet/page
  - _Discovered existing route/page file '(public)/fleet/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-79**: Support existing workspace page module: (public)/gallery/page
  - _Discovered existing route/page file '(public)/gallery/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-80**: Support existing workspace page module: (public)/layout
  - _Discovered existing route/page file '(public)/layout' in workspace directory tree_
- **REQ-PAGE-EXISTING-81**: Support existing workspace page module: (public)/loading
  - _Discovered existing route/page file '(public)/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-82**: Support existing workspace page module: (public)/page
  - _Discovered existing route/page file '(public)/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-83**: Support existing workspace page module: (public)/programs/page
  - _Discovered existing route/page file '(public)/programs/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-84**: Support existing workspace page module: (public)/study/page
  - _Discovered existing route/page file '(public)/study/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-85**: Support existing workspace page module: (public)/unauthorized/page
  - _Discovered existing route/page file '(public)/unauthorized/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-86**: Support existing workspace page module: (student)/error
  - _Discovered existing route/page file '(student)/error' in workspace directory tree_
- **REQ-PAGE-EXISTING-87**: Support existing workspace page module: (student)/layout
  - _Discovered existing route/page file '(student)/layout' in workspace directory tree_
- **REQ-PAGE-EXISTING-88**: Support existing workspace page module: (student)/loading
  - _Discovered existing route/page file '(student)/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-89**: Support existing workspace page module: (student)/student/badges/loading
  - _Discovered existing route/page file '(student)/student/badges/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-90**: Support existing workspace page module: (student)/student/badges/page
  - _Discovered existing route/page file '(student)/student/badges/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-91**: Support existing workspace page module: (student)/student/badges/page-AK
  - _Discovered existing route/page file '(student)/student/badges/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-92**: Support existing workspace page module: (student)/student/certificate/page
  - _Discovered existing route/page file '(student)/student/certificate/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-93**: Support existing workspace page module: (student)/student/components/ActivityTimeline
  - _Discovered existing route/page file '(student)/student/components/ActivityTimeline' in workspace directory tree_
- **REQ-PAGE-EXISTING-94**: Support existing workspace page module: (student)/student/components/ConfidenceMeter
  - _Discovered existing route/page file '(student)/student/components/ConfidenceMeter' in workspace directory tree_
- **REQ-PAGE-EXISTING-95**: Support existing workspace page module: (student)/student/components/DailyChallengesList
  - _Discovered existing route/page file '(student)/student/components/DailyChallengesList' in workspace directory tree_
- **REQ-PAGE-EXISTING-96**: Support existing workspace page module: (student)/student/components/LearningHeatmap
  - _Discovered existing route/page file '(student)/student/components/LearningHeatmap' in workspace directory tree_
- **REQ-PAGE-EXISTING-97**: Support existing workspace page module: (student)/student/dashboard/DashboardClient
  - _Discovered existing route/page file '(student)/student/dashboard/DashboardClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-98**: Support existing workspace page module: (student)/student/dashboard/loading
  - _Discovered existing route/page file '(student)/student/dashboard/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-99**: Support existing workspace page module: (student)/student/dashboard/page
  - _Discovered existing route/page file '(student)/student/dashboard/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-100**: Support existing workspace page module: (student)/student/dashboard/page-AK
  - _Discovered existing route/page file '(student)/student/dashboard/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-101**: Support existing workspace page module: (student)/student/flashcards/loading
  - _Discovered existing route/page file '(student)/student/flashcards/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-102**: Support existing workspace page module: (student)/student/flashcards/page
  - _Discovered existing route/page file '(student)/student/flashcards/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-103**: Support existing workspace page module: (student)/student/leaderboard/loading
  - _Discovered existing route/page file '(student)/student/leaderboard/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-104**: Support existing workspace page module: (student)/student/leaderboard/page
  - _Discovered existing route/page file '(student)/student/leaderboard/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-105**: Support existing workspace page module: (student)/student/learn/loading
  - _Discovered existing route/page file '(student)/student/learn/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-106**: Support existing workspace page module: (student)/student/learn/page
  - _Discovered existing route/page file '(student)/student/learn/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-107**: Support existing workspace page module: (student)/student/notifications/page
  - _Discovered existing route/page file '(student)/student/notifications/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-108**: Support existing workspace page module: (student)/student/onboarding/page
  - _Discovered existing route/page file '(student)/student/onboarding/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-109**: Support existing workspace page module: (student)/student/page
  - _Discovered existing route/page file '(student)/student/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-110**: Support existing workspace page module: (student)/student/profile/ProfileClient
  - _Discovered existing route/page file '(student)/student/profile/ProfileClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-111**: Support existing workspace page module: (student)/student/profile/actions
  - _Discovered existing route/page file '(student)/student/profile/actions' in workspace directory tree_
- **REQ-PAGE-EXISTING-112**: Support existing workspace page module: (student)/student/profile/loading
  - _Discovered existing route/page file '(student)/student/profile/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-113**: Support existing workspace page module: (student)/student/profile/page
  - _Discovered existing route/page file '(student)/student/profile/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-114**: Support existing workspace page module: (student)/student/roadmap/loading
  - _Discovered existing route/page file '(student)/student/roadmap/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-115**: Support existing workspace page module: (student)/student/roadmap/page
  - _Discovered existing route/page file '(student)/student/roadmap/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-116**: Support existing workspace page module: (student)/student/roadmap/page-AK
  - _Discovered existing route/page file '(student)/student/roadmap/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-117**: Support existing workspace page module: (student)/student/rto/loading
  - _Discovered existing route/page file '(student)/student/rto/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-118**: Support existing workspace page module: (student)/student/rto/page
  - _Discovered existing route/page file '(student)/student/rto/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-119**: Support existing workspace page module: (student)/student/schedule/loading
  - _Discovered existing route/page file '(student)/student/schedule/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-120**: Support existing workspace page module: (student)/student/schedule/page
  - _Discovered existing route/page file '(student)/student/schedule/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-121**: Support existing workspace page module: (student)/student/timeline/loading
  - _Discovered existing route/page file '(student)/student/timeline/loading' in workspace directory tree_
- **REQ-PAGE-EXISTING-122**: Support existing workspace page module: (student)/student/timeline/page
  - _Discovered existing route/page file '(student)/student/timeline/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-123**: Support existing workspace page module: api/admin/bookings/approve/route
  - _Discovered existing route/page file 'api/admin/bookings/approve/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-124**: Support existing workspace page module: api/admin/branding/route
  - _Discovered existing route/page file 'api/admin/branding/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-125**: Support existing workspace page module: api/admin/courses/route
  - _Discovered existing route/page file 'api/admin/courses/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-126**: Support existing workspace page module: api/admin/enquiries/[id]/resolve/route
  - _Discovered existing route/page file 'api/admin/enquiries/[id]/resolve/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-127**: Support existing workspace page module: api/admin/gallery/[id]/route
  - _Discovered existing route/page file 'api/admin/gallery/[id]/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-128**: Support existing workspace page module: api/admin/gallery/route
  - _Discovered existing route/page file 'api/admin/gallery/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-129**: Support existing workspace page module: api/admin/gamification/route
  - _Discovered existing route/page file 'api/admin/gamification/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-130**: Support existing workspace page module: api/admin/gamification/route-AK
  - _Discovered existing route/page file 'api/admin/gamification/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-131**: Support existing workspace page module: api/admin/live-feed/route
  - _Discovered existing route/page file 'api/admin/live-feed/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-132**: Support existing workspace page module: api/admin/live-feed/route-AK
  - _Discovered existing route/page file 'api/admin/live-feed/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-133**: Support existing workspace page module: api/admin/offers/route
  - _Discovered existing route/page file 'api/admin/offers/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-134**: Support existing workspace page module: api/admin/overview/route
  - _Discovered existing route/page file 'api/admin/overview/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-135**: Support existing workspace page module: api/admin/overview/route-AK
  - _Discovered existing route/page file 'api/admin/overview/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-136**: Support existing workspace page module: api/admin/roadmap/route
  - _Discovered existing route/page file 'api/admin/roadmap/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-137**: Support existing workspace page module: api/admin/students/[id]/assign/route
  - _Discovered existing route/page file 'api/admin/students/[id]/assign/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-138**: Support existing workspace page module: api/admin/students/[id]/fee/route
  - _Discovered existing route/page file 'api/admin/students/[id]/fee/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-139**: Support existing workspace page module: api/admin/students/[id]/payments/route
  - _Discovered existing route/page file 'api/admin/students/[id]/payments/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-140**: Support existing workspace page module: api/admin/students/[id]/status/route
  - _Discovered existing route/page file 'api/admin/students/[id]/status/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-141**: Support existing workspace page module: api/admin/students/[id]/tests/route
  - _Discovered existing route/page file 'api/admin/students/[id]/tests/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-142**: Support existing workspace page module: api/admin/students/create/route
  - _Discovered existing route/page file 'api/admin/students/create/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-143**: Support existing workspace page module: api/admin/students/route
  - _Discovered existing route/page file 'api/admin/students/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-144**: Support existing workspace page module: api/admin/syllabus/route
  - _Discovered existing route/page file 'api/admin/syllabus/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-145**: Support existing workspace page module: api/admin/translate/route
  - _Discovered existing route/page file 'api/admin/translate/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-146**: Support existing workspace page module: api/auth/[
  - _Discovered existing route/page file 'api/auth/[' in workspace directory tree_
- **REQ-PAGE-EXISTING-147**: Support existing workspace page module: api/auth/forgot-password/route
  - _Discovered existing route/page file 'api/auth/forgot-password/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-148**: Support existing workspace page module: api/chat/route
  - _Discovered existing route/page file 'api/chat/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-149**: Support existing workspace page module: api/cron/daily-reminders/route
  - _Discovered existing route/page file 'api/cron/daily-reminders/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-150**: Support existing workspace page module: api/cron/prune-logs/route
  - _Discovered existing route/page file 'api/cron/prune-logs/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-151**: Support existing workspace page module: api/cron/reset-streaks/route
  - _Discovered existing route/page file 'api/cron/reset-streaks/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-152**: Support existing workspace page module: api/notifications/[id]/read/route
  - _Discovered existing route/page file 'api/notifications/[id]/read/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-153**: Support existing workspace page module: api/notifications/read-all/route
  - _Discovered existing route/page file 'api/notifications/read-all/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-154**: Support existing workspace page module: api/notifications/route
  - _Discovered existing route/page file 'api/notifications/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-155**: Support existing workspace page module: api/public/bookings/route
  - _Discovered existing route/page file 'api/public/bookings/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-156**: Support existing workspace page module: api/public/bookings/route-AK
  - _Discovered existing route/page file 'api/public/bookings/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-157**: Support existing workspace page module: api/public/courses/route
  - _Discovered existing route/page file 'api/public/courses/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-158**: Support existing workspace page module: api/public/gallery/route
  - _Discovered existing route/page file 'api/public/gallery/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-159**: Support existing workspace page module: api/public/inquiry/route
  - _Discovered existing route/page file 'api/public/inquiry/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-160**: Support existing workspace page module: api/public/offers/route
  - _Discovered existing route/page file 'api/public/offers/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-161**: Support existing workspace page module: api/public/syllabus/route
  - _Discovered existing route/page file 'api/public/syllabus/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-162**: Support existing workspace page module: api/student/attendance-otp/route
  - _Discovered existing route/page file 'api/student/attendance-otp/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-163**: Support existing workspace page module: api/student/badges/route
  - _Discovered existing route/page file 'api/student/badges/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-164**: Support existing workspace page module: api/student/badges/route-AK
  - _Discovered existing route/page file 'api/student/badges/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-165**: Support existing workspace page module: api/student/course-feedback/route
  - _Discovered existing route/page file 'api/student/course-feedback/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-166**: Support existing workspace page module: api/student/dashboard/route
  - _Discovered existing route/page file 'api/student/dashboard/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-167**: Support existing workspace page module: api/student/gamification/route
  - _Discovered existing route/page file 'api/student/gamification/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-168**: Support existing workspace page module: api/student/leaderboard/route
  - _Discovered existing route/page file 'api/student/leaderboard/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-169**: Support existing workspace page module: api/student/learning-cards/route
  - _Discovered existing route/page file 'api/student/learning-cards/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-170**: Support existing workspace page module: api/student/learning-cards/route-AK
  - _Discovered existing route/page file 'api/student/learning-cards/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-171**: Support existing workspace page module: api/student/onboard/route
  - _Discovered existing route/page file 'api/student/onboard/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-172**: Support existing workspace page module: api/student/roadmap/route
  - _Discovered existing route/page file 'api/student/roadmap/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-173**: Support existing workspace page module: api/student/roadmap/route-AK
  - _Discovered existing route/page file 'api/student/roadmap/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-174**: Support existing workspace page module: api/student/rto/weak-topics/route
  - _Discovered existing route/page file 'api/student/rto/weak-topics/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-175**: Support existing workspace page module: api/student/rto/weak-topics/route-AK
  - _Discovered existing route/page file 'api/student/rto/weak-topics/route-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-176**: Support existing workspace page module: api/student/syllabus-progress/route
  - _Discovered existing route/page file 'api/student/syllabus-progress/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-177**: Support existing workspace page module: api/student/timeline/route
  - _Discovered existing route/page file 'api/student/timeline/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-178**: Support existing workspace page module: api/student/xp/route
  - _Discovered existing route/page file 'api/student/xp/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-179**: Support existing workspace page module: api/uploadthing/core
  - _Discovered existing route/page file 'api/uploadthing/core' in workspace directory tree_
- **REQ-PAGE-EXISTING-180**: Support existing workspace page module: api/uploadthing/route
  - _Discovered existing route/page file 'api/uploadthing/route' in workspace directory tree_
- **REQ-PAGE-EXISTING-181**: Support existing workspace page module: app-home/page
  - _Discovered existing route/page file 'app-home/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-182**: Support existing workspace page module: signs/SignsClient
  - _Discovered existing route/page file 'signs/SignsClient' in workspace directory tree_
- **REQ-PAGE-EXISTING-183**: Support existing workspace page module: signs/page
  - _Discovered existing route/page file 'signs/page' in workspace directory tree_
- **REQ-PAGE-EXISTING-184**: Support existing workspace page module: signs/page-AK
  - _Discovered existing route/page file 'signs/page-AK' in workspace directory tree_
- **REQ-PAGE-EXISTING-185**: Support existing workspace page module: test_badge/page
  - _Discovered existing route/page file 'test_badge/page' in workspace directory tree_

### UNKNOWN (1)

- **REQ-INF-WEB-005**: Public self-registration requires explicit confirmation. MUST_ASK user.
  - _Admin-created accounts are standard unless self-registration is explicitly desired_

## Affected Systems

- **frontend**: 227 requirement(s)
- **backend**: 91 requirement(s)
- **database**: 44 requirement(s)
- **auth**: 3 requirement(s)
- **observability**: 1 requirement(s)
- **validation**: 1 requirement(s)
- **tests**: 1 requirement(s)
- **config**: 1 requirement(s)
- **middleware**: 2 requirement(s)
- **offline_storage**: 1 requirement(s)
