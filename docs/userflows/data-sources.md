## Data Sources Userflow

### Overview
This userflow describes how Admins manage Data Sources in the Settings section: listing existing sources, adding new ones, editing, testing connections, and deleting.

### Access and Navigation
- **Who can access**: Admin only.
- **Navigation path**:
  1. From the top navbar, click **Settings** (visible to Admin and Manager).
  2. In the Settings left sidebar, click **Data Sources** (Admin-only item).

### List View

#### Empty State
- When there are no Data Sources yet:
  - Display message:  
    - *“No available Data Sources yet. Get started by creating your first Data Source.”*
  - Show primary CTA:
    - **Add Data Source**

#### Non-Empty State
- Show a **Data Sources table** listing all configured data sources.
- The table should include:
  - Name
  - Type (e.g. DB, CSV, JSON, REST)
  - Status pill (e.g. Connected (green) / Failed (red) / Not tested (gray))
  - Last updated
  - Actions
- **Top bar actions**:
  - **Create data source** (primary action)

#### Row Actions
- For each data source in the table:
  - **Edit**
  - **Test connection**
  - **Delete**

### Adding a Data Source

#### Entry Points
- Click **Add Data Source** from the empty state.
- Click **Create data source** from the table view.

#### Add Data Source Form
- **Common fields**
  - Name (must be unique).
  - Description (optional).
  - Data source type (dropdown).
- **Type-specific configurations**
  - **Database (DB)**
    - DB type dropdown:
      - PostgreSQL
      - MySQL
      - SQL Server
      - Oracle
    - Host (pre-filled defaults per DB type where applicable).
    - Port (pre-filled defaults per DB type).
    - Database name.
    - Username.
    - Password/credentials.
  - **CSV**
    - File path.
    - Encoding type (dropdown).
  - **JSON**
    - File path.
    - Encoding type (dropdown).
  - **REST API**
    - Base URL or endpoint URL.
    - Headers (key/value pairs).

#### Validation and Inline Errors
- All required fields must be validated:
  - Show **inline errors** when required fields are empty or invalid.
  - Mark invalid inputs and show clear error messages.
- **Name uniqueness**:
  - Test must ensure that the data source name is unique.
  - If the name already exists, display an inline error.

#### Actions
- Buttons at the bottom of the form:
  - **Create**
  - **Test Connection**
  - **Cancel**

##### Test Connection Behaviour
- **Create** button is **disabled** unless Test Connection is successful.
- After clicking **Test Connection**:
  - If successful:
    - Show a success indicator (e.g. green tick and success message).
    - Allow the user to click **Create**.
  - If failed:
    - Show a failure indicator (e.g. red cross and error message).
    - Allow the user to review and correct configuration fields.
- Any change to relevant configuration fields **disables** the **Create** button again until a new successful test is run.

##### Create Behaviour
- When **Create** is clicked:
  - If validation passes and the connection was successfully tested:
    - Persist the new data source.
    - Show a success notification (toast or inline).
    - Redirect the user back to the **Data Sources list**.
  - If validation fails:
    - Do not submit.
    - Show inline errors.

##### Cancel Behaviour
- When **Cancel** is clicked:
  - Discard unsaved changes.
  - Redirect back to the **Data Sources list**.

### Editing a Data Source

#### Entry Point
- From the Data Sources table, click **Edit** for a specific row.

#### Edit Form
- Same layout and fields as the **Add Data Source** form.
- All fields are **pre-filled** with the existing data source configuration.
- Credentials are masked and are disabled. Will be enabled by the **Update password button** which also clears the current password.

#### Behaviour
- User can modify configuration fields.
- Test Connection behaviour and validation are the same as for adding a data source:
  - User should be able to re-run **Test Connection**.
  - **Save** (or **Update**) action should require a successful connection test if connection-related fields changed.
  - If the name is changed, uniqueness must be enforced.

### Testing Connection (From List)

#### Entry Point
- From the Data Sources table, click **Test connection** for a specific row.

#### Behaviour
- Run connection test using the stored configuration.
- Show:
  - **Green tick** (or success status) if successful.
  - **Red cross** if failed, with an **expandable error message** that explains the failure.
- Optionally update the “Status” column to reflect the result.

### Deleting a Data Source

#### Entry Point
- From the Data Sources table, click **Delete** for a specific row.

#### Constraints
- Managers/Admins are **only allowed to delete** a data source **that is not used by any Data Views**.

#### Behaviour
1. On clicking **Delete**:
   - If the data source **is used** by one or more Data Views:
     - Show a **warning popup**:
       - Explain that the Data Source cannot be deleted because it is in use.
       - List all Data Views related to this data source.
     - Deletion is blocked until dependencies are removed.
   - If the data source **is not used**:
     - Show a confirmation dialog (“Are you sure you want to delete this Data Source?”).
     - On confirmation, delete the data source.
     - Redirect or refresh back to the updated **Data Sources list**.

