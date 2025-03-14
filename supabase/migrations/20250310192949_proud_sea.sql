/*
  # Create payment addresses table and add TRC20 address

  1. New Tables
    - `payment_addresses`
      - `id` (uuid, primary key)
      - `network` (text, unique)
      - `address` (text)
      - `qr_code_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on payment_addresses table
    - Add policy for authenticated users to read payment addresses

  3. Data
    - Insert TRC20 payment address
*/

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS payment_addresses CASCADE;

-- Create payment_addresses table
CREATE TABLE payment_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL,
  address text NOT NULL,
  qr_code_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT payment_addresses_network_key UNIQUE (network)
);

-- Enable RLS
ALTER TABLE payment_addresses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read payment addresses
CREATE POLICY "Allow authenticated users to read payment addresses"
  ON payment_addresses
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_addresses_updated_at
  BEFORE UPDATE ON payment_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO payment_addresses (network, address, qr_code_url)
VALUES 
  ('TRC20', 'TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2', 'https://raw.githubusercontent.com/supabase/supabase/master/apps/docs/public/img/supabase-logo.svg');