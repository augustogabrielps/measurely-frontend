import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { createMeasurements } from '../api/measurements';
import './NewMeasurement.css';

const FIELDS = [
  { key: 'bust', label: 'Bust', unit: 'cm' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hip', label: 'Hip', unit: 'cm' },
  { key: 'thigh', label: 'Thigh', unit: 'cm' },
  { key: 'shoeSize', label: 'Shoe size', unit: 'EU' },
];

export default function NewMeasurement() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ bust: '', chest: '', waist: '', hip: '', thigh: '', shoeSize: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {};
    for (const [key, val] of Object.entries(form)) {
      if (val !== '') payload[key] = parseFloat(val);
    }
    if (Object.keys(payload).length === 0) {
      setError('Please enter at least one measurement.');
      return;
    }
    setLoading(true);
    try {
      await createMeasurements(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save measurements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />
      <main className="main-content">
        <h1 className="page-title">Add measurements</h1>
        <p className="page-subtitle">Enter your body measurements. Fill in as many fields as you like.</p>

        <div className="card form-card">
          <form onSubmit={handleSubmit}>
            <div className="measure-form-grid">
              {FIELDS.map(({ key, label, unit }) => (
                <div className="form-group" key={key}>
                  <label htmlFor={key}>
                    {label}
                    <span className="field-unit"> ({unit})</span>
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="number"
                    step="0.1"
                    min="0"
                    value={form[key]}
                    onChange={handleChange}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving…' : 'Save measurements'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
