/* =========================================================
   POELYS — studio-wide content
   Everything here can also be changed from the Poelys Console.
   ========================================================= */

export const SITE = {
  name: 'Poelys',
  domain: 'poelys.com',
  email: 'poelysproducts@gmail.com',
  securityEmail: 'poelysproducts@gmail.com',
  founded: 2025,
  legalUpdated: '24 November 2026',
};

export type SocialId =
  | 'linkedin' | 'instagram' | 'x' | 'facebook' | 'youtube' | 'reddit' | 'discord' | 'whatsapp' | 'github' | 'threads';

export interface Social { id: SocialId; name: string; url: string }

/** Empty url = account not opened yet. Fill them in from the Console. */
export const socials: Social[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com/thrishankkuntimaddi' },
  { id: 'youtube', name: 'YouTube', url: '' },
  { id: 'linkedin', name: 'LinkedIn', url: '' },
  { id: 'instagram', name: 'Instagram', url: '' },
  { id: 'x', name: 'X', url: '' },
  { id: 'threads', name: 'Threads', url: '' },
  { id: 'facebook', name: 'Facebook', url: '' },
  { id: 'reddit', name: 'Reddit', url: '' },
  { id: 'discord', name: 'Discord', url: '' },
  { id: 'whatsapp', name: 'WhatsApp channel', url: '' },
];

export interface Role { id: string; title: string; team: string; place: string; kind: string; summary: string; open: boolean }

export const roles: Role[] = [
  { id: 'open-application', title: 'Open application', team: 'Any branch', place: 'Remote', kind: 'Any',
    summary: 'No listed role fits, but you build things you can show us? Write to us with what you made and why.', open: true },
  { id: 'hardware-tinkerer', title: 'Hardware & firmware tinkerer', team: 'Hardware & DIY', place: 'Remote / India', kind: 'Project-based',
    summary: 'ESP32, motor drivers, sensors, and the patience to wire it twice. Helps take the rover Marks forward.', open: false },
  { id: 'design-engineer', title: 'Design engineer', team: 'Studio', place: 'Remote', kind: 'Project-based',
    summary: 'Someone who designs in code and cares how a button feels when you press it.', open: false },
];

export interface Post { slug: string; title: string; date: string; tag: string; excerpt: string; body: string[] }

export const posts: Post[] = [
  {
    slug: 'a-studio-shaped-like-a-tree', title: 'A studio shaped like a tree', date: '2026-11-24', tag: 'Studio',
    excerpt: 'Why Poelys is one trunk with many branches, and why some branches are still bare.',
    body: [
      'Poelys started as a place to put things we were building. It turned into a trunk: one way of working, one standard for what ships, and branches that grow in whatever direction the work asks for.',
      'Some branches are software you can open today. Some are research. One of them is hardware, rovers and a talking desk clock, and it is the one we are most curious about.',
      'A branch can be bare for a while. That is fine. The tree is honest about what is growing and what is only a bud.',
    ],
  },
  {
    slug: 'software-that-does-less', title: 'Software that does less, on purpose', date: '2026-10-30', tag: 'Product',
    excerpt: 'NoLauncher, Meditation and ClearMyMind share one idea: the best feature is often a missing one.',
    body: [
      'A home screen with seven names on black. A meditation app that silences your other devices. A notepad you can blast clean.',
      'Each of these removes something. Fewer icons, fewer notifications, fewer places to put a thought. What is left is the part you came for.',
    ],
  },
  {
    slug: 'what-coming-soon-means', title: 'What "coming soon" means here', date: '2026-09-12', tag: 'Notes',
    excerpt: 'Statuses on this site are maintained by hand, and they mean exactly what they say.',
    body: [
      'Live means you can use it now. Beta means you can use it, and it may change under you. Coming soon means it exists and runs, but not for the public yet. Concept means an idea we are serious about.',
      'Under maintenance means we are fixing something, and the product will be back.',
    ],
  },
];

export interface Partner { name: string; kind: string; note: string; url?: string }
export const partners: Partner[] = [];

