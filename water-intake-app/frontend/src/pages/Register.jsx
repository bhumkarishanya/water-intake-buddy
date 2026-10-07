import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import { Alert } from '../components/Toast.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', dailyWaterGoal: 2000 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        dailyWaterGoal: Number(form.dailyWaterGoal),
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">💧</div>
        <h1>Create your account</h1>
        <p className="muted">Start reaching your daily water goal.</p>
        <form className="form" onSubmit={submit}>
          <Alert>{error}</Alert>
          <label className="field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={change} required autoComplete="name" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={change} required autoComplete="email" />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Password</span>
              <input type="password" name="password" value={form.password} onChange={change} required autoComplete="new-password" />
            </label>
            <label className="field">
              <span>Confirm password</span>
              <input type="password" name="confirm" value={form.confirm} onChange={change} required autoComplete="new-password" />
            </label>
          </div>
          <label className="field">
            <span>Daily goal (ml)</span>
            <input type="number" name="dailyWaterGoal" min="500" max="10000" step="50" value={form.dailyWaterGoal} onChange={change} required />
          </label>
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
