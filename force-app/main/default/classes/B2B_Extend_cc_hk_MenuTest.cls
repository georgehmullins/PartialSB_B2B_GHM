/**
 * @File Name          : B2B_Extend_cc_hk_MenuTest.cls
 * @Description        : 
 * @Author             : Rajesh Kumar
 * @Group              : 
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 6/23/2020, 2:25:34 AM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    6/23/2020   Rajesh Kumar     Initial Version
**/
@isTest
public class B2B_Extend_cc_hk_MenuTest {
    
    static testmethod void getFetchMethodTest(){
        // Map<String,Object> response = new Map<String,Object>();
        // ccrz__E_Menu__c menuItem = new ccrz__E_Menu__c(ccrz__DisplayName__c ='Test',ccrz__StoreID__c ='DefaultStore',ccrz__Enabled__c =true, B2B_Account_Menu_Control__c ='Anonymous');
        // insert menuItem;
        // // cc_bean_MenuItem menuItem = new cc_bean_MenuItem();
        // List<ccrz__E_Menu__c> menuData = new List<ccrz__E_Menu__c>();
        // menuData.add(menuItem);
        // response.put('PARAM_MENU',menuData);
        // B2B_Extend_cc_hk_Menu menu=new B2B_Extend_cc_hk_Menu();
        // Test.startTest();
        // // menu.fetch(response);
        // Test.stopTest();

        B2B_Extend_cc_hk_Menu sp = new B2B_Extend_cc_hk_Menu();
        List<ccrz.cc_bean_MenuItem> effList = new List<ccrz.cc_bean_MenuItem>();
        Map<String,Object> inputData = new Map<String,Object>();
        inputData.put('PARAM_MENU', effList);
        Test.startTest();
          Map<String,Object> newInputData = sp.fetch(inputData);
        Test.stopTest();
        
        
    }

}