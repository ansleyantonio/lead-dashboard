export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  workspace: string;
};

export type DemoProject = {
  id: string;
  name: string;
  status: "Active" | "Draft";
  qualificationGoal: string;
  channels: string[];
};

export type DemoDatabase = {
  version: 1;
  users: DemoUser[];
  projects: DemoProject[];
  leads: unknown[];
};

export type DemoSession = Omit<DemoUser, "password">;

const DATABASE_KEY = "lead-operations-demo-database-v1";
const SESSION_KEY = "lead-operations-demo-session-v1";

const seedDatabase: DemoDatabase = {
  version: 1,
  users: [
    {
      id: "maya-chen",
      name: "Maya Chen",
      email: "maya@leadops.demo",
      password: "demo1234",
      role: "Advisor Manager",
      workspace: "Aggregator — UK",
    },
    {
      id: "ravi-shah",
      name: "Ravi Shah",
      email: "ravi@leadops.demo",
      password: "demo1234",
      role: "Advisor",
      workspace: "Aggregator — UK",
    },
  ],
  projects: [
    { id: "september-intake", name: "September intake", status: "Active", qualificationGoal: "Confirm study interest", channels: ["Automated call", "WhatsApp", "Email", "Advisor follow-up"] },
    { id: "cape-town-open-day", name: "Cape Town open day", status: "Draft", qualificationGoal: "Verify course fit", channels: ["Automated call", "SMS", "Advisor follow-up"] },
  ],
  leads: [],
};

function cloneSeed(): DemoDatabase {
  return JSON.parse(JSON.stringify(seedDatabase)) as DemoDatabase;
}

export function getDemoDatabase(): DemoDatabase {
  if (typeof window === "undefined") return cloneSeed();
  const stored = window.localStorage.getItem(DATABASE_KEY);
  if (!stored) {
    const fresh = cloneSeed();
    window.localStorage.setItem(DATABASE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(stored) as DemoDatabase;
  } catch {
    const fresh = cloneSeed();
    window.localStorage.setItem(DATABASE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function saveDemoDatabase(database: DemoDatabase) {
  if (typeof window !== "undefined") window.localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
}

export function authenticateDemoUser(email: string, password: string): DemoSession | null {
  const user = getDemoDatabase().users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password);
  if (!user) return null;
  const { password: _password, ...session } = user;
  if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as DemoSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearDemoSession() {
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}

export function loadDemoLeads<T>(fallback: T[]): T[] {
  const stored = getDemoDatabase().leads;
  return stored.length ? stored as T[] : fallback;
}

export function persistDemoLeads<T>(leads: T[]) {
  const database = getDemoDatabase();
  database.leads = leads as unknown[];
  saveDemoDatabase(database);
}
