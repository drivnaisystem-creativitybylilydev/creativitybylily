# Return Workflow Automation - New Features

This document describes the automation features added to streamline the return workflow for both customers and admins.

---

## ✅ What's Been Automated

### 1. **Customer Tracking Number Input** (Step 3 Automation)

**What it does:**
- Customers can now add tracking numbers directly from their account page
- When a tracking number is added, the return status automatically updates from `approved` → `shipped`
- No admin intervention required

**How it works:**
1. Customer receives approval email with return address
2. Customer ships items and gets tracking number
3. Customer goes to **Account → Returns** tab
4. Customer enters tracking number in the input field
5. System automatically:
   - Saves tracking number to return record
   - Updates status to `shipped`
   - Shows confirmation message

**Files:**
- **API Route**: `src/app/api/returns/[id]/tracking/route.ts`
  - Validates user authentication
  - Verifies return ownership
  - Checks return is in `approved` status
  - Updates tracking number and status to `shipped`
- **Component**: `src/components/ReturnTrackingInput.tsx`
  - Customer-facing UI for adding tracking numbers
  - Shows current tracking if already added
  - Only displays when return is `approved` or `shipped`
- **Account Page**: `src/app/account/page.tsx`
  - Added "Returns" tab
  - Displays all customer returns with status
  - Shows tracking input component for approved returns

---

### 2. **Automatic Square Refund Processing** (Step 4 Automation)

**What it does:**
- When admin sets return status to `refunded`, the system automatically processes the refund through Square
- No manual refund processing required
- Refund transaction ID is automatically stored

**How it works:**
1. Admin receives return package and inspects items
2. Admin updates status to `processed` (inspection complete)
3. Admin updates status to `refunded`
4. System automatically:
   - Retrieves original Square payment ID from order
   - Calls Square Refunds API to process refund
   - Stores refund transaction ID in return record
   - Updates return status to `refunded`
   - Sends "Refund Processed" email to customer with transaction ID

**Files:**
- **API Route**: `src/app/api/admin/returns/[id]/status/route.ts`
  - Detects when status is set to `refunded`
  - Retrieves order's payment ID (checks both `payment_id` and `payment_intent_id`)
  - Initializes Square client
  - Creates refund request with:
    - Unique idempotency key (prevents duplicate refunds)
    - Refund amount in cents
    - Original payment ID
  - Processes refund via Square API
  - Stores refund transaction ID
  - Handles errors gracefully

**Error Handling:**
- If payment ID not found → Returns error (admin must process manually)
- If Square API fails → Returns error with details
- If refund succeeds but database update fails → Logs error (refund still processed)

---

## 📋 Updated Workflow

### **Phase 3: Customer Ships Return** (Now Automated)
1. ✅ Customer receives approval email with return address
2. ✅ Customer packages items
3. ✅ Customer ships items (customer pays shipping)
4. ✅ **Customer adds tracking number** → Status automatically updates to `shipped`
5. ✅ Admin receives notification (via return status change)

### **Phase 4: Admin Receives & Processes Refund** (Now Automated)
1. ✅ Admin receives return package
2. ✅ Admin updates status: `received`
3. ✅ Admin inspects items
4. ✅ Admin updates status: `processed`
5. ✅ **Admin updates status: `refunded`** → **Refund automatically processed through Square**
6. ✅ Customer receives "Refund Processed" email with transaction ID

---

## 🎯 Benefits

### For Customers:
- ✅ **Self-service tracking**: No need to email admin with tracking numbers
- ✅ **Faster updates**: Status updates immediately when tracking is added
- ✅ **Better visibility**: Can see all returns in one place on account page

### For Admins:
- ✅ **No manual refund processing**: Refunds happen automatically
- ✅ **Reduced errors**: No risk of forgetting to process refunds
- ✅ **Faster workflow**: One-click refund processing
- ✅ **Better tracking**: All refund transaction IDs stored automatically

---

## 🔧 Technical Details

### API Endpoints

#### `PATCH /api/returns/[id]/tracking`
- **Purpose**: Customer adds tracking number
- **Auth**: Requires customer authentication
- **Validation**:
  - User must own the return
  - Return must be in `approved` status
- **Updates**:
  - `return_tracking_number`: Tracking number
  - `status`: `shipped`

#### `PATCH /api/admin/returns/[id]/status`
- **Purpose**: Admin updates return status (with automatic refund processing)
- **Auth**: Requires admin authentication
- **Special handling for `refunded` status**:
  - Automatically processes Square refund
  - Stores refund transaction ID
  - Sends confirmation email

### Square Refund API Integration

**Square API Method**: `refundsApi.refundPayment()`

**Request Parameters**:
- `idempotencyKey`: Unique key to prevent duplicate refunds (`refund-{returnId}-{timestamp}`)
- `amountMoney`: Refund amount in cents (USD)
- `paymentId`: Original Square payment ID from order

**Response**:
- `refund.id`: Square refund transaction ID (stored in `refund_transaction_id`)

### Database Updates

**Returns Table**:
- `return_tracking_number`: Updated when customer adds tracking
- `status`: Auto-updated to `shipped` when tracking added
- `refund_transaction_id`: Auto-populated when refund processed

---

## 🚀 Usage Examples

### Customer Adding Tracking Number

1. Customer logs in and goes to **Account** page
2. Clicks **Returns** tab
3. Finds approved return
4. Enters tracking number in input field
5. Clicks "Add Tracking Number"
6. Status automatically updates to "Shipped"

### Admin Processing Refund

1. Admin goes to `/admin/returns/[id]`
2. Reviews return details
3. Updates status to `received` (package received)
4. Updates status to `processed` (inspection complete)
5. Updates status to `refunded` → **Refund automatically processed**
6. Customer receives email with refund confirmation

---

## ⚠️ Important Notes

### Payment ID Requirements
- Orders must have a `payment_id` (Square payment ID) stored
- If payment ID is missing, refund will fail with error message
- Admin must process refund manually if payment ID is not available

### Square Environment
- Uses `SQUARE_ENVIRONMENT` environment variable (Production/Sandbox)
- Uses `SQUARE_ACCESS_TOKEN` for authentication
- Refunds are processed in real-time

### Error Handling
- If Square refund fails, admin sees error message
- Return status is NOT updated if refund fails
- Admin can retry or process refund manually
- All errors are logged for debugging

### Idempotency
- Each refund uses a unique idempotency key
- Prevents duplicate refunds if request is retried
- Format: `refund-{returnId}-{timestamp}`

---

## 📝 Future Enhancements

Potential improvements that could be added:

1. **Email Notifications**:
   - Send email to admin when customer adds tracking number
   - Send email when refund is automatically processed

2. **Partial Refunds**:
   - Support partial refunds for partial returns
   - Allow admin to specify refund amount

3. **Refund Status Tracking**:
   - Poll Square API to check refund status
   - Update return status based on Square refund status

4. **Return Label Generation**:
   - Automatically generate return shipping labels
   - Email labels to customers when return is approved

---

**Last Updated**: January 2025


