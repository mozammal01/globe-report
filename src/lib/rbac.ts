export const ROLE = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AUTHOR: "AUTHOR",
  READER: "READER",
} as const;

export type RoleKey = (typeof ROLE)[keyof typeof ROLE];

export const ROLE_DEFINITIONS: Record<
  RoleKey,
  { name: string; description: string }
> = {
  [ROLE.ADMIN]: {
    name: "Admin",
    description: "Full administrative access to the platform.",
  },
  [ROLE.EDITOR]: {
    name: "Editor",
    description: "Reviews and publishes articles submitted by authors.",
  },
  [ROLE.AUTHOR]: {
    name: "Author",
    description: "Writes and submits articles for review.",
  },
  [ROLE.READER]: {
    name: "Reader",
    description: "Standard reader account.",
  },
} as const;

export const ADMIN_ACCESS_ROLES: RoleKey[] = [ROLE.ADMIN];
