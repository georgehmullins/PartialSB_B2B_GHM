/**
* @File Name          : B2B_CCMenuBasedOnUser.cls
* @Description        : Class is used to filter menu items based on user
* @Author             : Raziya Gurramkonda
* @Last Modified By   : Raziya Gurramkonda
* @Last Modified On   : 4/7/2020, 10:12:43 AM
* Ver       Date            Author      		    Modification
* 1.0    3/3/2020   Raziya Gurramkonda    Initial Version
**/
global without sharing class B2B_Extend_cc_hk_Menu extends ccrz.cc_hk_Menu{

    global override  Map<String,Object> fetch(Map<String,Object> inputData){
        Map<String,Object> baseData = super.fetch(inputData);
        List<ccrz.cc_bean_MenuItem> menus = (List<ccrz.cc_bean_MenuItem>)baseData.get(PARAM_MENU);
        List<ccrz.cc_bean_MenuItem> filteredFinalMenu = new List<ccrz.cc_bean_MenuItem>();
        try{
            Map<Id,ccrz__E_Menu__c> filteredMap = getUserMenuDetail();    
            for(ccrz.cc_bean_MenuItem menu: menus ){
                if(filteredMap.containsKey(menu.sfid)){
                    filteredFinalMenu.add(menu);
                }
            }
            baseData.put(PARAM_MENU,filteredFinalMenu);
        }catch(Exception e){
            system.debug('Exception while filter user menu details : fetch : '+e.getMessage());
            ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'Exception while filter user menu details: fetch: ', e.getMessage());
        }
        return baseData;
    }
   
    /**
    * @description : Method is used to get the user effective menus
    * @author Manoj | 5/21/2020 
    * @param menus 
    * @return List<ccrz__E_Menu__c> 
    **/
    global static Map<Id,ccrz__E_Menu__c> getUserMenuDetail(){
        Map <Id, ccrz__E_Menu__c> allowedMap = new Map <Id, ccrz__E_Menu__c>();
        String accountMenus = '';
		String menuQuery = '';
        try{           
            Boolean isGuest = ccrz.cc_CallContext.isGuest;
            if(isGuest){
                accountMenus = 'Anonymous';
            }else{
                String accId = ccrz.cc_CallContext.effAccountId;
                Account acc= [select id, B2B_Account_Menu_Control__c from Account where id=:accId LIMIT 1];
                if(acc != null && acc.B2B_Account_Menu_Control__c != null){
                    accountMenus = acc.B2B_Account_Menu_Control__c;
                }
            }
            List<String> openedMenus = accountMenus.split(',');
			if(openedMenus.size() > 0){
                accountMenus = '';
                Integer i = 0;
                for(String menuName : openedMenus){
                    if(i==openedMenus.size()-1){
                        accountMenus += '\''+menuName+'\'';    
                    }else{
                        accountMenus += '\''+menuName+'\',';
                    }
                    i++;
                }
            }
            ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'acount based menus :', accountMenus);
            menuQuery = 'SELECT id,B2B_Account_Menu_Control__c FROM ccrz__E_Menu__c ';
            menuQuery += 'WHERE B2B_Account_Menu_Control__c INCLUDES('+accountMenus+')';
			allowedMap = new Map<Id, ccrz__E_Menu__c>((List<ccrz__E_Menu__c>)Database.query(menuQuery)); 
        }catch(Exception e){
            system.debug('Exception while getting user menu details: getUserMenuDetails:'+e.getMessage());
            ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'Exception while getting user menu details: getUserMenuDetails:', e.getMessage());
        }
        return allowedMap; 
    }
}