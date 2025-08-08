import Dashboard from '@/components/Dashboard';
import { AuthProvider } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Dashboard | Graphiq.Art',
  description: 'Manage your projects and portfolio',
};

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}
