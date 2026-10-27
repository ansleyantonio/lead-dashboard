import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Bell,
  CalendarDots,
  CaretDown,
  CaretRight,
  Check,
  CheckCircle,
  ChatCircleDots,
  CheckSquareOffset,
  Clock,
  DotsThree,
  DownloadSimple,
  EnvelopeSimple,
  FileText,
  Funnel,
  Gauge,
  Lightning,
  MagnifyingGlass,
  NotePencil,
  Phone,
  Plus,
  Rows,
  ShieldCheck,
  SlidersHorizontal,
  SquaresFour,
  Target,
  TrendUp,
  UploadSimple,
  UserCircle,
  UserPlus,
  UsersThree,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { authenticateDemoUser, clearDemoSession, getDemoSession, loadDemoLeads, persistDemoLeads, type DemoSession } from "./lib/demoDb";

type LeadStatus = "New" | "Assigned" | "Contacted" | "Converted" | "Closed";
type Lead = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  source: string;
  sourceType: string;
  status: LeadStatus;
  owner: string;
  ownerInitials: string;
  temperature: "Hot" | "Warm" | "Cold";
  interest: string;
  institution: string;
  nextAction: string;
  nextActionType: "contact" | "follow-up" | "review" | "convert";
  lastActivity: string;
  created: string;
  age: string;
  sla: string;
  flags: string[];
  progress: number;
};

const initialLeads: Lead[] = [
  {
    id: "LD-4821",
    name: "Saskia Vermeer",
    initials: "SV",
    email: "saskia.vermeer@email.com",
    phone: "+31 6 1847 2239",
    source: "Meta · September intake",
    sourceType: "Paid social",
    status: "New",
    owner: "Unassigned",
    ownerInitials: "",
    temperature: "Hot",
    interest: "BSc Computer Science",
    institution: "Westbridge University",
    nextAction: "Contact within 42 min",
    nextActionType: "contact",
    lastActivity: "Lead captured 18 min ago",
    created: "Today, 08:42",
    age: "18m",
    sla: "42m",
    flags: ["Unassigned", "Awaiting course link"],
    progress: 20,
  },
  {
    id: "LD-4817",
    name: "Malik Okafor",
    initials: "MO",
    email: "malik.okafor@email.com",
    phone: "+234 803 518 9071",
    source: "Partner referral · Atlas",
    sourceType: "Referral",
    status: "Assigned",
    owner: "Maya Chen",
    ownerInitials: "MC",
    temperature: "Hot",
    interest: "MSc Data Analytics",
    institution: "Northstar Institute",
    nextAction: "Follow-up due today",
    nextActionType: "follow-up",
    lastActivity: "Email opened 1h ago",
    created: "Today, 07:51",
    age: "1h",
    sla: "Due",
    flags: ["Due today"],
    progress: 46,
  },
  {
    id: "LD-4809",
    name: "Elena Rossi",
    initials: "ER",
    email: "elena.rossi@email.com",
    phone: "+39 348 129 6740",
    source: "Organic search",
    sourceType: "Organic",
    status: "Contacted",
    owner: "Maya Chen",
    ownerInitials: "MC",
    temperature: "Warm",
    interest: "BA International Business",
    institution: "Easton Business School",
    nextAction: "Send course shortlist",
    nextActionType: "review",
    lastActivity: "Call logged 2h ago",
    created: "Today, 06:24",
    age: "2h",
    sla: "On track",
    flags: ["Ready to convert"],
    progress: 72,
  },
  {
    id: "LD-4794",
    name: "Theo Mbatha",
    initials: "TM",
    email: "theo.mbatha@email.com",
    phone: "+27 72 391 8804",
    source: "Open day · Cape Town",
    sourceType: "Event",
    status: "Assigned",
    owner: "Jules Martin",
    ownerInitials: "JM",
    temperature: "Warm",
    interest: "LLM International Law",
    institution: "Crownbridge College",
    nextAction: "Overdue by 1 day",
    nextActionType: "follow-up",
    lastActivity: "No activity since 26 Oct",
    created: "Yesterday, 15:10",
    age: "18h",
    sla: "Overdue",
    flags: ["Overdue", "Stale"],
    progress: 39,
  },
  {
    id: "LD-4788",
    name: "Nadia Al-Khatib",
    initials: "NA",
    email: "nadia.alkhatib@email.com",
    phone: "+962 7 9012 4438",
    source: "Course link · referral",
    sourceType: "Referral",
    status: "Contacted",
    owner: "Ravi Shah",
    ownerInitials: "RS",
    temperature: "Warm",
    interest: "MA Digital Marketing",
    institution: "Westbridge University",
    nextAction: "Review readiness",
    nextActionType: "convert",
    lastActivity: "Document uploaded 3h ago",
    created: "Yesterday, 11:36",
    age: "23h",
    sla: "On track",
    flags: ["Ready to convert"],
    progress: 91,
  },
  {
    id: "LD-4771",
    name: "Ari Bennett",
    initials: "AB",
    email: "ari.bennett@email.com",
    phone: "+1 647 281 0736",
    source: "Landing page · Canada",
    sourceType: "Organic",
    status: "New",
    owner: "Unassigned",
    ownerInitials: "",
    temperature: "Cold",
    interest: "BEng Software Engineering",
    institution: "Northstar Institute",
    nextAction: "Contact within 2h",
    nextActionType: "contact",
    lastActivity: "Lead captured 4h ago",
    created: "Today, 06:14",
    age: "4h",
    sla: "2h",
    flags: ["Unassigned"],
    progress: 17,
  },
];

const navItems = [
  { label: "Overview", icon: SquaresFour },
  { label: "Lead inbox", icon: Rows, count: 27 },
  { label: "Follow-ups", icon: CheckSquareOffset, count: 12 },
  { label: "Team workload", icon: UsersThree },
  { label: "Reports", icon: TrendUp },
  { label: "Projects", icon: NotePencil },
];

const pipeline = [
  { label: "New", count: 42, color: "clay", change: "+8.4%" },
  { label: "Assigned", count: 31, color: "gold", change: "+3.1%" },
  { label: "Contacted", count: 24, color: "sage", change: "+12.6%" },
  { label: "Converted", count: 9, color: "ink", change: "+18.2%" },
];

const workload = [
  { name: "Maya Chen", initials: "MC", role: "You", active: 14, due: 5, load: 72, tone: "clay" },
  { name: "Jules Martin", initials: "JM", role: "Advisor", active: 19, due: 4, load: 84, tone: "sage" },
  { name: "Ravi Shah", initials: "RS", role: "Advisor", active: 11, due: 2, load: 58, tone: "gold" },
  { name: "Inez Walker", initials: "IW", role: "Advisor", active: 8, due: 1, load: 41, tone: "plum" },
];

const statusOptions: Array<LeadStatus | "All"> = ["All", "New", "Assigned", "Contacted", "Converted", "Closed"];

function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getDemoSession());
  if (!session) return <LoginPage onLogin={setSession} />;
  return <PortalApp session={session} onLogout={() => { clearDemoSession(); setSession(null); }} />;
}

