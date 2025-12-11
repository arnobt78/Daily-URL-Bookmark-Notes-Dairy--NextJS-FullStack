import { getCurrentUser } from "@/lib/auth";
import { getListById } from "@/lib/db";

export type UserRole = "owner" | "editor" | "viewer" | "none";

export interface PermissionCheck {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canComment: boolean;
  role: UserRole;
}

/**
 * Get user role for a list
 * Priority: Owner > Collaborator (from collaboratorRoles) > Viewer (if public)
 */
export async function getUserRole(
  listId: string,
  userId?: string
): Promise<UserRole> {
  if (!userId) return "none";

  const list = await getListById(listId);
  if (!list) return "none";

  // Owner
  if (list.userId === userId) return "owner";

  // Check if user is a collaborator with role
  const user = await getCurrentUser();
  if (!user || user.id !== userId) return "none";

  // Check collaboratorRoles first (new role-based system)
  // CRITICAL: Email matching must be case-insensitive to handle email casing differences
  // (e.g., user.email might be "User@Example.com" but stored as "user@example.com")
  if (list.collaboratorRoles && typeof list.collaboratorRoles === "object") {
    const roles = list.collaboratorRoles as Record<string, string>;
    const userEmailLower = user.email.toLowerCase();
    
    // Check all keys case-insensitively
    const matchingKey = Object.keys(roles).find(
      (key) => key.toLowerCase() === userEmailLower
    );
    
    if (matchingKey) {
      const role = roles[matchingKey];
      if (role === "editor" || role === "viewer") {
        return role;
      }
    }
  }

  // Fallback: Check legacy collaborators array (for backward compatibility)
  // Convert legacy collaborators to "editor" role if found
  // Also use case-insensitive matching for legacy array
  if (list.collaborators && Array.isArray(list.collaborators)) {
    const userEmailLower = user.email.toLowerCase();
    if (list.collaborators.some((email) => email.toLowerCase() === userEmailLower)) {
      return "editor";
    }
  }

  // Public list - viewer access
  if (list.isPublic) return "viewer";

  return "none";
}

/**
 * Check permissions for a user on a list
 */
export async function checkPermissions(
  listId: string,
  userId?: string
): Promise<PermissionCheck> {
  const role = await getUserRole(listId, userId);

  return {
    canEdit: role === "owner" || role === "editor",
    canDelete: role === "owner", // Only owner can delete
    canInvite: role === "owner", // Only owner can invite/manage collaborators
    canComment: role !== "none", // Owner, editor, and viewer can comment
    role,
  };
}

/**
 * Require permission - throws error if user doesn't have permission
 */
export async function requirePermission(
  listId: string,
  userId: string,
  permission: "edit" | "delete" | "invite" | "comment"
): Promise<void> {
  const perms = await checkPermissions(listId, userId);

  if (permission === "edit" && !perms.canEdit) {
    throw new Error("You don't have permission to edit this list");
  }
  if (permission === "delete" && !perms.canDelete) {
    throw new Error("You don't have permission to delete this list");
  }
  if (permission === "invite" && !perms.canInvite) {
    throw new Error("You don't have permission to invite collaborators");
  }
  if (permission === "comment" && !perms.canComment) {
    throw new Error("You don't have permission to comment on this list");
  }
}

/**
 * Check if a user has access to view a list
 * This validates both the new role-based system and legacy collaborators array
 * Returns true if user can access the list, false otherwise
 */
export async function hasListAccess(
  list: { userId: string; isPublic: boolean; collaboratorRoles?: unknown; collaborators?: string[] },
  user: { id: string; email: string } | null
): Promise<boolean> {
  // Public lists are accessible to everyone
  if (list.isPublic) {
    return true;
  }

  // No user = no access (unless public)
  if (!user) {
    return false;
  }

  // Owner always has access
  if (list.userId === user.id) {
    return true;
  }

  // Check if user is a collaborator using new role-based system
  // CRITICAL: Email matching must be case-insensitive to handle email casing differences
  // (e.g., user.email might be "User@Example.com" but stored as "user@example.com")
  if (list.collaboratorRoles && typeof list.collaboratorRoles === "object") {
    const roles = list.collaboratorRoles as Record<string, string>;
    const userEmailLower = user.email.toLowerCase();
    
    // Check all keys case-insensitively
    const matchingKey = Object.keys(roles).find(
      (key) => key.toLowerCase() === userEmailLower
    );
    
    if (matchingKey && (roles[matchingKey] === "editor" || roles[matchingKey] === "viewer")) {
      return true;
    }
  }

  // Fallback: Check legacy collaborators array (backward compatibility)
  // Also use case-insensitive matching for legacy array
  if (list.collaborators && Array.isArray(list.collaborators)) {
    const userEmailLower = user.email.toLowerCase();
    if (list.collaborators.some((email) => email.toLowerCase() === userEmailLower)) {
      return true;
    }
  }

  // No access
  return false;
}

