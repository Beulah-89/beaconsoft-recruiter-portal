# Beaconsoft IT Pvt Ltd — Recruiter Portal

A working prototype recruiter portal: job board, worklist, candidate pipeline
with resume upload, job posting (Admin-only), and a demo login.

## What this is right now

- Runs entirely in your browser — no real server yet
- Data (jobs, candidates, worklist) is saved to *your browser's local storage*,
  so it will still be there next time you open it on the same device/browser,
  but it is NOT shared between different people yet
- Login checks that you typed something like an email — it does not verify
  a real password or account (that comes in a later step, with Supabase)

This is intentional — it lets you see and click through a fully working app
today, before spending any time or money on a real backend.

## Step 1: Run it and see it live (choose ONE option)

### Option A — StackBlitz (zero install, easiest for beginners)
1. Go to https://stackblitz.com and create a free account
2. Click "Create project" → choose "Vite + React"
3. Delete the sample files it creates
4. Upload/paste in all the files from this folder, keeping the same
   folder structure (src/RecruiterPortal.jsx, src/main.jsx, etc.)
5. StackBlitz will auto-install everything and show you a live preview
   with its own temporary URL

### Option B — Run it on your own computer
1. Install Node.js from https://nodejs.org (choose the LTS version) — this
   is a one-time install
2. Open a terminal in this folder
3. Run: npm install
4. Run: npm run dev
5. Open the link it prints (usually http://localhost:5173)

## Step 2: Put the code somewhere permanent — GitHub

1. Go to https://github.com and create a free account
2. Click "New repository", name it "beaconsoft-recruiter-portal"
3. Upload all the files in this folder to that repository
   (GitHub's website lets you drag-and-drop files — no command line needed)

## Step 3: Deploy it to a real, public website — Vercel

1. Go to https://vercel.com and sign up (choose "Continue with GitHub")
2. Click "Add New" → "Project"
3. Select your "beaconsoft-recruiter-portal" repository
4. Leave all settings as default (Vercel auto-detects Vite) and click Deploy
5. In a minute or two, you'll get a live URL like:
   beaconsoft-recruiter-portal.vercel.app
   This is a real, public website anyone can visit.

## Step 4: Connect your own domain (optional)

1. Buy a domain if you don't have one (e.g. via Namecheap or GoDaddy) —
   something like beaconsoftit.com or a subdomain like careers.beaconsoftit.com
2. In Vercel: Project → Settings → Domains → add your domain
3. Vercel gives you DNS records to add at your domain registrar — follow
   their instructions exactly, it's a copy-paste step

## What's still missing before this is a "real" company tool

- Real accounts: right now anyone can type any email and get in. Adding
  Supabase (https://supabase.com, free tier) gives you real signup/login,
  a real shared database (so all recruiters see the same candidates and
  jobs, not just their own browser), and real file storage for resumes
  instead of the browser-only version here.
- Email notifications when a job is posted or a candidate changes stage
- Proper resume storage (currently resumes are stored as browser data,
  fine for testing, not for production use)

Ask me when you're ready for the Supabase step — I'll walk through it the
same way, one step at a time.
