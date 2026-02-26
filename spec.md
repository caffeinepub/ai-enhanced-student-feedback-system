# Specification

## Summary
**Goal:** Extend the Anurag University Feedback System with a fully functional Instructor Panel, including authentication, system analytics, instructor notes, instructor management, and a score distribution chart.

**Planned changes:**
- Add `Instructor` data type to the backend with fields (instructorId, name, email, department, PIN) and CRUD operations stored in a persistent Map
- Add `verifyInstructor(instructorId, pin)` backend query for PIN-based authentication (PIN never returned in results)
- Add `addInstructorNote(submissionId, note)` and `getSubmissionNote(submissionId)` backend functions with persistent storage
- Add `getSystemStats()` backend function returning total students, total submissions, global average score, and top-performing student
- Gate the Instructor Panel page behind a login form (Instructor ID + PIN); show error on wrong credentials and a Logout button when authenticated
- Add a System Analytics section in the Instructor Panel with four stat cards (Total Students, Total Submissions, Average Score, Top Student) styled in au-red/au-navy
- Add an Instructor Notes text area to each submission detail view in the Instructor Panel, with save (toast confirmation) and pre-fill on load
- Add a Manage Instructors sub-section with a form to add new instructors and a table listing existing instructors with Delete actions
- Add a Score Distribution chart (CSS/Tailwind only, no external libraries) with five score-range buckets (0–20, 21–40, 41–60, 61–80, 81–100) styled in au-red
- Add React Query hooks in `useQueries.ts` for all new backend calls: `useVerifyInstructor`, `useGetSystemStats`, `useAddInstructorNote`, `useGetSubmissionNote`, `useGetAllInstructors`, `useAddInstructor`, `useDeleteInstructor`

**User-visible outcome:** Instructors can log into the Instructor Panel with a PIN, view platform-wide analytics, add and manage instructor accounts, annotate student submissions with notes, and see a score distribution chart — all within the existing au-red/au-navy branded interface.
