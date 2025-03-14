/*
  # Disable Email Confirmation

  1. Changes
    - Sets all existing users' email_confirmed_at to current timestamp
    - Sets default value for email_confirmed_at to current timestamp for new users
    - This effectively disables email confirmation requirement for all users

  2. Security
    - Maintains existing auth security
    - Only affects email confirmation status
*/

-- Update existing users to have confirmed email status
UPDATE auth.users 
SET email_confirmed_at = CURRENT_TIMESTAMP 
WHERE email_confirmed_at IS NULL;

-- Set default email confirmation for new users
ALTER TABLE auth.users 
ALTER COLUMN email_confirmed_at 
SET DEFAULT CURRENT_TIMESTAMP;

-- Create a function to automatically confirm emails for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();