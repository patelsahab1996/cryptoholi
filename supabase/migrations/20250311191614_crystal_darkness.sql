/*
  # Update QR code URLs for payment addresses

  1. Changes
    - Update QR code URLs for both TRC20 and ERC20 addresses
    - Use proper QR code service with correct parameters
*/

UPDATE payment_addresses
SET qr_code_url = CASE 
  WHEN network = 'TRC20' THEN 'https://mmddzxhavukusqbwvvsc.supabase.co/storage/v1/object/public/qr-codes/trc20-qr.png'
  WHEN network = 'ERC20' THEN 'https://mmddzxhavukusqbwvvsc.supabase.co/storage/v1/object/public/qr-codes/erc20-qr.png'
END
WHERE network IN ('TRC20', 'ERC20');