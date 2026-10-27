# Product Requirements Document: Advisor Portal Lead Management

**Status:** Draft  
**Product:** Lead Operations Recruitment & Admission Platform  
**Area:** Aggregator Advisor Portal  
**Primary users:** Advisors and Advisor Managers  
**Last updated:** 27 October 2026

## 1. Executive summary

The Advisor Portal Lead Management experience gives advisors one place to capture, qualify, work, assign, and convert prospective-student enquiries into applications.

The target experience covers the complete journey:

```text
Lead source → Lead captured → Deduplicated and enriched → Assigned
→ Contacted and followed up → Qualified → Application created/converted
→ Application submitted → Handoff and reporting
```

The product should make the next best action obvious for every lead, preserve a complete history of ownership and communication, and prevent leads from being lost between marketing capture, advisor follow-up, course selection, and application submission.

This PRD consolidates the portal's existing concepts—advertisement leads, awaiting-course-link leads, advisor assignment, follow-ups, lead documents, messaging, activity logs, and short applications—into one end-to-end operating model.

## 2. Problem statement

Advisors currently work across related but separate experiences:

- Advertisement leads are captured from advertisement links and external lead sources.
- Abstract or awaiting-course-link leads require a different workflow before they can become applications.
- Short applications live in a separate area from leads.
- Assignment, follow-up, communication, document collection, and conversion status are not always visible in one place.
- Managers need team-level visibility without compromising advisor-level access restrictions.
- Ownership must survive conversion into an application, with a traceable record of who changed it and why.

This creates operational risk:

- New enquiries can remain unassigned or become stale.
- Advisors may contact the same prospect twice.
- Managers cannot reliably identify overdue follow-ups or bottlenecks.
- Applicant context can be lost at conversion.
- Reporting on source, advisor performance, response time, and conversion is incomplete.

## 3. Goals and success metrics

### 3.1 Product goals

1. Provide a single, searchable lead workspace for advisors.
2. Reduce time from lead capture to first advisor action.
3. Make ownership, next action, status, and urgency visible at a glance.
4. Support structured qualification without forcing advisors into a long form.
5. Preserve all assignment, status, communication, document, and conversion history.
6. Convert qualified leads into the correct application workflow with no loss of context.
7. Give Advisor Managers team-wide controls, workload visibility, and performance reporting.
8. Enforce tenant/aggregator scope and per-user permissions at every read and write.

### 3.2 Launch success metrics

The following should be measured from launch baseline and reviewed weekly:

| Metric | Definition | Initial target |
|---|---|---:|
| Lead response time | Median time from lead creation to first recorded advisor action | Reduce by 30% |
| Unassigned lead rate | Active leads with no assigned advisor | <10% after 24 hours |
| First-contact rate | Active leads with an outbound contact or logged contact attempt | >80% within SLA |
| Follow-up adherence | Due follow-ups completed on or before due date | >85% |
| Lead-to-application conversion | Leads converted into an application / eligible leads | Establish baseline, then +15% |
| Stale lead rate | Active leads with no action for the configured stale period | Reduce by 25% |
| Duplicate contact rate | Leads with duplicate email/phone or duplicate applicant match | Reduce by 20% |
| Assignment audit completeness | Assignment changes with actor, previous owner, new owner, and timestamp | 100% |
| Data access violations | Leads exposed outside permitted aggregator/role scope | 0 |

Targets are directional until two weeks of baseline data are available.

## 4. Personas and permissions

### 4.1 Advisor

An advisor owns day-to-day lead work. They need to:

- View permitted leads.
- Claim or work assigned leads.
- Update lead status and qualification fields.
- Record calls, emails, SMS, WhatsApp, notes, and follow-ups.
- Request and manage lead documents when permitted.
- Create or convert an application when permitted.
- View the history of the lead and the application created from it.

An advisor may be configured as `assignedOnly`, limiting visibility to their own assigned records. This must be enforced server-side, not only through UI filtering.

### 4.2 Advisor Manager

An Advisor Manager manages the team and the full aggregator lead pool. They need to:

