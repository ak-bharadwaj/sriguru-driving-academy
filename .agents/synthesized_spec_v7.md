# Synthesized Specification V4.1 (Production-Grade LLD & Scope-Guarded)

**Intent**: Implement features for roles: ['driving school management', 'instructor', 'student']. Archetypes: ['fullstack', 'mobile_hybrid']
**Archetypes**: fullstack, mobile_hybrid | **Scope**: MAJOR
**Gate Result**: PASS_WITH_DECISIONS (Assumption Weight: 50/150)
**Total Requirements**: 348 | **Version**: v7

## ❓ Questions for Human Review

1. Please clarify the scope and expected behavior for: Driving School Management — Student Enrollment
2. Please clarify the scope and expected behavior for: Driving School Management — Instructor Scheduling
3. Please clarify the scope and expected behavior for: Driving School Management — Exam Tracking
4. You mentioned 9 features. Should we prioritize a subset for the initial release, or implement all at once?

## 🛡️ Scope Boundaries & Anti-Bloat Guard

### Explicitly Out-of-Scope (Unrequested Subsystems Suppressed)
- 🚫 Unrequested Payment Gateway (No Stripe Payment Gateway / Razorpay Checkout)
- 🚫 Unrequested Gamification (No Gamification Rewards Engine / User Badges & XP)
- 🚫 Unrequested Ai Chatbot (No AI Assistant Chatbot / LLM Integration Widget)
- 🚫 Unrequested Crypto Web3 (No Crypto Wallet Connect / Web3 Smart Contract Interaction)
- 🚫 Unrequested Social Oauth (No Third-Party Social OAuth Integrations)

## 🗺️ Role-Based Page Spreads & Frontend Sitemap

### Role: DRIVING SCHOOL MANAGEMENT (15 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Driving School Management Dashboard** | `dashboard` | Operational metrics, tasks, and real-time updates for driving school management |
| `/profile` | **Driving School Management Self-Profile** | `profile` | Account profile, contact details, and credentials for driving school management |
| `/student-enrollment` | **Student Enrollment Workspace** | `student-enrollment` | Manage and interact with Student Enrollment |
| `/instructor-scheduling` | **Instructor Scheduling Workspace** | `instructor-scheduling` | Manage and interact with Instructor Scheduling |
| `/exam-tracking` | **Exam Tracking Workspace** | `exam-tracking` | Manage and interact with Exam Tracking |
| `/driving` | **Driving Workspace** | `driving` | Manage and interact with Driving |
| `/school` | **School Workspace** | `school` | Manage and interact with School |
| `/portal` | **Portal Workspace** | `portal` | Manage and interact with Portal |
| `/enrollment` | **Enrollment Workspace** | `enrollment` | Manage and interact with Enrollment |
| `/scheduling` | **Scheduling Workspace** | `scheduling` | Manage and interact with Scheduling |
| `/exam` | **Exam Workspace** | `exam` | Manage and interact with Exam |
| `/tracking` | **Tracking Workspace** | `tracking` | Manage and interact with Tracking |
| `/instructor` | **Instructor Workspace** | `instructor` | Manage and interact with Instructor |
| `/student` | **Student Workspace** | `student` | Manage and interact with Student |
| `/documents` | **Driving School Management Document Vault** | `documents` | File uploads, records, and digital receipts for driving school management |

### Role: INSTRUCTOR (15 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Instructor Dashboard** | `dashboard` | Operational metrics, tasks, and real-time updates for instructor |
| `/profile` | **Instructor Self-Profile** | `profile` | Account profile, contact details, and credentials for instructor |
| `/student-enrollment` | **Student Enrollment Workspace** | `student-enrollment` | Manage and interact with Student Enrollment |
| `/instructor-scheduling` | **Instructor Scheduling Workspace** | `instructor-scheduling` | Manage and interact with Instructor Scheduling |
| `/exam-tracking` | **Exam Tracking Workspace** | `exam-tracking` | Manage and interact with Exam Tracking |
| `/driving` | **Driving Workspace** | `driving` | Manage and interact with Driving |
| `/school` | **School Workspace** | `school` | Manage and interact with School |
| `/portal` | **Portal Workspace** | `portal` | Manage and interact with Portal |
| `/enrollment` | **Enrollment Workspace** | `enrollment` | Manage and interact with Enrollment |
| `/scheduling` | **Scheduling Workspace** | `scheduling` | Manage and interact with Scheduling |
| `/exam` | **Exam Workspace** | `exam` | Manage and interact with Exam |
| `/tracking` | **Tracking Workspace** | `tracking` | Manage and interact with Tracking |
| `/instructor` | **Instructor Workspace** | `instructor` | Manage and interact with Instructor |
| `/student` | **Student Workspace** | `student` | Manage and interact with Student |
| `/documents` | **Instructor Document Vault** | `documents` | File uploads, records, and digital receipts for instructor |

### Role: STUDENT (15 Pages)

| Route Path | Page Name | Module Scope | Description |
|---|---|---|---|
| `/dashboard` | **Student Dashboard** | `dashboard` | Operational metrics, tasks, and real-time updates for student |
| `/profile` | **Student Self-Profile** | `profile` | Account profile, contact details, and credentials for student |
| `/student-enrollment` | **Student Enrollment Workspace** | `student-enrollment` | Manage and interact with Student Enrollment |
| `/instructor-scheduling` | **Instructor Scheduling Workspace** | `instructor-scheduling` | Manage and interact with Instructor Scheduling |
| `/exam-tracking` | **Exam Tracking Workspace** | `exam-tracking` | Manage and interact with Exam Tracking |
| `/driving` | **Driving Workspace** | `driving` | Manage and interact with Driving |
| `/school` | **School Workspace** | `school` | Manage and interact with School |
| `/portal` | **Portal Workspace** | `portal` | Manage and interact with Portal |
| `/enrollment` | **Enrollment Workspace** | `enrollment` | Manage and interact with Enrollment |
| `/scheduling` | **Scheduling Workspace** | `scheduling` | Manage and interact with Scheduling |
| `/exam` | **Exam Workspace** | `exam` | Manage and interact with Exam |
| `/tracking` | **Tracking Workspace** | `tracking` | Manage and interact with Tracking |
| `/instructor` | **Instructor Workspace** | `instructor` | Manage and interact with Instructor |
| `/student` | **Student Workspace** | `student` | Manage and interact with Student |
| `/documents` | **Student Document Vault** | `documents` | File uploads, records, and digital receipts for student |

## 📐 Canonical Low-Level Design (LLD) Specifications

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard (`/dashboard`)

- **Layout**: `metrics_grid`
- **Composed Sub-Components**: `MetricStatCardGrid`, `UpcomingEventsTimeline`, `QuickActionShortcuts`, `RecentActivityFeed`, `NotificationDrawer`
- **Backing REST Endpoints**: `GET /api/dashboard/metrics`, `GET /api/dashboard/announcements`, `GET /api/notifications`
- **Validation Rules**: Metrics must reflect real store data with zero mock placeholders

