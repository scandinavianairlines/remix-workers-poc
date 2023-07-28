import { json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export function loader() {
  return json({
    user: {
      email: 'email@provider.co',
      name: 'Scandinavian'
    }
  });
}

export default function AppLayout() {
  return (
    <main className="flex h-screen">
      <Outlet />
    </main>
  );
}
