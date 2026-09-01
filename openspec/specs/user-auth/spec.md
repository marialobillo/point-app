# user-auth Specification

## Purpose

Provides email/password authentication via Supabase Auth so every task can be tied to a specific signed-in user, including signup, login, session detection, and logout.

## Requirements

### Requirement: Email/password signup
The system SHALL allow a new user to create an account with an email and password via Supabase Auth.

#### Scenario: Successful signup
- **WHEN** a user submits a valid, unused email and a password meeting Supabase Auth's minimum requirements
- **THEN** a new Supabase Auth user SHALL be created
- **AND** the user SHALL end up in an authenticated session (directly, or after confirming, matching however this project's Supabase Auth email-confirmation setting is configured)

#### Scenario: Signup fails
- **WHEN** Supabase Auth rejects the signup (e.g. email already registered, weak password)
- **THEN** the error SHALL be surfaced to the caller instead of silently failing or treating it as success

### Requirement: Email/password login
The system SHALL allow an existing user to log in with their email and password via Supabase Auth.

#### Scenario: Successful login
- **WHEN** a user submits the email and password of an existing, confirmed account
- **THEN** the system SHALL establish an authenticated Supabase session for that user

#### Scenario: Login fails
- **WHEN** the submitted credentials are invalid
- **THEN** the system SHALL surface an error to the caller and SHALL NOT establish a session

### Requirement: Session detection and route protection
The system SHALL be able to determine whether a user is currently authenticated and prevent access to authenticated views when they are not.

#### Scenario: No active session
- **WHEN** the app loads and there is no authenticated Supabase session
- **THEN** the user SHALL be directed to the login/signup screen instead of any authenticated view

#### Scenario: Active session
- **WHEN** the app loads and there is a valid authenticated Supabase session
- **THEN** the user SHALL be able to reach authenticated views without being redirected to login

### Requirement: Logout
The system SHALL allow an authenticated user to log out, ending their Supabase session.

#### Scenario: Logout clears session
- **WHEN** an authenticated user triggers logout
- **THEN** the Supabase session SHALL be terminated
- **AND** the user SHALL subsequently be treated as unauthenticated (per the Session detection requirement)
