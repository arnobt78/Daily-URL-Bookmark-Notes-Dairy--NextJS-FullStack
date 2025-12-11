"use client";

import { useMemo } from "react";
import { useSession } from "./useSession";
import { useStore } from "@nanostores/react";
import { currentList, type UrlList } from "@/stores/urlListStore";

export type UserRole = "owner" | "editor" | "viewer" | "none";

export interface PermissionCheck {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canComment: boolean;
  role: UserRole;
}

/**
 * Client-side hook to check user permissions on a list
 * Returns permissions based on current list data and user session
 */
export function useListPermissions(): PermissionCheck {
  const { user } = useSession();
  const list = useStore(currentList);

  return useMemo(() => {
    // No user = no permissions
    if (!user || !list?.id) {
      return {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canComment: false,
        role: "none" as UserRole,
      };
    }

    // Type-safe access to list properties
    // UrlList interface includes userId, collaboratorRoles, collaborators, and isPublic
    interface ListWithPermissions extends Partial<UrlList> {
      userId?: string;
      collaboratorRoles?: Record<string, "editor" | "viewer">;
      collaborators?: string[];
      isPublic?: boolean;
    }
    const listData = list as ListWithPermissions;

    // Check if user is the owner
    if (listData.userId === user.id) {
      return {
        canEdit: true,
        canDelete: true, // Only owner can delete list itself
        canInvite: true,
        canComment: true,
        role: "owner" as UserRole,
      };
    }

    // Check collaborator roles
    // CRITICAL: Email matching must be case-insensitive to handle email casing differences
    // (e.g., user.email might be "User@Example.com" but stored as "user@example.com")
    if (
      listData.collaboratorRoles &&
      typeof listData.collaboratorRoles === "object"
    ) {
      const roles = listData.collaboratorRoles as Record<string, string>;
      const userEmailLower = user.email.toLowerCase();
      
      // Check all keys case-insensitively
      const matchingKey = Object.keys(roles).find(
        (key) => key.toLowerCase() === userEmailLower
      );
      
      if (matchingKey) {
        const role = roles[matchingKey];

        if (role === "editor") {
          return {
            canEdit: true,
            canDelete: false, // Editors cannot delete the list itself
            canInvite: false,
            canComment: true,
            role: "editor" as UserRole,
          };
        }

        if (role === "viewer") {
          return {
            canEdit: false,
            canDelete: false,
            canInvite: false,
            canComment: true, // Viewers can comment
            role: "viewer" as UserRole,
          };
        }
      }
    }

    // Fallback: Check legacy collaborators array
    // Also use case-insensitive matching for legacy array
    if (listData.collaborators && Array.isArray(listData.collaborators)) {
      const userEmailLower = user.email.toLowerCase();
      if (listData.collaborators.some((email) => email.toLowerCase() === userEmailLower)) {
        // Legacy collaborators default to editor
        return {
          canEdit: true,
          canDelete: false,
          canInvite: false,
          canComment: true,
          role: "editor" as UserRole,
        };
      }
    }

    // Public list - viewer access
    if (listData.isPublic) {
      return {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canComment: true,
        role: "viewer" as UserRole,
      };
    }

    // No access
    return {
      canEdit: false,
      canDelete: false,
      canInvite: false,
      canComment: false,
      role: "none" as UserRole,
    };
  }, [user, list]);
}
