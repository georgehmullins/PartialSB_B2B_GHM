/**
 * @File Name          : DCMB2B_extend_ccServiceProduct.cls
 * @Description        : 
 * @Author             : Rajesh Kumar
 * @Group              : 
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 6/8/2020, 11:30:39 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    4/3/2020   Rajesh Kumar     Initial Version
**/
global without sharing class B2B_extend_ccServiceProduct extends ccrz.ccServiceProduct{
    
    global virtual override Map<String, Object> getFieldsMap(Map<String, Object> inputData) {
        inputData = super.getFieldsMap(inputData);
        String objectFields = (String)inputData.get(ccrz.ccService.OBJECTFIELDS);
        objectFields += ', B2B_Test_ProductID__c, B2B_Superceded_Product__c, B2B_Superceded_Product__r.ccrz__SKU__c  '; 
        if(!objectFields.contains('ccrz__SupersedeProduct__r.ccrz__SKU__c')){
          objectFields += ', ccrz__SupersedeProduct__r.ccrz__SKU__c';
        }   
        system.debug('fieldS: ' + objectFields);
        ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'fieldS: ', objectFields);
        return new Map<String, Object> {
            ccrz.ccService.OBJECTFIELDS => objectFields
        };
    }

    global virtual override Map<String, Object> getSubQueryMap(Map<String, Object> inputData){ 
        ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'inputData:sub ', inputData);
        Map<String, Object> sub = super.getSubQueryMap(inputData);
        Account a = [SELECT Id, ccrz__E_AccountGroup__c FROM Account WHERE Id = :ccrz.cc_CallContext.currAccountId];
        sub.put('E_PriceListItems__r', '(SELECT Id, Name, ccrz__Pricelist__c, ccrz__EndDate__c, ccrz__MaxQty__c, ccrz__MinQty__c, ccrz__Price__c, ccrz__PricelistItemId__c, ccrz__PricingTiers__c, ccrz__StartDate__c, ccrz__Product__c, B2B_Suggested_Retail__c, B2B_Promo_Priced_Item__c, B2B_Promo_Basis_Price__c, B2B_Show_Promo_End_Date__c,B2B_Externally_Priced_Item__c FROM E_PriceListItems__r where    ccrz__Pricelist__c IN  (SELECT ccrz__Pricelist__c FROM ccrz__E_AccountGroupPriceList__c WHERE ccrz__AccountGroup__r.Id  = \'' + a.ccrz__E_AccountGroup__c + '\') )');
        return sub;
    }   
}