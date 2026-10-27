export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  url: string;
  cta: string;
  icon?: string;
}

export const projects: Project[] = [
  {
    id: "parla",
    number: "01",
    name: "Parla",
    category: "Communication · Product",
    tagline: "Say it clearly.",
    description:
      "A communication application built inside the Poelys ecosystem. Parla is designed around clarity — helping people have real conversations with less friction and more focus.",
    url: "https://app.parla.poelys.com/welcome",
    cta: "Explore Parla",
    icon: "💬",
  },
  {
    id: "oruinwan",
    number: "02",
    name: "Oruinwan",
    category: "AI · Collaboration · Productivity",
    tagline: "Your work, in one place.",
    description:
      "A shared digital workspace for conversations, tasks, notes, and the work that connects them. Oruinwan brings team communication and context together — with an AI layer that helps you work with your information, not just store it.",
    url: "https://oruinwan.poelys.com/workspaces",
    cta: "Enter Oruinwan",
    icon: "⬡",
  },
  {
    id: "expense-tracker",
    number: "03",
    name: "Expense Tracker",
    category: "Personal Finance · Open Source",
    tagline: "Know where every rupee goes.",
    description:
      "Expenses, income, bills, budgets, savings goals, and shared trip costs — in one calm place. Free, open-source, and available on the web, Android, Mac, Windows, and Linux. Built to pace your month and help you make better decisions with your money.",
    url: "https://thrishankkuntimaddi.github.io/ExpenseTracker/",
    cta: "Explore Expense Tracker",
    icon: "₹",
  },
  {
    id: "learnvianotes",
    number: "04",
    name: "LearnViaNotes",
    category: "Education · Computer Science",
    tagline: "One concept at a time.",
    description:
      "Quick, focused notes for exploring computer science. LearnViaNotes covers 13 core CS subjects — from data structures to networking — organized so you can learn at your own pace, without distraction. Built for interview preparation and genuine understanding.",
    url: "https://www.learnvianotes.in/",
    cta: "Start Learning",
    icon: "◎",
  },
  {
    id: "yormenu",
    number: "05",
    name: "YorMenu",
    category: "Restaurants · Operations",
    tagline: "From table to kitchen to bill.",
    description:
      "A restaurant platform that runs the whole dinner: table floor, waiter app, kitchen order tickets, billing counter, and a QR menu where guests can browse, order, or call a server. Many restaurants run on one server, and none of them can see another's data.",
    url: "https://github.com/thrishankkuntimaddi/YorMenu",
    cta: "Explore YorMenu",
    icon: "🛎",
  },
  {
    id: "sentinelflight",
    number: "06",
    name: "SentinelFlight",
    category: "Space · Research · Engineering",
    tagline: "Navigate around the hazards.",
    description:
      "An engineering experiment exploring how spacecraft trajectories can be planned around orbital debris. SentinelFlight combines a mission console, catalog screening, and a reinforcement-learning agent — the Double DQN — to simulate, evaluate, and propose trajectory adjustments. A research tool, not a production system.",
    url: "https://enhanced-space-debris-avoidance-and.onrender.com/",
    cta: "Explore SentinelFlight",
    icon: "◌",
  },
];
