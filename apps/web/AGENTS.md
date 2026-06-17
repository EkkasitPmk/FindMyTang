# AGENTS.md

# Table of Contents for Frontend Developer only

1. Tech Stack
2. Architecture Rules
3. Naming Conventions
4. Folder Structure
5. Frontend Rules
6. Coding Standards
7. AI Instructions

---

# 1. Tech Stack

## Frontend

### Framework

- Next.js (Latest Version)

### Language

- TypeScript

### Styling

- Tailwind CSS

### UI Components

- shadcn/ui

### Icons

- Lucide React

### HTTP Client

- Axios

### Forms

- React Hook Form

### Validation

- Zod

### Data Fetching & Server State

- TanStack Query

---

# 2. Architecture Rules

## Architecture Pattern

This project follows a Feature-Based Architecture.

The application is organized by features instead of technical layers.

Example:

src/
├── app/
├── features/
├── shared/

---

## App Directory

The app directory is responsible for:

- Routing
- Layouts
- Pages
- Global styles

Example:

app/
├── globals.css
├── layout.tsx
├── page.tsx
└── (pages)/

Business logic should not live inside app pages.

Pages should compose feature containers.

---

## Feature Structure

Each feature should be self-contained.

Example:

features/
└── authentication/
└── login/
├── components/
├── containers/
├── services/
├── hooks/
├── schemas/
├── helpers/
├── utils/
├── types/
└── configs/

---

## Folder Responsibilities

### components/

Contains UI components used only inside the current feature.

Components should focus on presentation.

---

### containers/

Contains feature-level logic.

Responsibilities:

- Connect hooks
- Handle page logic
- Coordinate components

Containers may contain lightweight layout code.

Complex business logic should be extracted to helpers.

---

### services/

Responsible only for API communication.

Rules:

- Use Axios
- No UI logic
- No React hooks

---

### hooks/

Responsible for custom hooks.

Examples:

- TanStack Query hooks
- Mutation hooks
- Feature-specific hooks

Hooks should consume services.

---

### schemas/

Contains Zod schemas.

Responsibilities:

- Request validation
- Form validation
- API response validation

---

### helpers/

Contains feature-specific helper functions.

Only used inside the current feature.

---

### utils/

Contains reusable utilities for the current feature only.

If a utility is needed by multiple features, move it to shared/lib/utils.

---

### types/

Contains shared interfaces and types for the current feature.

Create a types file only when the same type is used in multiple files.

Do not create types files unnecessarily.

---

### configs/

Contains static configuration values.

Examples:

- Select options
- Table columns
- Static mappings
- Reusable configuration objects

Do not store business logic here.

---

## Shared Directory

The shared directory contains reusable resources used across multiple features.

Example:

shared/
├── components/
└── lib/

---

## Shared Components

shared/components/ui/

Contains shadcn/ui components.

---

shared/components/customs/

Contains reusable custom UI components.

---

shared/components/skeletons/

Contains all skeleton loading components.

---

## Shared Libraries

shared/lib/

Contains reusable resources shared across multiple features.

Examples:

- api/
- hooks/
- services/
- utils/
- helpers/
- schemas/
- types/
- configs/
- storages/

Rules:

If a resource is used by more than one feature, move it to shared/lib.

Do not duplicate shared logic across features.

---

## Reusability Rules

If a UI component is reused across multiple features:

Move it to:

shared/components/

Do not duplicate the same component in multiple features.

---

## Type Rules

If an interface or type is used only once:

Keep it inside the file.

Do not create a separate types file.

If an interface or type is used by multiple files:

Move it to:

types/

---

## Dependency Direction

components
↓
containers
↓
hooks
↓
services
↓
API

Components should not call services directly.

Containers should not perform API calls directly.

Services should not contain UI logic.

---

# 3. Naming Conventions

## General Rules

- Use meaningful and descriptive names.
- Avoid abbreviations unless they are widely accepted.
- File names should clearly reflect their responsibility.
- Keep naming consistent across the project.

---

## Components

Rules:

- Use PascalCase.
- File names must start with an uppercase letter.
- Component names and file names must match.

Examples:

Header.tsx

LoginForm.tsx

TransactionTable.tsx

CategorySelect.tsx

---

## Containers

Rules:

- Use PascalCase.
- File names must start with an uppercase letter.
- Must end with "Container".
- Container names and file names must match.

Examples:

LoginContainer.tsx

RegisterContainer.tsx

TransactionContainer.tsx

DashboardContainer.tsx

---

## Services

Rules:

- Use meaningful names.
- Must end with ".service.ts".

Examples:

login.service.ts

transaction.service.ts

category.service.ts

---

## Hooks

Rules:

