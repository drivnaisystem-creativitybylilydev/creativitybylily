# Supabase Security Fixes

## 🔴 Critical: Leaked Password Protection

**Action Required:** Enable this immediately in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Password Protection**
2. Enable **"Leaked Password Protection"**
3. This will prevent users from using passwords that have been found in data breaches

**Why it matters:** Without this, attackers could use known compromised passwords to access accounts.

---

## 🟡 Moderate: Function Search Path Security

**Status:** Fixed in `supabase/fix-function-security.sql`

**What to do:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/fix-function-security.sql`
3. Click **Run**

**What this fixes:**
- Prevents SQL injection vulnerabilities in database functions
- Sets a fixed `search_path` so functions can't be hijacked
- Affects 3 functions:
  - `handle_new_user` (user profile creation)
  - `update_updated_at_column` (timestamp updates)
  - `generate_order_number` (order number generation)

**Why it matters:** Without fixed search_path, an attacker could potentially manipulate which schemas functions search, leading to security vulnerabilities.

---

## Priority Order

1. **IMMEDIATE:** Enable Leaked Password Protection (Dashboard setting)
2. **SOON:** Run the function security fix SQL (prevents potential SQL injection)

Both fixes are important, but the password protection is more critical for immediate user security.



