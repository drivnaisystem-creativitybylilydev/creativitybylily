# Return & Refund Workflow - Recommended Process

## 🎯 Complete Return/Refund Workflow

### **Phase 1: Customer Initiates Return** ✅ (Already Implemented)
1. Customer clicks "Start Return" on `/returns` page
2. Customer logs in (or is already logged in)
3. Customer selects order and items to return
4. Customer provides reason (optional)
5. System calculates refund amount
6. Return request created with status: `pending`
7. **Email sent to customer**: "Return Request Received"
8. **Email sent to admin**: "New Return Request - Action Required"

### **Phase 2: Admin Reviews & Approves** ✅ (Partially Implemented)
1. Admin sees notification badge on "Returns" link
2. Admin views return details at `/admin/returns/[id]`
3. Admin reviews:
   - Items being returned
   - Reason provided
   - Refund amount
   - Original order details
4. Admin decision:
   - **Approve** → Status: `approved`
   - **Reject** → Status: `rejected` (with reason in admin notes)
5. **If Approved:**
   - **Email sent to customer**: "Return Approved - Shipping Instructions"
   - Email includes:
     - Return address
     - Return shipping instructions
     - Return number for tracking
     - Deadline to ship (optional)
6. **If Rejected:**
   - **Email sent to customer**: "Return Request Rejected"
   - Email includes rejection reason

### **Phase 3: Customer Ships Return** (Needs Implementation)
1. Customer receives approval email with return address
2. Customer packages items
3. Customer ships items (customer pays shipping)
4. Customer can optionally add tracking number:
   - Add field in customer account → "My Returns" section
   - Or email admin with tracking number
5. **When customer adds tracking:**
   - Status: `shipped`
   - Tracking number saved to return record
   - **Email sent to admin**: "Return Shipped - Tracking Added"

### **Phase 4: Admin Receives & Inspects** (Needs Implementation)
1. Admin receives return package
2. Admin updates status: `received`
3. Admin inspects items:
   - Check condition
   - Verify items match return request
   - Check for damage/wear (acceptable per your policy)
4. Admin adds inspection notes in "Admin Notes" field
5. **If items acceptable:**
   - Status: `processed` (ready for refund)
6. **If items unacceptable:**
   - Status: `rejected` (with reason)
   - **Email sent to customer**: "Return Rejected - Items Not Acceptable"

### **Phase 5: Process Refund** (Needs Implementation)
1. When status is `processed`, admin clicks "Process Refund" button
2. System:
   - Retrieves original payment from order (`payment_intent_id`)
   - Calls Square API to process refund
   - Stores refund transaction ID
   - Updates status: `refunded`
3. **Email sent to customer**: "Refund Processed"
   - Email includes:
     - Refund amount
     - Refund transaction ID
     - Expected time to appear in account (5-7 business days)

---

## 🔧 Implementation Recommendations

### **Priority 1: Essential Features**

#### 1. **Email Notifications** (High Priority)
- Use Resend (already set up in codebase)
- Create email templates:
  - Return Request Received (customer)
  - New Return Request (admin)
  - Return Approved (customer)
  - Return Rejected (customer)
  - Return Shipped (admin)
  - Return Received (customer)
  - Refund Processed (customer)

#### 2. **Customer Return Tracking** (High Priority)
- Add "My Returns" section to `/account` page
- Show return status, items, refund amount
- Allow customer to add tracking number when shipping
- Show return instructions when approved

#### 3. **Refund Processing Integration** (High Priority)
- Create API endpoint: `/api/admin/returns/[id]/process-refund`
- Integrate with Square Refunds API
- Store refund transaction ID
- Handle refund errors gracefully

### **Priority 2: Enhanced Features**

#### 4. **Return Shipping Label** (Optional)
- Generate return shipping label (via Shippo or Square)
- Email label to customer when approved
- Store label URL in return record

#### 5. **Automated Status Transitions** (Optional)
- Auto-update to `received` when tracking shows delivered
- Auto-update to `processed` after X days if no issues

#### 6. **Return Analytics** (Optional)
- Track return reasons
- Calculate return rate
- Identify problematic products

---

## 📋 Suggested Status Workflow

```
pending → approved → shipped → received → processed → refunded
   ↓
rejected (can happen at any review stage)
```

### **Status Definitions:**
- **pending**: Customer submitted, awaiting admin review
- **approved**: Admin approved, customer can ship
- **shipped**: Customer shipped items back (tracking added)
- **received**: Admin received package, inspecting
- **processed**: Inspection complete, ready for refund
- **refunded**: Refund processed via payment processor
- **rejected**: Return denied (at any stage)

---

## 🎨 UI/UX Improvements

### **Admin Dashboard:**
- Add "Process Refund" button (only shows when status = `processed`)
- Add "Generate Return Label" button (when approved)
- Add tracking number input field (when status = `shipped`)
- Show refund transaction ID when refunded
- Add bulk actions (approve multiple returns)

### **Customer Account:**
- Add "Returns" tab to account page
- Show all returns with status
- Allow adding tracking number
- Show return instructions when approved
- Show refund status and transaction ID

---

## 💡 Quick Wins (Easy to Implement First)

1. **Email notifications** - Use existing Resend setup
2. **Customer return tracking** - Add to account page
3. **Refund button** - Add to admin return detail page
4. **Tracking number input** - Add to customer and admin views

---

## 🔐 Security Considerations

- Verify user owns the return before allowing tracking updates
- Verify admin permissions before processing refunds
- Log all refund transactions
- Store refund transaction IDs for audit trail
- Handle partial refunds if needed

---

Would you like me to implement any of these features? I'd recommend starting with:
1. Email notifications
2. Customer return tracking page
3. Refund processing integration


