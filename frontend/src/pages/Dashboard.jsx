import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getMeasurements } from '../api/measurements';
import './Dashboard.css';

const FIELDS = [
  { key: 'bust', label: 'Bust', unit: 'cm' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hip', label: 'Hip', unit: 'cm' },
  { key: 'thigh', label: 'Thigh', unit: 'cm' },
  { key: 'shoeSize', label: 'Shoe size', unit: 'EU' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const accessCode = localStorage.getItem('accessCode');
  const name = localStorage.getItem('name');

  useEffect(() => {
    getMeasurements()
      .then((res) => {
        const raw = res.data;
        const item = Array.isArray(raw) ? (raw[0] ?? null) : raw;
        setMeasurements(item);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setMeasurements(null);
        } else {
          setError('Failed to load measurements.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <Header />
      <main className="main-content">
        <div className="dashboard-top">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {name}!</p>
          </div>
          <button className="btn-outline" onClick={() => navigate('/measurements/new')}>
            + Add measurements
          </button>
        </div>

        <div className="card">
          <div className="section-label">Your access code</div>
          <div className="code-row">
            <code className="access-code">{accessCode || '—'}</code>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="code-hint">
            Share this code so others can view your measurements at{' '}
            <strong>/public/{accessCode}</strong>.
          </p>
        </div>

        <div className="card">
          <div className="card-header-row">
            <h2 className="card-title">Current measurements</h2>
            {measurements?.createdAt && (
              <span className="date-badge">
                {new Date(measurements.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {loading && <p className="state-text">Loading…</p>}

          {error && <p className="state-text state-text--error">{error}</p>}

          {!loading && !error && measurements === null && (
            <div className="empty-state">
              <p>No measurements recorded yet.</p>
              <button className="btn-primary" onClick={() => navigate('/measurements/new')}>
                Add your first measurement
              </button>
            </div>
          )}

          {!loading && measurements && (
            <div className="measurements-grid">
              {FIELDS.map(({ key, label, unit }) =>
                measurements[key] != null ? (
                  <div className="measurement-card" key={key}>
                    <span className="measurement-label">{label}</span>
                    <span className="measurement-value">
                      {measurements[key]}
                      <span className="measurement-unit"> {unit}</span>
                    </span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
