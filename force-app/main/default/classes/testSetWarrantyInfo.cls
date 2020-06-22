/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an organization are executed whenever Apex code is deployed
 * to a production organization to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production organization. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the organization size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class testSetWarrantyInfo {

    static testMethod void myUnitTest() {
Profile pf = [Select Id from Profile where Name = 'System Admin w/view Encryption'];
        
        User u = new User();
        u.FirstName = 'Test';
        u.LastName = 'User';
        u.Email = 'testuser@test123456789.com';
        u.CompanyName = 'test.com';
        u.Title = 'Test User';
        u.Username = 'testuser@test123456789.com';
        u.Alias = 'testuser';
        u.CommunityNickname = 'Test User';
        u.TimeZoneSidKey = 'America/Mexico_City';
        u.LocaleSidKey = 'en_US';
        u.EmailEncodingKey = 'ISO-8859-1';
        u.ProfileId = pf.Id;
        u.LanguageLocaleKey = 'en_US';
        insert u;
        
        system.runAs(u){
        	// Setting Test control
        	TestControl.inTestMode = true;
        	Test.startTest();   

           Account account = new Account(
                                            Name ='Account',
                                            ShippingStreet='ABC',
                                            ShippingCity='PQR ',
                                            ShippingState = 'XYZ',
                                            ShippingPostalCode='111',
                                            ShippingCountry='XYZ',
                                            BillingStreet='ABC',
                                            BillingCity='PQR ',
                                            BillingState = 'XYZ',
                                            BillingPostalCode='111',
                                            BillingCountry='XYZ'
                                            ); 
            insert account;
            Contact  contact = new Contact(          
                                            LastName='Last',
                                            AccountId = account.Id,
                                            Email='svmxmailfortest@gmail.com'
                                            );
            insert contact;
            
            Product2 product1 = new Product2(Name ='04354'
                                            ); 
            insert product1;
            Product2 part1 = new Product2(Name ='94-1152'
                                            ); 
            insert part1;
            Product2 part2 = new Product2(Name ='11-1420'
                                            ); 
            insert part2;       
            SVMXC__Installed_Product__c iproduct = new SVMXC__Installed_Product__c(
                                            SVMXC__Product__c=product1.Id,
                                            SVMXC__Serial_Lot_Number__c='789456123',
                                            SVMXC__Company__c=account.Id,
                                            Installed_Product_ID_Verification__c='04354!' + '789456123',
                                            ERP_External_ID__c = '001!04354!789456123',
                                            SVMXC__Status__c='Customer Owned'
                                            );

            try {
            	insert iproduct;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}
                       
            Case case1 = new Case(Status ='New', Priority = 'Medium', 
                                            Origin = 'Email',                                                                               
                                            ContactId =contact.Id,
                                            AccountId=account.Id,
                                            Hour_Meter__c='',
                                            SVMXC__Component__c = iproduct.id
                                            ); 
            try {
            	insert case1;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}
 // ADDED 7/9/14 FOR OPEN SERVICE BULLETIN
 			Service_Bulletin__c sbulletin = new Service_Bulletin__c(
            								Alert_Level__c = '2 - Rework',
            								Description__c = 'Test',
            								Repair_Time__c = 1.0,
            								Name = 'V09-201',
            								ERP_External_ID__c = '001!V09-201'
            								);
        	try {
        		insert sbulletin;
        	}
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}

 			Service_Bulletin_Installed_Product_Temp__c TsbIP = new Service_Bulletin_Installed_Product_Temp__c(
        									Installed_Products__c = iproduct.Id,
        									Service_Bulletins__c = sbulletin.Id,
        									Work_Order_in_Progress__c = null,
        									Name = iproduct.ERP_External_ID__c + '!' + sbulletin.Name
        									);    	            
         	try {
        		insert TsbIP;
        	}
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}           
            SVMXC__Service_Order__c workorder = new SVMXC__Service_Order__c(
                                            SVMXC__Company__c = account.Id,
                                            SVMXC__Contact__c = contact.Id,
                                            SVMXC__Case__c = case1.Id,
                                            SVMXC__Order_Status__c = 'Open',
                                            SVMXC__Priority__c = 'Medium',
                                            SVMXC__Order_Type__c = 'Internal',
                                            Pickup_Request_to_Whse__c = false,
                                            Deliver_Request_to_Whse__c = false,
                              //              SVMXC__Component__c = iproduct.Id,
                                            ERP_Repair_Order__c = '094350000',
                                            RecordTypeId = '012d0000000tH3YAAU'
                                            
                                            );
            try {
            	insert workorder;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}

            SVMXC__Service_Order__c cworkorder = new SVMXC__Service_Order__c(
            								RecordTypeId = '012d0000000tH3TAAU',
                                            SVMXC__Company__c = account.Id,
                                            SVMXC__Contact__c = contact.Id,
                                            SVMXC__Case__c = case1.Id,
                                            SVMXC__Order_Status__c = 'Open',
                                            SVMXC__Priority__c = 'Medium',
                                            SVMXC__Order_Type__c = 'Child Work Order',
                                            Generate_Transfer_Request__c = false,
                                            ERP_Repair_Order__c = '094350000',
                                            ERP_RepairJob__c = '094350000!A',
                                            SVMXC__Billing_Type__c = 'TORO WARRANTY CLAIMS',
                                            Service_Bulletin__c = sbulletin.Id,
                           //                 SVMXC__Component__c = iproduct.Id,
                                            Ownership_Flag__c = null,
                                            Parent_Work_Order__c = workorder.Id
                                            );

            try {
            	insert cworkorder;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}              
            SVMXC__Service_Order_Line__c wol = new SVMXC__Service_Order_Line__c(
                                            RecordTypeId = '012d0000000q2uXAAQ',
                                            SVMXC__Activity_Type__c = 'Repair',
                                            SVMXC__Service_Order__c = cworkorder.id,
                                            SVMXC__Line_Status__c = 'Open',
                                            SVMXC__Actual_Quantity2__c = 10,
                                            SVMXC__Line_Type__c = 'Parts',
                                            SVMXC__Actual_Price2__c = 11.50,
                                            SVMXC__Product__c = part1.id,
                                            SVMXC__Use_Price_From_Pricebook__c = false,
                                            SVMXC__Quantity_Shipment_Initiated2__c = 0,
                                            Primary_Failed_Part__c = true, 
                                            Primary_SRT_Code__c = false,
                                            SVMXC__Requested_Quantity2__c = 10
                                          
                                            );

            try {
            	insert wol;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}
            SVMXC__Service_Order_Line__c wol2 = new SVMXC__Service_Order_Line__c(
                                            RecordTypeId = '012d0000000q2uXAAQ',
                                            SVMXC__Activity_Type__c = 'Repair',
                                            SVMXC__Service_Order__c = cworkorder.id,
                                            SVMXC__Line_Status__c = 'Open',
                                            SVMXC__Actual_Quantity2__c = 10,
                                            SVMXC__Line_Type__c = 'Labor',
                                            SVMXC__Actual_Price2__c = 11.50,
                                            SVMXC__Product__c = part2.id,
                                            SVMXC__Use_Price_From_Pricebook__c = false,
                                            SVMXC__Quantity_Shipment_Initiated2__c = 0,
                                            Primary_Failed_Part__c = false, 
                                            Primary_SRT_Code__c = true,
                                            SVMXC__Requested_Quantity2__c = 10
                                          
                                            );          
            try {
            	insert wol2;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}            
       
       		cworkorder.SVMXC__Component__c = iproduct.Id;
        	try {
            	update cworkorder;
        	} 
        	catch (Exception e){
            	System.debug('ERROR: '+ e);
        	}

        	Test.stopTest();                   
        }       
    }
}