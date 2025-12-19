# Admin Notification Badge System

## Overview
The notification system displays red badges with counts on admin dashboard navigation links to alert admins about new activity (orders, returns, events).

## Setup Steps

### 1. Run SQL Migration
Run the SQL file to add `admin_viewed_at` columns to track when items have been viewed:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/add-admin-viewed-columns.sql
```

This adds:
- `admin_viewed_at` column to `orders` table
- `admin_viewed_at` column to `returns` table  
- `admin_viewed_at` column to `events` table (if exists)
- Indexes for performance

### 2. How It Works

**Notification Badges:**
- Red circular badges appear on navigation links (Orders, Returns, Events)
- Badge shows count of items where `admin_viewed_at IS NULL`
- Badges auto-refresh every 30 seconds
- Badges disappear when count is 0

**Marking as Viewed:**
- When admin visits a list page (`/admin/orders`, `/admin/returns`, `/admin/events`), all visible items are automatically marked as viewed
- This happens via the `MarkAsViewed` component
- Items are marked by setting `admin_viewed_at = NOW()`

**API Endpoints:**
- `GET /api/admin/notifications` - Returns counts of unviewed items
- `POST /api/admin/mark-viewed` - Marks items as viewed

## Components

### NotificationBadge
- Client component that fetches and displays notification counts
- Used in admin layout navigation
- Auto-refreshes every 30 seconds

### MarkAsViewed
- Client component that marks items as viewed when page loads
- Used on list pages (orders, returns, events)
- Runs silently in background

## Behavior

1. **New Order Created:**
   - Order has `admin_viewed_at = NULL`
   - Badge appears on "Orders" link showing count

2. **Admin Visits Orders Page:**
   - All orders on page are marked as viewed (`admin_viewed_at = NOW()`)
   - Badge count decreases/disappears

3. **New Return Created:**
   - Return has `admin_viewed_at = NULL`
   - Badge appears on "Returns" link showing count

4. **Admin Visits Returns Page:**
   - All returns on page are marked as viewed
   - Badge count decreases/disappears

## Customization

### Change Refresh Interval
Edit `NotificationBadge.tsx`:
```typescript
const interval = setInterval(fetchNotifications, 30000); // 30 seconds
```

### Change Badge Style
Edit `NotificationBadge.tsx`:
```typescript
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
```

### Add More Notification Types
1. Add column to database table
2. Update `GET /api/admin/notifications` to count new type
3. Add badge to navigation in `admin/layout.tsx`
4. Add `MarkAsViewed` to the list page

## Testing

1. **Create a new order** (as customer or via API)
2. **Log in as admin** → Should see red badge on "Orders"
3. **Visit `/admin/orders`** → Badge should disappear
4. **Create a new return** → Should see red badge on "Returns"
5. **Visit `/admin/returns`** → Badge should disappear

## Notes

- Badges only show for items where `admin_viewed_at IS NULL`
- Visiting a list page marks ALL items on that page as viewed (not just visible ones)
- Badges refresh automatically, no page reload needed
- System works for any admin user (not user-specific)
