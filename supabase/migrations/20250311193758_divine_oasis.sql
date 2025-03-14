/*
  # Update ERC20 wallet address

  1. Changes
    - Update ERC20 wallet address
    - Update QR code URL for the new address
*/

UPDATE payment_addresses
SET 
  address = '0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B',
  qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B&bgcolor=ffffff&color=000000'
WHERE network = 'ERC20';