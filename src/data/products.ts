/* =========================================================
   POELYS — product catalogue
   ---------------------------------------------------------
   This file is the default catalogue. The Poelys Console can
   override any field (status, copy, links, YouTube film, order)
   without a redeploy; those overrides are merged on top of it.

   To add a YouTube film to a product, put the video id on its
   `youtube` line, e.g.  youtube: 'dQw4w9WgXcQ',
   ========================================================= */

export type Status = 'live' | 'beta' | 'dev' | 'soon' | 'maintenance' | 'concept' | 'hidden';

export const STATUS_LABEL: Record<Status, string> = {
  live: 'Live',
  beta: 'Beta',
  dev: 'In development',
  soon: 'Coming soon',
  maintenance: 'Under maintenance',
  concept: 'Concept',
  hidden: 'Hidden',
};

/** Products are listed by status first (live on top), then by their own order. */
export const STATUS_RANK: Record<Status, number> = { live: 0, beta: 1, dev: 2, soon: 3, maintenance: 4, concept: 5, hidden: 9 };

/** Statuses offered in the Console (hidden is replaced by Archive). */
export const STATUS_CHOICES: Status[] = ['live', 'beta', 'dev', 'soon', 'maintenance', 'concept'];

/** Which hand-coded scene renders inside the product's preview frame. */
export type PreviewKind =
  | 'workspace' | 'chat' | 'restaurant' | 'ledger' | 'notes' | 'orbit'
  | 'breath' | 'grid' | 'jobs' | 'phone-text' | 'tablet' | 'clock' | 'rover' | 'space';

export interface Branch {
  id: string;
  name: string;
  short: string;
  blurb: string;
  kind: 'software' | 'hardware' | 'research';
}

export interface ProductLinks {
  open?: string;
  site?: string;
  source?: string;
  download?: string;
  pricing?: string;
  privacy?: string;
  terms?: string;
}

export interface ExtraLink { label: string; url: string }

export interface Product {
  id: string;
  name: string;
  branch: string;
  status: Status;
  tagline: string;
  summary: string;
  description: string;
  icon?: string;
  /** Brand colour of the product, used sparingly inside its preview. */
  accent: string;
  platforms: string[];
  highlights: string[];
  links: ProductLinks;
  preview: PreviewKind;
  /** A URL that allows framing. When set, visitors can run the product inside the page. */
  embed?: string;
  /** YouTube video id for the product film. Empty = no film shown. */
  youtube?: string;
  openSource?: boolean;
  featured?: boolean;
  year: number;
  order: number;
  /** Any other links (docs, store pages, press). */
  extraLinks?: ExtraLink[];
  /** Archived: off the website, kept in the Console. */
  archived?: boolean;
  /** Deleted: off the website and in the Console's bin, restorable. */
  removed?: boolean;
}

export const branches: Branch[] = [
  { id: 'work', name: 'Work & Operations', short: 'Work', kind: 'software',
    blurb: 'Tools teams and businesses run on every day.' },
  { id: 'life', name: 'Money & Mind', short: 'Money', kind: 'software',
    blurb: 'Calm, personal software for money, focus and attention.' },
  { id: 'learn', name: 'Learning & Careers', short: 'Learn', kind: 'software',
    blurb: 'Study and career tools built for clarity, not engagement.' },
  { id: 'launchers', name: 'Launchers', short: 'Launchers', kind: 'software',
    blurb: 'Home screens that give you fewer ways to get distracted.' },
  { id: 'space', name: 'Space & Simulation', short: 'Space', kind: 'research',
    blurb: 'Physics, orbits and long journeys, simulated honestly.' },
  { id: 'hardware', name: 'Hardware & DIY', short: 'Hardware', kind: 'hardware',
    blurb: 'Things you can hold: rovers, companions, and what comes next.' },
];

const GH = 'https://github.com/thrishankkuntimaddi';

