import { useState } from 'react';
import AuthPage from './AuthPage';
import AdminPanel from './AdminPanel';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {currentUser ? (
        <AdminPanel user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={setCurrentUser} />
      )}
    </div>
  );
}
