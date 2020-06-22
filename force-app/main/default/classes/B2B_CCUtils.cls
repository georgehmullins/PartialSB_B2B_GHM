/**
* @File Name          : B2B_CCUtils.cls
* @Description        : Class is used to get User Menus and Categories Control
* @Author             : Raziya Gurramkonda
* @Last Modified By   : Raziya Gurramkonda
* @Last Modified On   : 4/7/2020, 10:14:01 AM
* Ver       Date            Author      		    Modification
* 1.0    4/6/2020   Raziya Gurramkonda     Initial Version
**/
global without sharing class B2B_CCUtils {

/**
* @description : Method is used to get the user b2b menu control list
* @author Raziya Gurramkonda | 4/3/2020 
* @return List<String> 
**/
    global static List<String> getUserEffectiveMenus(){
        Account acc;
        List<String> userMenuControls = new List<String>();
        try{
            Boolean isGuest = ccrz.cc_CallContext.isGuest;
            if(isGuest){
                userMenuControls.add('Anonymous');
            }
            else{
                String accId = ccrz.cc_CallContext.effAccountId;
                acc= [select id, B2B_Account_Menu_Control__c from Account where id=:accId LIMIT 1];
                    if(acc != null && acc.B2B_Account_Menu_Control__c != null){
                        String userMenu = acc.B2B_Account_Menu_Control__c;
                        userMenuControls = userMenu.split(',');
                    }
            }
        return userMenuControls;
        }
        catch(Exception e){
            system.debug('Exception while getting Account groups in getUserAccounts'+e.getMessage());
            ccrz.ccLog.log(System.LoggingLevel.DEBUG,'Exception while getting Account groups in getUserAccounts:getUserEffectiveMenus: ',e.getMessage());
            return null;
        }  
    }
}