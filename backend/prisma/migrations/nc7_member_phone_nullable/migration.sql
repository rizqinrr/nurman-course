ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_role_check" CHECK ("role" IN ('admin', 'tentor', 'wali', 'member'));

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;

CREATE OR REPLACE FUNCTION private.handle_new_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'role' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.users (id, role, name, phone, email, active)
  VALUES (
    NEW.id::text,
    'member',
    LEFT(COALESCE(NULLIF(BTRIM(NEW.raw_user_meta_data->>'name'), ''), 'Member'), 150),
    NULL,
    NEW.email,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_new_member() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created_member ON auth.users;
CREATE TRIGGER on_auth_user_created_member
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_member();