**Tab & Form Field Breakdown**:

**Tab: Overview**
- *Fields*: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)
- *User Actions*: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile (`/profile`)

- **Layout**: `tabbed_card_layout`
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `OrganizationalCredentialsTab`, `SecurityPasswordModal`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match standard telephone format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Organizational Credentials**
- *Fields*: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)
- *User Actions*: Download Digital ID Card

**Tab: Security & Authentication**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [DRIVING SCHOOL MANAGEMENT] Student Enrollment Workspace (`/student-enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentEnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/student_enrollments`, `POST /api/student_enrollments`, `GET /api/student_enrollments/{id}`, `PUT /api/student_enrollments/{id}`, `DELETE /api/student_enrollments/{id}`
- **Validation Rules**: Student Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Enrollment Directory**
- *Fields*: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Instructor Scheduling Workspace (`/instructor-scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [DRIVING SCHOOL MANAGEMENT] Exam Tracking Workspace (`/exam-tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamTrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exam_trackings`, `POST /api/exam_trackings`, `GET /api/exam_trackings/{id}`, `PUT /api/exam_trackings/{id}`, `DELETE /api/exam_trackings/{id}`
- **Validation Rules**: Exam Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Tracking Directory**
- *Fields*: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Driving Workspace (`/driving`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `DrivingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/drivings`, `POST /api/drivings`, `GET /api/drivings/{id}`, `PUT /api/drivings/{id}`, `DELETE /api/drivings/{id}`
- **Validation Rules**: Driving title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Driving Directory**
- *Fields*: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Driving, Edit Driving, Archive Driving, Export CSV

### [DRIVING SCHOOL MANAGEMENT] School Workspace (`/school`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `SchoolDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/schools`, `POST /api/schools`, `GET /api/schools/{id}`, `PUT /api/schools/{id}`, `DELETE /api/schools/{id}`
- **Validation Rules**: School title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: School Directory**
- *Fields*: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create School, Edit School, Archive School, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Portal Workspace (`/portal`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `PortalDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/portals`, `POST /api/portals`, `GET /api/portals/{id}`, `PUT /api/portals/{id}`, `DELETE /api/portals/{id}`
- **Validation Rules**: Portal title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Portal Directory**
- *Fields*: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Portal, Edit Portal, Archive Portal, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Enrollment Workspace (`/enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `EnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/enrollments`, `POST /api/enrollments`, `GET /api/enrollments/{id}`, `PUT /api/enrollments/{id}`, `DELETE /api/enrollments/{id}`
- **Validation Rules**: Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Enrollment Directory**
- *Fields*: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Enrollment, Edit Enrollment, Archive Enrollment, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Scheduling Workspace (`/scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [DRIVING SCHOOL MANAGEMENT] Exam Workspace (`/exam`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exams`, `POST /api/exams`, `GET /api/exams/{id}`, `PUT /api/exams/{id}`, `DELETE /api/exams/{id}`
- **Validation Rules**: Exam title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Directory**
- *Fields*: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam, Edit Exam, Archive Exam, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Tracking Workspace (`/tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `TrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/trackings`, `POST /api/trackings`, `GET /api/trackings/{id}`, `PUT /api/trackings/{id}`, `DELETE /api/trackings/{id}`
- **Validation Rules**: Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Tracking Directory**
- *Fields*: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Tracking, Edit Tracking, Archive Tracking, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Instructor Workspace (`/instructor`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `InstructorDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/instructors`, `POST /api/instructors`, `GET /api/instructors/{id}`, `PUT /api/instructors/{id}`, `DELETE /api/instructors/{id}`
- **Validation Rules**: Instructor title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Instructor Directory**
- *Fields*: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Instructor, Edit Instructor, Archive Instructor, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Student Workspace (`/student`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/students`, `POST /api/students`, `GET /api/students/{id}`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`
- **Validation Rules**: Student title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Directory**
- *Fields*: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student, Edit Student, Archive Student, Export CSV

### [DRIVING SCHOOL MANAGEMENT] Driving School Management Document Vault (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: File security scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Download Document, Delete Document

### [INSTRUCTOR] Instructor Dashboard (`/dashboard`)

- **Layout**: `metrics_grid`
- **Composed Sub-Components**: `MetricStatCardGrid`, `UpcomingEventsTimeline`, `QuickActionShortcuts`, `RecentActivityFeed`, `NotificationDrawer`
- **Backing REST Endpoints**: `GET /api/dashboard/metrics`, `GET /api/dashboard/announcements`, `GET /api/notifications`
- **Validation Rules**: Metrics must reflect real store data with zero mock placeholders

**Tab & Form Field Breakdown**:

**Tab: Overview**
- *Fields*: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)
- *User Actions*: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action

### [INSTRUCTOR] Instructor Self-Profile (`/profile`)

- **Layout**: `tabbed_card_layout`
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `OrganizationalCredentialsTab`, `SecurityPasswordModal`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match standard telephone format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Organizational Credentials**
- *Fields*: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)
- *User Actions*: Download Digital ID Card

**Tab: Security & Authentication**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [INSTRUCTOR] Student Enrollment Workspace (`/student-enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentEnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/student_enrollments`, `POST /api/student_enrollments`, `GET /api/student_enrollments/{id}`, `PUT /api/student_enrollments/{id}`, `DELETE /api/student_enrollments/{id}`
- **Validation Rules**: Student Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Enrollment Directory**
- *Fields*: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment, Export CSV

### [INSTRUCTOR] Instructor Scheduling Workspace (`/instructor-scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [INSTRUCTOR] Exam Tracking Workspace (`/exam-tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamTrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exam_trackings`, `POST /api/exam_trackings`, `GET /api/exam_trackings/{id}`, `PUT /api/exam_trackings/{id}`, `DELETE /api/exam_trackings/{id}`
- **Validation Rules**: Exam Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Tracking Directory**
- *Fields*: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking, Export CSV

### [INSTRUCTOR] Driving Workspace (`/driving`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `DrivingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/drivings`, `POST /api/drivings`, `GET /api/drivings/{id}`, `PUT /api/drivings/{id}`, `DELETE /api/drivings/{id}`
- **Validation Rules**: Driving title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Driving Directory**
- *Fields*: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Driving, Edit Driving, Archive Driving, Export CSV

### [INSTRUCTOR] School Workspace (`/school`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `SchoolDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/schools`, `POST /api/schools`, `GET /api/schools/{id}`, `PUT /api/schools/{id}`, `DELETE /api/schools/{id}`
- **Validation Rules**: School title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: School Directory**
- *Fields*: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create School, Edit School, Archive School, Export CSV

### [INSTRUCTOR] Portal Workspace (`/portal`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `PortalDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/portals`, `POST /api/portals`, `GET /api/portals/{id}`, `PUT /api/portals/{id}`, `DELETE /api/portals/{id}`
- **Validation Rules**: Portal title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Portal Directory**
- *Fields*: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Portal, Edit Portal, Archive Portal, Export CSV

### [INSTRUCTOR] Enrollment Workspace (`/enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `EnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/enrollments`, `POST /api/enrollments`, `GET /api/enrollments/{id}`, `PUT /api/enrollments/{id}`, `DELETE /api/enrollments/{id}`
- **Validation Rules**: Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Enrollment Directory**
- *Fields*: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Enrollment, Edit Enrollment, Archive Enrollment, Export CSV

### [INSTRUCTOR] Scheduling Workspace (`/scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [INSTRUCTOR] Exam Workspace (`/exam`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exams`, `POST /api/exams`, `GET /api/exams/{id}`, `PUT /api/exams/{id}`, `DELETE /api/exams/{id}`
- **Validation Rules**: Exam title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Directory**
- *Fields*: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam, Edit Exam, Archive Exam, Export CSV

### [INSTRUCTOR] Tracking Workspace (`/tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `TrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/trackings`, `POST /api/trackings`, `GET /api/trackings/{id}`, `PUT /api/trackings/{id}`, `DELETE /api/trackings/{id}`
- **Validation Rules**: Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Tracking Directory**
- *Fields*: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Tracking, Edit Tracking, Archive Tracking, Export CSV

### [INSTRUCTOR] Instructor Workspace (`/instructor`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `InstructorDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/instructors`, `POST /api/instructors`, `GET /api/instructors/{id}`, `PUT /api/instructors/{id}`, `DELETE /api/instructors/{id}`
- **Validation Rules**: Instructor title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Instructor Directory**
- *Fields*: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Instructor, Edit Instructor, Archive Instructor, Export CSV

### [INSTRUCTOR] Student Workspace (`/student`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/students`, `POST /api/students`, `GET /api/students/{id}`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`
- **Validation Rules**: Student title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Directory**
- *Fields*: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student, Edit Student, Archive Student, Export CSV

### [INSTRUCTOR] Instructor Document Vault (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: File security scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Download Document, Delete Document

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
- **Composed Sub-Components**: `AvatarUploader`, `BioHeaderCard`, `PersonalDetailsTab`, `OrganizationalCredentialsTab`, `SecurityPasswordModal`
- **Backing REST Endpoints**: `GET /api/profile`, `PUT /api/profile`, `POST /api/profile/avatar`, `PUT /api/auth/password`
- **Validation Rules**: Avatar file must be image/jpeg or image/png under 2MB; Mobile number must match standard telephone format; New password must contain at least 8 characters with number and symbol

**Tab & Form Field Breakdown**:

**Tab: Personal Details**
- *Fields*: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select), permanentAddress (text), emergencyContact (tel)
- *User Actions*: Update Personal Info, Upload Avatar Image

**Tab: Organizational Credentials**
- *Fields*: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)
- *User Actions*: Download Digital ID Card

**Tab: Security & Authentication**
- *Fields*: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)
- *User Actions*: Change Password, Revoke Active Sessions

### [STUDENT] Student Enrollment Workspace (`/student-enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentEnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/student_enrollments`, `POST /api/student_enrollments`, `GET /api/student_enrollments/{id}`, `PUT /api/student_enrollments/{id}`, `DELETE /api/student_enrollments/{id}`
- **Validation Rules**: Student Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Enrollment Directory**
- *Fields*: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment, Export CSV

### [STUDENT] Instructor Scheduling Workspace (`/instructor-scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [STUDENT] Exam Tracking Workspace (`/exam-tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamTrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exam_trackings`, `POST /api/exam_trackings`, `GET /api/exam_trackings/{id}`, `PUT /api/exam_trackings/{id}`, `DELETE /api/exam_trackings/{id}`
- **Validation Rules**: Exam Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Tracking Directory**
- *Fields*: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking, Export CSV

### [STUDENT] Driving Workspace (`/driving`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `DrivingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/drivings`, `POST /api/drivings`, `GET /api/drivings/{id}`, `PUT /api/drivings/{id}`, `DELETE /api/drivings/{id}`
- **Validation Rules**: Driving title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Driving Directory**
- *Fields*: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Driving, Edit Driving, Archive Driving, Export CSV

### [STUDENT] School Workspace (`/school`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `SchoolDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/schools`, `POST /api/schools`, `GET /api/schools/{id}`, `PUT /api/schools/{id}`, `DELETE /api/schools/{id}`
- **Validation Rules**: School title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: School Directory**
- *Fields*: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create School, Edit School, Archive School, Export CSV

### [STUDENT] Portal Workspace (`/portal`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `PortalDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/portals`, `POST /api/portals`, `GET /api/portals/{id}`, `PUT /api/portals/{id}`, `DELETE /api/portals/{id}`
- **Validation Rules**: Portal title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Portal Directory**
- *Fields*: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Portal, Edit Portal, Archive Portal, Export CSV

### [STUDENT] Enrollment Workspace (`/enrollment`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `EnrollmentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/enrollments`, `POST /api/enrollments`, `GET /api/enrollments/{id}`, `PUT /api/enrollments/{id}`, `DELETE /api/enrollments/{id}`
- **Validation Rules**: Enrollment title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Enrollment Directory**
- *Fields*: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Enrollment, Edit Enrollment, Archive Enrollment, Export CSV

### [STUDENT] Scheduling Workspace (`/scheduling`)

- **Layout**: `calendar_dispatch_grid`
- **Composed Sub-Components**: `CalendarScheduleGrid`, `TimeSlotPickerMatrix`, `ResourceStaffSelector`, `BookingSummaryModal`, `RescheduleDrawer`, `ConflictWarningBadge`
- **Backing REST Endpoints**: `GET /api/bookings/available-slots`, `POST /api/bookings`, `PATCH /api/bookings/{id}/reschedule`, `DELETE /api/bookings/{id}`
- **Validation Rules**: Slot must not have overlapping confirmed bookings; Client phone number must be valid 10-digit format; Cancellation must occur at least 2 hours prior to scheduled time

**Tab & Form Field Breakdown**:

**Tab: Appointment Booking**
- *Fields*: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string), clientPhone (tel), clientEmail (email), specialNotes (text)
- *User Actions*: Confirm Booking, Check Availability, Cancel Reservation

**Tab: Reschedule & History**
- *Fields*: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)
- *User Actions*: Submit Reschedule Request, Download Receipt PDF

