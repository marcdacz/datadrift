## Reports and Report Consumption Userflow

### Overview
This userflow describes how reports are surfaced to end users via the dashboard, and how they relate to automation actions that generate and distribute reports.

### Roles and Access
- **Admin** and **Manager**:
  - Can configure automations that generate and share reports.
  - Can see the dashboard reports table, including reports they have access to.
- **User**:
  - Can view and download reports that have been shared with them.
  - Cannot configure automations.

### Reports on the Main Page / Dashboard

#### Location
- On the **Main Page / Dashboard**, there is a **Reports** section.
- This section is visible to all roles (Admin, Manager, User), but the contents depend on which reports are shared with the current user.

#### Empty State
- When there are no reports available to the current user:
  - Show an **empty table of reports**:
    - Columns are visible but there are no rows.
  - No CTAs for creating reports are shown for Users.
  - For Admins/Managers, the primary path to generating reports is via **Automations**, not directly from this table.

#### Non-Empty State
- When reports exist:
  - Show a **Reports table** with one row per report accessible to the current user.
  - Columns:
    - **Name**
    - **Description**
    - **Author**
    - **Download link** (or combined view/download action)
- Behaviour:
  - Clicking the download link triggers a download (or opens a viewer, depending on the file type and implementation).
  - Reports can be in various formats (CSV, JSON, XML, YML, PDF) as determined by automations.

### Relationship to Automations

#### Report Generation
- Reports are primarily generated via **Automation actions**:
  - Supported generation actions:
    - Generate **CSV**, **JSON**, **XML**, **YML**, or **PDF** report.
  - When these actions run:
    - A report artifact is created from a Data View.
    - The report is associated with:
      - The automation that generated it.
      - The time of generation.
      - One or more target recipients (users or channels).

#### Report Sharing
- Automation **Actions** related to sharing:
  - **Share report to user**
    - Makes the report available in the dashboard Reports table for the specified user(s).
  - **Send report to Email, Slack, or Microsoft Teams**
    - Sends the report or a link to the report to the specified channel.
    - The UI should document that the report is being sent out-of-band (email or messaging), while the underlying artifact may still be accessible from the app if designed that way.

### User Experience by Role

#### Admin / Manager
- Can:
  - See reports generated and shared with them.
  - Configure automations that:
    - Generate new reports.
    - Share reports to specific users or teams.
    - Send reports via external channels.
- In the dashboard Reports table:
  - Admins/Managers may see more reports (e.g. those they created, those shared with them, or those shared broadly).

#### User
- Cannot configure automations or direct report generation.
- Sees:
  - Only reports that have been explicitly shared with them through automation actions.
- In the dashboard:
  - The Reports table lists accessible reports with name, description, author, and download link.

### Error Handling

#### Missing or Unavailable Reports
- If a report entry exists but the underlying file is missing or cannot be fetched:
  - Show an error when the user attempts to download.
  - Optionally display an inline status (e.g. “Unavailable”) in the table row.

#### Permission Issues
- If a user attempts to access a report that they are not authorized to see (e.g. via direct URL):
  - Show a “Not authorized” message.
  - Redirect back to the dashboard.

