# Authentication System

This guide explains how authentication works end-to-end: from the login flow through token storage, session initialization, and automatic logout.

The system has two parts that work together:
- **`AuthContext`** — React context that manages user state and exposes login/signup/logout actions
- **`apiClient`** — Axios instance that silently refreshes expired tokens and logs out on failures

---

## Overview

```
User logs in
  → POST /api/auth/login
  → accessToken + refreshToken + user stored in localStorage
  → accessToken also set in cookie (for SSR middleware)
  → user state set in AuthContext
  → redirect to /home

Subsequent API calls
  → apiClient injects Bearer token from localStorage
  → 401 response → apiClient calls POST /api/auth/refresh (with cookie)
  → new token stored, original request retried
  → 403 or refresh failure → logoutUser() called → redirect to /login

Page reload
  → AuthContext reads token + user from localStorage
  → user state restored without a network request
  → middleware reads cookie to protect server-rendered routes
```

---

## AuthContext

**File:** `core/context/AuthContext.tsx`

### State

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | The currently authenticated user, or `null` |
| `isAuthenticated` | `boolean` | `true` when `user` is not null |
| `isLoading` | `boolean` | `true` during initial auth check and login/signup calls |

### Accessing auth state

```tsx
'use client'
import { useAuth } from '@/core/context/AuthContext'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not logged in</div>

  return <div>Welcome, {user?.name}</div>
}
```

---

## Login

```tsx
const { login } = useAuth()

await login(
  { email: 'user@example.com', password: 'secret' },
  (errorMessage) => {
    // Called only on failure — show this in your UI
    console.error(errorMessage)
  }
)
// On success, redirects to /home automatically
```

**What happens internally:**
1. `POST /api/auth/login` with the credentials
2. Response must contain `{ user, accessToken, refreshToken? }`
3. `accessToken` stored in `localStorage` under key `accessToken`
4. `refreshToken` stored in `localStorage` under key `refreshToken` (if present)
5. `userData` JSON stored in `localStorage` under key `userData`
6. `accessToken` set as a browser cookie (for SSR middleware)
7. `user` state updated → `isAuthenticated` becomes `true`
8. Router pushes to `/home`

### Expected backend response

```json
{
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "manager"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

The `role` field is used by the authorization system (CASL). See [AuthorizationDocumentation.md](./AuthorizationDocumentation.md).

---

## Signup

```tsx
const { signup } = useAuth()

await signup(
  { email: 'new@example.com', password: 'secret', name: 'Jane' },
  (errorMessage) => {
    console.error(errorMessage)
  }
)
// On success, redirects to /home automatically
```

The signup flow is identical to login — it calls `POST /api/auth/signup` and expects the same response shape.

---

## Logout

```tsx
const { logout } = useAuth()

await logout()
// Clears all storage, cookie, and redirects to /login
```

**What happens internally:**
1. `user` state set to `null`
2. `accessToken`, `refreshToken`, `userData` removed from `localStorage`
3. `accessToken` cookie expired
4. Router pushes to `/login`

---

## Customizing the User type

The `User` type in `core/configs/authConfig.ts` accepts any additional fields via an index signature:

```ts
export interface User {
  id: string
  email: string
  name?: string
  role?: string
  [key: string]: unknown   // ← allows any extra fields
}
```

You can add specific fields you care about:

```ts
export interface User {
  id: string
  email: string
  name?: string
  role?: string
  avatar?: string
  department?: string
  permissions?: string[]
}
```

---

## Customizing auth endpoints and storage keys

All configuration is in `core/configs/clientConfig.ts`:

```ts
const authConfig = {
  baseURL: '/api',

  // Endpoints — change to match your backend
  loginEndpoint: '/auth/login',       // POST
  signupEndpoint: '/auth/signup',     // POST
  refreshEndpoint: '/auth/refresh',   // POST

  // localStorage keys
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  storageUserDataKeyName: 'userData',

  // Redirect routes
  loginPageURL: '/login',
  homePageURL: '/home',

  // Cookie settings
  cookieName: 'accessToken',
  cookieMaxAge: 60 * 60 * 24 * 7,   // 7 days
  cookieSameSite: 'Strict',
}
```

---

## Token storage: why both localStorage and cookie?

The access token is stored in **two places** for different purposes:

| Storage | Used by | Why |
|---------|---------|-----|
| `localStorage` | `apiClient` (browser) | Fast, synchronous read for every API request |
| Cookie (`accessToken`) | Next.js middleware (server) | Middleware runs on the server before the page renders; it cannot read `localStorage` |

This dual storage ensures both client-side API calls and server-side route protection work correctly.

---

## Automatic token refresh

The `apiClient` handles token refresh transparently. You don't need to do anything in your components — it just works.

When a request returns `401`:
1. `apiClient` calls `POST /api/auth/refresh` using the refresh token cookie
2. The new access token is stored in `localStorage`
3. The failed request is automatically retried with the new token
4. All other requests that arrived during the refresh are queued and retried too

When a request returns `403`, or when the refresh call itself fails:
- `logoutUser()` is called
- All auth data is cleared
- User is redirected to `/login`

---

## Protecting pages (client-side)

For pages that should redirect unauthenticated users, check `isAuthenticated` in the component:

```tsx
'use client'
import { useAuth } from '@/core/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SecretPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated) return null

  return <div>Secret content</div>
}
```

For server-side route protection via the middleware, see [AuthorizationDocumentation.md](./AuthorizationDocumentation.md).

---

## Conditional rendering based on auth state

```tsx
const { user, isAuthenticated } = useAuth()

