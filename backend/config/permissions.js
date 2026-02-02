// Single source of truth for all system permissions.
// Format: MODULE: { ACTION: 'module:action' }

const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  PRODUCTS: {
    CREATE: 'products:create',
    READ: 'products:read',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
  },
  DASHBOARD: {
    VIEW: 'dashboard:view',
  },
   BRANCHES: {
    CREATE: 'branches:create',
    READ: 'branches:read',
    UPDATE: 'branches:update',
    DELETE: 'branches:delete',
  },
  // Add new modules and permissions here
};

module.exports = PERMISSIONS;