- View all permitted leads.
- Assign, reassign, and unassign leads.
- Configure team workload and reporting lines.
- View team activity, SLA breaches, stale leads, and conversion reporting.
- Resolve duplicates and data-quality exceptions.
- Override or reopen a lead with an auditable reason.

The existing hierarchy model should be used for reporting lines and team views. Hierarchy changes must be audited.

### 4.3 External/system actors

- **Prospective student:** submits an enquiry, responds to advisor contact, provides information/documents, and may continue into the applicant portal.
- **Marketing/source system:** creates or syncs leads from advertisement links, events, referral links, Meta/Facebook lead capture, or other approved sources.
- **Admissions/application system:** receives the converted application and continues the formal admissions lifecycle.
- **System jobs:** send notifications, calculate SLA state, deduplicate, and reconcile failed integrations.

## 5. Scope

### 5.1 In scope

- Unified lead inbox and dashboard.
- Lead capture from existing and future approved sources.
- Lead deduplication and identity matching.
- Lead assignment and workload management.
- Lead detail workspace.
- Status, qualification, and next-action management.
- Communication and activity timeline.
- Follow-ups and reminders.
- Lead document requests and document status.
- Course/institution interest and course-link workflow.
- Lead-to-application conversion.
- Application ownership carry-forward.
- Notifications and escalation.
- Manager reporting and operational exports.
- RBAC, audit trail, retention, and data access controls.

### 5.2 Out of scope for the first release

- Full omnichannel inbox with live two-way email sync.
- Automated sales/marketing journeys or bulk campaigns.
- AI-generated qualification decisions or autonomous outreach.
- Replacing the formal admissions lifecycle after application submission.
- Commission calculation.
- Applicant account creation and identity claim infrastructure beyond existing platform behaviour.
- A new agency-recruiter CRM; this PRD is for aggregator-level advisor operations.

## 6. Product principles

1. **Every active lead has an owner or an explicit queue state.**
2. **Every lead has a next action.** If no action is needed, the reason is recorded.
3. **A conversion never loses context.** Ownership, source, notes, consent, qualification, and activity history remain traceable.
4. **Visibility is least-privilege by default.** UI hiding is not an authorization control.
5. **The timeline is the source of operational truth.** Important changes are immutable events, not only mutable fields.
6. **Human decisions remain explicit.** Automation can suggest, notify, and flag; advisors or managers make qualification and conversion decisions.

## 7. End-to-end user journey

### 7.1 Lead capture

1. A prospect submits an approved form or is imported from an approved source.
2. The platform validates required contact data and consent.
3. The platform normalizes email, phone, name, and source metadata.
4. A duplicate check runs against active leads, applications, and known applicant identities within the permitted aggregator scope.
5. The system creates the lead or attaches the event to an existing lead according to duplicate rules.
6. The lead enters the **New** queue with source, created time, consent state, and suggested routing metadata.
7. The assigned advisor or manager receives an in-app notification; email/SMS notification is configurable.

### 7.2 Triage and assignment

1. The lead appears in the advisor inbox, sorted by urgency and SLA.
2. A manager may assign the lead to a named advisor, assign in bulk, or leave it in the unassigned queue.
3. An advisor may claim a lead when they have the assignment permission.
4. Assignment writes an immutable event containing previous owner, new owner, actor, timestamp, and reason where supplied.
5. Assignment changes do not remove historical ownership.
6. The lead moves to **Assigned** automatically when an owner is set, unless the advisor selects a more advanced status.

### 7.3 Qualification and first contact

The advisor opens the lead detail workspace and sees:

- Prospect identity and contact details.
- Source, campaign, advertisement/referral link, and capture timestamp.
- Consent and preferred contact channels.
- Duplicate warnings and linked applications.
- Current owner, status, SLA timer, and next action.
- Course/institution interest.
- Existing notes, messages, follow-ups, documents, and activity.

The advisor records the contact attempt using one of the supported channels, adds a concise outcome, and schedules the next follow-up. The first contact action should automatically satisfy the first-response metric.

Qualification fields should be quick to complete and configurable by product administrators. The initial set is:

