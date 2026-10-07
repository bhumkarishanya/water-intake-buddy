import { useState } from 'react';
import { localDate, localTime } from '../utils/date.js';
import { Alert } from './Toast.jsx';

const PRESETS = [250, 500, 750, 1000];

// Used both for "Add Water" and for editing a record in History.
export default function WaterEntryForm({ initial, onSubmit, onCancel, submitLabel = 'Add Water' }) {
  const [form, setForm] = useState({
    amount: initial?.amount ?? '',
    date: initial?.date ?? localDate(),
    time: initial?.time ?? localTime(),
    note: initial?.note ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount < 1 || amount > 5000) {
      setError('Enter an amount between 1 and 5000 ml');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({ ...form, amount });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <Alert>{error}</Alert>

      <label className="field">
        <span>Amount (ml)</span>
        <input type="number" name="amount" min="1" max="5000" value={form.amount} onChange={change} placeholder="e.g. 250" required />
      </label>

      <div className="chips">
        {PRESETS.map((p) => (
          <button type="button" key={p} className={`chip ${Number(form.amount) === p ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, amount: p })}>
            {p === 1000 ? '1 L' : `${p} ml`}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <label className="field">
          <span>Date</span>
          <input type="date" name="date" value={form.date} max={localDate()} onChange={change} required />
        </label>
        <label className="field">
          <span>Time</span>
          <input type="time" name="time" value={form.time} onChange={change} required />
        </label>
      </div>

      <label className="field">
        <span>Note (optional)</span>
        <input type="text" name="note" maxLength={200} value={form.note} onChange={change} placeholder="After workout, with lunch..." />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
