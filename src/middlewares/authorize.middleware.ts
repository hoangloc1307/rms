import { and, eq, inArray } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '~/database';
import { Action, features, rolePermissions, roles, userPermissions, userRoles } from '~/database/schemas';
import { AppError } from '~/errors';

export const authorize =
  (featureCode: string, allowActions: Action[]) => async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;

    // Tìm tất cả các permission của roles hoặc của userId đó có featureCode và action tương ứng
    const userPermissionQuery = db
      .select({
        sectionCode: userPermissions.sectionCode,
        decision: userPermissions.decision,
      })
      .from(userPermissions)
      .innerJoin(features, eq(userPermissions.featureCode, features.code))
      .where(
        and(
          eq(userPermissions.username, userId),
          eq(features.isActive, true),
          eq(userPermissions.featureCode, featureCode),
          inArray(userPermissions.action, allowActions),
        ),
      );

    const rolePermissionQuery = db
      .select({
        sectionCode: rolePermissions.sectionCode,
        decision: rolePermissions.decision,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleCode, roles.code))
      .innerJoin(rolePermissions, eq(userRoles.roleCode, rolePermissions.roleCode))
      .innerJoin(features, eq(rolePermissions.featureCode, features.code))
      .where(
        and(
          eq(userRoles.username, userId),
          eq(roles.isActive, true),
          eq(features.isActive, true),
          eq(rolePermissions.featureCode, featureCode),
          inArray(rolePermissions.action, allowActions),
        ),
      );

    const [userPermissionsData, rolePermissionsData] = await Promise.all([userPermissionQuery, rolePermissionQuery]);

    const permissions = [...userPermissionsData, ...rolePermissionsData];

    if (!permissions.length) {
      throw AppError.forbidden("You don't have permission");
    }

    const sectionMap = new Map<string, boolean>();

    for (const p of permissions) {
      if (p.decision === 'DENY') {
        sectionMap.set(p.sectionCode, false);
      } else if (!sectionMap.has(p.sectionCode)) {
        sectionMap.set(p.sectionCode, true);
      }
    }

    const allowedSections = [];
    for (const [section, allowed] of sectionMap) {
      if (allowed) allowedSections.push(section);
    }

    if (allowedSections.length === 0) {
      throw AppError.forbidden("You don't have permission");
    }

    req.user.allowedSections = allowedSections;
    next();
  };
