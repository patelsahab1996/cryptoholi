/*
  # Update TRC20 QR code URL

  1. Changes
    - Update QR code URL for TRC20 address to use Supabase storage
    - Use proper image URL with optimal size (300x300)
*/

UPDATE payment_addresses
SET qr_code_url = 'https://mmddzxhavukusqbwvvsc.supabase.co/storage/v1/object/public/TRC20/qr-TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2.png'
WHERE network = 'TRC20';