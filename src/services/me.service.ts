import { and, eq, inArray } from 'drizzle-orm';
import { db } from '~/database';
import { features, menus, rolePermissions, roles, userPermissions, userRoles, users } from '~/database/schemas';
import { AppError } from '~/errors';

// ==================== GET ME ====================

const getMe = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, userId),
    columns: {
      username: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  const userPermissionQuery = db
    .select({
      featureCode: userPermissions.featureCode,
      action: userPermissions.action,
      sectionCode: userPermissions.sectionCode,
      decision: userPermissions.decision,
    })
    .from(userPermissions)
    .innerJoin(features, eq(userPermissions.featureCode, features.code))
    .where(
      and(eq(userPermissions.username, user.username), eq(features.isActive, true), eq(userPermissions.isActive, true)),
    );

  const rolePermissionQuery = db
    .select({
      featureCode: rolePermissions.featureCode,
      action: rolePermissions.action,
      sectionCode: rolePermissions.sectionCode,
      decision: rolePermissions.decision,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleCode, roles.code))
    .innerJoin(rolePermissions, eq(roles.code, rolePermissions.roleCode))
    .innerJoin(features, eq(rolePermissions.featureCode, features.code))
    .where(
      and(
        eq(userRoles.username, user.username),
        eq(userRoles.sectionCode, rolePermissions.sectionCode),
        eq(roles.isActive, true),
        eq(features.isActive, true),
        eq(rolePermissions.isActive, true),
      ),
    );

  const [userPerms, rolePerms] = await Promise.all([userPermissionQuery, rolePermissionQuery]);

  const permissions = [...userPerms, ...rolePerms];

  const sectionMap = new Map<string, boolean>();

  for (const p of permissions) {
    const key = `${p.featureCode}:${p.action}:${p.sectionCode}`;
    if (p.decision === 'DENY') {
      sectionMap.set(key, false);
    } else if (!sectionMap.has(key)) {
      sectionMap.set(key, true);
    }
  }

  const allowedFeatures = [];
  const allowedPermissions = [];
  for (const [key, allowed] of sectionMap) {
    if (allowed) {
      allowedFeatures.push(key.split(':')[0]);
      allowedPermissions.push(key);
    }
  }

  const userMenus = await db.query.menus.findMany({
    where: and(eq(menus.isActive, true), inArray(menus.featureCode, allowedFeatures)),
    columns: {
      path: true,
    },
  });

  return { user, menus: userMenus.map((m) => m.path), permissions: allowedPermissions };
};

// ==================== EXPORT ====================

export const meService = {
  getMe,
};
