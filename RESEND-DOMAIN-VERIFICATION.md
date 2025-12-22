# Verify Your Domain in Resend (15 minutes)

This will allow you to send emails to ANY email address, not just your own.

## Step 1: Add Domain in Resend

1. Go to **Resend Dashboard** → **Domains**
2. Click **"Add Domain"** button
3. Enter: `creativitybylily.com`
4. Click **"Add"**

## Step 2: Add DNS Records

Resend will show you DNS records to add. You'll need to add these to your domain's DNS settings:

**Example records (Resend will give you the exact ones):**
- **TXT record** for domain verification
- **CNAME record** for DKIM
- **MX record** (if needed)

### Where to Add DNS Records:

**If your domain is on:**
- **Vercel/Netlify**: They usually have DNS settings, or you might need to use your domain registrar
- **GoDaddy/Namecheap/Other registrar**: Go to your domain registrar's DNS settings
- **Cloudflare**: Go to DNS settings in Cloudflare dashboard

### How to Add:

1. Go to your domain's DNS management
2. Add each record Resend provides
3. Save changes
4. Wait 5-10 minutes for DNS to propagate

## Step 3: Wait for Verification

1. Go back to Resend Dashboard → Domains
2. You'll see your domain with status "Pending" or "Verifying"
3. Wait 5-15 minutes (DNS propagation takes time)
4. Status will change to "Verified" ✅

## Step 4: Update Supabase SMTP

Once verified:

1. Go to **Supabase Dashboard** → **Project Settings** → **Authentication** → **Email (SMTP)**
2. In **"Sender details"**:
   - **Sender email address:** `noreply@creativitybylily.com`
   - **Sender name:** `creativity by lily`
3. Click **"Save changes"**

## Step 5: Test

1. Try signing up with ANY email address
2. Check inbox - email should arrive! ✅
3. No more restrictions!

---

## Benefits After Verification

✅ Send to any email address  
✅ Better deliverability (won't go to spam)  
✅ Professional sender address  
✅ No testing restrictions  
✅ Production-ready

---

**This is the proper solution for production!** Takes about 15 minutes total (mostly waiting for DNS).



