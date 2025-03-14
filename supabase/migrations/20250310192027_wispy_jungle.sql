/*
  # Add payment addresses table

  1. New Tables
    - `payment_addresses`
      - `id` (uuid, primary key)
      - `network` (text) - Network type (TRC20, ERC20)
      - `address` (text) - Wallet address
      - `qr_code_url` (text) - URL of the QR code image
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_addresses` table
    - Add policy for authenticated users to read payment addresses
*/

CREATE TABLE IF NOT EXISTS payment_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL,
  address text NOT NULL,
  qr_code_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_addresses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read payment addresses
CREATE POLICY "Allow authenticated users to read payment addresses"
  ON payment_addresses
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial payment addresses
INSERT INTO payment_addresses (network, address, qr_code_url)
VALUES 
  ('TRC20', 'TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2'),
  ('ERC20', '0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B')
ON CONFLICT DO NOTHING;