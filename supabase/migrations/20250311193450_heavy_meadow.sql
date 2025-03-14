/*
  # Update wallet addresses and QR codes

  1. Changes
    - Update TRC20 and ERC20 wallet addresses
    - Update QR code URLs for both addresses
    - Use QR code API with white background and black QR code for better visibility
*/

UPDATE payment_addresses
SET 
  address = CASE 
    WHEN network = 'TRC20' THEN 'TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2'
    WHEN network = 'ERC20' THEN '0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B'
  END,
  qr_code_url = CASE 
    WHEN network = 'TRC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2&bgcolor=ffffff&color=000000'
    WHEN network = 'ERC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B&bgcolor=ffffff&color=000000'
  END
WHERE network IN ('TRC20', 'ERC20');