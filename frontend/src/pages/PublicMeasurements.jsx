import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicMeasurements } from '../api/public';
import './PublicMeasurements.css';

const FIELDS = [
  { key: 'bust', label: 'Bust', unit: 'cm' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hip', label: 'Hip', unit: 'cm' },
  { key: 'thigh', label: 'Thigh', unit: 'cm' },
  { key: 'shoeSize', label: 'Shoe size', unit: 'EU' },
];

export default function PublicMeasurements() {
  const { code } = useParams();
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicMeasurements(code)
      .then((res) => setMeasurements(res.data))
      .catch(() => setError('No measurements found for this code.'))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <div className="public-page">
      <header className="public-header">
        <span className="public-logo">Measurely</span>
      </header>
      <main className="public-main">
        <div className="card">
          <h1 className="page-title" style={{ marginBottom: '0.375rem' }}>Measurements</h1>
          <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
            Access code: <code className="inline-code">{code}</code>
          </p>

          {loading && <p className="state-text">Loading…</p>}
          {error && <p className="state-text state-text--error">{error}</p>}

          {measurements && (
            <>
              {measurements.createdAt && (
                <p className="public-date">
                  Last updated: {new Date(measurements.createdAt).toLocaleDateString()}
                </p>
              )}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
