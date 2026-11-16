import { Navigate, Outlet } from 'react-router-dom';
import { getStoredUser } from '../lib/api.js';

const roleAliases = {
  customer: 'customer',
  cliente: 'customer',
  seller: 'seller',
  vendedor: 'seller',
  admin: 'admin',
  administrador: 'admin'
};

function getRoleHome(role) {
  if (role === 'admin') return '/admin';
  if (role === 'seller') return '/vendedor';
  return '/menu';
}

export default function RoleRoute({ allowedRoles, children }) {
  const user = getStoredUser();
  const storedRole = typeof user?.role === 'string' ? user.role.toLowerCase() : '';
  const role = roleAliases[storedRole];

  if (!user || !role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to={getRoleHome(role)} replace />;
  return children || <Outlet />;
}
