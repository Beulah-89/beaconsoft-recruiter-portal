import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Briefcase, ListChecks, Users, UserCircle, LogOut, Search, MapPin, Clock, DollarSign, X, Plus, Flame, Lock, Paperclip, FileText } from 'lucide-react';

// ---- Easy to customize ----
const COMPANY_NAME = "Beaconsoft IT Pvt Ltd";
const COMPANY_TAGLINE = "Recruiter Portal";
const COMPANY_INITIAL = "B";
// Brand colors — change these to match your real brand
const BRAND = {
  accent: '#2563EB',      // primary buttons, active nav
  accentHover: '#1D4ED8',
  accentSoft: '#EFF6FF',  // light backgrounds for badges
  accentText: '#1E40AF',
};
// ----------------------------


// ---------------------------------------------------------------
// Local storage shim: mimics the window.storage API this component
// was originally built against, but saves to the browser instead.
// NOTE: this means data is per-browser, not shared across users yet.
// Step 4 (Supabase) replaces this with real shared, permanent storage.
// ---------------------------------------------------------------
const storage = {
  async get(key) {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return { key, value: raw };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
};

const SEED_JOBS = [
  { id: 'j1', title: 'Risk Consulting', client: 'Marsh McLennan', type: 'Contract', location: 'New York, NY', rate: '$80/hr for 6 months', posted: '2026-07-02', hot: false, maxSubs: 5, status: 'Active' },
  { id: 'j2', title: 'Founding HR Generalist', client: 'Bramble Health', type: 'Full-time', location: 'Remote (US)', rate: '$95k - $115k', posted: '2026-07-01', hot: true, maxSubs: 3, status: 'Active' },
  { id: 'j3', title: 'Senior Backend Engineer', client: 'Ferro Analytics', type: 'Full-time', location: 'Austin, TX', rate: '$140k - $170k', posted: '2026-06-28', hot: true, maxSubs: 4, status: 'Active' },
  { id: 'j4', title: 'Bookkeeper, Part-time', client: 'Solstice Studio', type: 'Contract', location: 'Chicago, IL', rate: '$35/hr', posted: '2026-06-25', hot: false, maxSubs: 2, status: 'Active' },
];

function timeAgo(dateStr) {
  const days = Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

// ---------- LOGIN SCREEN ----------
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Recruiter');
  const [error, setError] = useState('');

  const submit = () => {
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    onLogin({ email, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: BRAND.accent }}>
            {COMPANY_INITIAL}
          </div>
          <div>
            <div className="font-semibold text-slate-900 leading-tight">{COMPANY_NAME}</div>
            <div className="text-slate-500 text-xs">{COMPANY_TAGLINE}</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Sign in</h1>
          <p className="text-slate-500 text-sm mb-5">Use your work email to access the portal.</p>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@beaconsoftit.com"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': BRAND.accent }}
          />
          <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-4">
            <option>Recruiter</option>
            <option>Admin</option>
          </select>
          {error && <div className="text-red-600 text-xs mb-3">{error}</div>}
          <button
            onClick={submit}
            className="w-full py-2.5 text-white text-sm font-medium rounded-md"
            style={{ backgroundColor: BRAND.accent }}
          >
            Sign in
          </button>
          <div className="text-xs text-slate-400 mt-4 text-center">
            Demo login — this checks your email format only, it does not verify a real account yet.
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ page, navigate, role, onLogout }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, locked: false },
    { id: 'jobs', label: 'Browse jobs', icon: Briefcase, locked: false },
    { id: 'worklist', label: 'My worklist', icon: ListChecks, locked: false },
    { id: 'candidates', label: 'My candidates', icon: Users, locked: false },
    { id: 'post', label: 'Post a job', icon: Plus, locked: role !== 'Admin' },
    { id: 'profile', label: 'My profile', icon: UserCircle, locked: false },
  ];
  return (
    <div style={{ width: 240 }} className="flex-shrink-0 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: BRAND.accent }}>
          {COMPANY_INITIAL}
        </div>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm tracking-tight truncate">{COMPANY_NAME}</div>
          <div className="text-slate-500 text-xs mt-0.5">{COMPANY_TAGLINE}</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ id, label, icon: Icon, locked }) => (
          <button
            key={id}
            onClick={() => navigate(`/recruiter/${id}`)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
            style={page === id ? { backgroundColor: BRAND.accent, color: 'white', fontWeight: 500 } : {}}
            onMouseEnter={e => { if (page !== id) e.currentTarget.style.backgroundColor = '#1e293b'; }}
            onMouseLeave={e => { if (page !== id) e.currentTarget.style.backgroundColor = ''; }}
          >
            <Icon size={17} />
            <span className="flex-1 text-left">{label}</span>
            {locked && <Lock size={13} className="text-slate-500" />}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-400 hover:bg-slate-800">
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );
}

