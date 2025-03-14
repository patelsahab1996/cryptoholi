/*
  # Fix QR code URLs for payment addresses

  1. Changes
    - Update QR code URLs to use a more reliable QR code generation service
    - Add proper parameters for better visibility
*/

UPDATE payment_addresses
SET qr_code_url = CASE 
  WHEN network = 'TRC20' THEN 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=TLWAGNzPZKhx28temM4cPXfyiFC4c2GjW2&chco=000000&chf=bg,s,FFFFFF'
  WHEN network = 'ERC20' THEN 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=0x3CcdC619411Db2b1bDf5430BBEe93b275734BC6B&chco=000000&chf=bg,s,FFFFFF'
END
WHERE network IN ('TRC20', 'ERC20');