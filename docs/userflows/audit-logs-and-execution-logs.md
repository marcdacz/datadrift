## Audit Logs and Execution Logs Userflow

### Overview
This userflow describes how Managers and Admins view and work with execution and audit logs, both globally on the main page and for a specific Automation.

### Roles and Access
- **Who can access**: Managers and Admins.
- **Users** (non-manager) do **not** see execution or audit logs.

### Global Execution Logs on the Main Page

#### Location
- On the **Main Page / Dashboard**, there is an **Execution logs** section.
- Visible only to Managers and Admins.

#### Empty State
- When there are no execution logs yet:
  - Display an empty table with headers but no rows.
  - This indicates that no automations have run yet.

#### Non-Empty State
- Show a table of executions with, at minimum:
  - Execution time.
  - Automation name.
  - Status.
  - Optional additional metadata (duration, triggered by, etc.).

#### Status Display
- Each execution row contains a **status pill**:
  - **Green** pill for successful runs.
  - **Red** pill for failed runs.
- For failed runs:
  - Managers can **expand** to view an error message describing what went wrong.

### Automation-Specific Audit Logs

#### Access from Automations List
- In the **Automations** settings section, each automation row includes an **Audit logs** action/link.
- Clicking this opens an audit log view focused on that specific automation.

#### Audit Log View
- Shows a table of execution logs **for the selected automation**.
- Columns can include:
  - Execution time.
  - Status (success/failure).
  - Trigger type (optional).
  - Error message (if any).

#### Filters
- To maximize reuse and consistency:
  - Use a **single audit logs view** component with filters.
  - Controls at the top:
    - **Automation name filter** (dropdown or search).
    - **Date/time filters** (from/to or relative ranges).
- For the automation-specific view:
  - The **automation name filter is pre-filled** with the selected automation’s name.
  - Users can adjust filters if they want to see a broader view.

### Reuse in Main Page Execution Logs

#### Shared Component
- The main page’s execution logs can reuse the same underlying audit logs component.
- Differences:
  - On the main page, the default filter may be:
    - “All automations”.
    - Date/time filter set to a recent range.
  - On the automation-specific page:
    - Automation filter pre-filled to a single automation.

### Error Details

#### Failed Executions
- For unsuccessful runs:
  - Rows should have an affordance (e.g. expand/collapse, “View error” button).
  - Expanding shows:
    - Error message text.
    - Optionally, additional diagnostic details (error codes, stack snippets, etc. if available).

### Navigation Summary
- From **Dashboard**:
  - Managers/Admins see a global **Execution logs** section.
  - Can scroll and inspect recent runs and failures.
- From **Settings → Automation**:
  - Managers/Admins can open **Audit logs** for a specific automation.
  - They see a filtered view of the same logs with pre-filled automation filter.

