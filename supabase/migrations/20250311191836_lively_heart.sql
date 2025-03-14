/*
  # Fix QR code URLs for payment addresses

  1. Changes
    - Update QR code URLs to use proper image URLs
    - Use direct image URLs for better reliability
*/

UPDATE payment_addresses
SET qr_code_url = CASE 
  WHEN network = 'TRC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2&bgcolor=ffffff&color=000000'
  WHEN network = 'ERC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B&bgcolor=ffffff&color=000000'
END
WHERE network IN ('TRC20', 'ERC20');