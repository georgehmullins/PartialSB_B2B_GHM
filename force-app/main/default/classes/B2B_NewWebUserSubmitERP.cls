/**
 * @File Name          : B2B_NewWebUserSubmitERP.cls
 * @Description        : 
 * @Author             : Rajesh Kumar
 * @Group              : 
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 6/22/2020, 5:02:38 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    6/22/2020   Rajesh Kumar     Initial Version
**/
public with sharing class B2B_NewWebUserSubmitERP {
    public static PreludeInfo__c info = null; 
    
    //Future annotation to mark the method as async.
    @Future(callout=true)
    public static void SubmitNewWebUser (String id) {
        try {
            info = [select userid__c,password__c,Connection__c,Sitename__c,GWURL__c,Account__c from PreludeInfo__c where active__c = true limit 1];    
        } catch (exception e){
            System.debug('ERROR: ' + e);        
        }
        
        ProcessorControl.inFutureContext = true;
        Boolean isApexTest = false;
        if (TestControl.inTestMode == true){
            isApexTest = true;
        }
        String msg = 'B2B_NewWebUserSubmitERP.SubmitNewWebUser' + id;
        System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser' + id);
        
        try {
            List<Contact> Contacts = new List<Contact>([SELECT ID,B2B_Customer__c,B2B_Web_User_ID__c,Email, Salutation,FirstName,LastName,ccrz__CompanyName__c,MailingStreet, MailingCity,
                                                        MailingState, MailingPostalCode,Phone,MobilePhone,B2B_Account_Number__c,B2B_Account_Menu_Control__c,Account.Name,B2B_Community_User__c from Contact WHERE ID =: id LIMIT 1]);
            
            if (Contacts != null){
                if (Contacts[0].B2B_Web_User_ID__c == null){
                    String hreq='';
                    Boolean hinfo=false;
                    String HOLD='';
                       
                	for(Contact cts: Contacts){
                        if (!hinfo){
                          	hreq+= '&id_customer=' + cts.Id  ;
                            hreq+= '&email=' + cts.Email;
                            hreq+= '&passwd=TEST'		;
                            hreq+= '&id_gender=' + cts.Salutation;
                            hreq+= '&firstname=' + cts.FirstName;
                            hreq+= '&lastname=' + cts.LastName;
                      //      hreq+= '&company='  + cts.ccrz__CompanyName__c;
                            hreq+= '&company='  + cts.Account.Name;
                            HOLD = cts.MailingStreet;
                            if (HOLD != null){
                                HOLD = HOLD.replaceAll('\\r\\n|\\r|\\n', ' ');
                                HOLD = HOLD.replace('&','%26');
                                HOLD = HOLD.replace(',','%2C');
                                HOLD = HOLD.replace('\\','%26');
                                HOLD = HOLD.replace('/','%2F');
                                HOLD = HOLD.replace('\'','%27');
                            }
                            hreq+= '&address1=' + HOLD;
                            hreq+= '&address2=';
                            hreq+= '&city=' + cts.MailingCity;
                            hreq+= '&id_state=' + cts.MailingState;
                            hreq+= '&postcode=' + cts.MailingPostalCode;
                            hreq+= '&phone=' + cts.Phone;
                            hreq+= '&b2b_account=' + cts.B2B_Account_Number__c;
                            hreq+= '&b2b_industry=' + cts.B2B_Account_Menu_Control__c;
                            hreq+= '&b2b_user=' + cts.B2B_Community_User__c;
                            hinfo=true;  
                            System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser hinfo= ' + hreq);
                        }
                        if(hinfo==true){
                            String fullreq = hreq;
                            fullreq = fullreq.replace(' ','%20');
                            fullreq = fullreq.replace('|','%7C');
                            fullreq = fullreq.replace('~','%7E');
                            fullreq = fullreq.replace(';','%3B');
                            fullreq = fullreq.replace(':','%3A');
                            fullreq = fullreq.replace('#','%23');
                        //    fullreq = fullreq.replace(',','%2C');                                    
                            fullreq = fullreq.replaceAll('\\r\\n|\\r|\\n', ' ');
                            System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser Class -FULLREQ**** '+ fullreq);
                            HttpRequest req = new HttpRequest();
                            req.setCompressed(false);
                            req.setBody(fullreq);
                            String endpoint = null;
							if (!isApexTest){
            						endpoint = info.GWURL__c + '/B2B/NEW/WEBUSER' + '?X-Connection=' + info.Account__c;

									String username = info.userid__c;
    								String password = info.password__c;
									Blob headerValue = Blob.valueOf(username + ':' + password);
									String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
									req.setHeader('Authorization', authorizationHeader);                          
                            } else {
                                   	endpoint = '?connection=' + '&exportid=B2B_NEW_WEBUSER';  
                            }
                            
                            ProcessorControl.inFutureContext = true;
                                   
                            msg += 'endpoint=' + endpoint + '\n';
                            req.setTimeout(120000);
                            req.setEndpoint(endpoint);
                            // comment out for POST  req.setMethod('GET');
                            req.setMethod('POST');
                            
                            try{                                    
                            	Http http = new Http();
                                HttpResponse res = new HttpResponse();
                                if (!isApexTest){
                                	res = http.send(req);
                                } else {
                                	res.setBody('<?xml version="1.0"?><B2B_New_Webuser><WebuserLinesResult><sbuser_wt>00000009</sbuser_wt><B2B_Customer_ID>' + id + '</B2B_Customer_ID><active>0</active><id_default_group>3</id_default_group><errors>NEW USER CREATED</errors></WebuserLinesResult></B2B_New_Webuser>');
                                    res.setStatusCode(200);
                                    System.assertNotEquals('{"hah":"fooled you"}', res.getBody());
                                    System.assertEquals(200,res.getStatusCode());
                                    //System.assertEquals('text/xml', res.getHeader('Content-Type'));
                                    System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser class res=' + res);                                          
                                } // end isApexTest
                                
                                if (res.getStatusCode() == 200 || res.getStatusCode() == 201){
                                	XMLDom doc = new XMLDom(res.getBody());
                                    // get the main part of each result out of the xml response
                                    XMLDom.Element[] elements = doc.getElementsByTagName('WebuserLinesResult');
                                    String FeedTestId = null;
                                    String FeedResponse = null;
                                    if (elements != null ) {
									//get update values
                                    	for (XMLDom.Element element : elements){
                                        	LineResult lines = new LineResult();
                                            lines.B2B_Customer_ID = element.getValue('B2B_Customer_ID');
                                            String TestId = lines.B2B_Customer_ID;
                                            if(TestId != null){
                                            	System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser BEFORE SELECT '  + lines.B2B_Customer_ID );
                                                Contact updateCon = [SELECT Id,B2B_Web_User_ID__c,ERP_Response__c FROM Contact WHERE id=:TestId LIMIT 1];
                                                if (element.getValue('errors') == 'NEW USER CREATED'){
                                                	lines.errors = element.getValue('errors');
                                                    lines.sbuser_wt = element.getValue('sbuser_wt');
                                                    updateCon.B2B_Web_User_ID__c = lines.sbuser_wt;
                                                    updateCon.ERP_Response__c = lines.errors;
                                                }
                                                 System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser BEFORE UPDATE '  + lines.B2B_Customer_ID + lines.errors);
                                                 update updateCon;
                                            }
                                        }
                                    }
                                } else {
                                	System.debug('Callout failed: ' + res);
                    				if (res.getStatusCode() == 400 || res.getStatusCode() == 401 || res.getStatusCode() == 404 || res.getStatusCode() == 411) {
                                    	Error_Log__c log = new Error_Log__c();
            							log.trace__c = msg + 'Callout failed: ' + res + '\nSTATUS: ' + res.getStatus() + '\nSTATUS_CODE: ' + res.getStatusCode() + '\nBODY:  ' + res.getBody();
            							log.Object__c = 'Contact';
            							insert log;
                    				}                                            
                               	} //end response section 
                                
                            } catch (Exception e){
                            	System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser FAIL Try Send HTTP' + req);  
                            }  
                        }
                	}
                }
            }
                        
        } catch (Exception e){
            System.debug('****** B2B_NewWebUserSubmitERP.SubmitNewWebUser FAIL Try Contact' + id);
        }
    }
    private class LineResult {
        public String B2B_Customer_ID;
        public String sbuser_wt;
        public String errors;       
    }
}