export const products: Product[] = [
  {
    id: 'oruinwan', name: 'Oruinwan', branch: 'work', status: 'live', order: 1, featured: true, year: 2025,
    tagline: 'One workspace for every conversation.',
    summary: 'Channels, DMs, huddles, tasks, notes and AI in one open-source workspace.',
    description:
      'Oruinwan brings team communication and context together: channels, direct messages, huddles, tasks and notes, with an AI layer that helps you work with what your team already knows. Your team follows one place instead of five.',
    icon: '/images/oruinwan-icon.png', accent: '#5b4bdb',
    platforms: ['Web', 'Windows', 'macOS', 'Linux', 'Android'],
    highlights: ['Channels, DMs and huddles', 'Tasks and notes linked to conversations', 'AI that reads your workspace, not the internet', 'Open source, MIT licensed'],
    links: { open: 'https://oruinwan.poelys.com', site: 'https://thrishankkuntimaddi.github.io/Oruinwan/', pricing: 'https://thrishankkuntimaddi.github.io/Oruinwan/pricing', source: `${GH}/Oruinwan`, download: `${GH}/Oruinwan/releases/latest` },
    preview: 'workspace', openSource: true, youtube: '',
  },
  {
    id: 'parla', name: 'Parla', branch: 'work', status: 'live', order: 2, year: 2025,
    tagline: 'Say it clearly.',
    summary: 'A communication app designed around clarity and fewer interruptions.',
    description:
      'Parla is a communication application built inside the Poelys ecosystem. It is designed around clarity, helping people have real conversations with less friction and more focus.',
    icon: '/images/parla-icon.png', accent: '#d01a1a',
    platforms: ['Web'],
    highlights: ['Conversations without the noise', 'Built for focus', 'Part of the Poelys ecosystem'],
    links: { open: 'https://app.parla.poelys.com/welcome' },
    embed: 'https://app.parla.poelys.com/welcome',
    preview: 'chat', youtube: '',
  },
  {
    id: 'yormenu', name: 'YorMenu', branch: 'work', status: 'live', order: 3, featured: true, year: 2026,
    tagline: 'From table to kitchen to bill.',
    summary: 'A restaurant platform: floor, waiter app, kitchen tickets, billing and a QR menu.',
    description:
      'YorMenu runs the whole dinner: the table floor, a waiter app, kitchen order tickets with thermal printing, a billing counter, a cleaning crew view, and a QR menu where guests browse, order or call a server. Many restaurants run on one server, and none can see another\'s data.',
    icon: '/images/yormenu-icon.png', accent: '#c2410c',
    platforms: ['Web', 'Android', 'Windows', 'macOS'],
    highlights: ['Kitchen order tickets with printing', 'Live billing counter with GST and split payments', 'QR menu for guests', 'Multi-restaurant, fully isolated data'],
    links: { open: 'https://yormenu.poelys.com/' },
    preview: 'restaurant', youtube: '',
  },
  {
    id: 'expense-tracker', name: 'Expense Tracker', branch: 'life', status: 'live', order: 4, featured: true, year: 2025,
    tagline: 'Know where every rupee goes.',
    summary: 'Expenses, income, bills, budgets, goals and trip splits in one calm place.',
    description:
      'One account for your whole money life: expenses, income, bills, budgets, savings goals, debts with people, trip splits and a monthly report, in any currency. Live sync, app lock across devices, backups in your own Google Drive, and reminders that arrive.',
    icon: '/images/expense-tracker-icon.png', accent: '#0f766e',
    platforms: ['Web', 'Android', 'Windows', 'macOS', 'Linux'],
    highlights: ['Budgets that pace your month', 'Trip splits and debts with people', 'Backups to your own Google Drive', 'Free and open source'],
    links: { open: 'https://expensetracker-in.web.app/', site: 'https://thrishankkuntimaddi.github.io/ExpenseTracker/', source: `${GH}/ExpenseTracker`, download: `${GH}/ExpenseTracker/releases/latest`, privacy: 'https://thrishankkuntimaddi.github.io/ExpenseTracker/privacy.html' },
    embed: 'https://thrishankkuntimaddi.github.io/ExpenseTracker/',
    preview: 'ledger', openSource: true, youtube: '',
  },
  {
    id: 'meditation', name: 'Meditation', branch: 'life', status: 'live', order: 5, year: 2026,
    tagline: 'Sit. Breathe. Every other device goes quiet.',
    summary: 'Meditation and breathing that silences your other devices while you practise.',
    description:
      'A calm, distraction-free meditation and breathing app on the web, Android and desktop. Your practice syncs across devices, and every other device is silenced while you meditate. Bells are synthesised on the device; reminders are off by default.',
    icon: '/images/meditation-icon.png', accent: '#4f6d5a',
    platforms: ['Web', 'Android', 'Windows', 'macOS', 'Linux'],
    highlights: ['Guided box, 4-7-8 and coherent breathing', 'Silences your other devices', 'Hold-to-end, eyes-closed mode', 'Reminders that adapt, never nag'],
    links: { open: 'https://thrishankkuntimaddi.github.io/Meditation/', download: `${GH}/Meditation/releases/latest`, privacy: 'https://thrishankkuntimaddi.github.io/Meditation/privacy.html', terms: 'https://thrishankkuntimaddi.github.io/Meditation/terms.html' },
    embed: 'https://thrishankkuntimaddi.github.io/Meditation/',
    preview: 'breath', youtube: '',
  },
  {
    id: 'clearmymind', name: 'ClearMyMind', branch: 'life', status: 'live', order: 6, year: 2025,
    tagline: 'Declutter your mind, one name at a time.',
    summary: 'A fast place to offload names, tasks and thoughts, then clear them away.',
    description:
      'ClearMyMind is a focused mental offloading tool. Open it, type a name, press Enter. Sheets, groups, bags, colour tags and snapshots are there when you need more, and when you are done you can literally blast it all away.',
    icon: '/images/clearmymind-icon.png', accent: '#7c3aed',
    platforms: ['Web'],
    highlights: ['Type, press Enter, done', 'Sheets, groups and colour tags', 'Cloud sync', 'Open source, MIT licensed'],
    links: { open: 'https://thrishankkuntimaddi.github.io/clearmyMind/', source: `${GH}/clearmyMind` },
    embed: 'https://thrishankkuntimaddi.github.io/clearmyMind/',
    preview: 'grid', openSource: true, youtube: '',
  },
  {
    id: 'learnvianotes', name: 'LearnViaNotes', branch: 'learn', status: 'live', order: 7, featured: true, year: 2025,
    tagline: 'One concept at a time.',
    summary: '22 subjects of focused notes plus 150 coding problems in four languages.',
    description:
      'A quick, focused interview sheet: 22 computer-science subjects plus 150 coding problems with solutions in Python, C++, Java and JavaScript. Sign-in is optional and only adds a synced streak, study history and notes. Just learn.',
    icon: '/images/learnvianotes-icon.png', accent: '#1d4ed8',
    platforms: ['Web', 'Android', 'iOS'],
    highlights: ['22 subjects, from DSA to Generative AI', '150 problems in 4 languages', 'Spaced-repetition review queue', 'Works offline'],
    links: { open: 'https://www.learnvianotes.in/' },
    preview: 'notes', youtube: '',
  },
  {
    id: 'willai', name: 'WillAI', branch: 'learn', status: 'beta', order: 8, year: 2026,
    tagline: 'See what AI can do in your job, and where to go next.',
    summary: 'Compares your work with live job openings and builds a plan you can tick off.',
    description:
      'For nurses, farmers, accountants, drivers, engineers and every other trade. WillAI compares your work with today\'s live job openings, shows which of your tasks AI already handles, suggests roles you could move into (each backed by real open positions), and gives you a plan you can tick off.',
    icon: '/images/willai-icon.svg', accent: '#1f1b16',
    platforms: ['Web'],
    highlights: ['Scores worked out in the open', 'Roles backed by real openings', 'A day-by-day plan', 'Live job search with trust badges'],
    links: { open: 'https://willai-564c9.web.app/' },
    preview: 'jobs', youtube: '',
  },
  {
    id: 'nolauncher', name: 'NoLauncher', branch: 'launchers', status: 'live', order: 9, year: 2026,
    tagline: 'No icons. No badges. Just names.',
    summary: 'A calm Android home screen that holds you to your limits.',
    description:
      'NoLauncher gives you fewer ways to open things, not more. Up to seven essential apps as plain text on black. Daily minutes per app; at zero the app closes and you are sent home. Stricter limits apply now, looser ones only start tomorrow.',
    icon: '/images/nolauncher-icon.svg', accent: '#111111',
    platforms: ['Android'],
    highlights: ['Seven names on black', 'Per-app daily time limits', 'One 15-minute extension a day', 'Who is waiting, never what they said'],
    links: { site: 'https://thrishankkuntimaddi.github.io/nolauncher/', privacy: 'https://thrishankkuntimaddi.github.io/nolauncher/privacy.html', terms: 'https://thrishankkuntimaddi.github.io/nolauncher/terms.html' },
    preview: 'phone-text', youtube: '',
  },
  {
    id: 'slate', name: 'Slate', branch: 'launchers', status: 'beta', order: 10, year: 2026,
    tagline: 'A tablet home screen that feels finished.',
    summary: 'An iPadOS-style launcher for Android tablets, with widgets and smart folders.',
    description:
      'Slate is a home screen for Android tablets, built for the Xiaomi Pad 5. Pages with folders, a dock of favourites and recent apps, an App Library, and widgets (clock, calendar, to-do, focus timer, habits, weather and more) in a stack that snaps and moves on by itself.',
    icon: '/images/slate-icon.svg', accent: '#2563eb',
    platforms: ['Android tablets'],
    highlights: ['Widget stacks that rotate on their own', 'Smart category folders', 'App Library and dock', 'Full-screen gestures on HyperOS'],
    links: { site: 'https://thrishankkuntimaddi.github.io/slatelauncher/', privacy: 'https://thrishankkuntimaddi.github.io/slatelauncher/privacy.html', terms: 'https://thrishankkuntimaddi.github.io/slatelauncher/terms.html' },
    embed: 'https://thrishankkuntimaddi.github.io/slatelauncher/',
    preview: 'tablet', youtube: '',
  },
  {
    id: 'sentinelflight', name: 'SentinelFlight', branch: 'space', status: 'live', order: 11, featured: true, year: 2025,
    tagline: 'Fly real rockets through the real sky.',
    summary: 'A launch and orbit game on the real space catalogue, with a trained avoidance AI.',
    description:
      'Every satellite and piece of debris is propagated with SGP4, every launch is screened for collisions, and your rocket is integrated from the pad to orbit with real physics. The collision-avoidance AI is a Double DQN agent trained for the job. A research tool, played as a game.',
    icon: '/images/sentinelflight-icon.jpg', accent: '#0e7490',
    platforms: ['Web'],
    highlights: ['Live public space catalogue', 'Launch-window collision screening', 'Double DQN avoidance agent', 'Six-mission campaign'],
    links: { open: 'https://sentinelflight.poelys.com/', source: `${GH}/Enhanced-Space-Debris-Avoidance-and-Trajectory-Optimization-System` },
    preview: 'orbit', youtube: '',
  },
  {
    id: 'interstellar', name: 'Interstellar Endurance', branch: 'space', status: 'soon', order: 12, year: 2026,
    tagline: 'Earth to Gargantua in fifteen minutes.',
    summary: 'A real-time journey and flight game in Three.js, with TARS as your copilot.',
    description:
      'A 14 minute 56 second real-time journey from Earth to Gargantua, synced to the score, plus a flight game: launch a Saturn V, dock with the Endurance, dive the black hole. TARS can fly all of it, and talks you through it.',
    icon: '/images/interstellar-icon.svg', accent: '#d6a55a',
    platforms: ['Web'],
    highlights: ['Every scene is a function of the music', 'Playable Saturn V ascent', 'TARS copilot with voice commands', 'Custom GLSL black hole'],
    links: {},
    preview: 'space', youtube: '',
  },
  {
    id: 'ms-minutes', name: 'Ms. Minutes', branch: 'hardware', status: 'dev', order: 13, featured: true, year: 2026,
    tagline: 'One brain. Many bodies.',
    summary: 'A persistent AI companion that lives in a tiny retro clock on your desk.',
    description:
      'Ms. Minutes is an AI companion that talks naturally and inhabits many bodies, starting with a small retro clock on the desk. Her brain runs on a local model or Claude; the firmware, the brain and the face are all open source.',
    icon: '/images/ms-minutes-icon.svg', accent: '#b45309',
    platforms: ['Desk clock', 'Web', 'Windows', 'macOS', 'Linux'],
    highlights: ['Runs on a local model', 'Retro clock body, more to come', 'Remembers you across bodies', 'Open source, MIT licensed'],
    links: { source: `${GH}/MsMinutes` },
    preview: 'clock', openSource: true, youtube: '',
  },
  {
    id: 'rc-rovers', name: 'RC Crawlers', branch: 'hardware', status: 'dev', order: 14, year: 2026,
    tagline: 'From tablet-driven crawlers to autonomous explorers.',
    summary: 'A numbered series of home-built rovers, each Mark adding a new capability.',
    description:
      'Each rover is a numbered Mark, and every Mark adds a capability on top of the last: remote control, then eyes, hands, a brain and 3D vision. They are driven from RC-Rovers, an Android tablet app. Each Mark is open-sourced once complete: code, wiring, docs and build videos.',
    icon: '/images/rc-rovers-icon.png', accent: '#0a0a0c',
    platforms: ['ESP32', 'Android tablet'],
    highlights: ['Mark 1: ESP32 rock crawler over Wi-Fi', 'Mark 2: live FPV camera', 'Mark 4: on-board AI driving', 'Mark 5: LiDAR and SLAM'],
    links: { source: `${GH}/my-rovers`, download: `${GH}/my-rovers/releases/latest/download/RC-Rovers.apk` },
    preview: 'rover', openSource: true, youtube: '',
  },
];

/** Things on the horizon. Shown as buds on the tree. */
export const horizon = [
  { name: 'Poelys API', note: 'One key for the studio\'s services', branch: 'work' },
  { name: 'Rover Mark 2', note: 'Eyes: a live camera in the app', branch: 'hardware' },
  { name: 'Ms. Minutes, second body', note: 'Beyond the clock', branch: 'hardware' },
  { name: 'Partner products', note: 'Built with people we trust', branch: 'partners' },
];
