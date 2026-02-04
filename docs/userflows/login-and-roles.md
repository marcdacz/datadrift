## Login and Roles Userflow

### Overview
This userflow covers how users access the application via the login page and how their role (Admin, Manager, User) determines what they can see and do in the UI.

### Roles
- **Admin**
  - Can manage system settings including:
    - Data Sources
    - Teams (user management)
    - Data Views
    - Automations
  - Can create charts/visualisations and report templates.
  - Can see execution/audit logs.
- **Manager**
  - Can manage:
    - Data Views
    - Automations
  - Can create charts/visualisations and report templates.
  - Can see execution/audit logs.
- **User**
  - Can view charts/visualisations shared with them.
  - Can view and download reports shared with them.
  - Cannot access Settings or manage data sources, data views, automations, or teams.

### Login Page

#### Entry Point
- Unauthenticated visitors are shown the **Login page**.
- If an authenticated user hits the login route, they are redirected to the main page/dashboard.

#### UI Elements
- **Email input**
- **Password input**
- **Login button**
- (Optional future element) “Forgot password” link – not required for current scope.

#### Behaviour
1. User enters email and password.
2. On clicking **Login**:
   - Validate required fields (email and password cannot be empty).
   - Show inline errors if validation fails.
   - If credentials are invalid:
     - Show an error message (e.g. “Invalid email or password”).
   - If credentials are valid:
     - Store authentication state (e.g. token/session).
     - Redirect to the **Main Page / Dashboard**.

### Post-Login Landing Experience

#### Main Page Layout
After a successful login, all roles land on the same **Main Page / Dashboard**, which consists of:
- Top navbar
- Visualisation area
- Reports table
- Execution logs (Admins/Managers only)

#### Top Navbar Behaviour
- **Left side**
  - DataDrift logo
  - Application name
- **Right side**
  - **Settings link**:
    - Visible **only** to Admin and Manager roles.
    - Opens Settings section where available subsections depend on role:
      - Admin: Data Sources, Team, Data View, Automation.
      - Manager: Data View, Automation.
  - **User profile avatar**:
    - Visible to all roles.
    - Used as an entry point for future account actions (e.g. profile, logout, preferences).

### Role-Based Access Summary

#### Admin
- **Dashboard**
  - Can see and interact with visualisations.
  - Sees reports table.
  - Sees execution logs table.
- **Settings**
  - Data Sources
  - Team
  - Data View
  - Automation

#### Manager
- **Dashboard**
  - Can see and interact with visualisations.
  - Sees reports table.
  - Sees execution logs table.
- **Settings**
  - Data View
  - Automation

#### User
- **Dashboard**
  - Sees visualisations shared with them.
  - Sees reports shared with them in the reports table.
  - **Does not** see execution logs.
- **Settings**
  - No access; Settings link is hidden.

### Error States and Edge Cases
- If an authenticated user with a certain role attempts to access a restricted route directly:
  - Show a “Not authorized” message and/or redirect to the dashboard.
- Session expiration:
  - If the session expires, redirect to the login page and prompt for re-authentication.

