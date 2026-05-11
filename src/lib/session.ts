export const ALL_PERMISSIONS = [
    'PRODUCT_VIEW',
    'PRODUCT_CREATE',
    'PRODUCT_STOCK_EDIT',
    'PRODUCT_DELETE',
    'CATEGORY_VIEW',
    'CATEGORY_MANAGE',
    'HISTORY_VIEW',
    'DASHBOARD_VIEW',
    'DATA_EXPORT',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

export function parsePermissions(rawValue: string | undefined, role: string | undefined): Permission[] {
    if (!rawValue || rawValue.trim() === '') {
        return role === 'ADMIN' ? [...ALL_PERMISSIONS] : [];
    }
    try {
        const decoded = decodeURIComponent(rawValue);
        const parsed = JSON.parse(decoded);
        if (!Array.isArray(parsed)) return role === 'ADMIN' ? [...ALL_PERMISSIONS] : [];
        const valid = parsed.filter((p: unknown): p is Permission =>
            typeof p === 'string' && (ALL_PERMISSIONS as readonly string[]).includes(p)
        );
        return valid.length > 0 ? valid : (role === 'ADMIN' ? [...ALL_PERMISSIONS] : []);
    } catch {
        return role === 'ADMIN' ? [...ALL_PERMISSIONS] : [];
    }
}

export function hasPermission(permissions: Permission[], permission: Permission): boolean {
    return permissions.includes(permission);
}
