/**
* @File Name : B2B_APIService.cls
* @Description : Class is used to get check and get the product using API
* @Author : Raziya Gurramkonda
* @Last Modified By : Rajesh Kumar
* @Last Modified On : 6/19/2020, 11:40:46 PM
* Ver Date Author          Modification
* 1.0 4/9/2020 Raziya Gurramkonda Initial Version
**/
public without sharing class B2B_APIService {
    static final String apiUrl = '/B2B/PRICE/AVAILSOURCE?X-Connection=';
    static final String CONST_APPORJSON = 'application/json';
    static final String CONST_URLENCODE = 'application/x-www-form-urlencoded';
    static final String CONST_BASIC = 'Basic';
    static final String CONST_SHIPTONO = 'ShipToNo';
    static final String CONST_WEBUSER = 'WebUser';
    static final String CONST_PSID = 'B2BId';
    static final String CONST_PARTNO = 'PartNo';
    static final String CONST_QTY = 'Qty';
    static final String CONST_QSource = 'QSource';
    /**
    * @description : Method is used to get the product date
    * @author Raziya Gurramkonda | 4/9/2020 
    * @return B2B_prodAvailabilityResponseWrapper 
    **/
    public static B2B_prodAvailabilityResponseWrapper getProductData(String ShipToNo,String WebUser,String Psid,String PartNo,String Qty, String sourceVal) {
    try{
    B2B_prodAvailabilityResponseWrapper respWrapper;
    PreludeInfo__c preludeInfo = getPreludeInfo();
    String body = CONST_SHIPTONO+'='+ShipToNo+'&'+CONST_WEBUSER+'='+WebUser+'&'+CONST_PSID+'='+Psid+'&'+CONST_QSource+'='+sourceVal+'&'+CONST_PARTNO+'='+PartNo+'&'+CONST_QTY+'='+Qty;
    String endpoint = apiUrl + preludeInfo.Account__c;
    HttpResponse res = httpCallOut(body,endpoint);
    String response = res.getBody();
        if(response != null && (res.getStatusCode() == 200 || res.getStatusCode() == 201)){
    respWrapper = B2B_prodAvailabilityResponseWrapper.parse(response);
    system.debug('response from getProductData method'+respWrapper);
    }
        else{
      system.debug('response'+res.getBody());
        }
    
    return respWrapper;
    }catch (exception e){
    system.debug('Exception while making view stock availability api callout: getProductData:'+e.getMessage());
    return null; 
    } 
    
    }
   
   
    
    /**
    * @description : Method is used to get the prelude info
    * @author Raziya Gurramkonda | 4/9/2020 
    * @return PreludeInfo__c 
    **/
    public static PreludeInfo__c getPreludeInfo(){
    PreludeInfo__c info = new PreludeInfo__c();
    try {
    info = [select userid__c,password__c,Connection__c,Sitename__c,GWURL__c,Account__c from PreludeInfo__c where active__c = true limit 1]; 
    return info;
    }catch (exception e){
    system.debug('Exception while getting PreludeInfo for view stock availability API Call details: getPreludeInfo:'+e.getMessage());
    return null; 
    }
    
    }
    /**
    * @description : Method is used to make a http callout
    * @author Raziya Gurramkonda | 4/9/2020 
    * @param authorizationHeaderVal 
    * @param body 
    * @param endpoint 
    * @param CONST_URLENCODE 
    * @return HttpResponse 
    **/
    public static HttpResponse httpCallOut(String body,String endpoint ){
    try {
            //String authorizationHeaderVal = 'Basic ' + EncodingUtil.base64Encode(headerValue);
    HttpRequest req = new HttpRequest();
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setBody(body);
    req.setEndpoint('callout:Wesco_Gateway_Credential'+endpoint);
    req.setMethod('POST');
    http h = new http();
    HttpResponse res = h.send(req);
    return res;
    }catch (exception e){
    system.debug('Exception while http callout : httpCallOut:'+e.getMessage());
    return null; 
    }
    
    }
   // @future(callout=true)
    public static String httpCallOutInFuture(String body,String endpoint ){
        String orderResp = '';
        try {
                //String authorizationHeaderVal = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        HttpRequest req = new HttpRequest();
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setBody(body);
        req.setEndpoint('callout:Wesco_Gateway_Credential'+endpoint);
        req.setMethod('POST');
        http h = new http();
        HttpResponse res = h.send(req);
        String response = res.getBody();
        system.debug('response__'+response);
        system.debug('code__'+res.getStatusCode());
        B2B_SubmitAsQuoteResponseWrapper respWrapper;
        if(response != null && (res.getStatusCode() == 200 || res.getStatusCode() == 201)){
           respWrapper = B2B_SubmitAsQuoteResponseWrapper.parse(response);
           system.debug('response from getProductData method'+respWrapper);
           Map<String, Object> serResp = (Map<String, Object>)JSON.deserializeUntyped(response); 
           system.debug('values____'+serResp);
           system.debug(serResp.get('CheckoutLinesResult')); 
           List<Object> CheckoutLinesResultList = (List<Object>) serResp.get('CheckoutLinesResult');          
           system.debug('CheckoutLinesResultList__'+CheckoutLinesResultList);
           map<String,orderItemsWrap> orderItemMap = new map<String,orderItemsWrap>();
           map<String,String> orderMap = new map<String,String>();
           map<String,Object> mapSerialized = new map<String,Object>();
           List<String> itemList = new List<String>();
           String orderItemId = '';
           String ERP_LineReference = '';
           String orderNumber='';
           String orderId ='';
           String orderStatus='';
           String pickQty='';
           String boQty='';
           for (Object CheckoutLinesResult: CheckoutLinesResultList) {
            mapSerialized = (map<String,Object>)JSON.deserializeUntyped(JSON.serializePretty(CheckoutLinesResult));
            System.debug('orderItemMaping___'+mapSerialized.get('id_orders_detail'));
            orderItemId = (String)mapSerialized.get('id_orders_detail');
            ERP_LineReference = (String)mapSerialized.get('ERP_LineReference');
            orderNumber = (String)mapSerialized.get('order_number');
            orderStatus = (String)mapSerialized.get('order_status');
            pickQty = (String)mapSerialized.get('pickquantity');
            boQty = (String)mapSerialized.get('boquantity');
            orderItemsWrap itemWrap = new orderItemsWrap();
            itemWrap.erpLineref = ERP_LineReference;
            itemWrap.po = boQty;
            itemWrap.pickQty = pickQty;
            orderItemMap.put(orderItemId, itemWrap);
        }
        List<ccrz__E_OrderItem__c> orderItmList =[select id,B2B_Backorder_Quantity__c,B2B_Pick_Quantity__c,ccrz__Order__c,B2B_ERP_LineReference__c from ccrz__E_OrderItem__c where id IN:orderItemMap.keyset()];
           For(ccrz__E_OrderItem__c orderItem: orderItmList){
               for(String key :orderItemMap.keySet()){
                    if(orderItem.Id == key){
                        orderItem.B2B_ERP_LineReference__c = orderItemMap.get(key).erpLineref;
                        orderItem.B2B_Pick_Quantity__c = Decimal.valueOf(orderItemMap.get(key).pickQty);
                        orderItem.B2B_Backorder_Quantity__c= Decimal.valueOf(orderItemMap.get(key).po);
                        orderId = orderItem.ccrz__Order__c;
                    }
               }               
           }
           update orderItmList;
           system.debug('orderItemMap__'+orderItemMap);
           if(!test.isRunningTest()){
            ccrz__E_Order__c orderObj = [select id,b2b_partnerId__c, b2b_partnerId_billTo__c ,ccrz__ShipTo__r.ccrz__Partner_Id__c, ccrz__BillTo__r.ccrz__Partner_Id__c,ccrz__OrderId__c,ccrz__OrderStatus__c,(SELECT ccrz__CCOrder__c, ccrz__AccountNumber__c, Id, Name FROM ccrz__TransactionPayments__r where ccrz__AccountType__c ='po' limit 1) from ccrz__E_Order__c where id =: orderId];
            orderObj.ccrz__OrderId__c = orderNumber;
            orderObj.ccrz__OrderStatus__c = orderStatus;
            orderObj.b2b_partnerId_billTo__c = orderObj.ccrz__BillTo__r.ccrz__Partner_Id__c;
            orderObj.b2b_partnerId__c = orderObj.ccrz__ShipTo__r.ccrz__Partner_Id__c;
            if(orderObj.ccrz__TransactionPayments__r.size()>0){
                orderObj.ccrz__PONumber__c = orderObj.ccrz__TransactionPayments__r[0].ccrz__AccountNumber__c;
            }
            update orderObj;
            orderResp = orderNumber;
           }  
        }
        }catch (exception e){
        system.debug('Exception while http callout : httpCallOut:'+e.getMessage());
        orderResp = ''; 
        }
        return orderResp;
        }

        public class orderItemsWrap{
            public String erpLineref{get;set;} 
            public String po{get;set;}
            public String pickQty{get;set;}
        }
   }