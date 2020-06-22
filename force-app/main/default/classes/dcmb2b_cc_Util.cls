public with sharing class dcmb2b_cc_Util {
    public static final String BATCH_COMPLETED = 'Completed';
    public static final String BATCH_ABORTED = 'Aborted';
    public static final String BATCH_FAILED = 'Failed';
    /**
    * @description Accepted format date
    */
    private static final String FORMAT_DATE_DDMMYYYY = 'dd/mm/yyyy';
    private static final String FORMAT_DATE_MMDDYYYY = 'mm/dd/yyyy';
    /**
    * @description Page label name
    */
    private static final String PAGE_LABEL_DATE = 'Date_Format';
    /**
    * @description Constant representing configuration page 'all'
    */
    public static final String CONF_PAGES_ALL = 'all';
    
    //private cc_cust_ApplicationLogService log = null;
    
    @TestVisible
    private static Map<String, String> CONFIG_MAP = null;
    
    public dcmb2b_cc_Util() {
        //this.log = new cc_cust_ApplicationLogService(this);
    }
    
    /** @description Variable to change sign of the number by multipling a number which you want to invert */
    public static final Decimal SIGN_INVERTER = -1.0;
    
    /**
    * @description Constant representing configuration with name of Org Wide Email Address object
    */
    private final String ORG_WIDE_EMAIL_ADDRESS_NAME = 'pcc.orgwideemailname';
    /**
    * @description Index of Org Wide Email Address object
    */
    private final Integer ORG_WIDE_EMAIL_ADDRESS_INDEX = 0;
    
    /**
    * @description Method fetch CC Private Cache considerung current context.
    * @return Map<String, String> fetched from ccConfig private cache.
    */
    public Map<String, String> getConfigs() {
        
        if (CONFIG_MAP == null) {
            Map<String, Object> cacheContext = ccrz.ccApiPrivateCache.fetch(new Map<String, Object>{
                ccrz.ccApi.API_VERSION => ccrz.ccApi.CURRENT_VERSION,
                    ccrz.ccApiPrivateCache.CACHE_NAME => 'ccConfig',
                    ccrz.ccApiPrivateCache.LOCALE => ccrz.cc_CallContext.userLocale,
                    ccrz.ccApiPrivateCache.STORE_NAME => ccrz.cc_CallContext.storefront,
                    ccrz.ccApiPrivateCache.PAGENAME => ccrz.cc_CallContext.currPageUIKey
                    });
            String content = (String) cacheContext.get(ccrz.ccApiPrivateCache.CONTENT);
            if (content == null) {
                return new Map<String, String>();
            }
            CONFIG_MAP = (Map<String, String>) JSON.deserialize(content, Map<String, String>.class);
        }
        return CONFIG_MAP;
    }
    /**
    * @description Method allows to fetch map with CC Configuration for specific storefront, locale and page
    * @param storefront Storefront name
    * @param userLocale User locale
    * @param pageName Page name
    * @return Map with CC Configuration
    */
    public Map<String, String> getConfigs(String storefront,String userLocale,String pageName){
        if(CONFIG_MAP == null){
            Map<String, Object> cacheContext = ccrz.ccApiPrivateCache.fetch(new Map<String, Object>{
                ccrz.ccApi.API_VERSION => ccrz.ccApi.CURRENT_VERSION,
                    ccrz.ccApiPrivateCache.CACHE_NAME => 'ccConfig',
                    ccrz.ccApiPrivateCache.LOCALE => userLocale,
                    ccrz.ccApiPrivateCache.STORE_NAME => storefront,
                    ccrz.ccApiPrivateCache.PAGENAME => pageName
                    });
            String content = (String) cacheContext.get(ccrz.ccApiPrivateCache.CONTENT);
            if(content == null){
                return new Map<String, String>();
            }
            CONFIG_MAP = (Map<String, String>) JSON.deserialize(content, Map<String, String>.class);
        }
        return CONFIG_MAP;
    }
    
    public String getConfig(String confName) {
        return this.getConfigs().get(confName);
    }
    
    public Integer getConfig(String confName, Integer defaultValue) {
        String val = this.getConfig(confName);
        if (val != null) {
            try {
                return Integer.valueOf(val);
            } catch (TypeException e) {
                // removing logging service, use the logging service from Docmation to log the error here 
                /*cc_cust_ApplicationLogService log = new cc_cust_ApplicationLogService(this);
                log.log(
                    LoggingLevel.ERROR,
                    'Failed to parse configuration ' + confName +
                    ': ' + val,
                    this.className(this),
                    'getConfig'
                );*/
            }
        }
        
        return defaultValue;
    }
    
    public String getConfig(String confName, String defaultValue) {
        String val = this.getConfig(confName);
        if (val != null) {
            return val;
        }
        
        return defaultValue;
    }
    
    /**
    * @description Method checks if batch job for given class is already in progress    *
    * @param apexClassName name of the batch class
    * @param exludeJobId job id to exclude from search
    * @param dependencyList the list of dependant batches
    * @return true if batch for given class is already in progess, otherwise false will be returned
    */
    public Boolean isBatchRunning(String apexClassName, String exludeJobId, List<String> dependencyList) {
        
        List<AsyncApexJob> jobs = [
            SELECT Id, ApexClassId, Status,ApexClass.Name
            FROM AsyncApexJob
            WHERE
            (ApexClass.Name = :apexClassName OR ApexClass.Name IN :dependencyList)
            AND status NOT IN (
                :dcmb2b_cc_Util.BATCH_COMPLETED,
                :dcmb2b_cc_Util.BATCH_ABORTED,
                :dcmb2b_cc_Util.BATCH_FAILED
            )
            AND JobType = 'BatchApex' AND Id != :exludeJobId
            LIMIT 10000
        ];
        
        System.debug(LoggingLevel.DEBUG, 'Selected jobs: ' + jobs);
        
        return !jobs.isEmpty();
        
    }
    
    /**
    * @description Method for generating GUID *
    * @return GUID
    */
    public String generateGUID() {
        Blob b = Crypto.GenerateAESKey(128);
        String hex = EncodingUtil.ConvertTohex(b);
        String guid = hex.SubString(0, 8) + '-' + hex.SubString(8, 12) + '-' + hex.SubString(12, 16) + '-' + hex.SubString(16, 20) + '-' + hex.substring(20);
        return guid;
    }
    
    public String className(Object obj) {
        return String.valueOf(obj).split(':')[0];
    }
    
    public String className(sObject obj) {
        return String.valueOf(obj).split(':')[0];
    }
    
    /**
    * @description Method gets value from CC Configuration using ApiName
    *              and if value is not null create new instance using this value.
    *              Otherwise create new instance by using defaultClass parameter
    *
    * @param ccConfigApiName name of ApiName from CC Configuration from where class name will be get.
    * @param defaultClass name of default class which will be instantiated if ccConfigApiName doesn't exists.
    *
    * @return new instance of required class.
    */
    public Object newInstance(String ccConfigApiName, String defaultClass) {
        Type objectType;
        String className = this.getConfig(ccConfigApiName);
        
        if (className != null) {
            objectType = Type.forName(className);
        }
        
        if(className == NULL || objectType == NULL){
            objectType = Type.forName(defaultClass);
            if( objectType == NULL ) {
                // Create New Exception on throw it here (Docmation)
                //throw new cc_cust_Exception('Failed to get proper Type object. Default class name: ' + defaultClass + ' Configuration class name: '+className);
            }
        }
        
        return objectType.newInstance();
    }
    /**
    * @description method to get Map of Page Labels, where keys are Page Label Name, values are values of Page Label Name
    * @param storefront
    * @param locale
    * @param pageLabelName
    * @param pageName
    * @return Map<String, String>, where keys are Page Label Name, values are values of Page Label Name
    */
    public Map<String, String> getPageLabelsMap(String storefront, String locale, String pageLabelName, String pageName){
        Set<String> setPagesName = new Set<String>{pageLabelName};
            Map<String, Object> inputData = new Map<String, Object> {
                ccrz.ccAPI.API_VERSION => ccrz.ccAPi.CURRENT_VERSION,
                    ccrz.ccApiI18N.PAGE_NAME => pageName,
                    ccrz.ccApiI18N.STORE_NAME => storefront,
                    ccrz.ccApiI18N.LOCALE => locale,
                    ccrz.ccApiI18N.USE_CACHE => true,
                    ccrz.ccApiI18N.RETURN_SERIAL => false,
                    ccrz.ccApiI18N.PAGE_LABEL_NAMES => setPagesName
                    };
                        Map<String, Object> outputData = ccrz.ccApiI18N.fetchPageLabels(inputData);
        if ((boolean) outputData.get(ccrz.ccApi.SUCCESS)) {
            Map<String, String> outputpageLabelsMap = (Map<String, String>) outputData.get(ccrz.ccApiI18N.PAGE_LABELS);
            return outputpageLabelsMap;
        }
        else {
            return null;
        }
    }
    /**
    * @description Method retrieves page labels values
    * @param pageLabelsNames a set of page labels names to fetch
    * @return Result of operation of fetching labels values
    */
    public Map<String,String> getPageLabelsMapByNames(Set<String> pageLabelsNames) {
        Map<String, Object> fetchPageLabelsData = ccrz.ccApiI18N.fetchPageLabels(new Map<String,Object>{
            ccrz.ccApi.API_VERSION => CCRZ.ccApi.CURRENT_VERSION,
                ccrz.ccApiI18N.PAGE_LABEL_NAMES => pageLabelsNames
                });
        Map<String,String> pageLabels = (Map<String,String>) fetchPageLabelsData.get(ccrz.ccApiI18N.PAGE_LABELS);
        return pageLabels;
    }
    /**
    * @description Method converts date
    * @param dateToConvert date that should be converted
    * @return Converted date
    */
    public String convertDate(String dateToConvert){
        String currStorefront = ccrz.cc_CallContext.storefront;
        String currUserLocale = ccrz.cc_CallContext.userLocale;
        Map<String, String> dateFormatLabelMap = getPageLabelsMap(currStorefront,currUserLocale,PAGE_LABEL_DATE,CONF_PAGES_ALL);
        String dateAfterConvert;
        String dateFormat = dateFormatLabelMap.get(PAGE_LABEL_DATE);
        if(dateFormat == FORMAT_DATE_DDMMYYYY){
            dateAfterConvert = dateToConvert.substring(3,5) + '/' + dateToConvert.substring(0,2) + '/' + dateToConvert.substring(6,10);
        }else if(dateFormat == FORMAT_DATE_MMDDYYYY){
            dateAfterConvert = dateToConvert.substring(0,2) + '/' + dateToConvert.substring(3,5) + '/' + dateToConvert.substring(6,10);
        }else{
            dateAfterConvert = dateToConvert.substring(5,7) + '/' + dateToConvert.substring(8,10) + '/' + dateToConvert.substring(0,4);
        }
        return dateAfterConvert;
    }
    
    /**
    * @description method is used to check if salesforce id is valid id for given sObject
    * @param  sfdcId The ID to test.
    * @param  t The Type of the sObject to compare against
    * @return returns true if the ID is valid, false if it is not.
    */
    public static Boolean isValidSalesforceId(String sfdcId, System.Type type) {
        try {
            if (Pattern.compile('[a-zA-Z0-9]{15}|[a-zA-Z0-9]{18}').matcher(sfdcId).matches()) {
                if (type != null) {
                    Id id = sfdcId;
                    sObject sObj = (sObject) type.newInstance();
                    sObj.Id = id;
                }
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
    /**
    * @description method to retrived map with urls to static resources
    * @@param staticResourceNames set with static resources names
    * @return map with static resource name as key and url as value
    */
    public Map<String,String> getUrlMappedWithStaticResourcesName(Set<String> staticResourceNames){
        if(Test.isRunningTest()){
            return new Map<String,String>{
                'TEST' => 'resource/1234567890/TEST'
                    };
                        }
        Map<String,String> result = new Map<String,String>();
        List<StaticResource> resourceList= [SELECT Name, NamespacePrefix, SystemModStamp FROM StaticResource WHERE Name = :staticResourceNames LIMIT 10000];
        if(!resourceList.isEmpty()){
            for(StaticResource resource : resourceList){
                String namespace = resource.NamespacePrefix;
                String url = 'resource/' + resource.SystemModStamp.getTime() + '/' + (namespace != null && namespace != '' ? namespace + '__' : '') + resource.Name;
                result.put(resource.Name,url);
            }
        }
        return result;
    }
    public String getCashCurrencyFromISOCurrency(String ISO){
        switch on ISO {
            when 'BRL' {
                return 'R$';
            }
            when 'USD' {
                return '$';
            }
            when else {
                return '';
            }
        }
    }
    
    /** Inner class allows to fetch user locale */
    public without sharing class cc_cust_UserData{
        /**
    * @description Method allows to fetch user locale
    * @param userID User ID
    * @return User locale
    */
        public String getUserLocale(String userID){
            User user = [
                SELECT LocaleSidKey FROM User
                WHERE id = :userID
            ];
            return (user != null) ? user.LocaleSidKey : null;
        }
    }
    
    /**
    * @description Method gets id of organization wide email address object
    * @return Org wide email address id
    */
    public String getOrgWideEmailAddress() {
        String result = null;
        String orgWideObjectName = getConfig(ORG_WIDE_EMAIL_ADDRESS_NAME);
        if (!Test.isRunningTest()) {
            OrgWideEmailAddress[] owea = [SELECT Id FROM OrgWideEmailAddress WHERE DisplayName = :orgWideObjectName LIMIT 1];
            if(owea.isEmpty()) {
                // Create New Exception on throw it here (Docmation)
                //throw new cc_cust_Exception('OrgWideEmailAddress list is empty, cannot get element!');
            } else {
                result = owea.get(ORG_WIDE_EMAIL_ADDRESS_INDEX).Id;
            }
        }
        return result;
    }
}