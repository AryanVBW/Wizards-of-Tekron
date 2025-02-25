import { AdminUserManagement } from '../components/AdminUserManagement';

export function AdminPage() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Admin Dashboard
      </h1>
      
      <AdminUserManagement />
      
      {/* Add other admin components here */}
    </div>
  );
} 