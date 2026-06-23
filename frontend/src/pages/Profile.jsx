import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { deleteMeasurements } from '../api/measurements';
import { deleteAccount } from '../api/users';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [delMeasLoading, setDelMeasLoading] = useState(false);
  const [delAccLoading, setDelAccLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  const handleDeleteMeasurements = async () => {
    if (!window.confirm('Delete all your measurements? This cannot be undone.')) return;
    setError('');
    setSuccess('');
    setDelMeasLoading(true);
    try {
      await deleteMeasurements();
      setSuccess('All measurements deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete measurements.');
    } finally {
      setDelMeasLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your account? This cannot be undone.')) return;
    setError('');
    setDelAccLoading(true);
    try {
      await deleteAccount();
      localStorage.clear();
      navigate('/register');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
      setDelAccLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />
      <main className="main-content">
        <h1 className="page-title">Profile</h1>

        <div className="card profile-card">
          <div className="profile-avatar">{name ? name[0].toUpperCase() : '?'}</div>
          <div className="profile-info">
            <div className="profile-name">{name}</div>
            {email && <div className="profile-email">{email}</div>}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card danger-card">
          <h2 className="danger-title">Danger zone</h2>

          <div className="danger-row">
            <div className="danger-text">
              <div className="danger-action-title">Delete measurements</div>
              <div className="danger-action-desc">
                Remove all your body measurement data. Your account stays active.
              </div>
            </div>
            <button
              className="btn-danger-outline"
              onClick={handleDeleteMeasurements}
              disabled={delMeasLoading}
            >
              {delMeasLoading ? 'Deleting…' : 'Delete measurements'}
            </button>
          </div>

          <div className="danger-divider" />

          <div className="danger-row">
            <div className="danger-text">
              <div className="danger-action-title">Delete account</div>
              <div className="danger-action-desc">
                Permanently delete your account and all associated data.
              </div>
            </div>
            <button
              className="btn-danger"
              onClick={handleDeleteAccount}
              disabled={delAccLoading}
            >
              {delAccLoading ? 'Deleting…' : 'Delete account'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
