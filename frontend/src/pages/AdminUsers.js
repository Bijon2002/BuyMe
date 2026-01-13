import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import './AdminDashboard.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change role (user <-> admin)
  const handleRoleChange = async (id, role) => {
    try {
      await API.patch(`/admin/users/${id}`, { role });
      fetchUsers();
    } catch (error) {
      console.error('Role update failed', error);
    }
  };

  // Deactivate user (soft delete)
  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;

    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Deactivate failed', error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading users...</p>;
  }

  return (
    <div className="admin-page">
      <h2 className="page-title">User Management</h2>

      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {/* <th>Role</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td className="email-text">{user.email}</td>

                {/* <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td> */}

                <td>
                  <span className={`status-chip ${user.isActive ? 'active' : 'blocked'}`} >
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>

                <td>
                  <button
                    className="danger-btn"
                    onClick={() => handleDeactivate(user._id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="empty-text">No users found.</p>
        )}
      </div>
    </div>
  );
}