### [STUDENT] Exam Workspace (`/exam`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `ExamDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/exams`, `POST /api/exams`, `GET /api/exams/{id}`, `PUT /api/exams/{id}`, `DELETE /api/exams/{id}`
- **Validation Rules**: Exam title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Exam Directory**
- *Fields*: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Exam, Edit Exam, Archive Exam, Export CSV

### [STUDENT] Tracking Workspace (`/tracking`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `TrackingDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/trackings`, `POST /api/trackings`, `GET /api/trackings/{id}`, `PUT /api/trackings/{id}`, `DELETE /api/trackings/{id}`
- **Validation Rules**: Tracking title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Tracking Directory**
- *Fields*: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Tracking, Edit Tracking, Archive Tracking, Export CSV

### [STUDENT] Instructor Workspace (`/instructor`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `InstructorDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/instructors`, `POST /api/instructors`, `GET /api/instructors/{id}`, `PUT /api/instructors/{id}`, `DELETE /api/instructors/{id}`
- **Validation Rules**: Instructor title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Instructor Directory**
- *Fields*: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Instructor, Edit Instructor, Archive Instructor, Export CSV

### [STUDENT] Student Workspace (`/student`)

- **Layout**: `master_detail_grid`
- **Composed Sub-Components**: `StudentDataGrid`, `SearchFilterBar`, `DetailInspectorDrawer`, `CreateEntityModal`, `ExportCsvButton`
- **Backing REST Endpoints**: `GET /api/students`, `POST /api/students`, `GET /api/students/{id}`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`
- **Validation Rules**: Student title/name must be non-empty; Status changes must follow standard operational workflow

**Tab & Form Field Breakdown**:

**Tab: Student Directory**
- *Fields*: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string), createdDate (date), notes (text)
- *User Actions*: Create Student, Edit Student, Archive Student, Export CSV

### [STUDENT] Student Document Vault (`/documents`)

- **Layout**: `document_vault`
- **Composed Sub-Components**: `FileUploadZone`, `VirusScanStatusPill`, `CategoryFolderTabs`, `DocumentPreviewModal`, `AccessControlPicker`
- **Backing REST Endpoints**: `GET /api/documents`, `POST /api/documents/upload`, `DELETE /api/documents/{id}`
- **Validation Rules**: File security scan must verify file is clean before storage

**Tab & Form Field Breakdown**:

**Tab: Document Vault**
- *Fields*: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge), isPublic (boolean)
- *User Actions*: Upload Document, Download Document, Delete Document

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
- Verify that role 'driving school management' can access all assigned capabilities without permission errors.
- Verify that role 'instructor' can access all assigned capabilities without permission errors.
- Verify that role 'student' can access all assigned capabilities without permission errors.

## Requirements by Type

### EXPLICIT (3)

- **REQ-BASE-0**: Driving School Management — Student Enrollment
- **REQ-BASE-1**: Driving School Management — Instructor Scheduling
- **REQ-BASE-2**: Driving School Management — Exam Tracking

### DERIVED (163)

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
- **REQ-LLD-COMP-1**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Driving School Management Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-2**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Driving School Management Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-3**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Driving School Management Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-4**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab
  - _Canonical Low-Level Design expansion for Driving School Management Self-Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab_
- **REQ-LLD-FIELDS-5**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Driving School Management Self-Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-6**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile (Organizational Credentials) — Form Fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date) | Actions: Download Digital ID Card
  - _Mandatory field definitions for Driving School Management Self-Profile -> Organizational Credentials_
  - _Input fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)_
  - _Actions: Download Digital ID Card_
- **REQ-LLD-FIELDS-7**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile (Security & Authentication) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Driving School Management Self-Profile -> Security & Authentication_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-8**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Self-Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Driving School Management Self-Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-9**: [DRIVING SCHOOL MANAGEMENT] Student Enrollment Workspace — UI Component Hierarchy: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Enrollment Workspace (/student-enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-10**: [DRIVING SCHOOL MANAGEMENT] Student Enrollment Workspace (Student Enrollment Directory) — Form Fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment
  - _Mandatory field definitions for Student Enrollment Workspace -> Student Enrollment Directory_
  - _Input fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment_
- **REQ-LLD-API-11**: [DRIVING SCHOOL MANAGEMENT] Student Enrollment Workspace — Backing REST APIs: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}
  - _REST API contract for Student Enrollment Workspace_
  - _Endpoints: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}_
- **REQ-LLD-COMP-12**: [DRIVING SCHOOL MANAGEMENT] Instructor Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Instructor Scheduling Workspace (/instructor-scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-13**: [DRIVING SCHOOL MANAGEMENT] Instructor Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-14**: [DRIVING SCHOOL MANAGEMENT] Instructor Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-15**: [DRIVING SCHOOL MANAGEMENT] Instructor Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Instructor Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-16**: [DRIVING SCHOOL MANAGEMENT] Exam Tracking Workspace — UI Component Hierarchy: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Tracking Workspace (/exam-tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-17**: [DRIVING SCHOOL MANAGEMENT] Exam Tracking Workspace (Exam Tracking Directory) — Form Fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking
  - _Mandatory field definitions for Exam Tracking Workspace -> Exam Tracking Directory_
  - _Input fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking_
- **REQ-LLD-API-18**: [DRIVING SCHOOL MANAGEMENT] Exam Tracking Workspace — Backing REST APIs: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}
  - _REST API contract for Exam Tracking Workspace_
  - _Endpoints: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}_
- **REQ-LLD-COMP-19**: [DRIVING SCHOOL MANAGEMENT] Driving Workspace — UI Component Hierarchy: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Driving Workspace (/driving)_
  - _Layout type: master_detail_grid_
  - _Composed components: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-20**: [DRIVING SCHOOL MANAGEMENT] Driving Workspace (Driving Directory) — Form Fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Driving, Edit Driving, Archive Driving
  - _Mandatory field definitions for Driving Workspace -> Driving Directory_
  - _Input fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Driving, Edit Driving, Archive Driving_
- **REQ-LLD-API-21**: [DRIVING SCHOOL MANAGEMENT] Driving Workspace — Backing REST APIs: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}
  - _REST API contract for Driving Workspace_
  - _Endpoints: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}_
- **REQ-LLD-COMP-22**: [DRIVING SCHOOL MANAGEMENT] School Workspace — UI Component Hierarchy: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for School Workspace (/school)_
  - _Layout type: master_detail_grid_
  - _Composed components: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-23**: [DRIVING SCHOOL MANAGEMENT] School Workspace (School Directory) — Form Fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create School, Edit School, Archive School
  - _Mandatory field definitions for School Workspace -> School Directory_
  - _Input fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create School, Edit School, Archive School_
- **REQ-LLD-API-24**: [DRIVING SCHOOL MANAGEMENT] School Workspace — Backing REST APIs: GET /api/schools, POST /api/schools, GET /api/schools/{id}
  - _REST API contract for School Workspace_
  - _Endpoints: GET /api/schools, POST /api/schools, GET /api/schools/{id}_
- **REQ-LLD-COMP-25**: [DRIVING SCHOOL MANAGEMENT] Portal Workspace — UI Component Hierarchy: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Portal Workspace (/portal)_
  - _Layout type: master_detail_grid_
  - _Composed components: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-26**: [DRIVING SCHOOL MANAGEMENT] Portal Workspace (Portal Directory) — Form Fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Portal, Edit Portal, Archive Portal
  - _Mandatory field definitions for Portal Workspace -> Portal Directory_
  - _Input fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Portal, Edit Portal, Archive Portal_
- **REQ-LLD-API-27**: [DRIVING SCHOOL MANAGEMENT] Portal Workspace — Backing REST APIs: GET /api/portals, POST /api/portals, GET /api/portals/{id}
  - _REST API contract for Portal Workspace_
  - _Endpoints: GET /api/portals, POST /api/portals, GET /api/portals/{id}_
- **REQ-LLD-COMP-28**: [DRIVING SCHOOL MANAGEMENT] Enrollment Workspace — UI Component Hierarchy: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Enrollment Workspace (/enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-29**: [DRIVING SCHOOL MANAGEMENT] Enrollment Workspace (Enrollment Directory) — Form Fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Enrollment, Edit Enrollment, Archive Enrollment
  - _Mandatory field definitions for Enrollment Workspace -> Enrollment Directory_
  - _Input fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Enrollment, Edit Enrollment, Archive Enrollment_
- **REQ-LLD-API-30**: [DRIVING SCHOOL MANAGEMENT] Enrollment Workspace — Backing REST APIs: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}
  - _REST API contract for Enrollment Workspace_
  - _Endpoints: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}_
- **REQ-LLD-COMP-31**: [DRIVING SCHOOL MANAGEMENT] Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Scheduling Workspace (/scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-32**: [DRIVING SCHOOL MANAGEMENT] Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-33**: [DRIVING SCHOOL MANAGEMENT] Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-34**: [DRIVING SCHOOL MANAGEMENT] Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-35**: [DRIVING SCHOOL MANAGEMENT] Exam Workspace — UI Component Hierarchy: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Workspace (/exam)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-36**: [DRIVING SCHOOL MANAGEMENT] Exam Workspace (Exam Directory) — Form Fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam, Edit Exam, Archive Exam
  - _Mandatory field definitions for Exam Workspace -> Exam Directory_
  - _Input fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam, Edit Exam, Archive Exam_
- **REQ-LLD-API-37**: [DRIVING SCHOOL MANAGEMENT] Exam Workspace — Backing REST APIs: GET /api/exams, POST /api/exams, GET /api/exams/{id}
  - _REST API contract for Exam Workspace_
  - _Endpoints: GET /api/exams, POST /api/exams, GET /api/exams/{id}_
- **REQ-LLD-COMP-38**: [DRIVING SCHOOL MANAGEMENT] Tracking Workspace — UI Component Hierarchy: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Tracking Workspace (/tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-39**: [DRIVING SCHOOL MANAGEMENT] Tracking Workspace (Tracking Directory) — Form Fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Tracking, Edit Tracking, Archive Tracking
  - _Mandatory field definitions for Tracking Workspace -> Tracking Directory_
  - _Input fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Tracking, Edit Tracking, Archive Tracking_
- **REQ-LLD-API-40**: [DRIVING SCHOOL MANAGEMENT] Tracking Workspace — Backing REST APIs: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}
  - _REST API contract for Tracking Workspace_
  - _Endpoints: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}_
- **REQ-LLD-COMP-41**: [DRIVING SCHOOL MANAGEMENT] Instructor Workspace — UI Component Hierarchy: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Instructor Workspace (/instructor)_
  - _Layout type: master_detail_grid_
  - _Composed components: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-42**: [DRIVING SCHOOL MANAGEMENT] Instructor Workspace (Instructor Directory) — Form Fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Instructor, Edit Instructor, Archive Instructor
  - _Mandatory field definitions for Instructor Workspace -> Instructor Directory_
  - _Input fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Instructor, Edit Instructor, Archive Instructor_
- **REQ-LLD-API-43**: [DRIVING SCHOOL MANAGEMENT] Instructor Workspace — Backing REST APIs: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}
  - _REST API contract for Instructor Workspace_
  - _Endpoints: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}_
- **REQ-LLD-COMP-44**: [DRIVING SCHOOL MANAGEMENT] Student Workspace — UI Component Hierarchy: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Workspace (/student)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-45**: [DRIVING SCHOOL MANAGEMENT] Student Workspace (Student Directory) — Form Fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student, Edit Student, Archive Student
  - _Mandatory field definitions for Student Workspace -> Student Directory_
  - _Input fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student, Edit Student, Archive Student_
- **REQ-LLD-API-46**: [DRIVING SCHOOL MANAGEMENT] Student Workspace — Backing REST APIs: GET /api/students, POST /api/students, GET /api/students/{id}
  - _REST API contract for Student Workspace_
  - _Endpoints: GET /api/students, POST /api/students, GET /api/students/{id}_
- **REQ-LLD-COMP-47**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Document Vault — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Driving School Management Document Vault (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-48**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Document Vault (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge) | Actions: Upload Document, Download Document, Delete Document
  - _Mandatory field definitions for Driving School Management Document Vault -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge)_
  - _Actions: Upload Document, Download Document, Delete Document_
- **REQ-LLD-API-49**: [DRIVING SCHOOL MANAGEMENT] Driving School Management Document Vault — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Driving School Management Document Vault_
  - _Endpoints: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}_
- **REQ-LLD-COMP-50**: [INSTRUCTOR] Instructor Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Instructor Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-51**: [INSTRUCTOR] Instructor Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Instructor Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-52**: [INSTRUCTOR] Instructor Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Instructor Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-53**: [INSTRUCTOR] Instructor Self-Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab
  - _Canonical Low-Level Design expansion for Instructor Self-Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab_
- **REQ-LLD-FIELDS-54**: [INSTRUCTOR] Instructor Self-Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Instructor Self-Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-55**: [INSTRUCTOR] Instructor Self-Profile (Organizational Credentials) — Form Fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date) | Actions: Download Digital ID Card
  - _Mandatory field definitions for Instructor Self-Profile -> Organizational Credentials_
  - _Input fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)_
  - _Actions: Download Digital ID Card_
- **REQ-LLD-FIELDS-56**: [INSTRUCTOR] Instructor Self-Profile (Security & Authentication) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Instructor Self-Profile -> Security & Authentication_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-57**: [INSTRUCTOR] Instructor Self-Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Instructor Self-Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-58**: [INSTRUCTOR] Student Enrollment Workspace — UI Component Hierarchy: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Enrollment Workspace (/student-enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-59**: [INSTRUCTOR] Student Enrollment Workspace (Student Enrollment Directory) — Form Fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment
  - _Mandatory field definitions for Student Enrollment Workspace -> Student Enrollment Directory_
  - _Input fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment_
- **REQ-LLD-API-60**: [INSTRUCTOR] Student Enrollment Workspace — Backing REST APIs: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}
  - _REST API contract for Student Enrollment Workspace_
  - _Endpoints: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}_
- **REQ-LLD-COMP-61**: [INSTRUCTOR] Instructor Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Instructor Scheduling Workspace (/instructor-scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-62**: [INSTRUCTOR] Instructor Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-63**: [INSTRUCTOR] Instructor Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-64**: [INSTRUCTOR] Instructor Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Instructor Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-65**: [INSTRUCTOR] Exam Tracking Workspace — UI Component Hierarchy: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Tracking Workspace (/exam-tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-66**: [INSTRUCTOR] Exam Tracking Workspace (Exam Tracking Directory) — Form Fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking
  - _Mandatory field definitions for Exam Tracking Workspace -> Exam Tracking Directory_
  - _Input fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking_
- **REQ-LLD-API-67**: [INSTRUCTOR] Exam Tracking Workspace — Backing REST APIs: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}
  - _REST API contract for Exam Tracking Workspace_
  - _Endpoints: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}_
- **REQ-LLD-COMP-68**: [INSTRUCTOR] Driving Workspace — UI Component Hierarchy: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Driving Workspace (/driving)_
  - _Layout type: master_detail_grid_
  - _Composed components: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-69**: [INSTRUCTOR] Driving Workspace (Driving Directory) — Form Fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Driving, Edit Driving, Archive Driving
  - _Mandatory field definitions for Driving Workspace -> Driving Directory_
  - _Input fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Driving, Edit Driving, Archive Driving_
- **REQ-LLD-API-70**: [INSTRUCTOR] Driving Workspace — Backing REST APIs: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}
  - _REST API contract for Driving Workspace_
  - _Endpoints: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}_
- **REQ-LLD-COMP-71**: [INSTRUCTOR] School Workspace — UI Component Hierarchy: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for School Workspace (/school)_
  - _Layout type: master_detail_grid_
  - _Composed components: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-72**: [INSTRUCTOR] School Workspace (School Directory) — Form Fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create School, Edit School, Archive School
  - _Mandatory field definitions for School Workspace -> School Directory_
  - _Input fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create School, Edit School, Archive School_
- **REQ-LLD-API-73**: [INSTRUCTOR] School Workspace — Backing REST APIs: GET /api/schools, POST /api/schools, GET /api/schools/{id}
  - _REST API contract for School Workspace_
  - _Endpoints: GET /api/schools, POST /api/schools, GET /api/schools/{id}_
- **REQ-LLD-COMP-74**: [INSTRUCTOR] Portal Workspace — UI Component Hierarchy: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Portal Workspace (/portal)_
  - _Layout type: master_detail_grid_
  - _Composed components: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-75**: [INSTRUCTOR] Portal Workspace (Portal Directory) — Form Fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Portal, Edit Portal, Archive Portal
  - _Mandatory field definitions for Portal Workspace -> Portal Directory_
  - _Input fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Portal, Edit Portal, Archive Portal_
- **REQ-LLD-API-76**: [INSTRUCTOR] Portal Workspace — Backing REST APIs: GET /api/portals, POST /api/portals, GET /api/portals/{id}
  - _REST API contract for Portal Workspace_
  - _Endpoints: GET /api/portals, POST /api/portals, GET /api/portals/{id}_
- **REQ-LLD-COMP-77**: [INSTRUCTOR] Enrollment Workspace — UI Component Hierarchy: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Enrollment Workspace (/enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-78**: [INSTRUCTOR] Enrollment Workspace (Enrollment Directory) — Form Fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Enrollment, Edit Enrollment, Archive Enrollment
  - _Mandatory field definitions for Enrollment Workspace -> Enrollment Directory_
  - _Input fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Enrollment, Edit Enrollment, Archive Enrollment_
- **REQ-LLD-API-79**: [INSTRUCTOR] Enrollment Workspace — Backing REST APIs: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}
  - _REST API contract for Enrollment Workspace_
  - _Endpoints: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}_
- **REQ-LLD-COMP-80**: [INSTRUCTOR] Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Scheduling Workspace (/scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-81**: [INSTRUCTOR] Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-82**: [INSTRUCTOR] Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-83**: [INSTRUCTOR] Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-84**: [INSTRUCTOR] Exam Workspace — UI Component Hierarchy: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Workspace (/exam)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-85**: [INSTRUCTOR] Exam Workspace (Exam Directory) — Form Fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam, Edit Exam, Archive Exam
  - _Mandatory field definitions for Exam Workspace -> Exam Directory_
  - _Input fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam, Edit Exam, Archive Exam_
- **REQ-LLD-API-86**: [INSTRUCTOR] Exam Workspace — Backing REST APIs: GET /api/exams, POST /api/exams, GET /api/exams/{id}
  - _REST API contract for Exam Workspace_
  - _Endpoints: GET /api/exams, POST /api/exams, GET /api/exams/{id}_
- **REQ-LLD-COMP-87**: [INSTRUCTOR] Tracking Workspace — UI Component Hierarchy: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Tracking Workspace (/tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-88**: [INSTRUCTOR] Tracking Workspace (Tracking Directory) — Form Fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Tracking, Edit Tracking, Archive Tracking
  - _Mandatory field definitions for Tracking Workspace -> Tracking Directory_
  - _Input fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Tracking, Edit Tracking, Archive Tracking_
- **REQ-LLD-API-89**: [INSTRUCTOR] Tracking Workspace — Backing REST APIs: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}
  - _REST API contract for Tracking Workspace_
  - _Endpoints: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}_
- **REQ-LLD-COMP-90**: [INSTRUCTOR] Instructor Workspace — UI Component Hierarchy: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Instructor Workspace (/instructor)_
  - _Layout type: master_detail_grid_
  - _Composed components: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-91**: [INSTRUCTOR] Instructor Workspace (Instructor Directory) — Form Fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Instructor, Edit Instructor, Archive Instructor
  - _Mandatory field definitions for Instructor Workspace -> Instructor Directory_
  - _Input fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Instructor, Edit Instructor, Archive Instructor_
- **REQ-LLD-API-92**: [INSTRUCTOR] Instructor Workspace — Backing REST APIs: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}
  - _REST API contract for Instructor Workspace_
  - _Endpoints: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}_
- **REQ-LLD-COMP-93**: [INSTRUCTOR] Student Workspace — UI Component Hierarchy: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Workspace (/student)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-94**: [INSTRUCTOR] Student Workspace (Student Directory) — Form Fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student, Edit Student, Archive Student
  - _Mandatory field definitions for Student Workspace -> Student Directory_
  - _Input fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student, Edit Student, Archive Student_
- **REQ-LLD-API-95**: [INSTRUCTOR] Student Workspace — Backing REST APIs: GET /api/students, POST /api/students, GET /api/students/{id}
  - _REST API contract for Student Workspace_
  - _Endpoints: GET /api/students, POST /api/students, GET /api/students/{id}_
- **REQ-LLD-COMP-96**: [INSTRUCTOR] Instructor Document Vault — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Instructor Document Vault (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-97**: [INSTRUCTOR] Instructor Document Vault (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge) | Actions: Upload Document, Download Document, Delete Document
  - _Mandatory field definitions for Instructor Document Vault -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge)_
  - _Actions: Upload Document, Download Document, Delete Document_
- **REQ-LLD-API-98**: [INSTRUCTOR] Instructor Document Vault — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Instructor Document Vault_
  - _Endpoints: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}_
- **REQ-LLD-COMP-99**: [STUDENT] Student Dashboard — UI Component Hierarchy: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed
  - _Canonical Low-Level Design expansion for Student Dashboard (/dashboard)_
  - _Layout type: metrics_grid_
  - _Composed components: MetricStatCardGrid, UpcomingEventsTimeline, QuickActionShortcuts, RecentActivityFeed_
- **REQ-LLD-FIELDS-100**: [STUDENT] Student Dashboard (Overview) — Form Fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array) | Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action
  - _Mandatory field definitions for Student Dashboard -> Overview_
  - _Input fields: kpiMetrics (object), announcements (array), pendingTasksCount (number), recentEvents (array)_
  - _Actions: Refresh Real-Time Metrics, Acknowledge Notification, Trigger Quick Action_
- **REQ-LLD-API-101**: [STUDENT] Student Dashboard — Backing REST APIs: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications
  - _REST API contract for Student Dashboard_
  - _Endpoints: GET /api/dashboard/metrics, GET /api/dashboard/announcements, GET /api/notifications_
- **REQ-LLD-COMP-102**: [STUDENT] Student Self-Profile — UI Component Hierarchy: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab
  - _Canonical Low-Level Design expansion for Student Self-Profile (/profile)_
  - _Layout type: tabbed_card_layout_
  - _Composed components: AvatarUploader, BioHeaderCard, PersonalDetailsTab, OrganizationalCredentialsTab_
- **REQ-LLD-FIELDS-103**: [STUDENT] Student Self-Profile (Personal Details) — Form Fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select) | Actions: Update Personal Info, Upload Avatar Image
  - _Mandatory field definitions for Student Self-Profile -> Personal Details_
  - _Input fields: fullName (string), personalEmail (email), mobileNumber (tel), dob (date), gender (select)_
  - _Actions: Update Personal Info, Upload Avatar Image_
- **REQ-LLD-FIELDS-104**: [STUDENT] Student Self-Profile (Organizational Credentials) — Form Fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date) | Actions: Download Digital ID Card
  - _Mandatory field definitions for Student Self-Profile -> Organizational Credentials_
  - _Input fields: identifierCode (string, read-only), departmentUnit (string, read-only), roleTitle (string, read-only), onboardingDate (date)_
  - _Actions: Download Digital ID Card_
- **REQ-LLD-FIELDS-105**: [STUDENT] Student Self-Profile (Security & Authentication) — Form Fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean) | Actions: Change Password, Revoke Active Sessions
  - _Mandatory field definitions for Student Self-Profile -> Security & Authentication_
  - _Input fields: currentPassword (password), newPassword (password), confirmPassword (password), twoFactorToggle (boolean)_
  - _Actions: Change Password, Revoke Active Sessions_
- **REQ-LLD-API-106**: [STUDENT] Student Self-Profile — Backing REST APIs: GET /api/profile, PUT /api/profile, POST /api/profile/avatar
  - _REST API contract for Student Self-Profile_
  - _Endpoints: GET /api/profile, PUT /api/profile, POST /api/profile/avatar_
- **REQ-LLD-COMP-107**: [STUDENT] Student Enrollment Workspace — UI Component Hierarchy: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Enrollment Workspace (/student-enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentEnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-108**: [STUDENT] Student Enrollment Workspace (Student Enrollment Directory) — Form Fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment
  - _Mandatory field definitions for Student Enrollment Workspace -> Student Enrollment Directory_
  - _Input fields: student_enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student Enrollment, Edit Student Enrollment, Archive Student Enrollment_
- **REQ-LLD-API-109**: [STUDENT] Student Enrollment Workspace — Backing REST APIs: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}
  - _REST API contract for Student Enrollment Workspace_
  - _Endpoints: GET /api/student_enrollments, POST /api/student_enrollments, GET /api/student_enrollments/{id}_
- **REQ-LLD-COMP-110**: [STUDENT] Instructor Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Instructor Scheduling Workspace (/instructor-scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-111**: [STUDENT] Instructor Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-112**: [STUDENT] Instructor Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Instructor Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-113**: [STUDENT] Instructor Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Instructor Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-114**: [STUDENT] Exam Tracking Workspace — UI Component Hierarchy: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Tracking Workspace (/exam-tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamTrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-115**: [STUDENT] Exam Tracking Workspace (Exam Tracking Directory) — Form Fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking
  - _Mandatory field definitions for Exam Tracking Workspace -> Exam Tracking Directory_
  - _Input fields: exam_trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam Tracking, Edit Exam Tracking, Archive Exam Tracking_
- **REQ-LLD-API-116**: [STUDENT] Exam Tracking Workspace — Backing REST APIs: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}
  - _REST API contract for Exam Tracking Workspace_
  - _Endpoints: GET /api/exam_trackings, POST /api/exam_trackings, GET /api/exam_trackings/{id}_
- **REQ-LLD-COMP-117**: [STUDENT] Driving Workspace — UI Component Hierarchy: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Driving Workspace (/driving)_
  - _Layout type: master_detail_grid_
  - _Composed components: DrivingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-118**: [STUDENT] Driving Workspace (Driving Directory) — Form Fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Driving, Edit Driving, Archive Driving
  - _Mandatory field definitions for Driving Workspace -> Driving Directory_
  - _Input fields: drivingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Driving, Edit Driving, Archive Driving_
- **REQ-LLD-API-119**: [STUDENT] Driving Workspace — Backing REST APIs: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}
  - _REST API contract for Driving Workspace_
  - _Endpoints: GET /api/drivings, POST /api/drivings, GET /api/drivings/{id}_
- **REQ-LLD-COMP-120**: [STUDENT] School Workspace — UI Component Hierarchy: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for School Workspace (/school)_
  - _Layout type: master_detail_grid_
  - _Composed components: SchoolDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-121**: [STUDENT] School Workspace (School Directory) — Form Fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create School, Edit School, Archive School
  - _Mandatory field definitions for School Workspace -> School Directory_
  - _Input fields: schoolId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create School, Edit School, Archive School_
- **REQ-LLD-API-122**: [STUDENT] School Workspace — Backing REST APIs: GET /api/schools, POST /api/schools, GET /api/schools/{id}
  - _REST API contract for School Workspace_
  - _Endpoints: GET /api/schools, POST /api/schools, GET /api/schools/{id}_
- **REQ-LLD-COMP-123**: [STUDENT] Portal Workspace — UI Component Hierarchy: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Portal Workspace (/portal)_
  - _Layout type: master_detail_grid_
  - _Composed components: PortalDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-124**: [STUDENT] Portal Workspace (Portal Directory) — Form Fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Portal, Edit Portal, Archive Portal
  - _Mandatory field definitions for Portal Workspace -> Portal Directory_
  - _Input fields: portalId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Portal, Edit Portal, Archive Portal_
- **REQ-LLD-API-125**: [STUDENT] Portal Workspace — Backing REST APIs: GET /api/portals, POST /api/portals, GET /api/portals/{id}
  - _REST API contract for Portal Workspace_
  - _Endpoints: GET /api/portals, POST /api/portals, GET /api/portals/{id}_
- **REQ-LLD-COMP-126**: [STUDENT] Enrollment Workspace — UI Component Hierarchy: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Enrollment Workspace (/enrollment)_
  - _Layout type: master_detail_grid_
  - _Composed components: EnrollmentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-127**: [STUDENT] Enrollment Workspace (Enrollment Directory) — Form Fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Enrollment, Edit Enrollment, Archive Enrollment
  - _Mandatory field definitions for Enrollment Workspace -> Enrollment Directory_
  - _Input fields: enrollmentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Enrollment, Edit Enrollment, Archive Enrollment_
- **REQ-LLD-API-128**: [STUDENT] Enrollment Workspace — Backing REST APIs: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}
  - _REST API contract for Enrollment Workspace_
  - _Endpoints: GET /api/enrollments, POST /api/enrollments, GET /api/enrollments/{id}_
- **REQ-LLD-COMP-129**: [STUDENT] Scheduling Workspace — UI Component Hierarchy: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal
  - _Canonical Low-Level Design expansion for Scheduling Workspace (/scheduling)_
  - _Layout type: calendar_dispatch_grid_
  - _Composed components: CalendarScheduleGrid, TimeSlotPickerMatrix, ResourceStaffSelector, BookingSummaryModal_
- **REQ-LLD-FIELDS-130**: [STUDENT] Scheduling Workspace (Appointment Booking) — Form Fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string) | Actions: Confirm Booking, Check Availability, Cancel Reservation
  - _Mandatory field definitions for Scheduling Workspace -> Appointment Booking_
  - _Input fields: serviceTypeId (select), resourceStaffId (select), bookingDate (date), timeSlot (select), clientFullName (string)_
  - _Actions: Confirm Booking, Check Availability, Cancel Reservation_
- **REQ-LLD-FIELDS-131**: [STUDENT] Scheduling Workspace (Reschedule & History) — Form Fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge) | Actions: Submit Reschedule Request, Download Receipt PDF
  - _Mandatory field definitions for Scheduling Workspace -> Reschedule & History_
  - _Input fields: bookingReference (string), originalDateTime (date), newDateTime (date), rescheduleReason (text), bookingStatus (badge)_
  - _Actions: Submit Reschedule Request, Download Receipt PDF_
- **REQ-LLD-API-132**: [STUDENT] Scheduling Workspace — Backing REST APIs: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule
  - _REST API contract for Scheduling Workspace_
  - _Endpoints: GET /api/bookings/available-slots, POST /api/bookings, PATCH /api/bookings/{id}/reschedule_
- **REQ-LLD-COMP-133**: [STUDENT] Exam Workspace — UI Component Hierarchy: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Exam Workspace (/exam)_
  - _Layout type: master_detail_grid_
  - _Composed components: ExamDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-134**: [STUDENT] Exam Workspace (Exam Directory) — Form Fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Exam, Edit Exam, Archive Exam
  - _Mandatory field definitions for Exam Workspace -> Exam Directory_
  - _Input fields: examId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Exam, Edit Exam, Archive Exam_
- **REQ-LLD-API-135**: [STUDENT] Exam Workspace — Backing REST APIs: GET /api/exams, POST /api/exams, GET /api/exams/{id}
  - _REST API contract for Exam Workspace_
  - _Endpoints: GET /api/exams, POST /api/exams, GET /api/exams/{id}_
- **REQ-LLD-COMP-136**: [STUDENT] Tracking Workspace — UI Component Hierarchy: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Tracking Workspace (/tracking)_
  - _Layout type: master_detail_grid_
  - _Composed components: TrackingDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-137**: [STUDENT] Tracking Workspace (Tracking Directory) — Form Fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Tracking, Edit Tracking, Archive Tracking
  - _Mandatory field definitions for Tracking Workspace -> Tracking Directory_
  - _Input fields: trackingId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Tracking, Edit Tracking, Archive Tracking_
- **REQ-LLD-API-138**: [STUDENT] Tracking Workspace — Backing REST APIs: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}
  - _REST API contract for Tracking Workspace_
  - _Endpoints: GET /api/trackings, POST /api/trackings, GET /api/trackings/{id}_
- **REQ-LLD-COMP-139**: [STUDENT] Instructor Workspace — UI Component Hierarchy: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Instructor Workspace (/instructor)_
  - _Layout type: master_detail_grid_
  - _Composed components: InstructorDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-140**: [STUDENT] Instructor Workspace (Instructor Directory) — Form Fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Instructor, Edit Instructor, Archive Instructor
  - _Mandatory field definitions for Instructor Workspace -> Instructor Directory_
  - _Input fields: instructorId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Instructor, Edit Instructor, Archive Instructor_
- **REQ-LLD-API-141**: [STUDENT] Instructor Workspace — Backing REST APIs: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}
  - _REST API contract for Instructor Workspace_
  - _Endpoints: GET /api/instructors, POST /api/instructors, GET /api/instructors/{id}_
- **REQ-LLD-COMP-142**: [STUDENT] Student Workspace — UI Component Hierarchy: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal
  - _Canonical Low-Level Design expansion for Student Workspace (/student)_
  - _Layout type: master_detail_grid_
  - _Composed components: StudentDataGrid, SearchFilterBar, DetailInspectorDrawer, CreateEntityModal_
- **REQ-LLD-FIELDS-143**: [STUDENT] Student Workspace (Student Directory) — Form Fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string) | Actions: Create Student, Edit Student, Archive Student
  - _Mandatory field definitions for Student Workspace -> Student Directory_
  - _Input fields: studentId (string), title / name (string), status (badge), categoryType (select), assignedTo (string)_
  - _Actions: Create Student, Edit Student, Archive Student_
- **REQ-LLD-API-144**: [STUDENT] Student Workspace — Backing REST APIs: GET /api/students, POST /api/students, GET /api/students/{id}
  - _REST API contract for Student Workspace_
  - _Endpoints: GET /api/students, POST /api/students, GET /api/students/{id}_
- **REQ-LLD-COMP-145**: [STUDENT] Student Document Vault — UI Component Hierarchy: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal
  - _Canonical Low-Level Design expansion for Student Document Vault (/documents)_
  - _Layout type: document_vault_
  - _Composed components: FileUploadZone, VirusScanStatusPill, CategoryFolderTabs, DocumentPreviewModal_
- **REQ-LLD-FIELDS-146**: [STUDENT] Student Document Vault (Document Vault) — Form Fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge) | Actions: Upload Document, Download Document, Delete Document
  - _Mandatory field definitions for Student Document Vault -> Document Vault_
  - _Input fields: fileName (string), fileSizeBytes (number), fileCategory (select), uploadedBy (string), securityScanStatus (badge)_
  - _Actions: Upload Document, Download Document, Delete Document_
- **REQ-LLD-API-147**: [STUDENT] Student Document Vault — Backing REST APIs: GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}
  - _REST API contract for Student Document Vault_
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

## Affected Systems

- **frontend**: 294 requirement(s)
- **backend**: 159 requirement(s)
- **database**: 44 requirement(s)
- **auth**: 2 requirement(s)
- **observability**: 1 requirement(s)
- **validation**: 1 requirement(s)
- **tests**: 1 requirement(s)
- **config**: 1 requirement(s)
- **middleware**: 2 requirement(s)
- **offline_storage**: 1 requirement(s)