function LoginPage({ onLogin }: { onLogin: (session: DemoSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = authenticateDemoUser(email, password);
    if (!session) {
      setError("That email or password is not recognised. Use the demo account below.");
      return;
    }
    setError("");
    onLogin(session);
  };

  return <main className="auth-shell">
    <section className="auth-frame" aria-labelledby="login-title">
      <aside className="auth-visual">
        <div className="auth-brand"><div className="brand-mark">L</div><div><strong>Lead Operations</strong><span>Advisor workspace</span></div></div>
        <div className="auth-visual-copy"><span className="auth-kicker">Advisor operations</span><h1>Move every enquiry <em>forward.</em></h1><p>One focused workspace for the leads that need a decision, a call, or a clear next step.</p></div>
        <div className="auth-principles"><div><CheckCircle size={16} /><span><strong>Qualify with context</strong><small>Keep source, consent, and history together.</small></span></div><div><CheckCircle size={16} /><span><strong>Make the next move obvious</strong><small>Give every active lead a clear action.</small></span></div><div><CheckCircle size={16} /><span><strong>Carry ownership forward</strong><small>Protect the handoff from lead to application.</small></span></div></div>
        <div className="auth-visual-footer"><span><ShieldCheck size={15} /> Secure advisor workspace</span><span>Qualify · Assign · Convert</span></div>
      </aside>
      <section className="auth-panel">
        <div className="auth-panel-top"><span>Sign in</span><span className="auth-panel-workspace"><ShieldCheck size={13} /> Secure workspace access</span></div>
        <div className="auth-copy"><span className="eyebrow">Good to see you</span><h2 id="login-title">Welcome back.</h2><p>Sign in to work leads, follow up with prospects, and keep every qualification decision in one place.</p></div>
        <form className="auth-form" onSubmit={submit}>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@leadops.demo" required /></label>
          <label>Password<span className="auth-password-label"><span>Password</span><button type="button" onClick={() => setError("Password reset is disabled in demo mode.")}>Forgot password?</button></span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" required /></label>
          {error && <div className="auth-error" role="alert"><WarningCircle size={16} />{error}</div>}
          <button className="button button-primary auth-submit" type="submit">Enter workspace <ArrowUpRight size={16} /></button>
        </form>
        <p className="auth-support-line"><ShieldCheck size={14} /> Use your workspace credentials. Contact your workspace administrator if you need access.</p>
      </section>
    </section>
  </main>;
}

function PortalApp({ session, onLogout }: { session: DemoSession; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>(() => loadDemoLeads(initialLeads));
  useEffect(() => { persistDemoLeads(leads); }, [leads]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeads[0].id);
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Today");
  const [notice, setNotice] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const sessionInitials = session.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = activeStatus === "All" || lead.status === activeStatus;
      const matchesQuery = !normalized || [lead.name, lead.id, lead.source, lead.interest, lead.owner]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, leads, query]);

  const selectedLead = selectedLeadId ? leads.find((lead) => lead.id === selectedLeadId) : undefined;

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const updateLead = (leadId: string, patch: Partial<Lead>, message: string) => {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)));
    showNotice(message);
  };

  const claimLead = (lead: Lead) => {
    updateLead(lead.id, {
      owner: "Maya Chen",
      ownerInitials: "MC",
      status: lead.status === "New" ? "Assigned" : lead.status,
      flags: lead.flags.filter((flag) => flag !== "Unassigned"),
    }, `${lead.name} is now assigned to you.`);
  };

  const logContact = (lead: Lead) => {
    updateLead(lead.id, {
      status: "Contacted",
      lastActivity: "Contact attempt logged just now",
      nextAction: "Schedule next follow-up",
      nextActionType: "follow-up",
      progress: Math.max(lead.progress, 57),
    }, `Contact logged for ${lead.name}.`);
  };

  const toggleRow = (id: string) => {
    setSelectedRows((rows) => rows.includes(id) ? rows.filter((row) => row !== id) : [...rows, id]);
  };

  const toggleAll = () => {
    setSelectedRows((rows) => rows.length === filteredLeads.length ? [] : filteredLeads.map((lead) => lead.id));
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">L</div>
          <div>
            <strong>Lead Operations</strong>
            <span>Advisor workspace</span>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">LO</div>
          <div className="workspace-copy">
            <span className="eyebrow">Workspace</span>
            <strong>Aggregator — UK</strong>
          </div>
          <CaretDown size={14} weight="bold" />
        </div>

        <div className="nav-group">
          <span className="nav-label">Workspace</span>
          <nav>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.label;
              return (
                <button
                  className={`nav-item ${active ? "active" : ""}`}
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.label === "Lead inbox") setActiveStatus("All");
                  }}
                >
                  <Icon size={18} weight={active ? "fill" : "regular"} />
                  <span>{item.label}</span>
                  {item.count && <em>{item.count}</em>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="nav-group nav-group-secondary">
          <span className="nav-label">Operations</span>
          <button className={`nav-item ${activeNav === "Source health" ? "active" : ""}`} onClick={() => setActiveNav("Source health")}>
            <Lightning size={18} />
            <span>Source health</span>
            <span className="status-dot" />
          </button>
          <button className={`nav-item ${activeNav === "Import leads" ? "active" : ""}`} onClick={() => setActiveNav("Import leads")}>
            <UploadSimple size={18} />
            <span>Import leads</span>
          </button>
          <button className={`nav-item ${activeNav === "Audit log" ? "active" : ""}`} onClick={() => setActiveNav("Audit log")}>
            <ShieldCheck size={18} />
            <span>Audit log</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="sync-card">
            <div className="sync-icon"><Lightning size={15} weight="fill" /></div>
            <div>
              <strong>Sources are live</strong>
              <span>Last sync 2 min ago</span>
            </div>
            <span className="pulse-dot" />
          </div>
          <button className="profile-card" onClick={onLogout} title="Sign out">
            <div className="avatar avatar-clay">{sessionInitials}</div>
            <div>
              <strong>{session.name}</strong>
              <span>{session.role}</span>
            </div>
            <span className="profile-signout">Sign out</span>
          </button>
        </div>
      </aside>

      <main id="main-content" className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">L</div><strong>Lead Operations</strong></div>
          <div className="breadcrumb"><span>Operations</span><CaretRight size={13} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <MagnifyingGlass size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, IDs, sources" />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showNotice("You are all caught up.")}>
              <Bell size={19} />
              <span />
            </button>
            <div className="avatar avatar-clay top-avatar">{sessionInitials}</div>
          </div>
        </header>

        <div className="content-wrap">
        {activeNav === "Overview" ? <>
          <section className="page-intro">
            <div>
              <div className="date-line"><CalendarDots size={16} /> Tuesday, 27 October 2026 <span className="date-separator" /> <span>London · 09:42</span></div>
              <h1>Good morning, Maya<span className="heading-period">.</span></h1>
              <p>Here is the work that needs a decision today. You have <strong>27 active leads</strong> across the aggregator pool.</p>
            </div>
            <div className="intro-actions">
              <button className="button button-secondary" onClick={() => showNotice("Export prepared for your current view.")}><DownloadSimple size={17} /> Export view</button>
              <button className="button button-primary" onClick={() => showNotice("New lead capture flow opened.")}><Plus size={18} weight="bold" /> Capture new lead</button>
            </div>
          </section>

          <section className="signal-strip" aria-label="Key lead signals">
            <SignalBlock label="Attention today" value="18" detail="12% fewer than last week" icon={Target} tone="clay" trend="down" />
            <SignalBlock label="Unassigned queue" value="07" detail="2 added since 09:00" icon={UserPlus} tone="gold" trend="up" />
            <SignalBlock label="Follow-ups due" value="12" detail="4 are already overdue" icon={Clock} tone="ink" trend="up" />
            <SignalBlock label="Ready to convert" value="09" detail="18% higher this week" icon={ArrowUpRight} tone="sage" trend="up" />
          </section>

          <section className="hero-grid">
            <div className="sla-panel panel-dark">
              <div className="panel-kicker light-kicker"><Gauge size={16} weight="fill" /> Response pulse</div>
              <div className="sla-heading-row">
                <div>
                  <h2>First-contact SLA</h2>
                  <p>Keep new enquiries moving before they cool.</p>
                </div>
                <div className="sla-score"><strong>82.4%</strong><span>on track</span></div>
              </div>
              <div className="sla-track"><motion.div initial={{ width: 0 }} animate={{ width: "82.4%" }} transition={{ duration: 1, ease: "easeOut" }} /></div>
              <div className="sla-foot"><span>Target <b>80%</b></span><span>Median response <b>1h 18m</b></span><span className="green-text"><ArrowUp size={14} /> 6.8% this week</span></div>
            </div>
            <div className="decision-panel panel-light">
              <div className="decision-topline"><span className="panel-kicker"><Lightning size={15} weight="fill" /> Focus for today</span><span className="mini-status">Live queue</span></div>
              <div className="decision-body">
                <div>
                  <span className="eyebrow">Next best action</span>
                  <h2>Clear the unassigned queue</h2>
                  <p>Seven new leads are waiting for an owner. Assigning them now keeps the 2-hour response promise intact.</p>
                </div>
                <div className="queue-ring"><span>07</span><small>leads</small></div>
              </div>
              <button className="text-button" onClick={() => { setActiveStatus("New"); setActiveNav("Lead inbox"); }}>Review unassigned <ArrowUpRight size={16} /></button>
            </div>
          </section>

          <section className="section-block queue-section">
            <div className="section-header">
              <div>
                <div className="section-overline"><span className="live-line" /> Live priority queue</div>
                <h2>Work that needs a decision</h2>
              </div>
              <div className="section-tools">
                <div className="segmented-control">
                  {["Today", "This week", "All time"].map((range) => <button key={range} className={dateRange === range ? "selected" : ""} onClick={() => setDateRange(range)}>{range}</button>)}
                </div>
                <button className={`filter-button ${filterOpen ? "active" : ""}`} onClick={() => setFilterOpen(!filterOpen)}><Funnel size={16} /> Filters <span>3</span></button>
              </div>
            </div>

            <AnimatePresence>
              {filterOpen && (
                <motion.div className="filter-drawer" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="filter-drawer-copy"><span className="eyebrow">Refine queue</span><strong>Show leads that need your attention first.</strong></div>
                  <div className="filter-selects">
                    <label>Status<select value={activeStatus} onChange={(event) => setActiveStatus(event.target.value as LeadStatus | "All")}><option value="All">All statuses</option>{statusOptions.slice(1).map((status) => <option key={status}>{status}</option>)}</select></label>
                    <label>Owner<select defaultValue="Everyone"><option>Everyone</option><option>My leads</option><option>Unassigned</option></select></label>
                    <label>Flag<select defaultValue="Any flag"><option>Any flag</option><option>Overdue</option><option>Ready to convert</option><option>Awaiting course link</option></select></label>
                  </div>
                  <button className="icon-button" onClick={() => setFilterOpen(false)} aria-label="Close filters"><X size={17} /></button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="queue-toolbar">
              <div className="queue-tabs">
                {(["All", "New", "Assigned", "Contacted"] as const).map((status) => <button key={status} className={activeStatus === status ? "active" : ""} onClick={() => setActiveStatus(status)}>{status === "All" ? "All priority" : status}<span>{status === "All" ? leads.length : leads.filter((lead) => lead.status === status).length}</span></button>)}
              </div>
              <div className="selected-summary">{selectedRows.length > 0 && <><span>{selectedRows.length} selected</span><button onClick={() => showNotice("Bulk assignment flow opened.")}>Assign</button><button onClick={() => setSelectedRows([])}>Clear</button></>}</div>
            </div>

            <div className="queue-table-wrap">
              <table className="queue-table">
                <thead><tr><th className="check-cell"><button className={`checkbox ${selectedRows.length === filteredLeads.length && filteredLeads.length ? "checked" : ""}`} onClick={toggleAll}>{selectedRows.length === filteredLeads.length && filteredLeads.length ? <Check size={13} weight="bold" /> : null}</button></th><th>Lead</th><th>Signal</th><th>Status</th><th>Owner</th><th>Next action</th><th>Last activity</th><th /></tr></thead>
                <tbody>
                  {filteredLeads.map((lead, index) => <LeadRow key={lead.id} lead={lead} index={index} selected={selectedLeadId === lead.id} checked={selectedRows.includes(lead.id)} onSelect={() => setSelectedLeadId(lead.id)} onToggle={() => toggleRow(lead.id)} onClaim={() => claimLead(lead)} />)}
                  {filteredLeads.length === 0 && <tr><td colSpan={8}><div className="empty-state"><MagnifyingGlass size={24} /><strong>No leads match this view</strong><span>Try a different status or search term.</span><button className="text-button" onClick={() => { setQuery(""); setActiveStatus("All"); }}>Clear filters</button></div></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredLeads.length}</strong> of {leads.length} leads</span><button className="text-button" onClick={() => { setActiveNav("Lead inbox"); showNotice("Full lead inbox opened."); }}>Open full inbox <ArrowUpRight size={15} /></button></div>
          </section>

          <section className="lower-grid">
            <div className="section-block pipeline-panel">
              <div className="section-header compact"><div><div className="section-overline">Lifecycle view</div><h2>Lead pipeline</h2></div><button className="icon-button" onClick={() => showNotice("Pipeline details opened.")}><DotsThree size={20} /></button></div>
              <div className="pipeline-list">
                {pipeline.map((stage, index) => <button className="pipeline-row" key={stage.label} onClick={() => setActiveStatus(stage.label as LeadStatus)}><span className={`pipeline-index ${stage.color}`}>0{index + 1}</span><span className="pipeline-label">{stage.label}</span><div className="pipeline-bar"><span className={stage.color} style={{ width: `${(stage.count / 42) * 100}%` }} /></div><strong>{stage.count}</strong><span className="pipeline-change"><ArrowUp size={12} /> {stage.change}</span><CaretRight size={15} className="pipeline-arrow" /></button>)}
              </div>
              <div className="pipeline-note"><div className="note-mark"><TrendUp size={15} /></div><span>Conversion is strongest on <strong>referral leads</strong> this week.</span><button className="text-button">View source mix <ArrowUpRight size={14} /></button></div>
            </div>

            <div className="section-block workload-panel">
              <div className="section-header compact"><div><div className="section-overline">Manager view</div><h2>Team workload</h2></div><button className="text-button" onClick={() => setActiveNav("Team workload")}>View team <ArrowUpRight size={15} /></button></div>
              <div className="workload-list">{workload.map((person, index) => <div className="workload-row" key={person.name}><div className={`avatar avatar-${person.tone}`}>{person.initials}</div><div className="workload-person"><strong>{person.name} {person.role === "You" && <span className="you-tag">you</span>}</strong><span>{person.active} active · {person.due} due</span></div><div className="load-meter"><span style={{ width: `${person.load}%` }} className={`load-${person.tone}`} /></div><span className="load-value">{person.load}%</span></div>)}</div>
              <div className="workload-footer"><span><span className="status-dot" /> Team capacity healthy</span><strong>52 active leads</strong></div>
            </div>
          </section>

          <section className="section-block recent-section">
            <div className="section-header compact"><div><div className="section-overline">Activity stream</div><h2>Recent movement</h2></div><button className="text-button" onClick={() => showNotice("Activity history opened.")}>View audit trail <ArrowUpRight size={15} /></button></div>
            <div className="activity-grid">
              <ActivityItem icon={CheckCircle} tone="sage" title="Nadia Al-Khatib moved to ready to convert" meta="Ravi Shah · 14 min ago" />
              <ActivityItem icon={EnvelopeSimple} tone="gold" title="Malik Okafor opened the course shortlist" meta="Automated signal · 27 min ago" />
              <ActivityItem icon={UserPlus} tone="clay" title="Three new leads entered the queue" meta="Meta September intake · 42 min ago" />
              <ActivityItem icon={FileText} tone="ink" title="Ari Bennett uploaded a passport scan" meta="Document received · 1h ago" />
            </div>
          </section>
        </> : <WorkspaceView
          activeNav={activeNav}
          leads={leads}
          filteredLeads={filteredLeads}
          query={query}
          setQuery={setQuery}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          selectedRows={selectedRows}
          toggleAll={toggleAll}
          toggleRow={toggleRow}
          setSelectedLeadId={(id) => setSelectedLeadId(id)}
          onClaim={claimLead}
          showNotice={showNotice}
          setActiveNav={setActiveNav}
        />}
        </div>
      </main>

      <AnimatePresence>
        {selectedLead && <motion.aside className="focus-drawer" initial={{ x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 28 }} key={selectedLead.id}>
          <div className="drawer-topline"><span className="panel-kicker"><Lightning size={15} weight="fill" /> Quick action</span><button className="icon-button" aria-label="Close lead focus" onClick={() => setSelectedLeadId(null)}><X size={17} /></button></div>
          <div className="drawer-profile"><div className={`avatar avatar-${selectedLead.ownerInitials === "MC" ? "clay" : "sage"} large-avatar`}>{selectedLead.initials}</div><div><span className="eyebrow">{selectedLead.id} · {selectedLead.sourceType}</span><h2>{selectedLead.name}</h2><p>{selectedLead.interest}</p></div></div>
          <div className="drawer-status-row"><StatusBadge status={selectedLead.status} /><span className={`temperature ${selectedLead.temperature.toLowerCase()}`}><span /> {selectedLead.temperature} intent</span><span className="drawer-age">{selectedLead.age} old</span></div>
          <div className="action-callout"><span className="eyebrow">Next best action</span><strong>{selectedLead.nextAction}</strong><p>{selectedLead.lastActivity}</p><div className="callout-actions"><button className="button button-primary small" onClick={() => selectedLead.owner === "Unassigned" ? claimLead(selectedLead) : logContact(selectedLead)}>{selectedLead.owner === "Unassigned" ? <><UserPlus size={15} /> Claim lead</> : <><Phone size={15} /> Log contact</>}</button><button className="button button-ghost small" onClick={() => showNotice("Follow-up composer opened.")}><CalendarDots size={15} /> Schedule</button></div></div>
          <div className="drawer-section"><div className="drawer-section-title"><span>Readiness</span><span className="readiness-score">{selectedLead.progress}%</span></div><div className="readiness-track"><span style={{ width: `${selectedLead.progress}%` }} /></div><div className="checklist"><ChecklistRow label="Identity captured" done={selectedLead.progress > 35} /><ChecklistRow label="Consent recorded" done={selectedLead.progress > 50} /><ChecklistRow label="Course linked" done={selectedLead.progress > 80} /><ChecklistRow label="Duplicate review" done={selectedLead.progress > 85} /></div></div>
          <div className="drawer-section activity-preview"><div className="drawer-section-title"><span>Latest activity</span><button className="text-button">View all</button></div><div className="mini-timeline"><div className="timeline-line" /><div className="timeline-item"><div className="timeline-dot clay" /><div><strong>{selectedLead.lastActivity}</strong><span>System event · today</span></div></div><div className="timeline-item"><div className="timeline-dot sage" /><div><strong>Lead captured from {selectedLead.sourceType.toLowerCase()}</strong><span>{selectedLead.created}</span></div></div></div></div>
          <div className="drawer-footer"><button className="text-button" onClick={() => showNotice("Lead details opened.")}>Open full record <ArrowUpRight size={15} /></button><button className="icon-button" onClick={() => showNotice("More actions opened.")}><DotsThree size={20} /></button></div>
        </motion.aside>}
      </AnimatePresence>

      <AnimatePresence>{notice && <motion.div className="toast" role="status" aria-live="polite" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}><CheckCircle size={18} weight="fill" /><span>{notice}</span></motion.div>}</AnimatePresence>
    </div>
  );
}

