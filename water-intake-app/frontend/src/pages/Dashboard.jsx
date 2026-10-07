import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import WaterProgress from '../components/WaterProgress.jsx';
import WaterCard from '../components/WaterCard.jsx';
import { localDate, localTime, formatTime, formatMl, weekdayShort } from '../utils/date.js';

const QUICK = [250, 500, 750, 1000];

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data: res } = await api.get('/water/today', { params: { date: localDate() } });
      setData(res);
    } catch (err) {
      toast.show(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickAdd = async (amount) => {
    setAdding(amount);
    try {
      await api.post('/water', { amount, date: localDate(), time: localTime() });
      toast.show(`Added ${formatMl(amount)}`);
      await load();
    } catch (err) {
      toast.show(getErrorMessage(err), 'error');
    } finally {
      setAdding(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="empty">Could not load your data.</div>;

  const maxWeek = Math.max(data.goal, ...data.weekly.map((d) => d.total));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Hi, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="muted">
            {data.goalReached ? "Goal reached — great job staying hydrated!" : `${formatMl(data.remaining)} to go today.`}
          </p>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card center">
          <WaterProgress total={data.total} goal={data.goal} percentage={data.percentage} />
          <div className="quick">
            {QUICK.map((q) => (
              <button key={q} className="btn btn-primary" disabled={adding !== null} onClick={() => quickAdd(q)}>
                {adding === q ? '...' : `+ ${q === 1000 ? '1 L' : `${q} ml`}`}
              </button>
            ))}
          </div>
        </section>

        <section className="stats-grid">
          <WaterCard icon="💧" label="Today's intake" value={formatMl(data.total)} />
          <WaterCard icon="🎯" label="Daily goal" value={formatMl(data.goal)} />
          <WaterCard icon="⏳" label="Remaining" value={formatMl(data.remaining)} accent="warn" />
          <WaterCard icon="✅" label="Completed" value={`${data.percentage}%`} accent="good" />
          <WaterCard icon="📈" label="7-day average" value={formatMl(data.stats.weekAverage)} hint="per day" />
          <WaterCard icon="🏆" label="Goals met this week" value={`${data.stats.daysGoalMet} / 7`} />
        </section>
      </div>

      <div className="dash-grid">
        <section className="card">
          <h2>Last 7 days</h2>
          <div className="bars">
            {data.weekly.map((d) => (
              <div key={d.date} className="bar-col" title={`${d.date}: ${d.total} ml`}>
                <div className="bar-val">{d.total ? (d.total / 1000).toFixed(1) : ''}</div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${d.total >= data.goal ? 'bar-met' : ''}`}
                    style={{ height: `${maxWeek ? (d.total / maxWeek) * 100 : 0}%` }}
                  />
                </div>
                <div className="bar-label">{weekdayShort(d.date)}</div>
              </div>
            ))}
          </div>
          <p className="muted small">Weekly total: {formatMl(data.stats.weekTotal)} · bars in litres, dark = goal met</p>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Recent entries</h2>
            <Link to="/history" className="link">View all</Link>
          </div>
          {data.records.length === 0 ? (
            <div className="empty small">Nothing logged yet today. Tap a button above!</div>
          ) : (
            <ul className="recent">
              {data.records.slice(0, 6).map((r) => (
                <li key={r._id}>
                  <span className="recent-amt">{r.amount} ml</span>
                  <span className="muted">{formatTime(r.time)}{r.note ? ` · ${r.note}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
