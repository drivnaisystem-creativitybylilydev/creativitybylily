# Returns System Setup Guide

## ✅ What's Been Implemented

### 1. Database Schema
- **File**: `supabase/create-returns-table.sql`
- **Action Required**: Run this SQL in your Supabase SQL Editor
- Creates `returns` table with:
  - Return tracking (status, return number)
  - Return items (JSONB array)
  - Refund tracking
  - Return shipping info
  - Admin notes

### 2. Frontend Components
- **Start Return Button**: Added to returns policy page
- **Return Form Page**: `/returns/start` - Multi-step form to:
  - Select order
  - Select items to return
  - Provide reason (optional)
- **Return Confirmation Page**: `/returns/confirmation` - Shows return status

### 3. API Routes
- **POST `/api/returns/create`**: Creates return requests
  - Validates user authentication
  - Verifies order ownership
  - Generates return number
  - Stores return request

### 4. Updated Returns Policy
- Changed to reflect unlimited returns
- Updated instructions to use the new return system
- Removed 14-day restriction

## 🔧 Setup Steps

### Step 1: Run Database Migration
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/create-returns-table.sql`
3. Click **Run**

### Step 2: Test the Flow
1. Create a test order (or use existing order)
2. Go to `/returns` page
3. Click "Start Return" button
4. Log in if needed
5. Select order and items
6. Submit return request
7. Check return appears in database

## 📋 Next Steps (To Complete)

### 1. Admin Dashboard for Returns
- Create `/admin/returns` page to:
  - View all return requests
  - Approve/reject returns
  - Update return status
  - Add admin notes
  - Process refunds

### 2. Email Notifications
- User confirmation email when return is submitted
- Admin notification email for new returns
- Status update emails (approved, received, refunded)

### 3. Return Shipping Integration
- Generate return shipping labels (if using Shippo)
- Track return shipments
- Update status when return is received

### 4. Refund Processing
- Integrate with payment processor (Square/Stripe)
- Process refunds to original payment method
- Update return status when refunded

## 🔄 Return Workflow

1. **User submits return** → Status: `pending`
2. **Admin reviews** → Approve or reject
3. **If approved** → Status: `approved`
   - User receives email with return instructions
   - User ships items back (user pays shipping)
4. **Admin receives return** → Status: `received`
5. **Admin inspects** → Status: `processed`
6. **Refund processed** → Status: `refunded`
   - Refund issued to original payment method

## 📝 Notes

- **Return Address**: Currently uses shipping address from the original order. You may want to set a fixed return address.
- **Return Shipping**: User pays for return shipping as specified
- **Refund Method**: Refunds go to original payment method
- **Admin Approval**: Required before return can proceed

## 🐛 Known Limitations

1. No admin interface yet (returns need to be managed via database)
2. No email notifications yet
3. No return shipping label generation
4. No automatic refund processing

---

**Status**: ✅ Core return system implemented. Ready for testing and admin interface development.
