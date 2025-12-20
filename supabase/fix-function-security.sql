-- Fix Function Search Path Security Issues
-- This sets a fixed search_path to prevent SQL injection vulnerabilities

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix generate_order_number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_order_number TEXT;
BEGIN
  LOOP
    new_order_number := 'CBY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number);
  END LOOP;
  RETURN new_order_number;
END;
$$;


