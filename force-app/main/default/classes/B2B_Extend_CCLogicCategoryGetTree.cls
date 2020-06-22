/**
* @File Name          : B2B_CCCategoriesBasedOnUser.cls
* @Description        : Class is used to filter categories based on user
* @Author             : Raziya Gurramkonda
* @Last Modified By   : Raziya Gurramkonda
* @Last Modified On   : 4/7/2020, 10:13:06 AM
* Ver       Date            Author      		    Modification
* 1.0    4/6/2020   Raziya Gurramkonda     Initial Version
**/
global without sharing class B2B_Extend_CCLogicCategoryGetTree extends ccrz.ccLogicCategoryGetTree{
    
    /**
* @description : Method is used to fetch and filter user effective category tree
* @author Raziya Gurramkonda | 4/6/2020 
* @param inputData 
* @return virtual 
**/
    global virtual override Map<String, Object> getTree(Map<String, Object> inputData) {
        Map<String,Object> superRet = super.getTree(inputData);
        List<Object> theTree = (List<Object>)superRet.get(ccrz.ccApiCategory.CATEGORYTREE);
        try{
            List<Object> filteredFinalcategory = new List<Object>();
            List<ccrz__E_Category__c> finalCategory= getUserCategoryDetails(theTree);
            if(finalCategory.size()>0){
                for(Object treeVal:theTree){
                    for(ccrz__E_Category__c categoryVal : finalCategory){
                        Map<String,Object> catElem = (Map<String,Object>)treeVal;
                        id catSfId = (id)catElem.get('sfid');
                        if(catSfId == categoryVal.id){
                            filteredFinalcategory.add((Object)catElem);
                        }
                    }
                }
            superRet.put(ccrz.ccApiCategory.CATEGORYTREE,filteredFinalcategory);
            }
        }
        catch(Exception e){
            system.debug('Exception while filter user category details : getTree : '+e.getMessage());
            ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'Exception while filter user category details: getTree: ', e.getMessage());
        }
        return superRet;
    }
    
    /**
* @description : Method used to get the user effective categories
* @author Raziya Gurramkonda | 4/3/2020 
* @param categoryIds 
* @return List<ccrz__E_Category__c> 
**/
    global static List<ccrz__E_Category__c> getUserCategoryDetails(List<Object> theTree){
        List<id> categorySfIds = new List<id>();
        List<ccrz__E_Category__c> filteredCategory = new List<ccrz__E_Category__c>();
        try{
            List<String> userCategoryControl = B2B_CCUtils.getUserEffectiveMenus();
            for(Object treeVal:theTree){
                Map<String,Object> catElem = (Map<String,Object>)treeVal;
                categorySfIds.add((id)catElem.get('sfid'));
            } 
            Map<Id,ccrz__E_Category__c > categoryMap = new Map<Id,ccrz__E_Category__c >([select id,B2B_Account_Menu_Control__c 
                                                                                        from ccrz__E_Category__c  where id IN: categorySfIds]);
            if(userCategoryControl.size()>0){
                for(ccrz__E_Category__c category:categoryMap.values()){
                    for(String userControl : userCategoryControl){
                        if(category != null && category.B2B_Account_Menu_Control__c != null){
                            String categoryControlVal = category.B2B_Account_Menu_Control__c;
                            List<String> categoryVal = categoryControlVal.split(';');
                            for(String categoryControl:categoryVal){
                                if(userControl == categoryControl){
                                    filteredCategory.add(category);
                                }  
                            }
                        }
                    }
                }
            }
        }
        catch(Exception e){
            system.debug('Exception while getting user category details: getUserCategoryDetails:'+e.getMessage());
            ccrz.ccLog.log(System.LoggingLevel.DEBUG, 'Exception while getting user category details: getUserCategoryDetails:', e.getMessage());
        }
        return filteredCategory; 
    }
}