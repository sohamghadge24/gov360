# GOVTRACK360 — FINAL SOFTWARE COMPLETION & INTEGRATION

IMPORTANT:

THE FRONTEND UI/UX IS NOW 100% COMPLETE.

DO NOT REDESIGN THE FRONTEND.

DO NOT CHANGE:
- UI design
- colors
- fonts
- spacing
- sidebar
- logo
- page layouts
- cards
- navigation
- responsive design
- existing frontend routes
- existing frontend components

The goal now is to make the COMPLETE SOFTWARE FUNCTIONAL end-to-end.

========================================================
CURRENT ARCHITECTURE
========================================================

Frontend:
Next.js / React / TypeScript

Backend:
FastAPI / Python

Database:
PostgreSQL + PostGIS

API:
FastAPI versioned API

Base URL:

http://localhost:8000/api/v1

Architecture:

WEB UI
   ↓
Next.js API / API Client
   ↓
FastAPI
   ↓
Services
   ↓
Repositories / SQLAlchemy
   ↓
PostgreSQL + PostGIS


Flutter Mobile App:

Flutter
   ↓
FastAPI /api/v1
   ↓
Services
   ↓
PostgreSQL/PostGIS


========================================================
PHASE 1 — FULL PROJECT AUDIT
========================================================

Before changing code, inspect the ENTIRE repository.

Identify:

- frontend
- backend
- database
- migrations
- services
- repositories
- models
- schemas
- routers
- authentication
- middleware
- API client
- Next.js API routes
- environment variables
- mobile API integration
- tests
- Docker configuration
- deployment configuration

Create a dependency map:

Frontend
→ API Client
→ Next.js Proxy
→ FastAPI Router
→ Service
→ Repository
→ Database


========================================================
PHASE 2 — DATABASE VERIFICATION
========================================================

Verify the PostgreSQL/PostGIS database is correctly configured.

Verify:

- database connection
- SQLAlchemy configuration
- Alembic
- migrations
- foreign keys
- indexes
- constraints
- UUID handling
- timestamps
- organization relationships
- employee relationships
- roster relationships
- attendance relationships
- verification relationships
- duty relationships
- exception relationships
- audit relationships

Do NOT recreate existing tables.

Do NOT destroy existing data.

Do NOT run destructive migrations automatically.

If a migration is required:
- create a proper Alembic migration
- make it reversible where practical
- document the change


========================================================
PHASE 3 — SERVICE LAYER AUDIT
========================================================

For EVERY required API:

FIRST search for an existing service.

Do NOT create duplicate services.

Check:

- authentication service
- organization service
- department service
- employee service
- user account service
- supervisor service
- shift service
- roster service
- attendance service
- attendance exception service
- duty assignment service
- duty type service
- duty service
- reporting service
- analytics service

For each endpoint determine:

SERVICE EXISTS?
SCHEMA EXISTS?
MODEL EXISTS?
REPOSITORY EXISTS?
API ROUTE EXISTS?

Reuse existing implementation whenever possible.


========================================================
PHASE 4 — FASTAPI API COMPLETION
========================================================

Required API base:

http://localhost:8000/api/v1


SYSTEM

GET /health


AUTH

POST /auth/login
GET /auth/me
POST /auth/activate


ORGANIZATIONS

POST /organizations
GET /organizations
GET /organizations/{organization_id}
PATCH /organizations/{organization_id}
DELETE /organizations/{organization_id}


DEPARTMENTS

POST /organizations/{organization_id}/departments
GET /organizations/{organization_id}/departments

GET /departments/{department_id}
PATCH /departments/{department_id}
DELETE /departments/{department_id}


EMPLOYEES

POST /organizations/{organization_id}/employees
GET /organizations/{organization_id}/employees

GET /employees/{employee_id}
PATCH /employees/{employee_id}
DELETE /employees/{employee_id}


USER ACCOUNTS

