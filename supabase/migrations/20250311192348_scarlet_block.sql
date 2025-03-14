/*
  # Update wallet addresses and QR codes

  1. Changes
    - Update TRC20 and ERC20 wallet addresses
    - Update QR code URLs using QR code API
*/

UPDATE payment_addresses
SET 
  address = CASE 
    WHEN network = 'TRC20' THEN 'TWd8zKCw4YeGBMynS8PKgSuaGAYaUCvGe3'
    WHEN network = 'ERC20' THEN '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  END,
  qr_code_url = CASE 
    WHEN network = 'TRC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TWd8zKCw4YeGBMynS8PKgSuaGAYaUCvGe3&bgcolor=ffffff&color=000000'
    WHEN network = 'ERC20' THEN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=0x742d35Cc6634C0532925a3b844Bc454e4438f44e&bgcolor=ffffff&color=000000'
  END
WHERE network IN ('TRC20', 'ERC20');