import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import AuthModal from '@/components/forms/AuthModal';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
      <AuthModal />
    </>
  );
}
