/**
* Created by Docmation LLC on 10.29.2019.
* @description Customized UserInterface hook subclass v004
* to inject merged javascript file on every page
*/

global with sharing class dcmb2b_cc_hook_userInterface extends ccrz.cc_hk_UserInterface.v004{

    /** @description name of the static resource where js file to include is placed*/
    @testVisible
    private static String DEFAULT_STATIC_RESOURCE_NAME ='cc_cust_Resources';
    @testVisible
    private static String DEFAULT_STATIC_RESOURCE_THEME_NAME ='CC_Theme_Fordis';
    /** @description path to the js file with config*/
    private Static final String SCRIPT_PATH_CONFIG = 'js/config.js';
    /** @description path to the js file with template*/
    private Static final String SCRIPT_PATH_TEMPLATE= 'js/template.js';
    /** @description path to the js file with requirejs*/
    @testVisible
    private Static final String SCRIPT_PATH_REQUIREJS = 'vendors/requirejs/require.js';
    /** @description path to the js file with cloudCrazeViewjs*/
    private Static final String SCRIPT_PATH_CLOUDCRAZEVIEW = 'js/cloudCrazeView.js';
	/** @description path to the js file with pageLoader*/
	private Static final String SCRIPT_PATH_PAGE_LOADER = 'js/pageLoader.js';
    /** @description default value for second parameter of buildScriptTagStringToInclude function */
    private Static final String SCRIPT_NO_ADDITIONNAL_PROPERTY = '';
    /**
     * @description Key for configuration of theme name
     */
    private static final String CUSTOM_RESOURCES_CONFIG_NAME = 'pcc.customresources.name';
    /**
     * @description Instance of common utils
     */
    private static dcmb2b_cc_Util util;
    /**
    * @description Overriden headContent method to attatch script with all customized js
    * files in the head of every single page
    * @param inputData Input data for headContent
    * @return map with content to attach in the html head
     */
    global override Map<String,Object> headContent(Map<String,Object> inpData){
        Map<String, Object> outputData = Test.isRunningTest() ? new Map<String,Object>() : super.headContent(inpData);
        String content = outputData.containsKey(HEAD_CONTENT) ? (String)outputData.get(HEAD_CONTENT) : '';
        String customResourcesName = (String)getUtils().getConfig(CUSTOM_RESOURCES_CONFIG_NAME,DEFAULT_STATIC_RESOURCE_NAME);
        String themeResourcesName = (String)getUtils().getConfig(CUSTOM_RESOURCES_CONFIG_NAME,DEFAULT_STATIC_RESOURCE_THEME_NAME);
        content += buildScriptTagStringToInclude(SCRIPT_PATH_CONFIG, SCRIPT_NO_ADDITIONNAL_PROPERTY,customResourcesName);
        content += buildScriptTagStringToInclude(SCRIPT_PATH_REQUIREJS, getRequireJSAdditionalParams(customResourcesName),customResourcesName);
        content += buildScriptTagStringToInclude(SCRIPT_PATH_TEMPLATE, SCRIPT_NO_ADDITIONNAL_PROPERTY,customResourcesName);
        content += buildScriptTagStringToInclude(SCRIPT_PATH_PAGE_LOADER, SCRIPT_NO_ADDITIONNAL_PROPERTY,customResourcesName);
        content += buildScriptTagStringToInclude(SCRIPT_PATH_CLOUDCRAZEVIEW, SCRIPT_NO_ADDITIONNAL_PROPERTY,customResourcesName); 
        //*8content += buildScriptTagStringToInclude('css/style.css', SCRIPT_NO_ADDITIONNAL_PROPERTY,themeResourcesName); 
        //content += buildScriptTagStringToInclude('js/uiproperties.js', SCRIPT_NO_ADDITIONNAL_PROPERTY,themeResourcesName); 
        outputData.put(HEAD_CONTENT, content);
 
        return outputData;
    }
    /**
    * @description Method builds html script tag to include require.js
    * @return string with script to include
     */
    private String getRequireJSAdditionalParams(String staticResourcesName){
        return 'onload="CCDP.init(\'' + resourcePath(staticResourcesName, '') + '\',true)"';
    }
    /**
    * @description Method builds html script tag to include with correct src path and type text/javascript
    * @return string with script tag to include
     */
    private String buildScriptTagStringToInclude(String scriptPath,String additionalScriptProperties,boolean relativePath,String staticResourceName){
        String scriptPrefix ='<script type="text/javascript" src="';
        String scriptPathEnd ='" ';
        String scriptSufix = ' ></script>\n';
        String pathToFileWithCurrentResourcePath = relativePath ? resourcePath(staticResourceName, scriptPath) : scriptPath;
        String result = scriptPrefix+
                pathToFileWithCurrentResourcePath+
                scriptPathEnd+
                additionalScriptProperties+
                scriptSufix;
        return result;
    }
    /**
    * @description Method builds html script tag to include with correct src path and type text/javascript as relative path
    * @return string with script tag to include
    */
    private String buildScriptTagStringToInclude(String scriptPath,String additionalScriptProperties,String staticResourceName){
      return buildScriptTagStringToInclude(scriptPath,additionalScriptProperties, true, staticResourceName);
    }
    
    /**
	* @description accessor for instance of cc_cust_Util
	* @return instance of cc_cust_Util
	*/
    private dcmb2b_cc_Util getUtils() {
        if (util == null){
            util = new dcmb2b_cc_Util();
        }
        return util;
    }
}