function JobCard({ job, onAdd, onView, added }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-slate-900 text-base">{job.title}</h3>
          {job.hot && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
              <Flame size={12} /> Hot
            </span>
          )}
        </div>
        <div className="text-slate-500 text-sm mt-0.5">{job.client} ({job.type})</div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" />{job.location}</span>
          <span className="flex items-center gap-1"><DollarSign size={14} className="text-slate-400" />{job.rate}</span>
          <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" />{timeAgo(job.posted)}</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">Max submissions: {job.maxSubs}</div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button onClick={() => onView(job)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">
          View details
        </button>
        <button
          onClick={() => onAdd(job)}
          disabled={added}
          className="px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1.5 justify-center"
          style={added ? { backgroundColor: '#F1F5F9', color: '#94A3B8' } : { backgroundColor: BRAND.accent, color: 'white' }}
        >
          <Plus size={14} /> {added ? 'Added' : 'Add to worklist'}
        </button>
      </div>
    </div>
  );
}

export default function RecruiterPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = (location.pathname.split('/recruiter/')[1] || 'dashboard').split('/')[0];
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [worklist, setWorklist] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', role: '', jobId: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', client: '', type: 'Full-time', location: '', rate: '', maxSubs: 3 });
  const [saveMsg, setSaveMsg] = useState('');

  // Check for a saved session on load
  useEffect(() => {
    (async () => {
      try {
        const u = await storage.get('currentUser');
        if (u && u.value) setUser(JSON.parse(u.value));
      } catch (e) {}
      setAuthChecked(true);
    })();
  }, []);

  // Load data once we know who's logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const j = await storage.get('jobs');
        if (j && j.value) setJobs(JSON.parse(j.value));
      } catch (e) {}
      try {
        const w = await storage.get(`worklist:${user.email}`);
        if (w && w.value) setWorklist(JSON.parse(w.value));
      } catch (e) {}
      try {
        const c = await storage.get(`candidates:${user.email}`);
        if (c && c.value) setCandidates(JSON.parse(c.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, [user]);

  // Keep the URL meaningful — default to /recruiter/dashboard
  useEffect(() => {
    if (user && !location.pathname.startsWith('/recruiter/')) {
      navigate('/recruiter/dashboard', { replace: true });
    }
  }, [user, location.pathname]);

  const persist = useCallback(async (key, value, shared) => {
    try { await storage.set(key, JSON.stringify(value)); } catch (e) {}
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    persist('currentUser', u, false);
  };

  const handleLogout = async () => {
    try { await storage.delete('currentUser'); } catch (e) {}
    setUser(null);
    setLoaded(false);
    navigate('/recruiter/dashboard');
  };

  const addToWorklist = (job) => {
    if (worklist.find(w => w.id === job.id)) return;
    const next = [...worklist, job];
    setWorklist(next);
    persist(`worklist:${user.email}`, next, false);
  };

  const removeFromWorklist = (id) => {
    const next = worklist.filter(w => w.id !== id);
    setWorklist(next);
    persist(`worklist:${user.email}`, next, false);
  };

  const handleResumeSelect = (file) => {
    if (!file) { setResumeFile(null); return; }
    if (file.size > 4 * 1024 * 1024) {
      setSaveMsg('That file is too large for this demo (max 4MB).');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setResumeFile({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const addCandidate = () => {
    if (!newCandidate.name || !newCandidate.jobId) return;
    const job = jobs.find(j => j.id === newCandidate.jobId);
    const next = [...candidates, {
      ...newCandidate,
      id: 'c' + Date.now(),
      jobTitle: job ? job.title : '',
      stage: 'Sourced',
      resumeName: resumeFile ? resumeFile.name : null,
      resumeDataUrl: resumeFile ? resumeFile.dataUrl : null,
    }];
    setCandidates(next);
    persist(`candidates:${user.email}`, next, false);
    setNewCandidate({ name: '', email: '', role: '', jobId: '' });
    setResumeFile(null);
    setSaveMsg('Candidate added');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const updateStage = (id, stage) => {
    const next = candidates.map(c => c.id === id ? { ...c, stage } : c);
    setCandidates(next);
    persist(`candidates:${user.email}`, next, false);
  };

  const postJob = () => {
    if (!newJob.title || !newJob.client) return;
    const job = { ...newJob, id: 'j' + Date.now(), posted: new Date().toISOString().slice(0, 10), hot: false, status: 'Active' };
    const next = [job, ...jobs];
    setJobs(next);
    persist('jobs', next, true);
    setNewJob({ title: '', client: '', type: 'Full-time', location: '', rate: '', maxSubs: 3 });
    setSaveMsg('Job posted to shared board');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) || j.client.toLowerCase().includes(search.toLowerCase())
  );

  const stages = ['Sourced', 'Screened', 'Submitted', 'Interviewing', 'Offer', 'Placed'];

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Loading...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const isAdmin = user.role === 'Admin';
  const pageIsLocked = page === 'post' && !isAdmin;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar page={page} navigate={navigate} role={user.role} onLogout={handleLogout} />
      <div className="flex-1 p-8 max-w-5xl">
        {!loaded ? (
          <div className="text-slate-400 text-sm">Loading...</div>
        ) : pageIsLocked ? (
          <div className="max-w-md">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
              <Lock size={18} className="text-slate-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Admin access required</h1>
            <p className="text-slate-500 text-sm">Posting jobs is limited to Admin accounts. Sign in with an Admin role, or ask an admin on your team to post this opening.</p>
          </div>
        ) : (
          <>
            {page === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">Dashboard</h1>
                <p className="text-slate-500 text-sm mb-6">Welcome back, {user.email}. Here's where things stand.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="text-slate-500 text-xs mb-1">Active jobs</div>
                    <div className="text-2xl font-semibold text-slate-900">{jobs.length}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="text-slate-500 text-xs mb-1">In your worklist</div>
                    <div className="text-2xl font-semibold text-slate-900">{worklist.length}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="text-slate-500 text-xs mb-1">Candidates tracked</div>
                    <div className="text-2xl font-semibold text-slate-900">{candidates.length}</div>
                  </div>
                </div>
                <div className="mt-6 rounded-lg p-4 text-sm" style={{ backgroundColor: BRAND.accentSoft, color: BRAND.accentText, border: `1px solid ${BRAND.accent}33` }}>
                  This is a working prototype. Data is saved to your account and persists between visits. Login here is a demo (email format only) — a production build would verify accounts against a real user database.
                </div>
              </div>
            )}

            {page === 'jobs' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-4">Browse jobs</h1>
                <div className="relative mb-5">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search jobs or clients..."
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-3">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} onAdd={addToWorklist} onView={setModalJob} added={!!worklist.find(w => w.id === job.id)} />
                  ))}
                  {filteredJobs.length === 0 && <div className="text-slate-400 text-sm">No jobs match your search.</div>}
                </div>
              </div>
            )}

            {page === 'worklist' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-4">My worklist</h1>
                {worklist.length === 0 ? (
                  <div className="text-slate-400 text-sm">No jobs added yet. Add jobs from Browse Jobs.</div>
                ) : (
                  <div className="space-y-3">
                    {worklist.map(job => (
                      <div key={job.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{job.title}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{job.client}</div>
                        </div>
                        <button onClick={() => removeFromWorklist(job.id)} className="text-slate-400 hover:text-red-500">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {page === 'candidates' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-4">My candidates</h1>
                <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-slate-700 mb-3">Add a candidate</div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Candidate name" value={newCandidate.name} onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm" />
                    <input placeholder="Email" value={newCandidate.email} onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm" />
                    <input placeholder="Current role" value={newCandidate.role} onChange={e => setNewCandidate({ ...newCandidate, role: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm" />
                    <select value={newCandidate.jobId} onChange={e => setNewCandidate({ ...newCandidate, jobId: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option value="">Link to job opening...</option>
                      {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.client}</option>)}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-md px-3 py-2 cursor-pointer hover:bg-slate-50 w-fit">
                      <Paperclip size={14} />
                      {resumeFile ? resumeFile.name : 'Attach resume (PDF, DOC — max 4MB)'}
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleResumeSelect(e.target.files[0])} />
                    </label>
                  </div>
                  <button onClick={addCandidate} className="mt-3 px-4 py-2 text-white text-sm font-medium rounded-md" style={{ backgroundColor: BRAND.accent }}>Add candidate</button>
                  {saveMsg && <span className="ml-3 text-sm text-green-700">{saveMsg}</span>}
                </div>
                <div className="space-y-2">
                  {candidates.map(c => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 text-sm">{c.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{c.role} · linked to {c.jobTitle || 'no job'}</div>
                        {c.resumeDataUrl && (
                          <a href={c.resumeDataUrl} download={c.resumeName} className="inline-flex items-center gap-1 text-xs mt-1.5" style={{ color: BRAND.accent }}>
                            <FileText size={12} /> {c.resumeName}
                          </a>
                        )}
                      </div>
                      <select value={c.stage} onChange={e => updateStage(c.id, e.target.value)} className="border border-slate-300 rounded-md px-2 py-1.5 text-xs flex-shrink-0">
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                  {candidates.length === 0 && <div className="text-slate-400 text-sm">No candidates yet.</div>}
                </div>
              </div>
            )}

            {page === 'post' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-4">Post a job</h1>
                <div className="bg-white border border-slate-200 rounded-lg p-5 max-w-lg space-y-3">
                  <input placeholder="Job title" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <input placeholder="Client company" value={newJob.client} onChange={e => setNewJob({ ...newJob, client: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm">
                      <option>Full-time</option><option>Contract</option><option>Part-time</option>
                    </select>
                    <input placeholder="Location" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                  <input placeholder="Rate or salary range" value={newJob.rate} onChange={e => setNewJob({ ...newJob, rate: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <input type="number" placeholder="Max submissions" value={newJob.maxSubs} onChange={e => setNewJob({ ...newJob, maxSubs: Number(e.target.value) })} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  <button onClick={postJob} className="px-4 py-2 text-white text-sm font-medium rounded-md" style={{ backgroundColor: BRAND.accent }}>Post job</button>
                  {saveMsg && <div className="text-sm text-green-700">{saveMsg}</div>}
                </div>
              </div>
            )}

            {page === 'profile' && (
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-4">My profile</h1>
                <div className="bg-white border border-slate-200 rounded-lg p-5 max-w-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: BRAND.accentSoft, color: BRAND.accentText }}>
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{user.email}</div>
                      <div className="text-slate-500 text-xs">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">Profile editing, photo upload, and notification settings would live here in a production build.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalJob && (
        <div style={{ position: 'fixed', inset: 0 }} className="bg-black/40 flex items-center justify-center z-50" onClick={() => setModalJob(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">{modalJob.title}</h2>
              <button onClick={() => setModalJob(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="text-slate-500 text-sm mb-4">{modalJob.client} · {modalJob.type}</div>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" />{modalJob.location}</div>
              <div className="flex items-center gap-2"><DollarSign size={14} className="text-slate-400" />{modalJob.rate}</div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" />Posted {timeAgo(modalJob.posted)}</div>
            </div>
            <button
              onClick={() => { addToWorklist(modalJob); setModalJob(null); }}
              className="mt-5 w-full py-2.5 text-white font-medium rounded-md flex items-center justify-center gap-1.5"
              style={{ backgroundColor: BRAND.accent }}
            >
              <Plus size={15} /> Add to worklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
