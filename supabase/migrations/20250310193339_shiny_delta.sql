/*
  # Create membership transactions table

  1. New Tables
    - `membership_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `plan` (text)
      - `transaction_id` (text)
      - `network` (text)
      - `amount` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on membership_transactions table
    - Add policies for authenticated users
*/

CREATE TABLE membership_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL,
  transaction_id text NOT NULL,
  network text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Enable RLS
ALTER TABLE membership_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own transactions"
  ON membership_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
  ON membership_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_membership_transactions_updated_at
  BEFORE UPDATE ON membership_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();