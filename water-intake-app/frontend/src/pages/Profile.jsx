import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast, Alert } from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Profile() {
  const { updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/users/profile')
      .then(({ data }) =>
        setForm({
          name: data.name || '',
          email: data.email || '',
          dailyWaterGoal: data.dailyWaterGoal ?? 2000,
          age: data.age ?? '',
          weight: data.weight ?? '',
        })
      )
      .catch((err) => toast.show(getErrorMessage(err), 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', {
        ...form,
        dailyWaterGoal: Number(form.dailyWaterGoal),
        age: form.age === '' ? null : Number(form.age),
        weight: form.weight === '' ? null : Number(form.weight),
      });
      updateUser(data);
      toast.show('Profile updated');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingSpinner />;

  // Common guideline of ~35 ml per kg body weight, shown only as a hint
  const suggested = form.weight ? Math.round((Number(form.weight) * 35) / 50) * 50 : null;

  return (
    <div className="page narrow">
      <h1>Profile & Settings</h1>
      <p className="muted">Update your details and daily water goal.</p>
      <div className="card">
        <form className="form" onSubmit={submit}>
          <Alert>{error}</Alert>
          <label className="field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={change} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={change} required />
          </label>
          <label className="field">
            <span>Daily water goal (ml)</span>
            <input type="number" name="dailyWaterGoal" min="500" max="10000" step="50" value={form.dailyWaterGoal} onChange={change} required />
            {suggested && (
              <small className="muted">
                A rough guideline for {form.weight} kg is about {suggested} ml. Ask your doctor for personal advice.
              </small>
            )}
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Age</span>
              <input type="number" name="age" min="1" max="120" value={form.age} onChange={change} />
            </label>
            <label className="field">
              <span>Weight (kg)</span>
              <input type="number" name="weight" min="1" max="500" value={form.weight} onChange={change} />
            </label>
          </div>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update profile'}</button>
        </form>
      </div>
    </div>
  );
}
