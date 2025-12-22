# Return Workflow - Step-by-Step Guide

This document explains how the return workflow is currently set up in your e-commerce system.

---

## 📋 Overview

The return workflow consists of **4 main phases**:
1. **Customer Initiates Return** ✅ Fully Implemented
2. **Admin Reviews & Approves** ✅ Fully Implemented
3. **Customer Ships Return** ⚠️ Partially Implemented (manual tracking)
4. **Admin Receives & Processes Refund** ✅ Fully Implemented

---

## 🔄 Phase 1: Customer Initiates Return

### Step 1.1: Customer Visits Returns Page
- **Location**: `/returns`
- **What happens**:
  - Customer sees the returns policy page
  - "Start Return" button is displayed at the top
  - Button checks if user is logged in

### Step 1.2: Customer Clicks "Start Return"
- **Component**: `StartReturnButton` (`src/components/StartReturnButton.tsx`)
- **What happens**:
  - If logged in → Redirects to `/returns/start`
  - If not logged in → Redirects to `/login?redirect=/returns/start`

### Step 1.3: Customer Selects Order & Items
- **Location**: `/returns/start`
- **Component**: `src/app/returns/start/page.tsx`
- **What happens**:
  1. System fetches all orders for the logged-in user
  2. Customer selects an order from their order history
  3. Customer selects which items to return (checkboxes)
  4. Customer optionally selects a reason from dropdown:
     - Changed my mind
     - Not as described
     - Defective/Damaged
     - Wrong item received
     - Other
  5. System automatically calculates refund amount based on selected items

### Step 1.4: Customer Submits Return Request
- **API Route**: `POST /api/returns/create`
- **File**: `src/app/api/returns/create/route.ts`
- **What happens**:
  1. **Authentication**: Validates user's session token
  2. **Order Verification**: Confirms order belongs to the user
  3. **Return Number Generation**: Creates unique return number (format: `RET-YYYYMMDD-XXXX`)
  4. **Database Insert**: Creates return record with:
     - `status`: `'pending'`
     - `return_number`: Generated unique ID
     - `order_id`: Reference to original order
     - `user_id`: Customer's user ID
     - `return_items`: JSON array of items being returned
     - `refund_amount`: Calculated total
     - `return_address`: Copied from order's shipping address
     - `reason`: Optional reason selected by customer
  5. **Email Notification**: Sends "Return Request Received" email to customer
     - **Template**: `ReturnRequestReceivedEmail` (`src/emails/ReturnRequestReceived.tsx`)
     - **Function**: `sendReturnRequestReceivedEmail()` (`src/lib/email.ts`)
  6. **Response**: Returns return number and redirects to confirmation page

### Step 1.5: Customer Sees Confirmation
- **Location**: `/returns/confirmation?return=RET-XXXXX`
- **Component**: `src/app/returns/confirmation/page.tsx`
- **What customer sees**:
  - Return number
  - Current status (pending)
  - Refund amount
  - Next steps message

---

## 🔄 Phase 2: Admin Reviews & Approves

### Step 2.1: Admin Views Return Requests
- **Location**: `/admin/returns`
- **Component**: `src/app/admin/returns/page.tsx`
- **What admin sees**:
  - Table of all return requests
  - Columns: Return #, Order #, Customer, Items, Refund Amount, Status, Date
  - Returns are sorted by most recent first
  - Status badges with color coding:
    - `pending`: Yellow
    - `approved`: Blue
    - `shipped`: Purple
    - `received`: Indigo
    - `processed`: Green
    - `refunded`: Gray
    - `rejected`: Red

### Step 2.2: Admin Views Return Details
- **Location**: `/admin/returns/[id]`
- **Component**: `src/app/admin/returns/[id]/page.tsx`
- **What admin sees**:
  - **Left Column**:
    - Items to return (with product images, titles, quantities, prices)
    - Return details (reason, refund amount, shipping cost)
    - Related order information (order number, date, total)
  - **Right Sidebar**:
    - Status update component
    - Return address (where customer should ship items)
    - Admin notes section

### Step 2.3: Admin Updates Status
- **Component**: `ReturnStatusUpdate` (`src/components/admin/ReturnStatusUpdate.tsx`)
- **Available Statuses**:
  1. **Pending** - Awaiting admin review
  2. **Approved** - Return approved, customer can ship
  3. **Shipped** - Customer has shipped items back
  4. **Received** - Items received, inspecting
  5. **Processed** - Inspection complete, ready for refund
  6. **Refunded** - Refund processed
  7. **Rejected** - Return request rejected

### Step 2.4: Admin Approves Return
- **API Route**: `PATCH /api/admin/returns/[id]/status`
- **File**: `src/app/api/admin/returns/[id]/status/route.ts`
- **What happens when status = `'approved'`**:
  1. Database updates return status to `'approved'`
  2. **Email Notification**: Sends "Return Approved" email to customer
     - **Template**: `ReturnApprovedEmail` (`src/emails/ReturnApproved.tsx`)
     - **Function**: `sendReturnApprovedEmail()` (`src/lib/email.ts`)
     - **Includes**: Return address, shipping instructions, return number

### Step 2.5: Admin Rejects Return (Optional)
- **What happens when status = `'rejected'`**:
  1. Database updates return status to `'rejected'`
  2. Admin can add notes explaining rejection
  3. **Note**: Currently no automatic email sent for rejections (could be added)

---

## 🔄 Phase 3: Customer Ships Return

### Step 3.1: Customer Receives Approval Email
- Customer gets email with:
  - Return address (where to ship)
  - Return number
  - Shipping instructions
  - Refund amount

