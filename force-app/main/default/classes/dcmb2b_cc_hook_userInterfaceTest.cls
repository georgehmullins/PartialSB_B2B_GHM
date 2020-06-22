@isTest
public class dcmb2b_cc_hook_userInterfaceTest {
	@isTest
    static void test1(){
        Map<String,Object> inpData = new Map<String,Object>();
        dcmb2b_cc_hook_userInterface cch = new dcmb2b_cc_hook_userInterface();
        cch.headContent(inpData);
    }
}