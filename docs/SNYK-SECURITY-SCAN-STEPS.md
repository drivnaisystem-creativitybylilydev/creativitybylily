# Full Step-by-Step: Snyk Security Scan

Use this guide when you're at your computer. You'll use both your **browser** and **terminal**.

---

## What you're doing

Snyk scans your project's dependencies (npm packages) for known security vulnerabilities. You'll create a free Snyk account, link it to your terminal once, then run a scan. No global install required if you use `npx`.

---

## Step 1: Open your project in the terminal

1. Open **Terminal** (Mac) or your IDE’s terminal (e.g. Cursor’s integrated terminal).
2. Go to your project folder:
   ```bash
   cd /Users/finnschueler/Desktop/creativitybylily
   ```
3. Confirm you’re in the right place (you should see `package.json`):
   ```bash
   ls package.json
   ```

---

## Step 2: Run Snyk auth (this will ask you to log in)

In the same terminal, run:

```bash
npx snyk auth
```

- The first time, npm may download Snyk (this is normal).
- You’ll see a message like: **“Now redirecting you to our auth page…”** and a long URL.

**Do not close the terminal.** Leave it open.

---

## Step 3: Create a Snyk account and finish auth (in your browser)

1. **Copy the long URL** from the terminal (the one that starts with `https://app.snyk.io/...`).
2. **Paste it into your browser** (Chrome, Safari, etc.) and press Enter.
3. On the Snyk page:
   - If you see **Sign up**: choose **Sign up with email** or **Sign up with GitHub/Google** and create a free account.
   - If you see **Log in**: log in with the account you just created or already have.
4. After you log in, Snyk will say something like **“Auth complete”** or **“You can close this window.”**
5. **Go back to your terminal.** The `snyk auth` command should have finished and you’ll see your prompt again. If it’s still waiting, that’s fine; once the browser said auth was complete, you’re done with this step.

You only need to do Step 2 + Step 3 once per machine (unless you log out of Snyk later).

---

## Step 4: Run the security test

In the **same terminal**, in the same project folder, run:

```bash
npx snyk test
```

- Snyk will read your `package.json` and lockfile and check for known vulnerabilities.
- It may take 30 seconds to a couple of minutes.

---

## Step 5: Read the results

- **If you see “no vulnerable paths found”** (or similar): no issues reported for your current dependencies.
- **If you see a table or list of issues**: Snyk is reporting vulnerabilities. For each one you’ll typically see:
  - **Package name** (e.g. some npm package)
  - **Severity** (e.g. High, Medium, Low)
  - **Issue** (e.g. CVE or vulnerability name)
  - Often a **“Fix”** line (e.g. “run `npm update some-package`” or “upgrade to X.Y.Z”).

You can:
- Run the suggested fix commands (e.g. `npm update <package>`) and then run `npx snyk test` again to see if the count goes down.
- Open the Snyk dashboard in your browser (you’ll get a link in the report) for a fuller view and history.

---

## Optional: Use a globally installed Snyk

If you prefer a global install so you can type `snyk` from any folder:

1. In terminal, run (you may be asked for your Mac password):
   ```bash
   sudo npm install -g snyk
   ```
2. Then use `snyk auth` and `snyk test` instead of `npx snyk auth` and `npx snyk test` (same steps as above).

---

## Quick reference (once you’ve done auth once)

```bash
cd /Users/finnschueler/Desktop/creativitybylily
npx snyk test
```

That’s all you need for a normal scan after the first-time auth.

---

## If something goes wrong

- **“Authentication error” or “401” when running `snyk test`**  
  Run `npx snyk auth` again and complete the browser login; then run `npx snyk test` again.

- **“command not found: snyk”**  
  Use `npx snyk` (e.g. `npx snyk test`) instead of `snyk`.

- **Browser didn’t open for auth**  
  Copy the URL from the terminal and paste it into your browser manually.

- **Permission denied when installing globally**  
  Use `npx snyk test` so you don’t need a global install.

---

## Summary checklist

- [ ] Open terminal and `cd` to project folder  
- [ ] Run `npx snyk auth`  
- [ ] Copy the URL from terminal into browser  
- [ ] Create/log in to Snyk account and complete auth  
- [ ] Back in terminal, run `npx snyk test`  
- [ ] Read the report and fix any issues you care about (optional)
