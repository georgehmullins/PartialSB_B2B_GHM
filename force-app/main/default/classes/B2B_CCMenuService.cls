/**
* @File Name          : B2B_CCMenuService.cls
* @Description        : 
* @Author             : Raziya Gurramkonda
* @Group              : 
* @Last Modified By   : Rajesh Kumar
* @Last Modified On   : 6/22/2020, 11:39:43 PM
* @Modification Log   : 
* Ver       Date            Author                  Modification
* 1.0    4/3/2020   Raziya Gurramkonda     Initial Version
**/
global without sharing class B2B_CCMenuService extends ccrz.ccServiceMenu{
    global virtual override Map<String,Object> getFieldsMap(Map<String,Object> inputData) {
        ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'inputData: ', inputData);        
        inputData = super.getFieldsMap(inputData);
        String objectFields = (String)inputData.get(ccrz.ccService.OBJECTFIELDS);
        objectFields += ', B2B_Account_Menu_Control__c '; 
        system.debug('fieldS: ' + objectFields);
        ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'fieldS: ', objectFields);
        return new Map<String, Object> {
            ccrz.ccService.OBJECTFIELDS => objectFields
        };
    }
    
}