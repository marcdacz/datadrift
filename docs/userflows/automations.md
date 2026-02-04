## Automations Userflow

### Overview
This userflow covers how Managers and Admins create, manage, validate, and delete Automations that act on Data Views, as well as how they duplicate and enable/disable them.

### Access and Navigation
- **Who can access**: Managers and Admins.
- **Navigation path**:
  1. From the top navbar, click **Settings**.
  2. In the Settings left sidebar, click **Automation**.

### List View

#### Empty State
- When there are no Automations yet:
  - Display message:  
    - *“No available Automation yet. Get started by creating your first Automation.”*
  - Show primary CTA:
    - **Add Automation**

#### Non-Empty State
- Show an **Automations table** listing all existing automations.
- Each row should include:
  - Name
  - Status (Enabled / Disabled)
  - Last run status
  - Last modified
  - Actions
- **Top bar actions**:
  - **Create automation**
  - **Duplicate automation**

#### Row Actions
- For each Automation:
  - **Edit**
  - **Delete**
  - **State toggle** (Enable/Disable switch)
  - **Audit logs** (link to automation-specific execution logs)

### Creating a New Automation

#### Entry Points
- From the empty state, click **Add Automation**.
- From the list view, click **Create automation**.

#### Automation Details
- On the Automation builder page:
  - Fields:
    - **Name** (required, must be unique).
    - **Enabled toggle** (switch to enable or disable the automation).

#### Builder Components
Each automation consists of the following logical components:

1. **Trigger (Mandatory)**
   - Only **one** Trigger component is allowed per automation.
   - Must be added at the very beginning.
   - Supported options:
     - **Scheduled**
       - Settings for:
         - Frequency (e.g. hourly, daily, weekly).
         - Day and time selections as needed.
     - **Webhooks**
       - Appears as an option but is **not to be implemented for now**.

2. **Branch (Optional)**
   - A Branch component can be added that contains its own internal **Conditions** and **Actions**.
   - Branch types:
     - **If**
     - **Else-if**
     - **Else**
   - Branches determine which Conditions/Actions are evaluated when the automation runs.

3. **Conditions (Optional)**
   - Conditions can be grouped and combined:
     - Individual conditions can be grouped using **AND** or **OR**.
     - Groups of conditions can also be combined using **AND** or **OR**.
   - Condition options:
     - Data view conditions 
       - **SQL condition**  
       - **Field/Column value conditions**:
         - contains
         - equals
         - greater than
         - greater than or equal
         - less than
         - less than or equal

4. **Actions (Mandatory)**
   - At least one Action must be defined.
   - Action options:
     - Generate **CSV**, **JSON**, **XML**, **YML**, or **PDF** report.
     - Share report to a user.
     - Send report to **Email**, **Slack**, or **Microsoft Teams**.

### Builder Actions

#### Page-Level Actions
- Buttons at the bottom of the builder:
  - **Save**
  - **Validate**
  - **Cancel**

##### Validate Behaviour
- When **Validate** is clicked:
  - The system checks that:
    - All mandatory components are present (e.g. one Trigger, at least one Action).
    - Component configurations are complete and valid.
  - Managers can **mock the conditions set**:
    - UI allows input of sample values for conditions.
    - Validation result shows whether the automation would execute correctly under those mocked conditions.
  - Show validation output:
    - Success message if everything is valid.
    - Specific errors pointing to misconfigured components if not.

##### Save Behaviour
- When **Save** is clicked:
  - Validate mandatory fields and structure:
    - Unique name.
    - Trigger present.
    - At least one Action.
  - On success:
    - Persist the automation definition and enabled/disabled state.
    - Show a success notification.
    - Redirect the user back to the **Automations list**.

##### Cancel Behaviour
- When **Cancel** is clicked:
  - Discard unsaved changes.
  - Redirect back to the **Automations list**.

### Duplicating an Automation

#### Entry Point
- From the list view top bar, click **Duplicate automation**, or
- Select an automation and choose a Duplicate action (depending on final UI layout).

#### Behaviour
- When duplicating:
  - Opens a popup dialog with dropdown for existing automations. Dropdown can be used as a filter as well to quickly find the automation.
  - Open the automation builder page with fields **pre-filled** from the source automation.
  - The **Name** field is pre-filled as:
    - `Copy of <original automation name>`
  - All components (Trigger, Branches, Conditions, Actions) are copied.
  - The user can adjust anything before saving.
  - On Save:
    - Enforce unique name.
    - Persist as a new automation.

### Editing an Automation

#### Entry Point
- From the Automations table, click **Edit** for a specific automation.

#### Behaviour
- Open the automation builder page pre-filled with the existing automation:
  - Existing Trigger.
  - Branches.
  - Conditions.
  - Actions.
  - Name and Enabled toggle.
- The user can:
  - Change configuration of existing components.
  - Add or remove branches, conditions, and actions.
  - Adjust the Enabled toggle.
- On Save:
  - Validate the configuration.
  - Update the automation.
  - Show success notification and redirect to the Automations list.

### Enabling/Disabling an Automation

#### Entry Point
- From the Automations table, use the **State toggle** (switch) on each row.

#### Behaviour
- Toggling:
  - **On**: marks the automation as active; it will run based on its Trigger.
  - **Off**: disables execution until re-enabled.
- Toggle actions should:
  - Provide immediate visual feedback (e.g. updated status).
  - Optionally show a small toast (“Automation disabled” / “Automation enabled”).

### Deleting an Automation

#### Entry Point
- From the Automations table, click **Delete** for a specific automation.

#### Behaviour
1. Show a confirmation dialog:
   - “Are you sure you want to delete this automation?”
2. On confirmation:
   - Delete the automation.
   - Redirect or refresh back to the updated Automations list.

