"use client";

import { QUESTIONS, TOTAL_QUESTIONS } from "./questions";

export type Answer = {
  text: string;
  via: "text" | "voice";
  answeredAt: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  lastActiveAt: string;
  answers: Record<string, Answer>;
  bookGeneratedAt: string | null;
  isDemo?: boolean;
};

const USERS_KEY = "source_users";
const SESSION_KEY = "source_session";
const SEED_KEY = "source_seeded_v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): Record<string, User> {
  seedDemoData();
  return read<Record<string, User>>(USERS_KEY, {});
}

function saveUsers(users: Record<string, User>) {
  write(USERS_KEY, users);
}

export function signUp(name: string, email: string, password: string): User | string {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  if (!name.trim()) return "Please tell us your name — it goes on the cover.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return "That email doesn't look right.";
  if (password.length < 4) return "Password needs at least 4 characters.";
  if (users[key]) return "An account with this email already exists. Sign in instead.";
  const now = new Date().toISOString();
  const user: User = {
    name: name.trim(),
    email: key,
    password,
    createdAt: now,
    lastActiveAt: now,
    answers: {},
    bookGeneratedAt: null,
  };
  users[key] = user;
  saveUsers(users);
  write(SESSION_KEY, key);
  return user;
}

export function logIn(email: string, password: string): User | string {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  const user = users[key];
  if (!user) return "No account found with that email.";
  if (user.password !== password) return "That password doesn't match.";
  user.lastActiveAt = new Date().toISOString();
  saveUsers(users);
  write(SESSION_KEY, key);
  return user;
}

export function logOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function currentUser(): User | null {
  const key = read<string | null>(SESSION_KEY, null);
  if (!key) return null;
  return getUsers()[key] ?? null;
}

export function updateUser(email: string, patch: Partial<User>) {
  const users = getUsers();
  const user = users[email];
  if (!user) return;
  users[email] = { ...user, ...patch, lastActiveAt: new Date().toISOString() };
  saveUsers(users);
}

export function saveAnswer(email: string, questionId: string, answer: Answer) {
  const users = getUsers();
  const user = users[email];
  if (!user) return;
  if (answer.text.trim()) {
    user.answers[questionId] = answer;
  } else {
    delete user.answers[questionId];
  }
  user.lastActiveAt = new Date().toISOString();
  saveUsers(users);
}

export function answeredCount(user: User): number {
  return QUESTIONS.filter((q) => user.answers[q.id]?.text.trim()).length;
}

export function firstUnansweredIndex(user: User): number {
  const i = QUESTIONS.findIndex((q) => !user.answers[q.id]?.text.trim());
  return i === -1 ? TOTAL_QUESTIONS - 1 : i;
}

/* ── Demo seed: makes the admin dashboard meaningful on first run ── */

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function seedAnswers(upTo: number, via: "text" | "voice", texts: string[]): Record<string, Answer> {
  const answers: Record<string, Answer> = {};
  QUESTIONS.slice(0, upTo).forEach((q, i) => {
    answers[q.id] = {
      text: texts[i % texts.length],
      via: i % 3 === 0 ? "voice" : via,
      answeredAt: daysAgo(6 - Math.min(i / 4, 5)),
    };
  });
  return answers;
}

export function seedDemoData() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEED_KEY)) return;
  window.localStorage.setItem(SEED_KEY, "1");

  const users = read<Record<string, User>>(USERS_KEY, {});

  const mara: User = {
    name: "Mara Velasco",
    email: "mara@example.com",
    password: "demo",
    createdAt: daysAgo(9),
    lastActiveAt: daysAgo(1),
    answers: seedAnswers(24, "text", [
      "I grew up in a narrow house by the harbor in Cebu. Mornings smelled of salt and frying garlic rice, and you could hear the jeepneys coughing up the hill before sunrise.",
      "My grandmother taught me to mend fishing nets on the porch. I remember the rough twine and her humming — she never finished a song, just circled the same three bars.",
      "My older brother Danilo. He read everything and gave me his books a year before I was ready for them, which meant I was always reaching.",
      "People called me 'the quiet one who notices.' Teachers said I daydreamed; my mother said I was listening to things other people walked past.",
      "I wanted to be a cartographer. I loved that someone's job was to say: this is where we are. The wish became photography, which is the same job with light.",
      "Never let a guest leave hungry. Even when there was little, the table stretched.",
    ]),
    bookGeneratedAt: daysAgo(1),
    isDemo: true,
  };

  const tomas: User = {
    name: "Tomas Reyes",
    email: "tomas@example.com",
    password: "demo",
    createdAt: daysAgo(5),
    lastActiveAt: daysAgo(2),
    answers: seedAnswers(14, "voice", [
      "Quezon City, third floor walk-up. Tricycle engines, karaoke on Saturdays, my mother's sewing machine going late into the night like a second heartbeat.",
      "Flying a kite made of newspaper on the roof with my cousins. It barely flew. It was the best afternoon of my life.",
      "My uncle Bert, who fixed radios. He taught me that everything broken is just waiting for someone patient enough.",
      "'Makulit' — restless, they said. Always taking things apart. I never grew out of it, I just got paid for it eventually.",
      "An astronaut, obviously. Then an engineer. The distance between those two turned out to be smaller than I thought.",
      "Work with your hands and you'll never be ashamed at dinner.",
    ]),
    bookGeneratedAt: null,
    isDemo: true,
  };

  const june: User = {
    name: "June Park",
    email: "june@example.com",
    password: "demo",
    createdAt: daysAgo(3),
    lastActiveAt: daysAgo(3),
    answers: seedAnswers(4, "text", [
      "A suburb that looked like every other suburb. What I remember is the sound of sprinklers and the feeling that real life was happening somewhere else.",
      "Sitting in the back of my dad's car at night, watching streetlights pass, pretending they were a code only I could read.",
      "My piano teacher, Mrs. Ahn. She never said 'good.' She said 'again' — and somehow it meant the same thing.",
      "An old soul. Adults loved saying it. I mostly remember wanting to be a young one.",
    ]),
    bookGeneratedAt: null,
    isDemo: true,
  };

  for (const u of [mara, tomas, june]) {
    if (!users[u.email]) users[u.email] = u;
  }
  saveUsers(users);
}
