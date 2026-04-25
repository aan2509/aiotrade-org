 OST
Create Transaction
Endpoint:
https://paymenku.com/api/v1/transaction/create
Headers:
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

Request Body Parameters:
Parameter 	    Type 	Required 	Description
reference_id	string	✓	        ID unik dari sistem Anda
amount	        number	✓	        Jumlah pembayaran (min: 1000)
customer_name	string	✓          	Nama customer
customer_email	email	✓	        Email customer
customer_phone	string	-	        No. HP customer (wajib utk OVO)
channel_code	string	✓	        Kode payment channel


GET
Get Payment Channels
Endpoint:
https://paymenku.com/api/v1/payment-channels
Headers:
Authorization: Bearer YOUR_API_KEY

cURL:
curl -X GET https://paymenku.com/api/v1/payment-channels \
  -H "Authorization: Bearer YOUR_API_KEY"


GET
Check Transaction Status
Endpoint:
https://paymenku.com/api/v1/check-status/{order_id}
Headers:
Authorization: Bearer YOUR_API_KEY

Path Parameters:
Parameter 	Type 	Description
order_id 	string 	Transaction ID (IDP...) atau Reference ID dari sistem Anda
cURL:

curl -X GET https://paymenku.com/api/v1/check-status/IDP202602271039768990 \
  -H "Authorization: Bearer YOUR_API_KEY"




Payment Channels Tersedia
Code 	        Nama 	                        Type
bri_va 	        BRI Virtual Account 	        va 	
bni_va 	        BNI Virtual Account 	        va 	
cimb_va 	    CIMB Virtual Account 	        va 	
qris 	        QRIS 	                        qris 	
danamon_va 	    Danamon Virtual Account 	    va
dana 	        DANA 	                        ewallet 	
bsi_va 	        BSI Virtual Account 	        va
mandiri_va 	    Mandiri Virtual Account     	va
linkaja 	    LinkAja 	                    ewallet 	
bjb_va 	        BJB Virtual Account 	        va
permata_va 	    Permata Virtual Account 	    va 	