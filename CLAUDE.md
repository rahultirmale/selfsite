# CLAUDE.md: rahultirmale.com

Personal portfolio site for Rahul Tirmale, built to pitch to recruiters for Head / Director of Product roles.
Live at **https://www.rahultirmale.com** · GitHub repo: `rahultirmale/selfsite` · Vercel project: `selfsite`.

## What this is

A static site with no build step and no framework: plain HTML, CSS and JS.

- `index.html`: the **interactive experience**, a dark HUD-style hub inspired by Iron Man (but with no Marvel names or branding). A glowing core is surrounded by five modules, each opening a full-screen panel:
  - **MK-I Product Leader**: career evolution timeline (click a company for details), signature wins (one per company), mission logs, awards, résumé download
  - **MK-II AI Consulting**: an "AI opportunity scan" (visitor picks industry and goal, gets 3 ideas, then a pre-filled email), engagement models, Builder's lab project grid
  - **MK-III Musician**: playable Web Audio guitar (Karplus-Strong synthesis), stage photo, YouTube solo (loaded on click)
  - **MK-IV Peace**: toolkit tabs (Breathe, Calm your body, Gratitude, Mantras with a 108-bead mala counter, Ground yourself 5-4-3-2-1), plus a "Power down the suit" mode that recolours the whole site
  - **MK-V Author**: 3D draggable book (Amazon link), and posts that open in an in-site reader
  - Also: boot intro (skippable, once per session), command bar (`/` or Ctrl+K), "Profile" link (top-left) that opens the `#about` overview, and a **Recruiter mode** button that is always visible
- `recruiter.html`: the **clean one-page résumé** view (light/dark, editorial style). It has an "Interactive mode" button back to `index.html`.
- `assets/hud.css`, `assets/hud.js`: everything for the interactive site.
- `assets/projects.js`: **single source of truth for side projects**, read by both pages. To change a project, edit only this file.
- `assets/stage.webp`: guitar stage photo. `resume.pdf`: downloadable CV.

Deep links work: `index.html#product`, `#consulting`, `#music`, `#peace`, `#author`, `#about`.

## Content rules (important)

- **Positioning:** product leader first. AI is a lever, not the identity. Lead with business impact, then scale, then AI.
- **Confidential metrics:** never publish exact internal Vi numbers.
  - Agent recharges are always shown as **"50K+"** a month.
  - App revenue share is only shown as **relative growth (about 28%)**, never absolute percentages.
  - "70% of app revenue owned by the team" is currently shown. Ask before adding any other revenue figures.
- **Don't invent facts.** Use the CV numbers: 30M+ users, $1B GMV, +11% DAU (Malaysia Airlines), +50% travel inventory (Wipro), 2–5M MAU per gamification programme, +27% transactions, 4.2 → 4.4 rating. If a claim isn't sourced, flag it to Rahul.
- **Accenture Strategy:** core strategy consulting, plus product-owner roles on client programmes. Show both sides.
- **No "Rahul OS" branding.** The header shows "PROFILE", not his name. Keep the Iron Man feel subtle.
- **Telecom prototypes** (Family Recharge, Predict & Win, Multi-bill Pay) were removed on purpose. Don't re-add them.
- Builder's lab statuses in `projects.js`: `live`, `proto`, `soon`. `soon` items render without a link. `next` shows "moving to <domain>" for projects whose custom domain isn't connected yet.

## Making changes

1. Edit the files directly. There's nothing to install.
2. Preview locally: `.claude/launch.json` defines a `site` server (`python -m http.server 5500`). Use the browser pane at `http://localhost:5500`.
3. Check both desktop and phone (375px) widths, and that nothing scrolls sideways (`document.documentElement.scrollWidth === innerWidth`).
4. Commit with author `Rahul Tirmale <rahultirmale@gmail.com>`, push to `origin main`.
5. Deploy: `vercel deploy --prod --yes` from this folder. This aliases to www.rahultirmale.com.
6. Verify on the live site (for example, `curl` the page and grep for the change).

## Gotchas learned the hard way

- **Run Vercel CLI commands in the user's Terminal panel** (`run_in_terminal`), not the Bash or PowerShell tools. The CLI login lives in the user's shell, and the tool shells report "No existing credentials found". Close old terminal tabs; the session caps open tabs.
- **The Vercel MCP connector returns 403** for the `rahultirmale-gmailcoms-projects` scope. Use the CLI instead.
- The project is **not connected to GitHub for auto-deploy** (as of Oct 2026). Pushing does not deploy; run `vercel deploy --prod`.
- **Nested git repo:** `C:\Users\Rohan` is itself a git repo. This folder has its own repo. Always run git commands from this folder, and never push from the home repo.
- **CSS `display` overrides `[hidden]`:** any element with an explicit `display` rule needs a `[hidden] { display: none; }` rule too (already added for `#boot`, `.panel`, `.pt`, `.reader`, `.mission`, `.cmd`).
- **Pseudo-element bullets:** `.scan-console div::before` adds "› " to every child div. Give non-text children `::before { content: none; }`.
- **Browser-pane screenshots break** when the emulated viewport is wider than the pane. Use the `mobile` preset with `zoom` on regions, or measure layout with JS instead.
- **Python:** not on PATH in Git Bash. Use `/c/Users/Rohan/anaconda3/python.exe`. Long heredocs containing backticks and quotes can confuse bash, so write scripts to a file with the Write tool.
- **Sound** is off by default (interface blips). The guitar, calm tone and mala chime play only on explicit user action.
- Peace journal entries are stored in the visitor's `localStorage` only (`peace-journal`), wrapped in try/catch.

## Open items

- Direct LinkedIn URLs for the three posts. They currently link to the LinkedIn activity page; `POSTS[].url` is in `hud.js`.
- `resume.pdf` still contains the confidential exact figures. Replace it once Rahul sends an updated CV.
- Domains to renew or connect: appreviewintelligence.com, crmforsme.com (both marked live), enhancemyemail.com, managemysubscriptionai.com. MicroAnalytics Dash is still `soon`.
- Optional: connect the Vercel project to the GitHub repo for auto-deploys. Possible phase 3: an "R.A.I." recruiter Q&A assistant, which needs a backend and API costs, so ask first.
