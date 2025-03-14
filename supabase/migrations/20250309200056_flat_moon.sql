/*
  # Disable Email Confirmation

  1. Changes
    - Sets all existing users' email_confirmed_at to current timestamp
    - Sets default value for email_confirmed_at to current timestamp for new users
    - This effectively disables email confirmation requirement

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