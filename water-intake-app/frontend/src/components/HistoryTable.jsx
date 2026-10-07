import { formatDate, formatTime } from '../utils/date.js';

export default function HistoryTable({ records, onEdit, onDelete }) {
  if (!records.length) {
    return <div className="empty">No records found.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Note</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td data-label="Date">{formatDate(r.date)}</td>
              <td data-label="Time">{formatTime(r.time)}</td>
              <td data-label="Amount"><strong>{r.amount} ml</strong></td>
              <td data-label="Note" className="muted">{r.note || '—'}</td>
              <td className="row-actions">
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(r)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(r)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