- Interested in studying: yes / no / unsure.
- Eligible based on current information: yes / no / needs review.
- International/domestic classification where applicable.
- Preferred institution, course, location, intake, and study mode.
- Budget or funding concern.
- English-language or assessment concern.
- Visa/immigration concern where applicable.
- Preferred contact channel and contactability.
- Lead temperature: hot / warm / cold.
- Qualification note.

### 7.4 Follow-up and nurture

1. Every active lead has a next action or a selected terminal/review reason.
2. Advisors create follow-ups with due date/time, channel, note, and optional reminder.
3. The dashboard surfaces due today, overdue, and upcoming follow-ups.
4. Missed follow-ups remain visible until completed, rescheduled, or cancelled with a reason.
5. Managers see team-level overdue queues and can reassign stale leads.
6. A lead becomes **Stale** as a derived operational flag when no meaningful action occurs within the configured threshold; this does not replace the primary lead status.

### 7.5 Course and institution matching

The advisor can search the approved course catalogue and attach a prospect's interest to one or more course options. If the desired course is not yet linked to a real admissions course:

1. The lead enters the existing awaiting-course-link workflow.
2. The advisor can capture the applicant's details while the course is being resolved.
3. The lead is clearly marked as awaiting a course link and cannot be submitted as a normal application until the required course context exists.
4. Once a course is linked, the advisor is notified and the lead becomes eligible for conversion.

### 7.6 Conversion to application

A lead can be converted only when the required minimum data and business rules are satisfied:

- A valid prospect identity exists.
- Consent requirements are satisfied or an explicit exception is recorded.
- An advisor owns the lead or a manager performs an approved override.
- A valid institution/course/intake selection exists, or the lead follows the approved abstract-course path.
- Required duplicate checks have completed.
- The lead is not already converted, closed, or deleted.

Conversion flow:

1. Advisor selects **Convert to application**.
2. The platform presents a pre-conversion review with missing fields, duplicate warnings, selected course/intake, and ownership.
3. The advisor confirms or returns to edit.
4. The platform creates or materializes the application in a transaction.
5. Lead assignment carries forward to the application owner unless a manager explicitly selects a different owner.
6. Lead and application histories are cross-linked.
7. The lead status becomes **Converted** and records the application ID.
8. The advisor is taken to the application edit/review page.
9. The assigned advisor receives an in-app notification when the conversion was performed by someone else.
10. Any failure leaves the lead unchanged and shows a recoverable error; partial applications must not be created silently.

### 7.7 Application handoff and closure

Once converted, the advisor continues in the existing application workflow until the defined handoff point. The lead record remains read-only for conversion-critical fields but remains available for history and source reporting.

Terminal lead outcomes include:

- Converted.
- Closed — not interested.
- Closed — unreachable after configured attempts.
- Closed — not eligible.
- Closed — duplicate.
- Closed — opted out.
- Closed — other, with required reason.

Reopening a closed lead is a manager action or a permissioned advisor action and must create an audit event.

## 8. Information architecture and key screens

### 8.1 Advisor dashboard

The dashboard should answer: “What needs my attention today?”

Core widgets:

- New/unassigned leads.
- My active leads.
- Due today.
- Overdue follow-ups.
- Leads nearing SLA breach.
- Ready to convert.
- Recently converted.
- Team workload and stale leads for managers.

Each widget is clickable and applies the corresponding list filter.

### 8.2 Lead inbox

The inbox supports:

- Full-text search across name, email, phone, lead/reference ID, and campaign.
- Filters: status, owner, source, campaign, institution, course, intake, temperature, created date, next-action date, consent state, duplicate flag, and stale/SLA state.
- Saved views, with manager-created shared views and personal views.
- Sort by priority, created time, last activity, next action, and response deadline.
- Bulk assignment, status update, close, export, and follow-up creation where permitted.
- Column configuration appropriate to the user's role and screen size.

Recommended default columns:

| Column | Purpose |
|---|---|
| Priority/SLA | Shows urgency and overdue state |
| Prospect | Name, email, phone |
| Status | Current lifecycle state |
| Owner | Advisor or unassigned |
| Source | Advertisement, event, referral, manual, import |
| Interest | Institution/course/intake summary |
| Last activity | Recency and channel |
| Next action | Due date and follow-up summary |
| Created | Lead age |
| Actions | Open, assign, convert, close |

### 8.3 Lead detail workspace

Use a single workspace with a persistent header and two-column desktop layout.

Header:

- Prospect name and lead/reference ID.
- Status badge and SLA state.
- Owner and assignment controls.
- Primary action: next best action, such as Contact, Schedule follow-up, Convert, or Close.
- More actions: duplicate, reopen, export, audit history.

Primary content:

- Contact and consent card.
- Qualification and course-interest card.
- Communication composer/history.
- Follow-ups and tasks.
- Documents.

Secondary content:

- Activity timeline.
- Duplicate/linked-record panel.
- Conversion readiness checklist.
- Application link when converted.

### 8.4 Manager team view

Manager view adds:

- Workload by advisor.
- Unassigned and overdue queues.
- Reassignment controls.
- SLA and conversion breakdowns.
- Hierarchy/team filters.
- Bulk actions with confirmation and audit reason.

## 9. Functional requirements

### 9.1 Lead record and source attribution

| ID | Requirement | Priority |
|---|---|---|
| LM-001 | Create a lead from each approved source with source, campaign, link/event, capture timestamp, and raw attribution metadata preserved. | Must |
| LM-002 | Normalize email and phone for matching while preserving the original submitted value for display/audit. | Must |
| LM-003 | Store consent per channel: email, SMS, WhatsApp, phone, and general contact consent. | Must |
| LM-004 | Support manual lead creation by a permitted advisor. | Must |
| LM-005 | Make source attribution immutable after capture except through an audited manager correction. | Should |

### 9.2 Deduplication and identity

| ID | Requirement | Priority |
|---|---|---|
| LM-010 | Detect likely duplicates using normalized email, phone, applicant identity, and configurable fuzzy name matching. | Must |
| LM-011 | Show duplicate warnings before creating a new lead and before conversion. | Must |
| LM-012 | Allow a manager to mark records as duplicate, legitimate multiple enquiry, or unresolved. | Must |
| LM-013 | Never merge or delete records automatically without a reversible, auditable action. | Must |
| LM-014 | Link related leads/applications so advisors can see prior history without widening data scope. | Should |

### 9.3 Assignment and workload

| ID | Requirement | Priority |
|---|---|---|
| LM-020 | Allow an advisor to claim an eligible unassigned lead. | Must |
| LM-021 | Allow managers to assign, reassign, and unassign individual or bulk leads. | Must |
| LM-022 | Record previous owner, new owner, actor, timestamp, and reason for every assignment change. | Must |
| LM-023 | Carry lead ownership into the converted application by default. | Must |
| LM-024 | Notify the new owner when assigned by another user. Self-assignment must not create a redundant notification. | Must |
| LM-025 | Support assignment rules by source, campaign, institution, region, language, and workload in a later phase. | Could |

### 9.4 Status and qualification

| ID | Requirement | Priority |
|---|---|---|
| LM-030 | Support the core statuses New, Assigned, Contacted, Converted, and Closed, aligned with the current lead model. | Must |
| LM-031 | Support derived operational flags: due, overdue, stale, duplicate, ready to convert, and awaiting course link. | Must |
| LM-032 | Require a reason when closing, reopening, overriding, or marking a duplicate. | Must |
| LM-033 | Allow configurable qualification fields without changing the core lifecycle status. | Should |
| LM-034 | Preserve before/after values for status and qualification changes in the activity timeline. | Must |

### 9.5 Communication and activity

| ID | Requirement | Priority |
|---|---|---|
| LM-040 | Display a chronological timeline of creation, assignment, status, notes, follow-ups, messages, document events, and conversion. | Must |
| LM-041 | Show who performed each material action, using actor name/email and timestamp. | Must |
| LM-042 | Support internal notes distinct from prospect-visible messages. | Must |
| LM-043 | Support existing SMS/WhatsApp/email message records and channel consent checks. | Must |
| LM-044 | Prevent sending through a channel when consent is missing or revoked unless an authorized exception is recorded. | Must |
| LM-045 | Provide message templates with variable preview and delivery status. | Should |