POST /employees/{employee_id}/user-account
GET /organizations/{organization_id}/user-accounts
GET /user-accounts/{user_account_id}
GET /employees/{employee_id}/user-account
DELETE /user-accounts/{user_account_id}


SUPERVISORS

POST /supervisors


SHIFTS

POST /shifts
GET /shifts
GET /shifts/{shift_template_id}
PATCH /shifts/{shift_template_id}

Compatibility:

POST /organizations/{organization_id}/shift-templates
GET /organizations/{organization_id}/shift-templates
GET /shift-templates/{shift_template_id}
PATCH /shift-templates/{shift_template_id}


ROSTERS

GET /rosters
POST /rosters
POST /rosters/bulk
POST /rosters/import
PATCH /rosters/{roster_entry_id}

Compatibility:

POST /organizations/{organization_id}/roster-entries
GET /organizations/{organization_id}/roster-entries
GET /roster-entries/{roster_entry_id}
PATCH /roster-entries/{roster_entry_id}


ATTENDANCE

GET /attendance/today
GET /attendance/status/current

POST /attendance/check-in
POST /attendance/check-out
POST /attendance/events

GET /attendance/sessions
GET /attendance/sessions/{session_id}

POST /attendance/sessions/{session_id}/finalize
POST /attendance/sessions/{session_id}/correction-request

POST /attendance/offline-sync


LEGACY ATTENDANCE

POST /organizations/{organization_id}/attendance/check-in
POST /organizations/{organization_id}/attendance/check-out

GET /organizations/{organization_id}/attendance/sessions
GET /organizations/{organization_id}/attendance/sessions/{session_id}

GET /organizations/{organization_id}/attendance/employees/{employee_id}/active


ATTENDANCE EXCEPTIONS

GET /attendance/exceptions
GET /attendance/exceptions/{exception_id}
PATCH /attendance/exceptions/{exception_id}


DUTY ASSIGNMENTS

POST /organizations/{organization_id}/duty-assignments
GET /organizations/{organization_id}/duty-assignments
GET /duty-assignments/{assignment_id}
PATCH /duty-assignments/{assignment_id}


DUTY TYPES

GET /duty-types
POST /duty-types
PATCH /duty-types/{duty_type_id}


DUTIES

POST /duties
GET /duties
GET /duties/{duty_id}
PATCH /duties/{duty_id}

POST /duties/{duty_id}/reassign
POST /duties/{duty_id}/checkpoints

GET /my/duty/today
GET /my/duty/upcoming


REPORTS

GET /reports/attendance/daily
GET /reports/attendance/daily/export

GET /reports/attendance/monthly
GET /reports/attendance/monthly/export

GET /reports/verification/compliance
GET /reports/verification/compliance/export

GET /reports/verification/missed
GET /reports/verification/missed/export

GET /reports/field-duty
GET /reports/field-duty/export

GET /reports/employees/{employee_id}/attendance
GET /reports/employees/{employee_id}/attendance/export

GET /reports/analytics/dashboard


IMPORTANT:

Do NOT simply create route functions that return mock data.

Every endpoint must connect:

Router
→ Service
→ Repository
→ Database


========================================================
PHASE 5 — FRONTEND API CONNECTION
========================================================

The frontend is visually complete.

Now connect every existing page to REAL APIs.

Create/reuse ONE centralized typed API client.

Do NOT scatter:

fetch("http://localhost:8000/...")

through individual components.

Use:

Frontend
→ centralized API client
→ Next.js proxy where appropriate
→ FastAPI


The API client must handle:

- GET
- POST
- PATCH
- DELETE
- authentication
- authorization
- JSON
- errors
- timeout
- retry where appropriate
- request IDs
- response parsing


========================================================
PHASE 6 — FRONTEND PAGE → API MAPPING
========================================================

Verify every page.

Dashboard:

GET /reports/analytics/dashboard


Live Control Room:

