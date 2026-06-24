"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  CreditCard,
  Download,
  FileText,
  Globe2,
  LayoutDashboard,
  Mic,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { answeredCount, getUsers, type User } from "@/lib/store";
import {
  ageDemographics,
  countries,
  funnel,
  invoices,
  payments,
  reports,
  revenueByMonth,
} from "@/lib/mock-business";

type Section =
  | "overview"
  | "readers"
  | "payments"
  | "invoices"
  | "reports"
  | "settings";

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "readers", label: "Readers", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  signups: { label: "Sign-ups", color: "var(--chart-3)" },
} satisfies ChartConfig;

const booksConfig = {
  books: { label: "Books generated", color: "var(--chart-2)" },
} satisfies ChartConfig;

const funnelConfig = {
  value: { label: "Readers", color: "var(--chart-4)" },
} satisfies ChartConfig;

const ageConfig = Object.fromEntries(
  ageDemographics.map((a, i) => [
    a.key,
    { label: a.band, color: `var(--chart-${i + 1})` },
  ])
) satisfies ChartConfig;

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [section, setSection] = useState<Section>("overview");
  const [selectedReader, setSelectedReader] = useState<string | null>(null);
  const [mockNote, setMockNote] = useState("");
  const [range, setRange] = useState("6m");

  const RANGE_LABELS: Record<string, string> = {
    "30d": "Last 30 days",
    "6m": "Last 6 months",
    "12m": "Last 12 months",
    all: "All time",
  };

  useEffect(() => {
    setUsers(
      Object.values(getUsers()).sort(
        (a, b) => +new Date(b.lastActiveAt) - +new Date(a.lastActiveAt)
      )
    );
  }, []);

  function mockAction(label: string) {
    setMockNote(`“${label}” is a mockup action in this prototype.`);
    window.setTimeout(() => setMockNote(""), 2600);
  }

  /* ── Live metrics from this browser's real data ─────────── */
  const liveAnswers = users.reduce((n, u) => n + answeredCount(u), 0);
  const liveBooks = users.filter((u) => u.bookGeneratedAt).length;
  const liveVoice = users.reduce(
    (n, u) =>
      n + Object.values(u.answers).filter((a) => a.via === "voice").length,
    0
  );
  const voicePct = liveAnswers
    ? Math.round((liveVoice / liveAnswers) * 100)
    : 0;

  const sectionTitle: Record<Section, string> = {
    overview: "CEO 360 · Overview",
    readers: "Readers",
    payments: "Payments",
    invoices: "Invoices",
    reports: "Reports",
    settings: "Settings",
  };

  return (
    <div className="dark ceo min-h-dvh bg-background font-sans text-foreground antialiased">
      <div className="flex min-h-dvh">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
              S
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">SOURCE</p>
              <p className="text-xs text-muted-foreground">Storyteller HQ</p>
            </div>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV.map((item) => (
              <Button
                key={item.id}
                variant={section === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2.5"
                onClick={() => setSection(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <Separator />
          <div className="px-3 py-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5"
              render={<Link href="/" />}
              nativeButton={false}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to storybook
            </Button>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-5 py-3.5 backdrop-blur-sm">
            <h1 className="text-lg font-semibold tracking-tight">
              {sectionTitle[section]}
            </h1>
            <Badge variant="outline" className="text-muted-foreground">
              {section === "readers" ? "Live · this browser" : "Mock data · demo"}
            </Badge>
            <div className="ms-auto flex items-center gap-2.5">
              <div className="lg:hidden">
                <Select
                  value={section}
                  onValueChange={(v) => setSection(v as Section)}
                >
                  <SelectTrigger className="w-36">
                    {NAV.find((n) => n.id === section)?.label}
                  </SelectTrigger>
                  <SelectContent>
                    {NAV.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={range} onValueChange={(v) => setRange(v as string)}>
                <SelectTrigger className="hidden w-36 sm:flex">
                  {RANGE_LABELS[range]}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => mockAction("Export")}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
                aria-label="Signed in as CEO"
              >
                CEO
              </span>
            </div>
            {mockNote && (
              <p
                role="status"
                className="w-full text-xs text-amber-400"
              >
                {mockNote}
              </p>
            )}
          </header>

          <main className="space-y-6 p-5 lg:p-6">
            {section === "overview" && (
              <Overview voicePct={voicePct} liveBooks={liveBooks} liveReaders={users.length} onJump={setSection} />
            )}
            {section === "readers" && (
              <Readers
                users={users}
                selected={selectedReader}
                onSelect={setSelectedReader}
              />
            )}
            {section === "payments" && <Payments onMock={mockAction} />}
            {section === "invoices" && <Invoices onMock={mockAction} />}
            {section === "reports" && <Reports onMock={mockAction} />}
            {section === "settings" && <SettingsPanel onMock={mockAction} />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ Overview ════════════════ */

function Overview({
  voicePct,
  liveBooks,
  liveReaders,
  onJump,
}: {
  voicePct: number;
  liveBooks: number;
  liveReaders: number;
  onJump: (s: Section) => void;
}) {
  const kpis = [
    {
      label: "Total revenue",
      value: usd(95630),
      delta: "+17.4% vs last quarter",
      icon: TrendingUp,
    },
    {
      label: "Active readers",
      value: "3,322",
      delta: "+446 this month",
      icon: Users,
    },
    {
      label: "Books generated",
      value: "1,070",
      delta: "58% completion rate",
      icon: BookOpenText,
    },
    {
      label: "Voice answers",
      value: `${voicePct || 56}%`,
      delta: "of all responses",
      icon: Mic,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardDescription>{k.label}</CardDescription>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-semibold tracking-tight">
                {k.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{k.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & sign-ups</CardTitle>
            <CardDescription>Last 8 months, all markets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-72 w-full">
              <AreaChart data={revenueByMonth} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="var(--color-revenue)"
                  fillOpacity={0.22}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="signups"
                  type="monotone"
                  fill="var(--color-signups)"
                  fillOpacity={0.18}
                  stroke="var(--color-signups)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reader age bands</CardTitle>
            <CardDescription>Share of active readers</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={ageConfig} className="h-52 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="key" />} />
                <Pie
                  data={ageDemographics}
                  dataKey="share"
                  nameKey="key"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {ageDemographics.map((a, i) => (
                    <Cell key={a.key} fill={`var(--chart-${i + 1})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="mt-2 grid w-full grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {ageDemographics.map((a, i) => (
                <li key={a.key} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: `var(--chart-${i + 1})` }}
                  />
                  <span className="text-muted-foreground">{a.band}</span>
                  <span className="ms-auto font-mono">{a.share}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Books per month</CardTitle>
            <CardDescription>Generated storybooks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={booksConfig} className="h-56 w-full">
              <BarChart data={revenueByMonth}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="books"
                  fill="var(--color-books)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              Top markets
            </CardTitle>
            <CardDescription>Readers by country</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {countries.map((c) => (
              <div key={c.code} className="flex items-center gap-3">
                <span className="w-8 font-mono text-xs text-muted-foreground">
                  {c.code}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="truncate">{c.name}</span>
                    <span className="ms-2 font-mono text-xs text-muted-foreground">
                      {c.readers.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={c.share} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recent payments</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {payments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {p.customer.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate font-medium">{p.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.method}</p>
                </div>
                <PaymentBadge status={p.status} />
                <span className="font-mono">{usd(p.amount)}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => onJump("payments")}
            >
              View all payments
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

/* ════════════════ Readers (live data) ════════════════ */

function Readers({
  users,
  selected,
  onSelect,
}: {
  users: User[];
  selected: string | null;
  onSelect: (email: string | null) => void;
}) {
  const sel = users.find((u) => u.email === selected);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All readers</CardTitle>
          <CardDescription>
            Real accounts and answers stored in this browser. Click a row to
            read a reader&rsquo;s full answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reader</TableHead>
                <TableHead className="hidden md:table-cell">Progress</TableHead>
                <TableHead className="hidden sm:table-cell">Last active</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const done = answeredCount(u);
                const pct = Math.round((done / TOTAL_QUESTIONS) * 100);
                return (
                  <TableRow
                    key={u.email}
                    className="cursor-pointer"
                    data-state={selected === u.email ? "selected" : undefined}
                    onClick={() =>
                      onSelect(selected === u.email ? null : u.email)
                    }
                  >
                    <TableCell>
                      <p className="font-medium">
                        {u.name}
                        {u.isDemo && (
                          <Badge variant="outline" className="ms-2 text-muted-foreground">
                            demo
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 w-32" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {done}/{TOTAL_QUESTIONS}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {new Date(u.lastActiveAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.bookGeneratedAt ? (
                        <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                          Book generated
                        </Badge>
                      ) : pct > 0 ? (
                        <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-400">
                          In progress
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Just joined</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {sel && (
        <Card>
          <CardHeader>
            <CardTitle>Answers from {sel.name}</CardTitle>
            <CardDescription>
              Joined{" "}
              {new Date(sel.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}{" "}
              · {answeredCount(sel)} of {TOTAL_QUESTIONS} questions answered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {QUESTIONS.filter((q) => sel.answers[q.id]?.text.trim()).map((q) => (
              <div key={q.id} className="max-w-[70ch]">
                <p className="text-sm text-muted-foreground">
                  {q.prompt}
                  {sel.answers[q.id].via === "voice" && (
                    <Badge variant="outline" className="ms-2 gap-1 text-muted-foreground">
                      <Mic className="h-3 w-3" /> voice
                    </Badge>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {sel.answers[q.id].text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}

/* ════════════════ Payments ════════════════ */

function PaymentBadge({ status }: { status: string }) {
  if (status === "paid")
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
        Paid
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-400">
        Pending
      </Badge>
    );
  return <Badge variant="secondary">Refunded</Badge>;
}

function Payments({ onMock }: { onMock: (l: string) => void }) {
  const collected = payments
    .filter((p) => p.status === "paid")
    .reduce((n, p) => n + p.amount, 0);
  const pending = payments
    .filter((p) => p.status === "pending")
    .reduce((n, p) => n + p.amount, 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-1.5">
            <CardDescription>Collected this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold">{usd(collected)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1.5">
            <CardDescription>Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold">{usd(pending)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1.5">
            <CardDescription>Refund rate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold">2.1%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent storybook purchases & plans</CardDescription>
          </div>
          <div className="ms-auto flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => onMock("Export CSV")}>
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button className="gap-2" onClick={() => onMock("New payment link")}>
              <Plus className="h-4 w-4" /> Payment link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{p.customer}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">{p.method}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {p.date}
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono">{usd(p.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

/* ════════════════ Invoices ════════════════ */

function InvoiceBadge({ status }: { status: string }) {
  if (status === "paid")
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
        Paid
      </Badge>
    );
  if (status === "due")
    return (
      <Badge className="border-sky-500/30 bg-sky-500/15 text-sky-400">Due</Badge>
    );
  if (status === "overdue") return <Badge variant="destructive">Overdue</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

function Invoices({ onMock }: { onMock: (l: string) => void }) {
  const outstanding = invoices
    .filter((i) => i.status === "due" || i.status === "overdue")
    .reduce((n, i) => n + i.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            B2B & bulk orders · {usd(outstanding)} outstanding
          </CardDescription>
        </div>
        <div className="ms-auto flex gap-2">
          <Button variant="outline" onClick={() => onMock("Send reminders")}>
            Send reminders
          </Button>
          <Button className="gap-2" onClick={() => onMock("New invoice")}>
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {inv.id}
                </TableCell>
                <TableCell className="font-medium">{inv.client}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {inv.description}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {inv.due}
                </TableCell>
                <TableCell>
                  <InvoiceBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right font-mono">{usd(inv.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ════════════════ Reports ════════════════ */

function Reports({ onMock }: { onMock: (l: string) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Reader journey funnel</CardTitle>
          <CardDescription>From first visit to printed book</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={funnelConfig} className="h-72 w-full">
            <BarChart data={funnel} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="stage"
                type="category"
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled reports</CardTitle>
          <CardDescription>Generated as PDF & emailed to the board</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {reports.map((r, i) => (
            <div key={r.name}>
              {i > 0 && <Separator className="my-3" />}
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.detail} · updated {r.updated}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMock(`Generate ${r.name}`)}
                >
                  Generate
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ════════════════ Settings ════════════════ */

function SettingsPanel({ onMock }: { onMock: (l: string) => void }) {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Product settings</CardTitle>
        <CardDescription>Mock configuration panel for the demo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="pname">
            Product name
          </label>
          <Input id="pname" defaultValue="SOURCE: Your story, starring you!" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="price1">
              Digital book price
            </label>
            <Input id="price1" defaultValue="$29" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="price2">
              Print bundle price
            </label>
            <Input id="price2" defaultValue="$79" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="support">
            Support email
          </label>
          <Input id="support" defaultValue="hello@source.app" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={() => onMock("Save settings")}>Save changes</Button>
        <Button variant="ghost" onClick={() => onMock("Discard")}>
          Discard
        </Button>
      </CardFooter>
    </Card>
  );
}