### Step 3.2: Customer Ships Items
- **Current Implementation**: Manual process
- Customer packages items and ships to return address
- Customer pays for return shipping
- **Note**: Customer can optionally add tracking number (currently manual via admin)

### Step 3.3: Admin Updates Status to "Shipped"
- Admin can manually update status to `'shipped'` when customer notifies them
- **Future Enhancement**: Could add customer-facing form to add tracking number

---

## 🔄 Phase 4: Admin Receives & Processes Refund

### Step 4.1: Admin Receives Package
- Admin receives return package
- Admin updates status to `'received'`

### Step 4.2: Admin Inspects Items
- Admin checks condition of returned items
- Admin can add notes in "Admin Notes" section
- Admin updates status to `'processed'` when inspection is complete

### Step 4.3: Admin Processes Refund
- **Current Implementation**: Manual refund processing
- Admin processes refund through Square (or payment processor)
- Admin updates status to `'refunded'`
- **API Route**: `PATCH /api/admin/returns/[id]/status` with `status: 'refunded'`

### Step 4.4: Customer Receives Refund Confirmation
- **What happens when status = `'refunded'`**:
  1. Database updates return status to `'refunded'`
  2. **Email Notification**: Sends "Refund Processed" email to customer
     - **Template**: `RefundProcessedEmail` (`src/emails/RefundProcessed.tsx`)
     - **Function**: `sendRefundProcessedEmail()` (`src/lib/email.ts`)
     - **Includes**: Refund amount, transaction ID (if available)

---

## 📊 Database Schema

### Returns Table (`returns`)
- **File**: `supabase/create-returns-table.sql`
- **Key Fields**:
  - `id`: UUID primary key
  - `return_number`: Unique return identifier (e.g., `RET-20240115-1234`)
  - `order_id`: Foreign key to `orders` table
  - `user_id`: Foreign key to `users` table
  - `status`: One of: `pending`, `approved`, `shipped`, `received`, `processed`, `refunded`, `rejected`
  - `reason`: Optional reason for return
  - `return_items`: JSONB array of items being returned
  - `refund_amount`: Decimal amount to refund
  - `return_address`: JSONB shipping address for return
  - `return_tracking_number`: Optional tracking number
  - `admin_notes`: Optional admin notes
  - `refund_transaction_id`: Optional payment processor transaction ID
  - `created_at`, `updated_at`: Timestamps

### Row Level Security (RLS)
- Users can only view/create their own returns
- Admins can view/manage all returns

---

## 📧 Email Notifications

### 1. Return Request Received
- **Trigger**: When customer submits return request
- **Template**: `src/emails/ReturnRequestReceived.tsx`
- **Sent to**: Customer
- **Includes**: Return number, order number, items, refund amount

### 2. Return Approved
- **Trigger**: When admin changes status to `'approved'`
- **Template**: `src/emails/ReturnApproved.tsx`
- **Sent to**: Customer
- **Includes**: Return address, shipping instructions, return number

### 3. Refund Processed
- **Trigger**: When admin changes status to `'refunded'`
- **Template**: `src/emails/RefundProcessed.tsx`
- **Sent to**: Customer
- **Includes**: Refund amount, transaction ID

---

## 🔧 Technical Details

### API Routes
1. **`POST /api/returns/create`**
   - Creates new return request
   - Requires authentication
   - Validates order ownership
   - Sends confirmation email

2. **`PATCH /api/admin/returns/[id]/status`**
   - Updates return status
   - Requires admin authentication
   - Sends status-specific emails

### Components
- `StartReturnButton`: Button on returns policy page
- `ReturnStatusUpdate`: Admin status update interface
- `MarkAsViewed`: Marks returns as viewed in admin dashboard

### Email Functions
- `sendReturnRequestReceivedEmail()`: Sends initial confirmation
- `sendReturnApprovedEmail()`: Sends approval with shipping instructions
- `sendRefundProcessedEmail()`: Sends refund confirmation

---

## ⚠️ Current Limitations & Future Enhancements

### What's Working ✅
- Customer can initiate returns
- Admin can view and manage returns
- Status updates work correctly
- Email notifications for key status changes
- Return number generation
- Order ownership validation

### What Could Be Enhanced 🔄
1. **Customer Tracking Number Input**: Allow customers to add tracking numbers themselves
2. **Automatic Refund Processing**: Integrate with Square API to automatically process refunds
3. **Return Label Generation**: Generate return shipping labels via Shippo
4. **Rejection Email**: Send email when return is rejected
5. **Customer Return History**: Add "My Returns" section to customer account page
6. **Return Deadline Tracking**: Track deadlines for shipping returns
7. **Partial Refunds**: Support partial refunds for partial returns

---

## 🎯 Status Flow Diagram

```
pending → approved → shipped → received → processed → refunded
   ↓
rejected
```

**Status Descriptions**:
- `pending`: Initial state, awaiting admin review
- `approved`: Admin approved, customer can ship
- `shipped`: Customer has shipped items
- `received`: Admin received package
- `processed`: Admin inspected, ready for refund
- `refunded`: Refund completed
- `rejected`: Return request denied

---

## 📝 Notes

- **Return Address**: Currently uses the shipping address from the original order. You may want to set a fixed return address.
- **Return Shipping**: Customer pays for return shipping (as specified in policy)
- **Refund Method**: Refunds go to original payment method (Square)
- **Admin Approval**: Required before return can proceed
- **Unlimited Returns**: Policy allows unlimited returns with no time restrictions

---

**Last Updated**: January 2025


