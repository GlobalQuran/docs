import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSession } from './auth';

/** Second row shared by every page of the API section (keys, reference, basics, help). */
const ApiShell = () => {
  const { user } = useSession();
  const items = user
    ? [['/keys', 'My key', true], ['/keys/all', 'All keys'], ['/api/reference', 'API reference'], ['/how-it-works', 'How it works']]
    : [['/api', 'Get started', true], ['/api/reference', 'API reference'], ['/how-it-works', 'How it works']];
  return (
    <div className="gq-new">
      <nav className="subrow" aria-label="API section">
        <div className="in">
          {items.map(([to, label, end]) => <NavLink key={to} to={to} end={!!end || to === '/keys/all'} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink>)}
          <NavLink className="help" to="/contact?subject=API%20Support">Help</NavLink>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};
export default ApiShell;
