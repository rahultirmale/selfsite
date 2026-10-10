// Single source of truth for side projects, used by index.html and recruiter.html.
// status: "live" (working now) · "proto" (product prototype) · "soon" (domain owned, being rebuilt)
// next: custom domain being set up. When it works, set url + domain to it and delete next.
window.PROJECTS = [
  { name: 'AI Universe', status: 'live', url: 'https://ainewsletterglobal.com', domain: 'ainewsletterglobal.com',
    desc: 'Interactive explorer for global AI news, sorted into Core LLMs, AI wrappers and industry agents.', tags: ['Content', 'Interactive UI'] },
  { name: 'Jyotish AI', status: 'live', url: 'https://vedicastrologyforyouai.com', domain: 'vedicastrologyforyouai.com · aipredictstoday.com',
    desc: 'Vedic astrology engine plus LLM readings for career, love and compatibility, with ₹99/month subscriptions via Razorpay.', tags: ['Subscriptions', 'Razorpay'] },
  { name: 'EnhanceMyEmail', status: 'live', url: 'https://email-fluent.vercel.app', domain: 'email-fluent.vercel.app', next: 'enhancemyemail.com',
    desc: 'AI rewriting that turns rough drafts into polished professional emails. 30 free drafts, no signup needed.', tags: ['LLM', 'Freemium'] },
  { name: 'ManageMySubscription AI', status: 'live', url: 'https://keep-my-stream.vercel.app', domain: 'keep-my-stream.vercel.app', next: 'managemysubscriptionai.com',
    desc: 'Tracks renewals, finds wasted subscription spend and suggests savings.', tags: ['Fintech', 'Personal finance'] },
  { name: 'DrawOps', status: 'live', url: 'https://draw-ops-plus.vercel.app', domain: 'draw-ops-plus.vercel.app',
    desc: 'Hand-drawn-style system diagrams with cloud icons, smart connectors and real-time collaboration.', tags: ['Collaboration', 'Dev tools'] },
  { name: 'Cozy Canvas', status: 'live', url: 'https://cozy-canvas.vercel.app', domain: 'cozy-canvas.vercel.app',
    desc: 'Real-time drawing duels: create, duel and rate drawings with others, or sketch solo.', tags: ['Multiplayer', 'Realtime'] },
  { name: 'Family Recharge', status: 'proto', url: 'https://prepaidfamily.vercel.app', domain: 'prepaidfamily.vercel.app',
    desc: 'Telecom concept: up to 4 prepaid lines share one payer, one expiry date and leftover daily data.', tags: ['Telecom', 'Prototype'] },
  { name: 'Predict & Win', status: 'proto', url: 'https://v0-predict-and-win-feature.vercel.app', domain: 'v0-predict-and-win-feature.vercel.app',
    desc: 'Gamified match predictions that earn telecom rewards, with streaks and leaderboards.', tags: ['Gamification', 'Prototype'] },
  { name: 'Multi-bill Pay', status: 'proto', url: 'https://v0-multiple-payment-feature.vercel.app', domain: 'v0-multiple-payment-feature.vercel.app',
    desc: 'Pay several prepaid and postpaid bills in one go, for yourself or for accounts you manage.', tags: ['Payments', 'Prototype'] },
  { name: 'AppReviewIntelligence', status: 'soon', url: 'https://appreviewintelligence.com', domain: 'appreviewintelligence.com',
    desc: 'Compare two apps and turn their reviews into product signals. n8n scraper → insights agent, with Supabase.', tags: ['n8n', 'AI agents'] },
  { name: 'MicroAnalytics Dash', status: 'soon', url: 'https://microanalyticsdash.com', domain: 'microanalyticsdash.com',
    desc: 'Lightweight analytics dashboard for small products.', tags: ['Analytics'] },
  { name: 'CRM for SMEs', status: 'soon', url: 'https://crmforsme.com', domain: 'crmforsme.com',
    desc: 'A simple CRM for small businesses that have outgrown spreadsheets.', tags: ['B2B', 'CRM'] },
];
