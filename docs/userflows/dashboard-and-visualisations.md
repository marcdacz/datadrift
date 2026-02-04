## Dashboard and Visualisations Userflow

### Overview
This userflow describes what happens for all user types (Admin, Manager, User) after login: the main dashboard, visualisation area, reports table, and execution logs section.

### Roles and Permissions
- **Admin**: Can create and edit visualisations, automations, data sources, data views, teams. Sees execution logs.
- **Manager**: Can create and edit visualisations, automations, data views. Sees execution logs.
- **User**: Read-only access to visualisations and reports shared with them. No access to settings or execution logs.

### Entry Point
1. User logs in via the login page (email/password).
2. On successful authentication, user is redirected to the **Main Page / Dashboard**.

### Top Navbar
- **Left**: DataDrift logo and app name.
- **Right**:
  - **Settings link**: Visible only for Admin and Manager roles. Navigates to the Settings section (Data Sources, Teams, Data Views, Automations).
  - **User profile avatar**: Visible to all user types. Used to access account-related actions (e.g. future profile/preferences).

### Main Page Content (Shared Layout)
The main page always contains three conceptual areas:
1. **Visualisation area**
2. **Reports table**
3. **Execution logs table** (Admins and Managers only)

#### Empty State Behaviour
1. **Visualisation area (no visualisations yet)**
   - For **Users**:
     - Message: *“Your Data Manager haven't created any charts yet.”*
     - No create buttons are shown.
   - For **Managers/Admins**:
     - Message: *“You haven't created any charts yet. Get started by creating your first visualisation.”*
     - Visible Call-To-Action (CTA) buttons:
       - **Add Visualisation**
       - **Add Automation**

2. **Reports**
   - Empty table with no rows.
   - Columns are visible but contain no data.

3. **Execution logs** (Managers/Admins only)
   - Empty table with headers but no rows.

#### Non-Empty State Behaviour
1. **Visualisation area**
   - Visualisations are displayed on the grid at the positions where they were configured.
   - Each visualisation tile/card:
     - Shows a title.
     - Shows visualisation content (table, chart, text, etc.).
     - May show quick actions (e.g. edit, remove, resize) for Managers/Admins in edit mode.

2. **Reports table**
   - Displays reports that are shared with or accessible by the current user.
   - Columns:
     - **Name**
     - **Description**
     - **Author**
     - **Created Date**
     - **Download link** (or view/download action)

3. **Execution logs** (Managers/Admins only)
   - Table of automation executions.
   - Each row includes:
     - Execution datetime
     - Automation name
     - **Status pill**:
       - Green for successful runs.
       - Red for failed runs.
     - Action to expand and view error details for failed runs.

### Creating and Editing Visualisations

#### Entry Points
- From the dashboard empty state CTA: **Add Visualisation** (Managers/Admins).
- From a toolbar/menu when visualisations already exist (Managers/Admins).

#### Flow
1. Manager/Admin clicks **Add Visualisation**.
2. User is redirected to **Edit Mode** for the dashboard:
   - A grid layout is shown where components can be placed.
   - A panel or toolbar lists available visualisation types.
3. User selects and **drags-and-drops** a visualisation type into the grid.
4. User can **resize** the visualisation within the grid.
5. When a visualisation is selected:
   - A **settings tab/pane** appears on the right-hand side.
   - The settings pane includes:
     - **Data view selection dropdown**.
     - **“+” button next to data view dropdown** to quickly add a new Data View (opens Data View creation flow).
     - Column selection/configuration UI.
     - Visualisation-type-specific configuration (e.g. series, labels, aggregations).

#### Supported Visualisation Types (MVP)
- Table
- Pie chart
- Bar chart
- Line chart
- Text

### Save / Cancel Behaviour
- When the user saves visualisation changes:
  - Grid layout and individual visualisation settings are persisted.
  - User is redirected back to the main page showing the updated dashboard.
- When the user cancels:
  - No changes are persisted.
  - User is redirected back to the previous view or dashboard.

### Validation and Error Handling
- If a visualisation uses an invalid or deleted Data View, show:
  - A clear error state on that visualisation tile.
  - An action for Managers/Admins to reconfigure the data view.
- Network or server errors:
  - Show non-blocking error toasts or inline messages.
  - Allow retries where appropriate.