return (
  <header>
    {isAuthenticated ? (
      <>
        <span>Hello, {user?.name}</span>
        <button onClick={logout}>Sign out</button>
      </>
    ) : (
      <a href="/login">Sign in</a>
    )}
  </header>
)
```

---

## Session initialization

On every page load, `AuthProvider` runs `initAuth()` in a `useEffect`:

1. Reads `accessToken` and `userData` from `localStorage`
2. If both exist, parses `userData` and sets the user state — no network request needed
3. If either is missing or the JSON is invalid, clears all auth keys and stays logged out
4. Sets `isLoading = false` when done

This means authenticated users see their content immediately on reload without waiting for a server round-trip.

---

## Moving from Mock Data to Real API

The template ships with [MSW (Mock Service Worker)](https://mswjs.io/) enabled for development. Once your backend is ready, follow these steps to remove the mocks and fetch real data.

### Step 1 — Disable MSW

MSW is controlled by the environment variable `NEXT_PUBLIC_ENABLE_MOCKS`. To stop intercepting requests and let them reach your real backend, set it to `false` (or remove it entirely):

```env
# .env.local
NEXT_PUBLIC_ENABLE_MOCKS=false
```

The mock initialization in `lib/mocks/index.ts` checks this flag and skips setup when it is absent or `false`.

---

### Step 2 — Create a feature client

For each resource you need to fetch, create a dedicated client file inside `core/clients/`. The client holds the raw async functions that call your backend via `apiClient`.

**Example — `core/clients/WorkspaceClient.ts`:**

```ts
import apiClient from './apiClient'

export interface Workspace {
  id: string
  name: string
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const { data } = await apiClient.get<Workspace[]>('/workspaces')
  return data
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const { data } = await apiClient.get<Workspace>(`/workspaces/${id}`)
  return data
}

export async function createWorkspace(payload: Omit<Workspace, 'id'>): Promise<Workspace> {
  const { data } = await apiClient.post<Workspace>('/workspaces', payload)
  return data
}

export async function updateWorkspace(id: string, payload: Partial<Workspace>): Promise<Workspace> {
  const { data } = await apiClient.patch<Workspace>(`/workspaces/${id}`, payload)
  return data
}

export async function deleteWorkspace(id: string): Promise<void> {
  await apiClient.delete(`/workspaces/${id}`)
}
```

`apiClient` already handles Bearer token injection, automatic token refresh on 401, and logout on 403 — you don't need to add any auth logic here.

---

### Step 3 — Create TanStack Query hooks

Create a folder named after the resource inside `core/clients/` and add two files: `queries.ts` for read operations and `mutations.ts` for write operations.

**`core/clients/workspace/queries.ts`:**

```ts
import { useQuery } from '@tanstack/react-query'
import { getWorkspaces, getWorkspace } from '../WorkspaceClient'

export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspaceKeys.all, 'list'] as const,
  detail: (id: string) => [...workspaceKeys.all, 'detail', id] as const,
}

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: getWorkspaces,
  })
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => getWorkspace(id),
    enabled: Boolean(id),
  })
}
```

**`core/clients/workspace/mutations.ts`:**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWorkspace, updateWorkspace, deleteWorkspace } from '../WorkspaceClient'
import { workspaceKeys } from './queries'

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  })
}

export function useUpdateWorkspace(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateWorkspace>[1]) => updateWorkspace(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  })
}
```

---

### Step 4 — Use the hooks in your components

```tsx
'use client'
import { useWorkspaces } from '@/core/clients/workspace/queries'
import { useCreateWorkspace } from '@/core/clients/workspace/mutations'

export default function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const create = useCreateWorkspace()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {workspaces?.map(ws => <div key={ws.id}>{ws.name}</div>)}
      <button onClick={() => create.mutate({ name: 'New Workspace' })}>
        Add Workspace
      </button>
    </div>
  )
}
```

---

### Folder structure reference

```text
core/
  clients/
    apiClient.ts              ← Axios instance (do not modify)
    WorkspaceClient.ts        ← Raw async functions for /workspaces
    workspace/
      queries.ts              ← useWorkspaces, useWorkspace
      mutations.ts            ← useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace
    UserClient.ts             ← Raw async functions for /users
    user/
      queries.ts
      mutations.ts
```

This pattern is a convention, not a requirement. You are free to reorganise it to suit your project structure.
