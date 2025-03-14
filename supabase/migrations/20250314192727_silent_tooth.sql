/*
  # Fix QR code URL for TRC20 address

  1. Changes
    - Update QR code URL for TRC20 address to use a reliable QR code generation service
    - Ensure proper image format and parameters for optimal display
*/

UPDATE payment_addresses
SET qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2&bgcolor=ffffff&color=000000&format=png&qzone=2'
WHERE network = 'TRC20';