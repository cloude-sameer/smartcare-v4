import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dash } from './overview.js';
import { Hero } from './art.js';
import { Amb, Beds, Blood, FB, Lab, Pharm, Queue } from './modules.js';
import { Btn, K, load, seed, td } from './core.js';

const MODS = [
  ['dash', 'Overview', Dash, '📊', 'Live snapshot of the whole hospital'],
  ['queue', 'Appointments', Queue, '🗓️', 'Issue tokens and run the live doctor queue'],
  ['beds', 'Rooms & Beds', Beds, '🛏️', 'Admit and discharge patients'],
  ['pharm', 'Pharmacy', Pharm, '💊', 'Dispense medicines and manage stock'],
  ['lab', 'Laboratory', Lab, '🧪', 'Order tests and report results'],
  ['blood', 'Blood Bank', Blood, '🩸', 'Donations, stock and requests'],
  ['amb', 'Ambulance', Amb, '🚑', 'Fleet and emergency dispatch'],
  ['fb', 'Feedback', FB, '⭐', 'Patient ratings and comments'],
];

const GROUPS = [
  ['Main', ['dash']],
  ['Patient care', ['queue', 'beds']],
  ['Services', ['pharm', 'lab', 'blood']],
  ['Emergency & quality', ['amb', 'fb']],
];

function DashboardApp({ theme, setTheme }) {
  const navigate = useNavigate();
  const { tab: routeTab = 'dash' } = useParams();
  const tab = MODS.some((module) => module[0] === routeTab) ? routeTab : 'dash';
  const [db, setDb] = useState(load);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!MODS.some((module) => module[0] === routeTab)) navigate('/dashboard/dash', { replace: true });
  }, [navigate, routeTab]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === K) setDb(load());
    };
    addEventListener('storage', onStorage);
    return () => removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(K, JSON.stringify(db));
    } catch {
      setMsg('Changes could not be saved in this browser.');
    }
  }, [db]);

  const update = (key, transform) => {
    setDb((current) => ({ ...current, [key]: transform(current[key]) }));
  };

  const toast = (message) => {
    setMsg(message);
    window.setTimeout(() => setMsg(''), 2500);
    if (!/^(Enter|Invalid|Only|No |Allow|Insufficient|Name|Caller|Medicine is)/.test(message)) {
      update('log', (activity) => [
        { t: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), m: message },
        ...(activity || []),
      ].slice(0, 8));
    }
  };

  const today = td();
  const badges = {
    queue: db.queue.filter((item) => item.date === today && item.status === 'waiting').length,
    pharm: db.meds.filter((medicine) => medicine.stock < 20 || medicine.exp < today).length,
    lab: db.labs.filter((item) => item.status !== 'reported').length,
    blood: db.breq.filter((request) => request.status === 'pending').length,
    amb: db.calls.filter((call) => call.st === 'waiting').length,
  };
  const module = MODS.find((item) => item[0] === tab);
  const ModuleView = module[2];

  const resetDemo = () => {
    if (!window.confirm('Reset all modules to demo data?')) return;
    setDb(seed());
    toast('Demo data restored');
  };

  return (
    <div className={`app${open ? ' open' : ''}`}>
      <aside className="side" aria-label="Dashboard navigation">
        <Link className="logo" to="/dashboard/dash" aria-label="SmartCare overview">
          <i aria-hidden="true">+</i>
          <div><b>SmartCare</b><span>Hospital Suite</span></div>
        </Link>
        {GROUPS.map(([group, ids]) => (
          <div key={group}>
            <div className="grp">{group}</div>
            {ids.map((id) => {
              const item = MODS.find((entry) => entry[0] === id);
              return (
                <Link
                  key={id}
                  className={tab === id ? 'on' : ''}
                  to={`/dashboard/${id}`}
                  aria-current={tab === id ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden="true">{item[3]}</span>
                  <em>{item[1]}</em>
                  {badges[id] > 0 && <u aria-label={`${badges[id]} alerts`}>{badges[id]}</u>}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="sfoot">
          <Link to="/">← Back to website</Link>
          <div>Demo data · saved in your browser</div>
        </div>
      </aside>
      <button className="scrim" type="button" aria-label="Close navigation" onClick={() => setOpen(false)} />
      <div className="content">
        <header>
          <button className="burger" type="button" aria-label="Open dashboard navigation" onClick={() => setOpen(true)}>☰</button>
          <div className="ttl"><h1>{module[1]}</h1><span className="mu">{module[4]}</span></div>
          <span className="mu date">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="user"><i className="av" aria-hidden="true">A</i><b>Admin</b></span>
          <button className="ico" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          {Btn('Reset demo', resetDemo, 'dng')}
        </header>
        <main>
          <Hero k={tab} name={module[1]} />
          <ModuleView db={db} set={update} toast={toast} go={(nextTab) => navigate(`/dashboard/${nextTab}`)} />
        </main>
      </div>
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  );
}

export default DashboardApp;
