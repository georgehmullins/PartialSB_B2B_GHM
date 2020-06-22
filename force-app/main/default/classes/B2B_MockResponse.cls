/**
 * @File Name          : B2B_MockResponse.cls
 * @Description        : Class is used to create mockresponse for API calls
 * @Author             : Raziya Gurramkonda
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 6/19/2020, 11:08:44 PM
 * Ver       Date            Author      		    Modification
 * 1.0    4/10/2020   Raziya Gurramkonda     Initial Version
**/
public class B2B_MockResponse implements HttpCalloutMock {
    
    public Integer statusCode;
    public String response;
    public B2B_MockResponse(Integer statusCode,String response){
        this.statusCode = statusCode;
        this.response = response;
    }

    /**
    * @description : Method used to create Mock Response for callout
    * @author Raziya Gurramkonda | 1/16/2020 
    * @param req 
    * @return HTTPResponse 
    **/
    public HTTPResponse respond(HTTPRequest req) {
        
        HttpResponse res = new HttpResponse();
        res.setBody(response);
        res.setStatusCode(statusCode);
        return res;
    }
    
     /**
     * @description : Method used to create mock response for valid request of getProductData method
     * @author Raziya Gurramkonda | 4/10/2020 
     * @return String 
     **/
     public static String ResponseForValidRequest(){
         String response=		'{'+
		'    "AvailLinesResult": ['+
		'        {'+
		'            "CC_Product_ID": "",'+
		'            "ProductNumbers": "119-4151",'+
		'            "Quantities": "2",'+
		'            "CustomerPrice": "",'+
		'            "SuggestedRetailPrice": "",'+
		'            "AvailableMain": ""'+
		'        },'+
		'        {'+
		'            "CC_Product_ID": "",'+
		'            "ProductNumbers": "11-1419",'+
		'            "Quantities": "1",'+
		'            "CustomerPrice": "",'+
		'            "SuggestedRetailPrice": "",'+
		'            "AvailableMain": ""'+
		'        },'+
		'        {'+
		'            "CC_Product_ID": "",'+
		'            "ProductNumbers": "07042",'+
		'            "Quantities": "1",'+
		'            "CustomerPrice": "",'+
		'            "SuggestedRetailPrice": "",'+
		'            "AvailableMain": ""'+
		'        },'+
		'        {'+
		'            "CC_Product_ID": "",'+
		'            "ProductNumbers": "20333",'+
		'            "Quantities": "1",'+
		'            "CustomerPrice": "",'+
		'            "SuggestedRetailPrice": "",'+
		'            "AvailableMain": ""'+
		'        }'+
		'    ]'+
		'}';
        return response;
	 }
	 
	 public static String ResponseForCheckOutSubmitRequest(){
		String response=		'{'+
		'"CheckoutLinesResult":['+
		'		{'+
		'		"id_order":"12345",'+
		'		"id_cart":"",'+
		'		"order_tax":"0",'+
		'		"order_number":"21167178",'+
		'		"id_orders_detail":"1.1",'+
		'		"quantities":"2",'+
		'		"pickquantity":"2",'+
		'		"boquantity":"0",'+
		'		"errors":"",'+
		'		"errors":"",'+
		'		"B2B_Product_ID":"aDX2g000000CtHgGAK",'+
		'		"ERP_LineReference":"00121167178!1"'+
		'        }'+
		'    ]'+
		'}';
		return response;
	 }

	 public static String ResponseForQuoteSubmitRequest(){
		String response=		'{'+
		'"CheckoutLinesResult":['+
		'		{'+
		'		"id_order":"12345",'+
		'		"id_cart":"",'+
		'		"order_tax":"0",'+
		'		"order_number":"21167178",'+
		'		"order_status":"SUBMITTED",'+
		'		"id_orders_detail":"1.1",'+
		'		"quantities":"2",'+
		'		"pickquantity":"2",'+
		'		"boquantity":"0",'+
		'		"errors":"",'+
		'		"errors":"",'+
		'		"B2B_Product_ID":"aDX2g000000CtHgGAK"'+
		'        }'+
		'   ],'+
		'		"ERP_LineReference":['+
		'		"00152031616!1","00152031616!2"'+
		'	]'+
		'}';
		return response;
	 }
    
}