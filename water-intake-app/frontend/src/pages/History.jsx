import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import HistoryTable from '../components/HistoryTable.jsx';
import WaterEntryForm from '../components/WaterEntryForm.jsx';
import { formatDate, formatMl } from '../utils/date.js';

export default function History() {
  const toast = useToast();
  const [date, setDate] = useState('');
  const [result, setResult] = useState({ records: [], totalIntake: 0, count: 0, daily: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/water/history', { params: date ? { date } : {} });
      setResult(data);
    } catch (err) {
      toast.show(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const saveEdit = async (values) => {
    try {
      await api.put(`/water/${editing._id}`, values);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
    toast.show('Record updated');
    setEditing(null);
    load();
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/water/${deleting._id}`);
      toast.show('Record deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.show(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>History</h1>
          <p className="muted">Review, edit or remove past entries.</p>
        </div>
        <div className="filter">
          <label className="field inline">
            <span>Filter by date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {date && <button className="btn btn-outline btn-sm" onClick={() => setDate('')}>Clear</button>}
        </div>
      </div>

      <div className="summary-row">
        <div className="summary-pill"><strong>{formatMl(result.totalIntake)}</strong> total{date ? ` on ${formatDate(date)}` : ''}</div>
        <div className="summary-pill"><strong>{result.count}</strong> entries</div>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner /> : <HistoryTable records={result.records} onEdit={setEditing} onDelete={setDeleting} />}
      </div>

      {!date && result.daily.length > 0 && !loading && (
        <div className="card">
          <h2>Daily totals</h2>
          <ul className="daily-list">
            {result.daily.map((d) => (
              <li key={d.date}><span>{formatDate(d.date)}</span><strong>{formatMl(d.total)}</strong></li>
            ))}
          </ul>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit record</h2>
            <WaterEntryForm initial={editing} onSubmit={saveEdit} onCancel={() => setEditing(null)} submitLabel="Save changes" />
          </div>
        </div>
      )}

      {deleting && (
        <div className="modal-backdrop" onClick={() => setDeleting(null)}>
          <div className="modal small-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete record?</h2>
            <p className="muted">
              {deleting.amount} ml on {formatDate(deleting.date)} will be permanently removed.
            </p>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
