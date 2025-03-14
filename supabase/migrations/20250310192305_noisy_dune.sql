/*
  # Update TRC20 QR code

  1. Changes
    - Update the QR code URL for the TRC20 payment address
*/

DO $$ 
BEGIN
  UPDATE payment_addresses
  SET qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2&bgcolor=ffffff'
  WHERE network = 'TRC20';
END $$;