### 9.6 Follow-ups and notifications

| ID | Requirement | Priority |
|---|---|---|
| LM-050 | Create, edit, complete, reschedule, and cancel follow-ups. | Must |
| LM-051 | Show due and overdue follow-ups on dashboard, inbox, and lead detail. | Must |
| LM-052 | Notify advisors of assignments, due follow-ups, lead replies, and conversion events. | Must |
| LM-053 | Notify managers of configurable SLA breaches and unassigned queue thresholds. | Should |
| LM-054 | Make notification delivery best-effort and log failures without blocking lead updates. | Must |

### 9.7 Documents

| ID | Requirement | Priority |
|---|---|---|
| LM-060 | Request documents against a lead with type, note, due date, and notification preference. | Must |
| LM-061 | Display requested, pending, uploaded, and verified states with actor and timestamps. | Must |
| LM-062 | Carry relevant document metadata into the application conversion flow without duplicating files unnecessarily. | Should |
| LM-063 | Enforce document access by aggregator, role, and lead visibility. | Must |

### 9.8 Conversion

| ID | Requirement | Priority |
|---|---|---|
| LM-070 | Show a conversion readiness checklist before conversion. | Must |
| LM-071 | Block conversion when required data, consent, course linkage, duplicate review, or ownership rules fail. | Must |
| LM-072 | Create/materialize the application and update the lead atomically. | Must |
| LM-073 | Carry source, owner, applicant identity, relevant notes, and history links to the application. | Must |
| LM-074 | Mark the lead Converted only after application creation succeeds. | Must |
| LM-075 | Provide a recovery path for failed conversions and an operational error record. | Must |

### 9.9 Reporting and exports

| ID | Requirement | Priority |
|---|---|---|
| LM-080 | Report volume, response time, assignment, follow-up, source, conversion, and closure outcomes. | Must |
| LM-081 | Support filtering reports by date, source, campaign, advisor, team, institution, course, and intake. | Must |
| LM-082 | Ensure metrics use a documented event/time definition and distinguish current-state from point-in-time metrics. | Must |
| LM-083 | Allow scoped CSV export for permitted users, with an export audit event. | Should |

## 10. Lead lifecycle model

### 10.1 Primary status model

| Status | Meaning | Entry examples | Allowed next states |
|---|---|---|---|
| New | Captured but not yet actively worked | Form submission/import | Assigned, Contacted, Closed |
| Assigned | Has an owner and is ready for work | Claim or manager assignment | Contacted, Closed |
| Contacted | At least one meaningful advisor action has occurred | Call/message/note/contact attempt | Contacted, Converted, Closed |
| Converted | Linked to a formal application | Successful conversion | Read-only for lead lifecycle |
| Closed | No further active work | Not interested, duplicate, unreachable, not eligible | Reopened if permitted |

### 10.2 Derived state

Derived state must not overwrite the primary status:

- **Unassigned:** no current owner.
- **Due:** next follow-up is due.
- **Overdue:** next follow-up is past due.
- **Stale:** no meaningful action within the configured threshold.
- **Ready to convert:** minimum conversion rules pass.
- **Awaiting course link:** course context is not yet connected to a real admissions course.
- **Duplicate review:** potential duplicate requires a decision.

## 11. Data and technical requirements

### 11.1 Existing domain entities to reuse

The first implementation should build on current entities and patterns where possible:

- `Lead` for advertisement and marketing enquiries.
- `LeadEvent` for immutable lead history.
- `LeadFollowup` for scheduled follow-ups.
- `LeadMessage` for persisted communications.
- `LeadDocument` for lead-level document requests and uploads.
- `Application` and `ApplicationEvent` for formal applications and history.
- `AbstractApplicationLead` for awaiting-course-link workflows.
- `AggregatorUserRole` for advisor scope, role, permissions, and assigned-only configuration.
- Existing notification and audit-log infrastructure.

### 11.2 Required record relationships