GET /attendance/today
GET /attendance/status/current
GET /attendance/exceptions
GET /my/duty/today


Employees:

GET /organizations/{organization_id}/employees
POST /organizations/{organization_id}/employees
GET /employees/{employee_id}
PATCH /employees/{employee_id}
DELETE /employees/{employee_id}


Organizations:

GET /organizations
POST /organizations
GET /organizations/{organization_id}
PATCH /organizations/{organization_id}
DELETE /organizations/{organization_id}


Departments:

GET /organizations/{organization_id}/departments
POST /organizations/{organization_id}/departments
PATCH /departments/{department_id}
DELETE /departments/{department_id}


Roster & Duty:

GET /rosters
POST /rosters
POST /rosters/bulk
POST /rosters/import
PATCH /rosters/{roster_entry_id}

GET /duties
POST /duties
PATCH /duties/{duty_id}
POST /duties/{duty_id}/reassign


Attendance:

GET /attendance/today
GET /attendance/sessions
GET /attendance/sessions/{session_id}
POST /attendance/check-in
POST /attendance/check-out
POST /attendance/events
POST /attendance/offline-sync


Verification:

Connect to the existing verification/compliance APIs and services.

Do NOT invent verification data.


Approvals:

Connect to:

GET /attendance/exceptions
GET /attendance/exceptions/{exception_id}
PATCH /attendance/exceptions/{exception_id}

Use the existing approval workflow/service where available.


Reports & Analytics:

Connect all report pages to the report APIs.

Export buttons must call the real export endpoints.

Do not create fake downloadable files.


========================================================
PHASE 7 — NEXT.JS API PROXY
========================================================

Verify:

POST /api/auth/login
POST /api/auth/activate
POST /api/auth/logout
GET /api/auth/me
GET /api/auth/session-expired

ANY /api/admin/[...path]

The admin proxy must correctly forward requests to:

http://localhost:8000/api/v1


Verify:

- HTTP method forwarding
- headers
- Authorization
- cookies
- request body
- query parameters
- response status
- response body
- error responses


========================================================
PHASE 8 — AUTHENTICATION
========================================================

Verify complete authentication flow:

Login
↓
Token/session
↓
GET /auth/me
↓
Frontend session state
↓
Protected pages
↓
API authorization


Implement/fix:

- login
- logout
- session restoration
- session expiration
- unauthorized handling
- protected routes
- current user
- organization scope
- role permissions

Do NOT bypass authentication for development.


========================================================
PHASE 9 — RBAC / DATA SCOPE
========================================================

Verify roles and permissions.

Ensure users cannot access data outside their authorized organization/scope.

Apply authorization consistently to:

- organizations
- departments
- employees
- attendance
- duties
- reports
- exports
- sensitive evidence
- administration


========================================================
PHASE 10 — LOADING / EMPTY / ERROR STATES
========================================================

The frontend already has the visual states.

Connect them to REAL API states.

Every page must distinguish:

LOADING
EMPTY
SUCCESS
ERROR
UNAUTHORIZED
FORBIDDEN
OFFLINE / NETWORK ERROR

Never show fake success when the API fails.

Never show empty data when the API request actually failed.

Never show mock records.


========================================================
PHASE 11 — ERROR HANDLING
========================================================

Create one consistent API error handling system.

Handle:

400
401
403
404
409
422
429
500
502
503
network timeout

Use the backend's real error response.

Show user-friendly messages in the existing UI.

Do not expose stack traces or sensitive backend details.


========================================================
PHASE 12 — ATTENDANCE INTEGRITY
========================================================

Preserve the event-based attendance architecture.

Do NOT silently modify historical attendance.

Attendance must support:

- check-in
- periodic verification
- check-out
- correction request
- approval
- exceptions
- offline synchronization
- idempotency
- duplicate protection
- replay protection

Offline events must preserve:

- event ID
- device reference
- local capture time
- server receive time
- sync state
- evidence references
- integrity information where implemented


