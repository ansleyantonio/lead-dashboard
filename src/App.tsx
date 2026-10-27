import { useMemo, useState } from "react";
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
  UserCircle,
  UserPlus,
  UsersThree,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

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
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeads[0].id);
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Today");
  const [notice, setNotice] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
          <button className="nav-item" onClick={() => showNotice("Sources are syncing normally.")}>
            <Lightning size={18} />
            <span>Source health</span>
            <span className="status-dot" />
          </button>
          <button className="nav-item" onClick={() => showNotice("Audit log opened in a new view.")}>
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
          <button className="profile-card" onClick={() => showNotice("Profile settings are coming next.")}>
            <div className="avatar avatar-clay">MC</div>
            <div>
              <strong>Maya Chen</strong>
              <span>Advisor Manager</span>
            </div>
            <DotsThree size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
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
            <div className="avatar avatar-clay top-avatar">MC</div>
          </div>
        </header>

        <div className="content-wrap">
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

      <AnimatePresence>{notice && <motion.div className="toast" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}><CheckCircle size={18} weight="fill" /><span>{notice}</span></motion.div>}</AnimatePresence>
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