- Use meaningful names.
- Must end with ".hook.ts".

Examples:

login.hook.ts

transaction.hook.ts

category.hook.ts

---

## Schemas

Rules:

- Use meaningful names.
- Must end with ".schema.ts".

Examples:

login.schema.ts

transaction.schema.ts

category.schema.ts

---

## Helpers

Rules:

- Use meaningful names.
- Must end with ".helper.ts".

Examples:

login.helper.ts

transaction.helper.ts

date.helper.ts

---

## Utils

Rules:

- Use meaningful names.
- Must end with ".util.ts".

Examples:

currency.util.ts

date.util.ts

number.util.ts

---

## Types

Rules:

- Use meaningful names.
- Must end with ".type.ts".
- Create a types file only when the same type is shared across multiple files within a feature.

Examples:

login.type.ts

transaction.type.ts

category.type.ts

---

## Configs

Rules:

- Use meaningful names.
- Must end with ".config.ts".

Examples:

table.config.ts

sidebar.config.ts

transaction.config.ts

---

## Shared Components

Rules:

- Use PascalCase.
- File names must start with an uppercase letter.
- Component names and file names must match.
- **Exemption**: UI components generated or imported from external libraries/CLIs (e.g., shadcn/ui command-generated files in `shared/components/ui/` like `button.tsx`, `calendar.tsx`) can retain their default library naming conventions (such as lowercase/kebab-case) and are exempt from this PascalCase requirement.

Examples:

Button.tsx

Modal.tsx

LoadingSkeleton.tsx

PageHeader.tsx

---

## Type Creation Rules

Do not create a separate types file when a type or interface is used only once.

Example:

- Used in a single component → keep it inside that file.
- Used in a single container → keep it inside that file.

Create a types file only when the same type or interface is reused across multiple files.

---

## Naming Priority

When creating new files:

1. Follow existing naming patterns.
2. Keep names descriptive.
3. Match the responsibility of the file.
4. Maintain consistency within the feature.

---

# 4. Folder Structure

## Root Structure

The frontend application must follow this structure:

src/
├── app/
├── features/
└── shared/

Do not introduce new top-level folders unless explicitly required.

---

## App Directory

Responsible for:

- Next.js routing
- Layouts
- Global styles
- Route pages

Structure:

app/
├── globals.css
├── layout.tsx
├── page.tsx
└── (pages)/

Rules:

- Keep pages lightweight.
- Pages should compose feature containers.
- Do not place business logic in pages.

---

## Features Directory

All feature-specific code must live inside features/.

Structure:

features/
└── feature-name/
├── components/
├── containers/
├── services/
├── hooks/
├── schemas/
├── helpers/
├── utils/
├── types/
└── configs/

Rules:

- Keep features self-contained.
- Avoid importing between unrelated features.
- Prefer feature ownership over shared ownership.

---

## Components Directory

Location:

features/\*/components/

Purpose:

- Feature-specific UI components.

Rules:

- Only used by the current feature.
- If reused across multiple features, move to shared/components.

---

## Containers Directory

Location:

features/\*/containers/

Purpose:

- Feature entry points.
- Connect hooks and UI components.
- Handle page-level logic.

---

## Services Directory

Location:

features/\*/services/

Purpose:

- API communication only.

Rules:

- Use Axios.
- No UI logic.
- No React rendering logic.

---

## Hooks Directory

Location:

features/\*/hooks/

Purpose:

- Feature-specific hooks.
- TanStack Query hooks.
- Mutation hooks.

---

## Schemas Directory

Location:

features/\*/schemas/

Purpose:

- Zod schemas.
- Form validation.
- API validation.

---

## Helpers Directory

Location:

features/\*/helpers/

Purpose:

- Feature-specific helper functions.

Rules:

- Used only inside the current feature.

---

## Utils Directory

Location:

features/\*/utils/

Purpose:

- Reusable utilities for the current feature.

Rules:

- If used by multiple features, move to shared/lib/utils.

---

## Types Directory

Location:

features/\*/types/

Purpose:

- Shared types within the feature.

Rules:

- Create only when types are reused across multiple files.

---

## Configs Directory

Location:

features/\*/configs/

Purpose:

- Static configuration.
- UI configuration.
- Reusable constants and mappings.

Rules:

- Do not place business logic here.

---

## Shared Directory

Contains reusable resources shared by multiple features.

Structure:

shared/
├── components/
└── lib/

---

## Shared Components

Structure:

shared/components/
├── ui/
├── customs/
└── skeletons/

### ui/

Contains shadcn/ui components.

### customs/

Contains reusable custom components.

### skeletons/

Contains all skeleton loading components.

---

## Shared Libraries