========================================================
PHASE 13 — POSTGIS / LOCATION
========================================================

Verify PostGIS integration.

Verify:

- locations
- geofences
- geofence versions
- location evidence
- location events
- routes
- checkpoints

Verify spatial queries and indexes.

Do not invent GPS data.

Do not silently accept invalid location evidence.


========================================================
PHASE 14 — SECURITY
========================================================

Audit:

- authentication
- authorization
- password handling
- tokens
- session management
- CORS
- CSRF where applicable
- SQL injection protection
- input validation
- file upload validation
- rate limiting
- sensitive data access
- audit logging
- security events
- secrets

CORS must explicitly allow the actual frontend origin(s); do not use an unsafe wildcard configuration with credentials.

Never commit:

- passwords
- JWT secrets
- database passwords
- API keys
- encryption keys
- cloud credentials


========================================================
PHASE 15 — ENVIRONMENT CONFIGURATION
========================================================

Create/verify:

.env.example

Separate:

Development
Testing
Production

Variables should cover:

DATABASE_URL
API_BASE_URL
NEXT_PUBLIC_API_BASE_URL
AUTH configuration
JWT/session configuration
CORS origins
PostGIS configuration
Redis configuration if used
Object storage configuration if used
External integrations

Never hardcode localhost URLs into production code.


========================================================
PHASE 16 — DATABASE MIGRATIONS
========================================================

Verify Alembic.

Run:

alembic upgrade head

against a test/development database.

Verify:

- clean migration
- fresh database
- existing database upgrade
- rollback where supported

Do not destroy production data.


========================================================
PHASE 17 — TESTING
========================================================

Create/run tests for:

UNIT TESTS

- services
- validation
- permissions
- business rules


API TESTS

- authentication
- organizations
- employees
- departments
- rosters
- attendance
- duties
- reports


INTEGRATION TESTS

Frontend
→ API
→ FastAPI
→ Database


REGRESSION TESTS

Ensure existing working features still work.


========================================================
PHASE 18 — API CONTRACT VALIDATION
========================================================

Start FastAPI.

Verify:

/health
/docs
/openapi.json

FastAPI automatically generates the OpenAPI schema from registered routes, so compare the actual generated paths against the required API contract.

Create an automated API audit.

For every required endpoint report:

METHOD
PATH
ROUTER
SERVICE
SCHEMA
MODEL
STATUS


========================================================
PHASE 19 — MOBILE API VALIDATION
========================================================

Verify Flutter endpoints:

POST /api/v1/auth/login
GET /api/v1/auth/me

GET /api/v1/attendance/today
GET /api/v1/attendance/status/current
GET /api/v1/attendance/sessions
GET /api/v1/attendance/sessions/{session_id}

POST /api/v1/attendance/check-in
POST /api/v1/attendance/check-out
POST /api/v1/attendance/events
POST /api/v1/attendance/offline-sync

GET /api/v1/my/duty/today
GET /api/v1/my/duty/upcoming


Do not break the mobile API contract while completing the web application.


========================================================
PHASE 20 — PERFORMANCE
========================================================

Check:

- unnecessary database queries
- N+1 queries
- pagination
- indexes
- slow API endpoints
- large API responses
- frontend unnecessary requests
- duplicate requests
- caching where already appropriate

Use pagination for large employee/attendance/report datasets.

Do not overengineer with unnecessary microservices.


========================================================
PHASE 21 — LOGGING & OBSERVABILITY
========================================================

Implement/verify structured logging.

Every API request should be traceable with:

request_id

Log:

- request
- response status
- duration
- errors
- important security events

Do NOT log:

- passwords
- tokens
- biometric data
- sensitive personal information unnecessarily


========================================================
PHASE 22 — AUDIT LOGGING
========================================================

Verify audit events for important operations:

- login
- logout
- employee creation/update/deletion
- organization changes
- role changes
- attendance corrections
- approvals
- exports
- sensitive-data access
- policy changes
- integration changes

Audit records should remain traceable and should not be casually deleted.


========================================================
PHASE 23 — FILES / EVIDENCE
========================================================

If the application handles:

- selfies
- documents
- task proofs
- biometric references
- media evidence

Do not store large binary evidence directly in normal relational tables unless the existing architecture explicitly requires it.

Database should maintain controlled references/metadata according to the existing design.

Verify:

- upload validation
- access control
- hashes
- retention status
- secure retrieval


========================================================
PHASE 24 — REPORTS / EXPORTS
========================================================

Verify every report endpoint.

Exports must:

- use real database data
- respect authorization
- respect organization scope
- use correct date ranges
- handle empty results
- return correct content type
- not expose unauthorized employee information


========================================================
PHASE 25 — DOCKER / LOCAL DEVELOPMENT
========================================================

Create/verify a reproducible local environment.

Services where applicable:

frontend
backend
postgres
postgis
redis

Use Docker Compose if already part of the architecture.

Provide one clear startup flow.

Example:

docker compose up

Then verify:

Frontend
Backend
Database


========================================================
PHASE 26 — PRODUCTION BUILD
========================================================

Frontend:

npm run build

Backend:

start with production ASGI configuration.

Verify:

- production environment variables
- CORS
- database connection
- migrations
- health endpoint
- logs
- restart behavior


FastAPI deployment requires attention to HTTPS, startup/restarts, resources and production process configuration.


========================================================
PHASE 27 — FINAL END-TO-END TEST
========================================================

Test the actual user journey:

LOGIN
↓
DASHBOARD
↓
EMPLOYEES
↓
CREATE EMPLOYEE
↓
EMPLOYEE LIST
↓
SHIFT
↓
ROSTER
↓
DUTY
↓
ATTENDANCE
↓
VERIFICATION
↓
EXCEPTION
↓
APPROVAL
↓
REPORT
↓
EXPORT
↓
LOGOUT


Every step must use REAL backend/database data.


========================================================
PHASE 28 — NO FAKE DATA
========================================================

CRITICAL:

Do not add demo employees.

Do not add fake attendance.

Do not add fake GPS points.

Do not add fake verification results.

Do not add fake dashboard numbers.

Do not add mock reports.

If database is empty, show the existing empty states.

The software must represent actual system state.


========================================================
PHASE 29 — FINAL COMPLETION REPORT
========================================================

At the end create:

GOVTRACK360_COMPLETION_REPORT.md

Include:

1. FRONTEND
   COMPLETE — UI/UX frozen

2. API
   total endpoints
   implemented
   missing
   fixed
   broken

3. SERVICES
   implemented
   reused
   created

4. DATABASE
   migrations
   tables
   indexes
   constraints

5. AUTHENTICATION
   status

6. RBAC
   status

7. NEXT.JS PROXY
   status

8. MOBILE API
   status

9. ATTENDANCE
   status

10. DUTY / ROSTER
   status

11. REPORTS
   status

12. SECURITY
   status

13. TESTS
   unit
   integration
   API
   end-to-end

14. DEPLOYMENT
   status

15. REMAINING BLOCKERS

Only mark the software COMPLETE if all critical production paths actually work.

Do not mark something complete merely because the code exists.


========================================================
FINAL RULE
========================================================

FRONTEND = FROZEN.

DO NOT REDESIGN IT.

Focus entirely on:

DATABASE
↓
SERVICES
↓
FASTAPI
↓
NEXT.JS API CONNECTION
↓
AUTH
↓
RBAC
↓
REAL DATA
↓
ERROR HANDLING
↓
TESTING
↓
SECURITY
↓
MOBILE API
↓
DEPLOYMENT
↓
END-TO-END VERIFICATION

The final objective is:

A REAL, WORKING GOVTRACK360 SYSTEM

—not a UI demo.
