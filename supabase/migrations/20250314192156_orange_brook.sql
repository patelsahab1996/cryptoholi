/*
  # Update TRC20 QR code URL

  1. Changes
    - Update QR code URL for TRC20 address to use Supabase storage URL
*/

UPDATE payment_addresses
SET qr_code_url = 'https://mmddzxhavukusqbwvvsc.supabase.co/storage/v1/object/public/qr-codes/trc20-qr.png'
WHERE network = 'TRC20';