export interface ApiPlan { name: string; price: string; note: string; points: string[] }
export const apiPlans: ApiPlan[] = [
  { name: 'Explore', price: 'Free', note: 'For trying things', points: ['Rate limited per key', 'Community support', 'All public endpoints'] },
  { name: 'Build', price: 'Usage based', note: 'For products in production', points: ['Higher limits', 'Usage dashboard', 'Email support'] },
  { name: 'Partner', price: 'Talk to us', note: 'For deep integrations', points: ['Custom limits', 'Shared roadmap', 'Direct line to the studio'] },
];

export const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy covers poelys.com. Each Poelys product has its own policy, linked from its page, because each handles different data.',
    sections: [
      ['What we collect on this website', 'When you visit poelys.com we record an anonymous visit: the page, the referring site\'s domain, a rough device class (phone, tablet, desktop), browser and OS family, language, time zone, and a random visitor id kept in your browser\'s local storage. We record when you open a product, download a file, or play a film. We do not record your IP address, your name, or anything you type, except in the forms below.'],
      ['Forms', 'If you send us a message, apply for a role or ask about partnering, we keep what you write and the email you give, so we can reply. Nothing else.'],
      ['Cookies', 'This website sets no advertising or tracking cookies. It uses local storage for the visitor id, your theme choice, and dismissed banners. Clearing site data removes all of it.'],
      ['Where it lives', 'Visit records and messages are stored in Google Firebase (Cloud Firestore). Only the Poelys owner account can read them. Google acts as our processor.'],
      ['How long', 'Visit records are kept for up to 13 months. Messages are kept until the conversation is over, then deleted on request or within 24 months.'],
      ['Your choices', 'Turn on "Do Not Track" or Global Privacy Control in your browser and this website records nothing at all. To have your messages deleted, write to poelysproducts@gmail.com.'],
      ['Children', 'This website is not directed at children under 13 and does not knowingly collect their data.'],
      ['Changes', 'If this policy changes, the date at the top changes with it.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These terms cover poelys.com. Each product has its own terms where it needs them.',
    sections: [
      ['Using this website', 'You may browse, share links to, and quote this website. Do not attempt to disrupt it, scrape it at volume, probe it for vulnerabilities outside our security policy, or impersonate Poelys.'],
      ['Products', 'Products listed here are provided by Poelys or its partners under their own terms. A status such as Beta or Coming soon means the product may change or be unavailable.'],
      ['Open source', 'Open-source projects are licensed under the licence in their repository. Those licences, not these terms, govern the code.'],
      ['Names and marks', 'Poelys, the Poelys wordmark and product names are ours. Please do not use them in a way that suggests we endorse something we do not.'],
      ['No warranty', 'This website and its previews are provided as is. We work to keep them accurate but cannot promise they are free of errors.'],
      ['Liability', 'To the extent the law allows, Poelys is not liable for indirect or consequential loss arising from use of this website.'],
      ['Law', 'These terms are governed by the laws of India.'],
      ['Contact', 'Questions about these terms: poelysproducts@gmail.com.'],
    ],
  },
  cookies: {
    title: 'Cookie Notice',
    intro: 'Short version: no tracking cookies.',
    sections: [
      ['What we store', 'poelys.visitor (a random id), poelys.theme (light, dark or system), poelys.banner (banners you closed). All in local storage, none sent to third parties.'],
      ['Embedded content', 'Product previews and films load only when you press play. YouTube films use youtube-nocookie.com. A product running inside the page follows its own policy.'],
    ],
  },
  security: {
    title: 'Security',
    intro: 'How this website is protected, and how to tell us if you find a problem.',
    sections: [
      ['In transit', 'Every page and request is served over HTTPS (TLS). Plain HTTP is redirected.'],
      ['Content integrity', 'Published content can only be changed by the Poelys owner account, signed in with Google, verified, and recent. Database rules enforce this on the server; the website cannot override them.'],
      ['Scripts', 'A Content Security Policy only allows scripts from poelys.com and Google\'s Firebase. Text from the database is rendered as text, never as HTML.'],
      ['Rate limits', 'Every write a visitor can make (visit records, messages) is rate limited per visitor by the database rules themselves, and messages are capped in size and shape.'],
      ['Previews', 'Products shown inside the page run in a sandboxed frame that cannot reach this website.'],
      ['Reporting a vulnerability', 'Write to poelysproducts@gmail.com with steps to reproduce. Please give us 30 days before disclosing. We do not pursue good-faith research that follows this policy.'],
    ],
  },
} as const;

export type LegalKey = keyof typeof LEGAL;
