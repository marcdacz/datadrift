## Data Views Userflow

### Overview
This userflow describes how Managers and Admins configure Data Views that sit on top of Data Sources. Data Views are used by visualisations and automations.

### Access and Navigation
- **Who can access**: Managers and Admins.
- **Navigation path**:
  1. From the top navbar, click **Settings**.
  2. In the Settings left sidebar, click **Data View**.
  3. Alternatively, Managers/Admins can click the “+” button beside the Data View dropdown when configuring a visualisation, which opens the Add Data View flow.

### List View

#### Empty State
- When there are no Data Views yet:
  - Display message:  
    - *“No available Data Views yet. Get started by creating your first Data View.”*
  - Show primary CTA:
    - **Add Data View**

#### Non-Empty State
- Show a **Data Views table** listing existing views.
- Each row should include:
  - Name
  - Related Data Source
  - Type (Basic / Advanced)
  - Last updated
  - Actions (Edit, Delete)
- **Top bar actions**:
  - **Create data view** (note: source text says “Create data source” but this should be implemented as create data view).

#### Row Actions
- For each Data View:
  - **Edit**
  - **Delete**

### Adding a Data View

#### Entry Points
- Click **Add Data View** from the empty state.
- Click **Create data view** from the list view.
- Click the **“+” button** beside the Data View dropdown in the visualisation settings pane.

#### Add Data View Wizard
- Step 1: **Mode selection**
  - **Basic**:
    - Allows users to select multiple fields based on the underlying Data Source.
  - **Advanced**:
    - Allows users to enter a SQL query directly.

##### Basic Mode
- Fields:
  - Name (required).
  - Data Source (dropdown from configured data sources).
  - Field/column multi-select from the chosen Data Source.
  - Optional filters or sort order (future extensions).

##### Advanced Mode
- Fields:
  - Name (required).
  - Data Source or Connection context as needed.
  - **SQL query editor**:
    - Text area with **syntax highlighting** for SQL.
    - Query **validated for correctness** (e.g. simple syntax check and/or backend validation).

#### Actions
- Buttons at the bottom of the wizard:
  - **Create**
  - **Preview**
  - **Cancel**

##### Preview Behaviour
- When **Preview** is clicked:
  - Run the Data View query/definition.
  - Show a preview table/grid of the result set.
  - Surface validation or query errors inline.

##### Create Behaviour
- When **Create** is clicked:
  - Validate required fields.
    - Name cannot be empty.
    - Data Source must be selected.
    - For Advanced mode, SQL query must pass validation.
  - On success:
    - Persist the Data View definition.
    - Show success notification.
    - Redirect to the **Data Views list** (or back to the context from which it was opened, e.g. visualisation editor).

##### Cancel Behaviour
- When **Cancel** is clicked:
  - Discard unsaved changes.
  - Redirect back to the previous context (typically Data Views list, or visualisation settings if opened from there).

### Editing a Data View

#### Entry Point
- From the Data Views table, click **Edit** for a specific Data View.

#### Edit Form
- Same structure as the Add Data View wizard.
- All fields are **pre-filled** with the existing Data View details:
  - Name
  - Selected Data Source
  - Selected fields (Basic) or SQL query (Advanced).

#### Behaviour
- User can adjust fields, filters, or SQL query.
- **Preview** should still be available to verify changes.
- On **Save** (or Create in edit mode):
  - Validate inputs as in the add flow.
  - Persist changes.
  - Show success notification and return to Data Views list (or calling context).

### Deleting a Data View

#### Entry Point
- From the Data Views table, click **Delete** for a specific Data View.

#### Constraints
- Managers/Admins are **only allowed to delete** a Data View that is **not used by any Automations**.

#### Behaviour
1. On clicking **Delete**:
   - If the Data View is used by one or more Automations:
     - Show a **warning popup**:
       - Explain that the Data View cannot be deleted because it is in use.
       - List all Automations that reference this Data View.
     - Deletion is blocked until those dependencies are removed or updated.
   - If the Data View is **not used**:
     - Show a confirmation dialog (“Are you sure you want to delete this Data View?”).
     - On confirmation, delete the Data View.
     - Redirect or refresh back to the updated **Data Views list**.