At minimum, the system must be able to navigate:

```text
Lead
 ├─ source/link/event/campaign
 ├─ current advisor owner
 ├─ assignment/status/activity history
 ├─ follow-ups/messages/documents
 ├─ duplicate and related-record links
 └─ converted application

Application
 ├─ originating lead
 ├─ carried-forward advisor owner
 └─ application activity/history
```

If the current schema cannot represent a relationship without overloading an existing field, add a dedicated relation or metadata field rather than relying on free-text notes.

### 11.3 Transaction and consistency rules

- Assignment update and assignment event must be written atomically.
- Status update and status event must be written atomically.
- Conversion must update lead, create/materialize application, and write cross-links atomically.
- Notifications are asynchronous/best-effort and must not roll back the primary transaction.
- Idempotency keys are required for source imports and webhook retries.
- All list/detail queries must include aggregator scope and deleted-record filters.
- Bulk operations must return per-record success/failure results.

## 12. Security, privacy, and compliance

- Enforce aggregator scope on every server action, route, query, export, and notification link.
- Enforce role and permission checks server-side; never trust hidden UI controls.
- Respect `assignedOnly` for advisors on leads, applications, search, exports, counts, and related-record panels.
- Mask or restrict sensitive applicant fields until the lead reaches the appropriate workflow state.
- Record consent timestamp, source, channel, and any withdrawal.
- Do not expose message bodies, documents, or contact data to users lacking the corresponding permission.
- Log authentication-relevant and data-sensitive actions, including exports, reassignments, merges, deletes, status overrides, and document access where supported.
- Support retention/deletion policy with soft deletion and audit preservation.
- Avoid putting personal data into URLs, notification text, or analytics event payloads unless required.

## 13. Non-functional requirements

### Performance

- Lead inbox first meaningful render: target <2 seconds for a normal scoped page.
- Search/filter response: target <1 second for indexed queries; paginate all lists.
- Lead detail initial load: target <2 seconds excluding large document previews.
- Bulk actions should provide progress and complete asynchronously for large batches.

### Reliability

- Source ingestion retries must be idempotent.
- Failed notifications and integrations must be observable and retryable.
- Conversion failures must not leave a lead in a misleading Converted state.
- Audit/event writes are required for material state changes.

### Accessibility and usability

- Keyboard-accessible tables, filters, dialogs, assignment controls, and timeline.
- Status must not rely on colour alone.
- Responsive operation on laptop and tablet widths.
- Clear empty, loading, error, and permission-denied states.
- Destructive or bulk actions require confirmation and explain impact.

## 14. Analytics and event taxonomy

Product analytics should be separate from the auditable domain event stream, while sharing stable IDs where appropriate.

Recommended events:

- `lead_created`
- `lead_duplicate_detected`
- `lead_assigned`
- `lead_reassigned`
- `lead_unassigned`
- `lead_contact_attempted`
- `lead_followup_created`
- `lead_followup_completed`
- `lead_followup_overdue`
- `lead_status_changed`
- `lead_document_requested`
- `lead_message_sent`
- `lead_course_linked`
- `lead_conversion_started`
- `lead_converted`
- `lead_conversion_failed`
- `lead_closed`
- `lead_reopened`

Each event should include aggregator ID, lead ID, actor role, source, current status, owner ID where allowed, and timestamp. Avoid raw email, phone, message body, or document content in analytics.

## 15. Acceptance criteria for end-to-end release

The release is acceptable when all of the following are true:

1. A test lead can be created from each supported source and appears in the correct aggregator-scoped inbox.
2. A duplicate lead is detected and shown with an actionable warning before conversion.
3. A manager can assign, reassign, unassign, and bulk-assign leads; advisors see only actions permitted by their role.
4. Every assignment change records actor, previous owner, new owner, and timestamp.
5. An advisor can open a lead, update qualification, record contact, schedule follow-up, and see all changes in the timeline.
6. Due and overdue follow-ups are visible on the dashboard and lead inbox.
7. Consent restrictions prevent unauthorized outreach channels.
8. A lead with missing conversion prerequisites receives specific, actionable validation errors.
9. A valid lead converts into an application atomically.
10. The assigned advisor is carried forward to the application, with an application event and notification when applicable.
11. The converted lead links to the application and becomes read-only for conversion-critical fields.
12. A failed conversion leaves the lead in its prior state and creates an observable failure record.
13. Assigned-only advisors cannot discover restricted leads through search, counts, exports, URLs, or related records.
14. Manager reporting reconciles with lead and application event history for the same date range.
15. All critical actions pass automated authorization, transaction, and audit tests.

