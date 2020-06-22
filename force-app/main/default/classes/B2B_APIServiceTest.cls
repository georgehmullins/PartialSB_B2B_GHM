/**
 * @File Name          : B2B_APIServiceTest.cls
 * @Description        : class is used for the test coverage of B2B_APIService
 * @Author             : Raziya Gurramkonda
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 6/17/2020, 5:17:54 PM
 * Ver       Date            Author      		    Modification
 * 1.0    4/10/2020   Raziya Gurramkonda     Initial Version
**/
@isTest
public with sharing class B2B_APIServiceTest {
    
   /**
   * @description : Method is used to test coverage for getProductData method
   * @author Raziya Gurramkonda | 4/10/2020 
   * @return testmethod 
   **/
   public static testmethod void getProductDataTest(){
        PreludeInfo__c info = new PreludeInfo__c(userid__c = 'test',GWURL__c='https://test.com',Account__c='test',password__c='test',active__c=true); 
       	insert info;
        Test.setMock(HttpCalloutMock.class, new B2B_MockResponse(201,B2B_MockResponse.ResponseForValidRequest()));
        Test.startTest();
        B2B_APIService.getProductData('test','test@test.com','test','111','1','PDP');
        Test.stopTest();
        

        Test.setMock(HttpCalloutMock.class, new B2B_MockResponse(201,B2B_MockResponse.ResponseForCheckOutSubmitRequest()));
    }
}