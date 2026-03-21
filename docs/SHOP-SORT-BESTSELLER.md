# Shop: “Most sold” sort

The **Most sold** option sorts products by total quantity sold across all `order_items` rows.

The API aggregates `order_items` using the **Supabase service role** (`SUPABASE_SERVICE_ROLE_KEY` in `.env.local`) so it can read order lines despite RLS (customers only see their own orders).

- If the service role key is **missing** (e.g. local dev), totals fall back to empty and “Most sold” behaves like **Newest** (tie‑break by `created_at`).

Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in production for accurate bestseller sorting.