Structure:

shared/lib/
├── api/
├── configs/
├── storages/
├── utils/
├── hooks/
├── services/
├── types/
├── schemas/
└── helpers/

Rules:

- Only place code here when it is shared across multiple features.
- Do not duplicate shared logic inside features.

---

## Shared API

Location:

shared/lib/api/

Purpose:

- Axios configuration
- HTTP client setup
- TanStack Query client

Examples:

http.ts

queryClient.ts

---

## Shared Resource Rule

Before creating a new file:

1. Check whether it already exists in shared/.
2. If it is reused by multiple features, place it in shared/.
3. If it is used by a single feature only, keep it inside that feature.

Prefer feature ownership first.

Promote to shared only when reuse is confirmed.

---

# 5. Frontend Rules

## General Principles

- Build reusable and maintainable UI.
- Prefer composition over duplication.
- Keep components focused on a single responsibility.
- Avoid unnecessary complexity.

---

## Next.js

Rules:

- Use App Router.
- Prefer Server Components when client-side features are not required.
- Keep page files lightweight.
- Pages should primarily render feature containers.

---

## UI Components

Rules:

- Use shadcn/ui components whenever possible.
- Reuse existing shared components before creating new ones.
- Avoid duplicating UI components across features.

Priority:

1. shared/components/ui
2. shared/components/customs
3. Create new component

---

## Forms

Rules:

- Use React Hook Form for all forms.
- Use Zod for validation.
- Keep validation schemas in schemas/.
- Avoid manual form state management unless necessary.

Preferred Pattern:

React Hook Form

- Zod
- shadcn/ui

  ***

## API Communication

Rules:

- Use Axios for all HTTP requests.
- Do not call APIs directly inside components.
- API communication must be handled through services/.

---

## Data Fetching

Rules:

- Use TanStack Query for server state.
- Use queries for fetching data.
- Use mutations for create, update, and delete operations.
- Avoid manual fetching with useEffect when TanStack Query can be used.

---

## Loading States

Rules:

- Always handle loading states.
- Prefer Skeleton components for page content.
- Use shared/components/skeletons when available.

---

## Error States

Rules:

- Always handle API errors.
- Display user-friendly error messages.
- Avoid exposing raw backend errors.

---

## Empty States

Rules:

- Handle empty data scenarios.
- Provide clear user feedback when no data exists.

Examples:

- No transactions found
- No categories found
- No search results found

---

## Type Safety

Rules:

- Use TypeScript strictly.
- Avoid any.
- Prefer explicit types for API requests and responses.
- Reuse existing types whenever possible.

---

## Validation

Rules:

- Validate user input with Zod.
- Do not rely solely on backend validation.
- Keep validation rules centralized in schemas/.

---

## Component Reusability

Before creating a new component:

1. Check shared/components/ui
2. Check shared/components/customs
3. Check current feature components
4. Create a new component only when necessary

Avoid duplicate components.

---

## Imports

Rules:

- Prefer existing shared resources.
- Avoid creating duplicate utilities, hooks, helpers, services, schemas, or types.
- Reuse existing modules whenever possible.

---

## State Management

Rules:

- Use TanStack Query for server state.
- Use React state only for local UI state.
- Do not introduce additional state management libraries unless explicitly requested.

---

# 6. Coding Standards

## General Principles

- Write clean and readable code.
- Prefer simplicity over clever solutions.
- Prioritize maintainability.
- Keep implementations predictable and consistent.

---

## Readability

Rules:

- Use meaningful variable names.
- Use meaningful function names.
- Use meaningful component names.
- Avoid unclear abbreviations.

Good:

const transactionAmount = 1000

const calculateTotalExpense = () => {}

Bad:

const amt = 1000

const calc = () => {}

---

## Functions

Rules:

- Functions should have a single responsibility.
- Keep functions small and focused.
- Extract repeated logic into helpers or utilities.

Prefer:

const calculateTotalExpense = () => {}

Avoid:

const processEverything = () => {}

---

## Components

Rules:

- Keep components focused on a single responsibility.
- Avoid large components with mixed responsibilities.
- Extract reusable UI when duplication appears.

---

## TypeScript

Rules:

- Use strict typing.
- Avoid any.
- Prefer explicit types when clarity is improved.
- Reuse existing types whenever possible.

Preferred:

interface Transaction {
id: string;
amount: number;
}

Avoid:

const data: any = response.data

---

## Interfaces and Types

Rules:

- Keep local types in the same file when used only once.
- Move types to types/ only when shared across multiple files.
- Avoid unnecessary type files.

---

## Conditional Logic

Rules:

- Prefer early returns.
- Avoid deeply nested conditions.

Preferred:

if (!user) {
return null;
}

Avoid:

if (user) {
if (user.profile) {
if (user.profile.settings) {
...
}
}
}

---

## Duplication

Rules:

- Avoid duplicated code.
- Extract reusable logic into:
  - helpers/
  - utils/
  - shared/lib/

Do not copy and paste logic across features.

---

## Imports

Rules:

- Remove unused imports.
- Reuse existing modules before creating new ones.
- Keep imports organized.

---

## Error Handling

Rules:

- Handle errors explicitly.
- Avoid empty catch blocks.
- Provide meaningful error messages.
- Consider fallback behavior.

Bad:

catch (error) {}

Preferred:

catch (error) {
console.error(error);
}

---

## Async Code

Rules:

- Use async/await.
- Avoid excessive promise chaining.

Preferred:

const data = await getTransactions();

Avoid:

getTransactions()
.then(...)
.then(...)
.catch(...)

---

## Comments

Rules:

- Write self-explanatory code first.
- Add comments only when the intent is not obvious.
- Avoid comments that repeat the code.

Bad:

// Set loading to true
setLoading(true);

Preferred:

// Prevent duplicate form submission
setLoading(true);

---

## Constants

Rules:

- Extract magic values into constants when reused.
- Keep configuration values in configs/.

Avoid:

if (amount > 1000000)

Preferred:

if (amount > MAX_TRANSACTION_AMOUNT)

---

## Code Reuse

Before creating:

- Component
- Hook
- Service
- Helper
- Utility
- Type
- Schema
- Config

Always check whether an existing implementation already exists.

Prefer reuse over recreation.

---

## Maintainability

Rules:

- Optimize for long-term maintenance.
- Prefer straightforward solutions.
- Avoid overengineering.
- Follow existing project patterns before introducing new ones.

---

# 7. AI Instructions

## Primary Goal

Generate code that follows the existing project architecture, folder structure, naming conventions, and coding standards.

Prioritize consistency over personal preference.

Do not introduce new patterns when an existing pattern already exists.

---

## Before Generating Code

Always:

1. Analyze the existing structure.
2. Analyze existing naming conventions.
3. Analyze existing implementation patterns.
4. Reuse existing patterns whenever possible.

Do not assume a new architecture is needed.

---

## Reuse Before Create

Before creating:

- Component
- Container
- Hook
- Service
- Schema
- Helper
- Utility
- Type
- Config

Always check whether an existing implementation already exists.

Prefer reuse over duplication.

---

## Follow Existing Project Patterns

When adding new code:

- Follow existing feature structure.
- Follow existing naming conventions.
- Follow existing folder responsibilities.
- Follow existing implementation patterns.

Do not introduce alternative patterns unless explicitly requested.

---

## Do Not Create Unnecessary Files

Avoid creating new files when the existing implementation can be extended.

Prefer modifying existing files when appropriate.

Create new files only when there is a clear architectural reason.

---

## Respect Feature Boundaries

Keep feature-specific code inside its feature.

Do not move code to shared prematurely.

Promote code to shared only when it is genuinely reused across multiple features.

---

## Shared Resource Rules

Before creating anything in shared:

Verify that it is used by multiple features.

Do not place feature-specific logic in shared.

---

## API Rules

Always:

- Use Axios.
- Place API communication inside services.
- Use hooks to consume services.
- Use TanStack Query for server state.

Never:

- Call APIs directly inside components.
- Call APIs directly inside containers.

---

## Form Rules

Always:

- Use React Hook Form.
- Use Zod validation.

Do not introduce:

- Formik
- Yup
- Alternative form libraries

Unless explicitly requested.

---

## UI Rules

Prefer:

1. shared/components/ui
2. shared/components/customs
3. Existing feature components
4. New components

Avoid creating duplicate UI components.

---

## Type Rules

Always prefer existing types.

Create new types only when necessary.

Do not use any.

Keep local types inside the file when they are used only once.

---

## Code Quality

Generated code should:

- Be production-ready.
- Be readable.
- Be maintainable.
- Be type-safe.

Avoid:

- Placeholder code
- Mock implementations
- TODO comments
- Unused code

Unless explicitly requested.

---

## Error Handling

Always consider:

- Loading states
- Error states
- Empty states

Do not ignore failure scenarios.

---

## Simplicity First

Prefer the simplest solution that satisfies the requirement.

Avoid:

- Overengineering
- Unnecessary abstractions
- Premature optimization

---

## Decision Priority

When making implementation decisions, follow this order:

1. Existing project architecture
2. Existing project patterns
3. Maintainability
4. Readability
5. Performance
6. Personal preference

Project consistency always has higher priority than introducing new ideas.