function SignalBlock({ label, value, detail, icon: Icon, tone, trend }: { label: string; value: string; detail: string; icon: typeof Target; tone: string; trend: "up" | "down" }) {
  return <div className="signal-block"><div className={`signal-icon ${tone}`}><Icon size={17} weight="fill" /></div><div className="signal-copy"><span>{label}</span><strong>{value}</strong><small className={trend === "down" ? "good" : ""}>{trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{detail}</small></div></div>;
}

function LeadRow({ lead, index, selected, checked, onSelect, onToggle, onClaim }: { lead: Lead; index: number; selected: boolean; checked: boolean; onSelect: () => void; onToggle: () => void; onClaim: () => void }) {
  return <motion.tr className={selected ? "selected-row" : ""} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={onSelect}>
    <td className="check-cell"><button className={`checkbox ${checked ? "checked" : ""}`} onClick={(event) => { event.stopPropagation(); onToggle(); }}>{checked ? <Check size={13} weight="bold" /> : null}</button></td>
    <td><div className="lead-cell"><div className={`avatar avatar-${index % 3 === 0 ? "clay" : index % 3 === 1 ? "sage" : "gold"}`}>{lead.initials}</div><div><strong>{lead.name}</strong><span>{lead.id} · {lead.interest}</span></div></div></td>
    <td><div className="signal-cell"><span className={`temperature ${lead.temperature.toLowerCase()}`}><span /> {lead.temperature}</span>{lead.flags.slice(0, 1).map((flag) => <span className={`flag flag-${flag.toLowerCase().replace(/\s/g, "-")}`} key={flag}>{flag}</span>)}</div></td>
    <td><StatusBadge status={lead.status} /></td>
    <td>{lead.owner === "Unassigned" ? <button className="claim-link" onClick={(event) => { event.stopPropagation(); onClaim(); }}><UserPlus size={14} /> Claim</button> : <div className="owner-cell"><div className="avatar avatar-neutral tiny-avatar">{lead.ownerInitials}</div><span>{lead.owner === "Maya Chen" ? "You" : lead.owner}</span></div>}</td>
    <td><div className={`next-action ${lead.sla === "Overdue" ? "overdue" : ""}`}><span>{lead.nextAction}</span>{lead.sla === "Overdue" ? <WarningCircle size={14} weight="fill" /> : <CaretRight size={14} />}</div></td>
    <td><span className="last-activity">{lead.lastActivity}</span></td>
    <td><button className="icon-button row-more" onClick={(event) => event.stopPropagation()}><DotsThree size={18} /></button></td>
  </motion.tr>;
}

type WorkspaceViewProps = {
  activeNav: string;
  leads: Lead[];
  filteredLeads: Lead[];
  query: string;
  setQuery: (value: string) => void;
  activeStatus: LeadStatus | "All";
  setActiveStatus: (value: LeadStatus | "All") => void;
  selectedRows: string[];
  toggleAll: () => void;
  toggleRow: (id: string) => void;
  setSelectedLeadId: (id: string) => void;
  onClaim: (lead: Lead) => void;
  showNotice: (message: string) => void;
  setActiveNav: (value: string) => void;
};

function WorkspaceView(props: WorkspaceViewProps) {
  switch (props.activeNav) {
    case "Lead inbox":
      return <LeadInboxView {...props} />;
    case "Follow-ups":
      return <FollowUpsView {...props} />;
    case "Team workload":
      return <TeamWorkloadView {...props} />;
    case "Reports":
      return <ReportsView {...props} />;
    case "Projects":
      return <ProjectsView showNotice={props.showNotice} setActiveNav={props.setActiveNav} />;
    case "Import leads":
      return <ImportLeadsView {...props} />;
    case "Source health":
      return <SourceHealthView showNotice={props.showNotice} setActiveNav={props.setActiveNav} />;
    case "Audit log":
      return <AuditLogView showNotice={props.showNotice} />;
    default:
      return <LeadInboxView {...props} />;
  }
}

function WorkspaceIntro({ eyebrow, title, description, action, onAction }: { eyebrow: string; title: string; description: string; action: string; onAction: () => void }) {
  return <section className="workspace-intro page-intro">
    <div>
      <div className="date-line"><CalendarDots size={16} /> Tuesday, 27 October 2026 <span className="date-separator" /> <span>London · 09:42</span></div>
      <div className="section-overline workspace-eyebrow">{eyebrow}</div>
      <h1>{title}<span className="heading-period">.</span></h1>
      <p>{description}</p>
    </div>
    <div className="intro-actions"><button className="button button-primary" onClick={onAction}><Plus size={17} weight="bold" /> {action}</button></div>
  </section>;
}

function MiniMetric({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return <div className="mini-metric"><span className={`mini-metric-mark ${tone}`} /><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

function LeadInboxView({ filteredLeads, leads, query, setQuery, activeStatus, setActiveStatus, selectedRows, toggleAll, toggleRow, setSelectedLeadId, onClaim, showNotice }: WorkspaceViewProps) {
  const unassigned = leads.filter((lead) => lead.owner === "Unassigned").length;
  const overdue = leads.filter((lead) => lead.sla === "Overdue").length;
  const ready = leads.filter((lead) => lead.flags.includes("Ready to convert")).length;

  return <>
    <WorkspaceIntro eyebrow="Advisor workspace / inbox" title="Lead inbox" description="Search every permitted enquiry, see the urgency first, and move the next lead forward without losing its history." action="Capture new lead" onAction={() => showNotice("New lead capture flow opened.")} />

    <section className="mini-metrics" aria-label="Inbox summary">
      <MiniMetric label="Unassigned" value={`0${unassigned}`} detail="Needs an owner" tone="gold" />
      <MiniMetric label="Due today" value="12" detail="4 are overdue" tone="clay" />
      <MiniMetric label="Ready to convert" value={`0${ready}`} detail="Minimum checks pass" tone="sage" />
      <MiniMetric label="SLA at risk" value={`0${overdue + 1}`} detail="Review within 2 hours" tone="ink" />
    </section>

    <section className="inbox-panel section-block">
      <div className="inbox-heading section-header">
        <div><div className="section-overline"><span className="live-line" /> Unified lead queue</div><h2>{filteredLeads.length} leads in this view</h2></div>
        <div className="inbox-heading-actions"><button className="button button-secondary" onClick={() => showNotice("Saved view options opened.")}><SlidersHorizontal size={15} /> Configure view</button><button className="text-button" onClick={() => showNotice("CSV export prepared for this scoped view.")}><DownloadSimple size={15} /> Export CSV</button></div>
      </div>
      <div className="inbox-filters">
        <label className="inbox-search"><MagnifyingGlass size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, lead ID or campaign" /></label>
        <label className="filter-select-label">Status<select value={activeStatus} onChange={(event) => setActiveStatus(event.target.value as LeadStatus | "All")}><option value="All">All statuses</option>{statusOptions.slice(1).map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="filter-select-label">Owner<select defaultValue="Everyone"><option>Everyone</option><option>My leads</option><option>Unassigned</option></select></label>
        <button className="filter-button" onClick={() => showNotice("Advanced filters are ready to configure.")}><Funnel size={15} /> More filters <span>6</span></button>
      </div>
      <div className="queue-toolbar inbox-toolbar">
        <div className="queue-tabs">{(["All", "New", "Assigned", "Contacted", "Converted"] as const).map((status) => <button key={status} className={activeStatus === status ? "active" : ""} onClick={() => setActiveStatus(status)}>{status === "All" ? "All leads" : status}<span>{status === "All" ? leads.length : leads.filter((lead) => lead.status === status).length}</span></button>)}</div>
        <div className="selected-summary">{selectedRows.length > 0 && <><span>{selectedRows.length} selected</span><button onClick={() => showNotice("Bulk assignment flow opened.")}>Assign</button><button onClick={() => showNotice("Bulk follow-up flow opened.")}>Follow up</button><button onClick={() => showNotice("Selection cleared.")}>Clear</button></>}</div>
      </div>
      <div className="queue-table-wrap">
        <table className="queue-table inbox-table"><thead><tr><th className="check-cell"><button className={`checkbox ${selectedRows.length === filteredLeads.length && filteredLeads.length ? "checked" : ""}`} onClick={toggleAll}>{selectedRows.length === filteredLeads.length && filteredLeads.length ? <Check size={13} weight="bold" /> : null}</button></th><th>Prospect</th><th>Priority / SLA</th><th>Status</th><th>Owner</th><th>Interest</th><th>Next action</th><th /></tr></thead>
          <tbody>{filteredLeads.map((lead, index) => <LeadRow key={lead.id} lead={lead} index={index} selected={false} checked={selectedRows.includes(lead.id)} onSelect={() => setSelectedLeadId(lead.id)} onToggle={() => toggleRow(lead.id)} onClaim={() => onClaim(lead)} />)}{filteredLeads.length === 0 && <tr><td colSpan={8}><div className="empty-state"><MagnifyingGlass size={24} /><strong>No leads match this view</strong><span>Try another status or search term.</span><button className="text-button" onClick={() => { setQuery(""); setActiveStatus("All"); }}>Clear filters</button></div></td></tr>}</tbody>
        </table>
      </div>
      <div className="table-footer"><span>Showing <strong>{filteredLeads.length}</strong> of {leads.length} permitted leads</span><span className="privacy-note"><ShieldCheck size={13} /> Aggregator scope applied</span></div>
    </section>
  </>;
}

function FollowUpsView({ showNotice, setActiveNav }: WorkspaceViewProps) {
  const tasks = [
    { lead: "Saskia Vermeer", id: "LD-4821", action: "Make first contact", due: "Due in 42 min", owner: "Unassigned", tone: "clay", type: "First contact", status: "New" as LeadStatus },
    { lead: "Malik Okafor", id: "LD-4817", action: "Send course shortlist", due: "Due today · 14:00", owner: "Maya Chen", tone: "gold", type: "Follow-up", status: "Assigned" as LeadStatus },
    { lead: "Theo Mbatha", id: "LD-4794", action: "Reconnect after no response", due: "Overdue by 1 day", owner: "Jules Martin", tone: "clay", type: "Overdue", status: "Assigned" as LeadStatus },
    { lead: "Elena Rossi", id: "LD-4809", action: "Share business course options", due: "Due today · 16:30", owner: "Maya Chen", tone: "sage", type: "Qualification", status: "Contacted" as LeadStatus },
    { lead: "Nadia Al-Khatib", id: "LD-4788", action: "Review conversion readiness", due: "Tomorrow · 09:00", owner: "Ravi Shah", tone: "sage", type: "Convert", status: "Contacted" as LeadStatus },
  ];
  return <>
    <WorkspaceIntro eyebrow="Advisor workspace / follow-ups" title="Follow-ups" description="Keep every promise visible. Due, overdue, and upcoming actions stay attached to the lead that needs them." action="Schedule follow-up" onAction={() => showNotice("Follow-up composer opened.")} />
    <section className="mini-metrics"><MiniMetric label="Due today" value="12" detail="Across 5 active owners" tone="clay" /><MiniMetric label="Overdue" value="04" detail="Needs intervention" tone="clay" /><MiniMetric label="Upcoming" value="08" detail="Next 7 days" tone="gold" /><MiniMetric label="Completed this week" value="31" detail="85% on time" tone="sage" /></section>
    <section className="followup-layout">
      <div className="section-block followup-panel"><div className="section-header compact"><div><div className="section-overline"><span className="live-line" /> Action queue</div><h2>Today’s follow-ups</h2></div><button className="filter-button" onClick={() => showNotice("Follow-up filters opened.")}><Funnel size={15} /> Filter</button></div>
        <div className="followup-list">{tasks.map((task) => <article className={`followup-row ${task.type === "Overdue" ? "is-overdue" : ""}`} key={task.id}><div className={`followup-mark ${task.tone}`}><CalendarDots size={16} /></div><div className="followup-copy"><div className="followup-meta"><span>{task.type}</span><span>·</span><span>{task.id}</span></div><strong>{task.action}</strong><p>{task.lead} · {task.owner}</p></div><div className="followup-due"><span>{task.due}</span><StatusBadge status={task.status} /></div><div className="followup-actions"><button className="button button-secondary small" onClick={() => showNotice(`${task.lead} marked as complete.`)}><Check size={14} /> Complete</button><button className="icon-button" aria-label={`More actions for ${task.lead}`} onClick={() => showNotice("Follow-up actions opened.")}><DotsThree size={18} /></button></div></article>)}</div>
      </div>
      <aside className="section-block followup-side panel-light"><div className="section-overline">Operating rule</div><h2>Every active lead has a next action.</h2><p>Follow-ups stay open until they are completed, rescheduled, or cancelled with a reason. Missed actions remain visible to the manager queue.</p><div className="followup-rule"><CheckCircle size={17} /><span><strong>85%</strong> completed on or before the due date</span></div><button className="text-button" onClick={() => setActiveNav("Lead inbox")}>Open all active leads <ArrowUpRight size={15} /></button></aside>
    </section>
  </>;
}

function TeamWorkloadView({ showNotice, setActiveNav }: WorkspaceViewProps) {
  const totalActive = workload.reduce((sum, person) => sum + person.active, 0);
  return <>
    <WorkspaceIntro eyebrow="Manager view / capacity" title="Team workload" description="See who has room, where the SLA is under pressure, and which queues need a manager decision." action="Assign leads" onAction={() => setActiveNav("Lead inbox")} />
    <section className="mini-metrics"><MiniMetric label="Active leads" value={`${totalActive}`} detail="Across 4 advisors" tone="ink" /><MiniMetric label="Team capacity" value="64%" detail="Healthy overall" tone="sage" /><MiniMetric label="Unassigned" value="07" detail="2 added since 09:00" tone="gold" /><MiniMetric label="Overdue work" value="04" detail="3 with one advisor" tone="clay" /></section>
    <section className="team-layout">
      <div className="section-block team-panel"><div className="section-header compact"><div><div className="section-overline">Advisor capacity</div><h2>Workload by owner</h2></div><button className="button button-secondary small" onClick={() => showNotice("Workload export prepared.")}><DownloadSimple size={14} /> Export</button></div><div className="team-table"><div className="team-table-head"><span>Advisor</span><span>Active</span><span>Due</span><span>Capacity</span><span /></div>{workload.map((person) => <div className="team-table-row" key={person.name}><div className="team-person"><div className={`avatar avatar-${person.tone}`}>{person.initials}</div><div><strong>{person.name} {person.role === "You" && <span className="you-tag">you</span>}</strong><span>{person.role} · London team</span></div></div><strong>{person.active}</strong><strong>{person.due}</strong><div className="team-capacity"><div className="load-meter"><span style={{ width: `${person.load}%` }} className={`load-${person.tone}`} /></div><span>{person.load}%</span></div><button className="icon-button" aria-label={`Open ${person.name} workload`} onClick={() => showNotice(`${person.name}'s workload opened.`)}><CaretRight size={16} /></button></div>)}</div></div>
      <aside className="section-block panel-dark team-insight"><div className="panel-kicker light-kicker"><Lightning size={15} weight="fill" /> Manager signal</div><h2>Jules is closest to capacity.</h2><p>Four assigned leads are due today and one is already overdue. Reassigning the next unassigned lead to Inez keeps the team below the 85% pressure mark.</p><div className="capacity-callout"><span>Current load</span><strong>84%</strong><div className="sla-track"><span style={{ width: "84%" }} /></div></div><button className="button button-primary small" onClick={() => showNotice("Suggested reassignment review opened.")}>Review suggested assignment <ArrowUpRight size={14} /></button></aside>
    </section>
    <section className="section-block team-queue"><div className="section-header compact"><div><div className="section-overline">Exceptions</div><h2>Queues that need a decision</h2></div><button className="text-button" onClick={() => setActiveNav("Follow-ups")}>View overdue work <ArrowUpRight size={15} /></button></div><div className="exception-grid"><div><span>Unassigned over 1 hour</span><strong>03 leads</strong><small>Oldest is LD-4821 · 18 min</small></div><div><span>Stale over 24 hours</span><strong>02 leads</strong><small>Both assigned to the legal queue</small></div><div><span>Ready to convert</span><strong>09 leads</strong><small>4 owned by Maya Chen</small></div></div></section>
  </>;
}

function ReportsView({ showNotice }: WorkspaceViewProps) {
  const [range, setRange] = useState("This month");
  const sourceMix = [{ label: "Referral", value: 38, width: "76%", tone: "sage" }, { label: "Paid social", value: 27, width: "54%", tone: "clay" }, { label: "Organic", value: 21, width: "42%", tone: "gold" }, { label: "Events", value: 14, width: "28%", tone: "ink" }];
  return <>
    <WorkspaceIntro eyebrow="Manager view / reporting" title="Reports" description="Understand response time, source quality, ownership, and conversion without losing the event history behind the numbers." action="Export report" onAction={() => showNotice("Scoped report export prepared.")} />
    <div className="report-controls"><div className="segmented-control">{["This week", "This month", "Last month"].map((option) => <button className={range === option ? "selected" : ""} key={option} onClick={() => setRange(option)}>{option}</button>)}</div><button className="filter-button" onClick={() => showNotice("Report filters opened.")}><Funnel size={15} /> Filter by source</button><span className="report-scope"><ShieldCheck size={14} /> Aggregator — UK</span></div>
    <section className="report-metrics"><div className="report-metric"><span>Median first response</span><strong>1h 18m</strong><small className="positive"><ArrowDown size={13} /> 30% vs baseline</small></div><div className="report-metric"><span>First-contact rate</span><strong>82.4%</strong><small className="positive"><ArrowUp size={13} /> 6.8% this week</small></div><div className="report-metric"><span>Lead-to-application</span><strong>21.4%</strong><small className="positive"><ArrowUp size={13} /> 3.1% this month</small></div><div className="report-metric"><span>Stale lead rate</span><strong>8.7%</strong><small className="positive"><ArrowDown size={13} /> 25% vs baseline</small></div></section>
    <section className="report-grid"><div className="section-block report-panel"><div className="section-header compact"><div><div className="section-overline">Acquisition quality</div><h2>Source mix</h2></div><button className="text-button" onClick={() => showNotice("Source detail opened.")}>View source detail <ArrowUpRight size={15} /></button></div><div className="source-bars">{sourceMix.map((source) => <div className="source-bar-row" key={source.label}><div><span>{source.label}</span><strong>{source.value}%</strong></div><div className="source-bar"><span className={source.tone} style={{ width: source.width }} /></div><small>{source.label === "Referral" ? "Highest conversion" : source.label === "Paid social" ? "42 new leads" : ""}</small></div>)}</div></div><div className="section-block report-panel"><div className="section-header compact"><div><div className="section-overline">Lifecycle health</div><h2>Pipeline movement</h2></div><TrendUp size={18} className="report-trend" /></div><div className="report-funnel">{pipeline.map((stage, index) => <div className="report-funnel-row" key={stage.label}><span className={`pipeline-index ${stage.color}`}>0{index + 1}</span><div><strong>{stage.label}</strong><span>{stage.label === "New" ? "Capture and triage" : stage.label === "Assigned" ? "Owner set" : stage.label === "Contacted" ? "First action logged" : "Application created"}</span></div><b>{stage.count}</b><ArrowUpRight size={14} /></div>)}</div></div></section>
    <section className="section-block report-table-panel"><div className="section-header compact"><div><div className="section-overline">Advisor performance</div><h2>Response and conversion</h2></div><span className="report-period">{range} · updated 09:42</span></div><div className="performance-table"><div className="performance-head"><span>Advisor</span><span>First contact</span><span>Follow-up on time</span><span>Converted</span></div>{workload.map((person, index) => <div className="performance-row" key={person.name}><div className="team-person"><div className={`avatar avatar-${person.tone}`}>{person.initials}</div><strong>{person.name}</strong></div><span className={index === 1 ? "warn" : "positive-text"}>{index === 1 ? "76%" : index === 2 ? "84%" : "89%"}</span><span className="positive-text">{index === 1 ? "78%" : "91%"}</span><strong>{[4, 3, 2, 1][index]}</strong></div>)}</div></section>
  </>;
}

function ProjectsView({ showNotice, setActiveNav }: { showNotice: (message: string) => void; setActiveNav: (value: string) => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const projects = [
    { name: "September intake", status: "Active", leads: "42", owner: "Maya Chen", channels: "Automated call · WhatsApp · Email", next: "New leads qualify within 15 min", tone: "sage" },
    { name: "Cape Town open day", status: "Draft", leads: "07", owner: "Jules Martin", channels: "Automated call · SMS · Advisor follow-up", next: "Starts when event file is imported", tone: "gold" },
    { name: "Partner referral · Atlas", status: "Active", leads: "18", owner: "Ravi Shah", channels: "Email · WhatsApp · Advisor follow-up", next: "First response target: 2 hours", tone: "clay" },
  ];
  return <>
    <WorkspaceIntro eyebrow="Workspace / qualification projects" title="Projects" description="Set the qualification goal, contact sequence, ownership, and timing before you import a lead list. Every imported lead belongs to a project." action="Create project" onAction={() => setShowCreate(true)} />
    <section className="project-layout">
      <div className="project-list-panel"><div className="section-header compact"><div><div className="section-overline"><NotePencil size={14} /> Operating programmes</div><h2>Qualification projects</h2></div><span className="project-count">3 configured</span></div>
        {showCreate && <div className="project-create"><div className="section-overline">New project</div><div className="project-create-grid"><label><span>Project name</span><input autoFocus value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. January intake" /></label><label><span>Qualification goal</span><select defaultValue="Confirm study interest"><option>Confirm study interest</option><option>Verify course fit</option><option>Re-engage an old enquiry</option></select></label></div><div className="project-create-actions"><button className="button button-secondary small" onClick={() => setShowCreate(false)}>Cancel</button><button className="button button-primary small" onClick={() => { if (!projectName.trim()) { showNotice("Add a project name first."); return; } showNotice(`${projectName} project created.`); setShowCreate(false); setProjectName(""); }}>Create project</button></div></div>}
        <div className="project-list">{projects.map((project) => <article className="project-card" key={project.name}><div className={`project-status ${project.tone}`}><span /></div><div className="project-card-main"><div className="project-card-top"><div><span className="eyebrow">{project.status} project</span><h3>{project.name}</h3></div><button className="icon-button" aria-label={`More options for ${project.name}`} onClick={() => showNotice("Project actions opened.")}><DotsThree size={19} /></button></div><div className="project-card-meta"><span><UsersThree size={13} /> {project.leads} active leads</span><span><UserCircle size={13} /> {project.owner}</span></div><div className="project-sequence"><span>Qualification sequence</span><strong>{project.channels}</strong><small>{project.next}</small></div><button className="text-button" onClick={() => setActiveNav("Import leads")}>Import leads into project <ArrowUpRight size={15} /></button></div></article>)}</div>
      </div>
      <aside className="project-next panel-dark"><div className="panel-kicker light-kicker"><Lightning size={15} weight="fill" /> Recommended setup</div><h2>Qualify interest before an advisor spends time.</h2><p>Start with an automated call, then use consent-aware fallbacks. Stop when the prospect answers, opts out, or needs an advisor.</p><div className="project-channel-stack"><div><Phone size={15} /><span><strong>Automated call</strong><small>First attempt · within 15 min</small></span><b>01</b></div><div><ChatCircleDots size={15} /><span><strong>WhatsApp or SMS</strong><small>After unanswered call</small></span><b>02</b></div><div><EnvelopeSimple size={15} /><span><strong>Email</strong><small>Send course context and reply link</small></span><b>03</b></div><div><UserCircle size={15} /><span><strong>Advisor follow-up</strong><small>Handoff when interest is confirmed</small></span><b>04</b></div></div><button className="button button-primary small" onClick={() => setActiveNav("Import leads")}>Import and qualify leads <ArrowUpRight size={14} /></button></aside>
    </section>
  </>;
}

function ImportLeadsView({ showNotice }: WorkspaceViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragActive, setDragActive] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("Manual Excel import");
  const [defaultOwner, setDefaultOwner] = useState("Unassigned");
  const [duplicatePolicy, setDuplicatePolicy] = useState("Flag for review");
  const [consentPolicy, setConsentPolicy] = useState("Reject rows without consent");
  const [project, setProject] = useState("September intake");
  const [qualificationGoal, setQualificationGoal] = useState("Confirm study interest");
  const [callTiming, setCallTiming] = useState("Start within 15 minutes");
  const [channels, setChannels] = useState({ call: true, whatsapp: true, sms: false, email: true, advisor: true });
  const channelOptions = [{ key: "call", label: "Automated call", detail: "AI agent asks if they are still interested", icon: Phone, tone: "clay", required: true }, { key: "whatsapp", label: "WhatsApp", detail: "Follow up when consent is present", icon: ChatCircleDots, tone: "sage", required: false }, { key: "sms", label: "SMS", detail: "Short reminder after no answer", icon: ChatCircleDots, tone: "gold", required: false }, { key: "email", label: "Email", detail: "Send course context and reply link", icon: EnvelopeSimple, tone: "ink", required: false }, { key: "advisor", label: "Advisor follow-up", detail: "Handoff when interest is confirmed", icon: UserCircle, tone: "plum", required: false }];

  const acceptFile = (candidate?: File) => {
    if (!candidate) return;
    const lowerName = candidate.name.toLowerCase();
    const supported = [".xlsx", ".xls", ".csv"].some((extension) => lowerName.endsWith(extension));
    if (!supported) {
      showNotice("Use an .xlsx, .xls, or .csv file.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      showNotice("The file must be smaller than 10 MB.");
      return;
    }
    setFile(candidate);
    setStep(2);
    showNotice("File ready for column mapping.");
  };

  const resetImport = () => {
    setFile(null);
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const csv = "full_name,email,phone,source,campaign,captured_at,consent_general,consent_email,consent_sms,institution,course_interest,intake,study_mode,preferred_channel,owner,notes,external_id\nSaskia Vermeer,saskia@example.com,+31 6 1847 2239,Meta,September intake,2026-10-27T08:42:00Z,true,true,false,Westbridge University,BSc Computer Science,September 2027,Full-time,email,,Example row,EXT-1001";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "lead-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
    showNotice("Import template downloaded.");
  };

  const hasValidDefaults = () => {
    if (!sourceLabel.trim()) {
      showNotice("Add an import label before continuing.");
      return false;
    }
    if (!project.trim()) {
      showNotice("Choose a project before continuing.");
      return false;
    }
    if (!channels.call) {
      showNotice("Keep the automated call enabled for qualification.");
      return false;
    }
    if (Object.values(channels).filter(Boolean).length < 2) {
      showNotice("Choose at least two contact options for the sequence.");
      return false;
    }
    return true;
  };

  const fileSize = file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "—";
  const selectedChannelLabels = channelOptions.filter((channel) => channels[channel.key as keyof typeof channels]).map((channel) => channel.label).join(" · ");
  const introAction = file ? (step === 3 ? "Back to mapping" : "Review import") : "Choose Excel file";
  const runIntroAction = () => {
    if (!file) {
      fileInputRef.current?.click();
    } else if (!hasValidDefaults()) {
      return;
    } else if (step === 3) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  return <>
    <WorkspaceIntro eyebrow="Operations / lead ingestion" title="Import leads" description="Bring approved enquiry data into the unified inbox with clear ownership, consent, and duplicate handling before any record is created." action={introAction} onAction={runIntroAction} />
    <div className="import-stepper" aria-label="Import progress">{[{ number: 1, label: "Prepare file" }, { number: 2, label: "Map columns" }, { number: 3, label: "Review and import" }].map((item) => <div className={`import-step ${step >= item.number ? "complete" : ""} ${step === item.number ? "current" : ""}`} key={item.number}><span>{step > item.number ? <Check size={13} weight="bold" /> : item.number}</span><strong>{item.label}</strong></div>)}</div>
    <section className="import-layout">
      <div className="import-main-card">
        {step === 1 && <>
          <div className="import-card-heading"><div><div className="section-overline"><UploadSimple size={14} /> Source file</div><h2>Upload a lead list</h2><p>Use the template or an existing spreadsheet with one lead per row. We validate the file before creating anything.</p></div><span className="import-limit">10 MB max</span></div>
          <label className={`import-dropzone ${dragActive ? "drag-active" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(event) => { event.preventDefault(); setDragActive(false); acceptFile(event.dataTransfer.files[0]); }}>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(event) => acceptFile(event.target.files?.[0])} />
            <span className="import-upload-icon"><UploadSimple size={23} /></span><strong>Drop your file here</strong><span>or choose an Excel workbook or CSV from your computer</span><small>Supported: .xlsx, .xls, .csv · One sheet · Up to 10 MB</small>
          </label>
          <div className="import-file-actions"><button className="button button-secondary" onClick={downloadTemplate}><DownloadSimple size={15} /> Download import template</button><span>Template includes headers, examples, and field definitions.</span></div>
          <div className="import-options qualification-settings"><div className="section-overline"><Phone size={14} /> Qualification setup</div><div className="import-option-grid"><label><span>Project <b>Required</b></span><select value={project} onChange={(event) => setProject(event.target.value)}><option>September intake</option><option>Cape Town open day</option><option>Partner referral · Atlas</option></select></label><label><span>Qualification goal</span><select value={qualificationGoal} onChange={(event) => setQualificationGoal(event.target.value)}><option>Confirm study interest</option><option>Verify course fit</option><option>Re-engage an old enquiry</option></select></label><label><span>First call timing</span><select value={callTiming} onChange={(event) => setCallTiming(event.target.value)}><option>Start within 15 minutes</option><option>Start in the next business hour</option><option>Schedule for a specific time</option></select></label><label><span>Maximum call attempts</span><select defaultValue="2 attempts"><option>1 attempt</option><option>2 attempts</option><option>3 attempts</option></select></label></div><div className="channel-picker-heading"><span>Contact options <b>Choose at least two</b></span><small>Consent is checked per channel before outreach.</small></div><div className="channel-picker">{channelOptions.map((channel) => { const Icon = channel.icon; const enabled = channels[channel.key as keyof typeof channels]; return <label className={`channel-option ${enabled ? "selected" : ""} ${channel.required ? "recommended" : ""}`} key={channel.key}><input type="checkbox" checked={enabled} onChange={() => setChannels((current) => ({ ...current, [channel.key]: !current[channel.key as keyof typeof current] }))} /><span className={`channel-icon ${channel.tone}`}><Icon size={16} /></span><span className="channel-copy"><strong>{channel.label}{channel.required && <em>Recommended</em>}</strong><small>{channel.detail}</small></span><span className="channel-check">{enabled ? <Check size={13} weight="bold" /> : null}</span></label>; })}</div><div className="sequence-preview"><span>Sequence preview</span><strong>{selectedChannelLabels}</strong><small>{qualificationGoal} · {callTiming}</small></div></div>
          <div className="import-options"><div className="section-overline">Import defaults</div><div className="import-option-grid"><label><span>Import label <b>Required</b></span><input required value={sourceLabel} onChange={(event) => setSourceLabel(event.target.value)} placeholder="e.g. Meta September intake" /></label><label><span>Default owner</span><select value={defaultOwner} onChange={(event) => setDefaultOwner(event.target.value)}><option>Unassigned</option><option>Maya Chen</option><option>Jules Martin</option><option>Ravi Shah</option></select></label><label><span>Duplicate handling</span><select value={duplicatePolicy} onChange={(event) => setDuplicatePolicy(event.target.value)}><option>Flag for review</option><option>Skip likely duplicates</option><option>Import and link history</option></select></label><label><span>Consent handling</span><select value={consentPolicy} onChange={(event) => setConsentPolicy(event.target.value)}><option>Reject rows without consent</option><option>Import as contact-restricted</option></select></label></div></div>
        </>}
        {step === 2 && file && <>
          <div className="import-card-heading"><div><div className="section-overline"><CheckCircle size={14} /> File received</div><h2>Map your columns</h2><p>Confirm how the spreadsheet headers map to lead fields. Required fields must be mapped before import.</p></div><button className="text-button" onClick={resetImport}>Choose another file</button></div>
          <div className="selected-file"><div className="selected-file-icon"><FileText size={19} /></div><div><strong>{file.name}</strong><span>{fileSize} · {sourceLabel}</span></div><span className="file-ready"><CheckCircle size={14} /> Ready</span></div>
          <div className="mapping-table"><div className="mapping-head"><span>Detected header</span><span>Lead field</span><span>Requirement</span></div>{[{ from: "full_name", to: "Full name", requirement: "Required" }, { from: "email", to: "Email address", requirement: "Email or phone" }, { from: "phone", to: "Phone number", requirement: "Email or phone" }, { from: "source", to: "Source label", requirement: "Required" }, { from: "consent_general", to: "General contact consent", requirement: "Required" }, { from: "course_interest", to: "Course interest", requirement: "Recommended" }].map((row) => <div className="mapping-row" key={row.from}><span className="mapping-source">{row.from}</span><select defaultValue={row.to}><option>{row.to}</option><option>Do not import</option><option>Custom field</option></select><span className={row.requirement === "Required" ? "mapping-required" : "mapping-optional"}>{row.requirement}</span></div>)}</div>
          <div className="import-validation"><WarningCircle size={16} /><div><strong>We’ll flag rows, not silently change them.</strong><span>Likely duplicates are held for review. Missing contact data or consent will not enter an outreach-ready queue.</span></div></div>
          <div className="import-footer-actions"><button className="button button-secondary" onClick={() => setStep(1)}>Back</button><button className="button button-primary" onClick={() => hasValidDefaults() && setStep(3)}>Continue to review <ArrowUpRight size={15} /></button></div>
        </>}
        {step === 3 && file && <>
          <div className="import-card-heading"><div><div className="section-overline"><ShieldCheck size={14} /> Pre-import review</div><h2>Check before creating leads</h2><p>Review the validation outcome and defaults. No lead is created until you confirm the import.</p></div><button className="text-button" onClick={() => setStep(2)}>Edit mapping</button></div>
          <div className="import-review-file"><FileText size={18} /><div><strong>{file.name}</strong><span>{fileSize} · {project} · {sourceLabel} · Owner: {defaultOwner}</span></div></div>
          <div className="review-counts"><div className="review-count ready"><strong>22</strong><span>Ready to import</span></div><div className="review-count warning"><strong>02</strong><span>Possible duplicates</span></div><div className="review-count restricted"><strong>01</strong><span>Missing consent</span></div><div className="review-count total"><strong>25</strong><span>Rows scanned</span></div></div>
          <div className="review-checks"><div><CheckCircle size={16} /><span>Required identity and contact columns mapped</span><b>Pass</b></div><div><CheckCircle size={16} /><span>Import label, project, and source attribution will be preserved</span><b>Pass</b></div><div><CheckCircle size={16} /><span>Qualification sequence: {selectedChannelLabels}</span><b>Ready</b></div><div><WarningCircle size={16} /><span>Duplicate policy: {duplicatePolicy.toLowerCase()}</span><b>Review 2</b></div><div><WarningCircle size={16} /><span>Consent policy: {consentPolicy.toLowerCase()}</span><b>Hold 1</b></div></div>
          <div className="import-review-note"><Phone size={15} /><span>After import, leads enter <strong>New</strong> status and the automated call is scheduled for <strong>{callTiming.toLowerCase()}</strong>. Leads who confirm interest are handed to an advisor; unanswered or restricted leads follow the enabled fallbacks.</span></div>
          <div className="import-footer-actions"><button className="button button-secondary" onClick={() => setStep(2)}>Back to mapping</button><button className="button button-primary" onClick={() => { showNotice("22 leads imported and qualification calls scheduled; 3 rows held for review."); resetImport(); }}>Import and start qualification <ArrowUpRight size={15} /></button></div>
        </>}
      </div>
      <aside className="import-guide">
        <div className="import-guide-heading"><div className="section-overline">Before you upload</div><h2>Prepare a clean, permissioned list.</h2></div>
        <div className="import-guide-list"><div><span>01</span><p><strong>One lead per row.</strong> Keep headers in the first row and avoid merged cells, formulas, or multiple sheets.</p></div><div><span>02</span><p><strong>Include contact consent.</strong> Record the consent state and timestamp for the channels you plan to use.</p></div><div><span>03</span><p><strong>Keep source attribution.</strong> Add source, campaign, capture date, and any external reference ID where available.</p></div><div><span>04</span><p><strong>Expect duplicate review.</strong> Matching email, phone, applicant identity, and similar names are flagged; records are never merged automatically.</p></div></div>
        <div className="required-fields"><div className="section-overline">Required columns</div><div className="required-field-row"><span>full_name</span><b>Required</b></div><div className="required-field-row"><span>email or phone</span><b>One required</b></div><div className="required-field-row"><span>source</span><b>Required</b></div><div className="required-field-row"><span>consent_general</span><b>Required</b></div><div className="required-field-row"><span>captured_at</span><b>Recommended</b></div></div>
        <div className="import-channel-note"><div className="section-overline">Contact sequence</div><p><strong>Automated call first.</strong> WhatsApp, SMS, email, and advisor follow-up are available as consent-aware fallbacks. A lead stops when they confirm interest, opt out, or needs a human decision.</p></div>
        <div className="import-security"><ShieldCheck size={16} /><span>Only permitted users can import into Aggregator — UK. Every file, row result, and assignment default is logged.</span></div>
      </aside>
    </section>
  </>;
}

function SourceHealthView({ showNotice, setActiveNav }: { showNotice: (message: string) => void; setActiveNav: (value: string) => void }) {
  const sources = [{ name: "Meta · September intake", type: "Paid social", status: "Healthy", volume: "42 leads", sync: "2 min ago", tone: "sage" }, { name: "Atlas partner referral", type: "Referral", status: "Healthy", volume: "18 leads", sync: "6 min ago", tone: "sage" }, { name: "Cape Town open day", type: "Event", status: "Needs review", volume: "7 leads", sync: "1h ago", tone: "gold" }, { name: "Organic course search", type: "Organic", status: "Healthy", volume: "21 leads", sync: "12 min ago", tone: "sage" }];
  return <>
    <WorkspaceIntro eyebrow="Operations / source health" title="Source health" description="Check that approved lead sources are connected, delivering usable payloads, and staying within the expected response window." action="Import a lead file" onAction={() => setActiveNav("Import leads")} />
    <section className="mini-metrics"><MiniMetric label="Connected sources" value="04" detail="All approved" tone="sage" /><MiniMetric label="Last sync" value="2m" detail="Meta intake" tone="ink" /><MiniMetric label="Payload exceptions" value="03" detail="Needs review" tone="gold" /><MiniMetric label="Ingestion uptime" value="99.8%" detail="Last 30 days" tone="sage" /></section>
    <section className="section-block source-panel"><div className="section-header compact"><div><div className="section-overline"><span className="live-line" /> Live connectors</div><h2>Approved lead sources</h2></div><button className="text-button" onClick={() => showNotice("Source health refresh requested.")}><Lightning size={14} /> Refresh now</button></div><div className="source-list">{sources.map((source) => <div className="source-row" key={source.name}><div className={`source-status ${source.tone}`}><span /></div><div className="source-main"><strong>{source.name}</strong><span>{source.type} · Last sync {source.sync}</span></div><strong>{source.volume}</strong><span className={`source-state ${source.tone}`}>{source.status}</span><button className="icon-button" onClick={() => showNotice(`${source.name} details opened.`)}><DotsThree size={19} /></button></div>)}</div><div className="source-note"><ShieldCheck size={15} /><span>Raw attribution is preserved and scoped to the Aggregator — UK workspace.</span></div></section>
  </>;
}

function AuditLogView({ showNotice }: { showNotice: (message: string) => void }) {
  const events = [
    { action: "Lead moved to ready to convert", actor: "Ravi Shah", target: "Nadia Al-Khatib · LD-4788", time: "14 min ago", kind: "Status change" },
    { action: "Assignment changed", actor: "Maya Chen", target: "Theo Mbatha · LD-4794", time: "29 min ago", kind: "Ownership" },
    { action: "Course shortlist opened", actor: "Automated signal", target: "Malik Okafor · LD-4817", time: "27 min ago", kind: "Activity" },
    { action: "Document uploaded", actor: "Ari Bennett", target: "Passport scan · LD-4771", time: "1h ago", kind: "Document" },
    { action: "Three leads captured", actor: "Meta · September intake", target: "Source event batch 8841", time: "1h ago", kind: "Ingestion" },
  ];
  return <>
    <WorkspaceIntro eyebrow="Operations / history" title="Audit log" description="A readable record of material lead changes, assignments, source events, and conversion decisions within this workspace." action="Export audit log" onAction={() => showNotice("Audit export prepared for the current scope.")} />
    <section className="audit-toolbar"><label className="inbox-search"><MagnifyingGlass size={16} /><input placeholder="Search actor, lead ID or event" /></label><button className="filter-button" onClick={() => showNotice("Audit filters opened.")}><Funnel size={15} /> Event type</button><span className="privacy-note"><ShieldCheck size={13} /> Immutable event history</span></section>
    <section className="section-block audit-panel"><div className="section-header compact"><div><div className="section-overline">27 October 2026</div><h2>Recent activity</h2></div><span className="report-period">Showing 5 of 248 events</span></div><div className="audit-list">{events.map((event) => <article className="audit-row" key={`${event.action}-${event.time}`}><div className="audit-icon"><CheckCircle size={16} weight="fill" /></div><div className="audit-copy"><strong>{event.action}</strong><span>{event.actor} · {event.target}</span></div><span className="audit-kind">{event.kind}</span><span className="audit-time">{event.time}</span><button className="icon-button" aria-label={`Open ${event.action}`} onClick={() => showNotice("Event details opened.")}><CaretRight size={16} /></button></article>)}</div><button className="button button-secondary audit-more" onClick={() => showNotice("Older audit events loaded.")}>Load older events</button></section>
  </>;
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}><span />{status}</span>;
}

function ChecklistRow({ label, done }: { label: string; done: boolean }) {
  return <div className={`checklist-row ${done ? "done" : ""}`}><span className="check-circle">{done ? <Check size={11} weight="bold" /> : null}</span><span>{label}</span>{done ? <CheckCircle size={14} weight="fill" /> : <span className="pending-mark">—</span>}</div>;
}

function ActivityItem({ icon: Icon, tone, title, meta }: { icon: typeof CheckCircle; tone: string; title: string; meta: string }) {
  return <div className="activity-item"><div className={`activity-icon ${tone}`}><Icon size={16} weight="fill" /></div><div><strong>{title}</strong><span>{meta}</span></div><CaretRight size={15} /></div>;
}

export default App;