## 16. Delivery plan

### Phase 0 — Baseline and instrumentation

- Confirm current lead/application entity mappings.
- Document current source ingestion and conversion paths.
- Add missing event/audit coverage.
- Establish baseline metrics and data-quality dashboard.

### Phase 1 — Lead inbox and ownership

- Unified inbox with search, filters, status, owner, source, and SLA flags.
- Lead detail header and assignment controls.
- Advisor/manager visibility enforcement.
- Assignment notifications and audit trail.

### Phase 2 — Follow-up and qualification workspace

- Qualification fields.
- Next-action and follow-up UX.
- Due/overdue dashboard views.
- Activity timeline improvements.
- Consent-aware contact logging.

### Phase 3 — Course matching, documents, and conversion

- Course/institution interest.
- Awaiting-course-link integration.
- Conversion readiness checklist.
- Atomic lead-to-application conversion.
- Ownership carry-forward and cross-linked history.

### Phase 4 — Manager operations and reporting

- Team workload view.
- SLA and stale-lead escalations.
- Saved views and scoped exports.
- Source and advisor performance reporting.

### Phase 5 — Optimization

- Rule-based assignment.
- Template improvements.
- Additional source connectors.
- Controlled experimentation on response and conversion workflows.

## 17. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Lead and abstract-lead workflows remain split | Advisors miss work or duplicate records | Use a unified operational inbox with explicit record type and state labels; keep domain-specific detail forms where necessary |
| Assignment scope leaks data | High privacy/security impact | Centralize visibility predicates and test list, search, detail, export, and notification paths |
| Conversion creates partial records | Incorrect admissions data | Use transaction boundaries, idempotency, failure events, and recovery tooling |
| Source payload quality varies | Duplicate or unusable leads | Normalize, validate, preserve raw attribution, and route exceptions to a manager queue |
| Too many statuses confuse users | Low adoption and inconsistent reporting | Keep the primary lifecycle small; use derived flags for operational conditions |
| Messaging consent is unclear | Compliance and reputation risk | Store channel-level consent and block sends by default when consent is absent |
| Managers overload advisors through bulk assignment | Slow response and poor morale | Show workload before assignment, support capacity filters, and retain assignment history |

## 18. Open decisions

1. What is the default first-response SLA by source and working hours?
2. Which channels are enabled at launch: email, SMS, WhatsApp, phone logging?
3. Should the initial release unify `Lead` and `AbstractApplicationLead` in one physical list, or provide a unified dashboard with separate source lists?
4. Which qualification fields are mandatory for conversion versus optional reporting fields?
5. What is the duplicate match threshold and who can resolve ambiguous matches?
6. Can an advisor reopen a closed lead, or is that manager-only?
7. What is the retention period for lead messages, documents, and source payloads?
8. Which reports must be point-in-time snapshots rather than current-state queries?
9. Should automatic assignment rules be included in Phase 1 or Phase 5?
10. Which external systems are authoritative for institution, course, intake, and applicant identity?

## 19. Definition of done

The feature is ready for production when:

- All Must requirements are implemented and tested.
- End-to-end tests cover capture, dedupe, assignment, follow-up, contact, document request, course-link, conversion, notification, and handoff.
- Authorization tests cover advisor, assigned-only advisor, advisor manager, and cross-aggregator access attempts.
- Event and audit records are complete for all material state changes.
- Metrics and dashboards reconcile with source records.
- Support documentation and advisor training materials are published.
- A rollback plan exists for source ingestion, conversion, and notification changes.
- Pilot feedback from at least one Advisor Manager and several Advisors has been incorporated.

