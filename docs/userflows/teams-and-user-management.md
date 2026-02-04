## Teams and User Management Userflow

### Overview
This userflow describes how Admins manage users and roles via the **Team** settings section.

### Access and Navigation
- **Who can access**: Admin only.
- **Navigation path**:
  1. From the top navbar, click **Settings**.
  2. In the Settings left sidebar (Admin-only section), click **Team**.

### List View

#### General Behaviour
- There is always at least one user: the default **Admin**.
- Therefore, there is **no empty state** for the Team page.

#### Table Contents
- Display a table of users with:
  - Name
  - Email
  - Role (Admin, Manager, User)
  - Status (e.g. active / invited)
  - Actions (e.g. edit, resend invite – if implemented later)

#### Top-Level Actions
- **Add user** (primary action).

### Role Constraints
- **Admin should not be able to edit their own permissions**:
  - When viewing their own user row:
    - Role field is not editable, or edit role action is disabled.
  - Other profile fields (e.g. name) may be editable if desired, but role changes for self are disallowed.

### Adding a User

#### Entry Point
- Click **Add user** at the top of the Team page.

#### Add User Form
- Fields:
  - Email address (required).
  - Role (dropdown: Admin, Manager, User) – required.
  - Optional fields (e.g. name) as desired.

#### Behaviour
- Validate required fields:
  - Email must be present and in a valid format.
  - Role must be selected.
- **Email implementation will be for later**:
  - For now, focus on capturing the user and role in the system.
  - The UI should still reflect that an invitation would be sent in a later phase, but actual sending can be stubbed.

#### Actions
- Buttons at bottom:
  - **Save** (or **Invite**) – label can be future-proofed.
  - **Cancel**.

##### Save / Invite Behaviour
- When Save/Invite is clicked:
  - If validation passes:
    - Create a new user entry with the specified email and role.
    - Mark it as invited/pending if invitation semantics are used.
    - Show a success notification.
    - Redirect back to the Team list with the new user visible.
  - If validation fails:
    - Do not submit.
    - Show inline error messages.

##### Cancel Behaviour
- When Cancel is clicked:
  - Discard unsaved changes.
  - Navigate back to the Team list.

### Editing Other Users

#### Entry Point
- From the Team list, click an **Edit** action for a user (other than the current Admin).

#### Edit Form
- Similar layout to Add User form.
- Fields are pre-filled with the existing user information.

#### Behaviour
- Admin can:
  - Change role (Admin, Manager, User) for other users.
  - Update email or other metadata if allowed.
- On Save:
  - Validate inputs.
  - Persist changes.
  - Show success notification.
  - Return to Team list.

### Deactivation / Removal (Future Consideration)
- If user deactivation or removal is required later:
  - Add actions to deactivate or remove users with appropriate confirmation dialogs.
  - Consider constraints if the user is the last remaining Admin (prevent leaving the system without any Admin).

