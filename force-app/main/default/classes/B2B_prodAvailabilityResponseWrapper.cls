/**
 * @File Name          : B2B_prodAvailabilityResponseWrapper.cls
 * @Description        : Wrapper class is used to parse the product data response
 * @Author             : Raziya Gurramkonda
 * @Last Modified By   : Rajesh Kumar
 * @Last Modified On   : 5/5/2020, 3:42:46 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    4/9/2020   Raziya Gurramkonda     Initial Version
**/

public without sharing class B2B_prodAvailabilityResponseWrapper {

	public List<AvailLinesResult> AvailLinesResult {get;set;} 

	public B2B_prodAvailabilityResponseWrapper(JSONParser parser) {
		while (parser.nextToken() != System.JSONToken.END_OBJECT) {
			if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
				String text = parser.getText();
				if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
					if (text == 'AvailLinesResult') {
						AvailLinesResult = arrayOfAvailLinesResult(parser);
					} else {
						System.debug(LoggingLevel.WARN, 'B2B_prodAvailabilityResponseWrapper consuming unrecognized property: '+text);
						consumeObject(parser);
					}
				}
			}
		}
	}
	
	public class AvailLinesResult {
		public String CC_Product_ID {get;set;} 
		public String ProductNumbers {get;set;} 
		public String Quantities {get;set;} 
		public String CustomerPrice {get;set;} 
		public String SuggestedRetailPrice {get;set;} 
		public String AvailableMain {get;set;}
		public String free_freight_code {get;set;} 
		public String payment_options {get;set;}

		public AvailLinesResult(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'CC_Product_ID') {
							CC_Product_ID = parser.getText();
						} else if (text == 'ProductNumbers') {
							ProductNumbers = parser.getText();
						} else if (text == 'Quantities') {
							Quantities = parser.getText();
						} else if (text == 'CustomerPrice') {
							CustomerPrice = parser.getText();
						} else if (text == 'SuggestedRetailPrice') {
							SuggestedRetailPrice = parser.getText();
						} else if (text == 'AvailableMain') {
							AvailableMain = parser.getText();
						} else if (text == 'free_freight_code') {
							free_freight_code = parser.getText();
						} else if (text == 'payment_options') {
							payment_options = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'AvailLinesResult consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	
	public static B2B_prodAvailabilityResponseWrapper parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
		return new B2B_prodAvailabilityResponseWrapper(parser);
	}
	
	public static void consumeObject(System.JSONParser parser) {
		Integer depth = 0;
		do {
			System.JSONToken curr = parser.getCurrentToken();
			if (curr == System.JSONToken.START_OBJECT || 
				curr == System.JSONToken.START_ARRAY) {
				depth++;
			} else if (curr == System.JSONToken.END_OBJECT ||
				curr == System.JSONToken.END_ARRAY) {
				depth--;
			}
		} while (depth > 0 && parser.nextToken() != null);
	}
    
    private static List<AvailLinesResult> arrayOfAvailLinesResult(System.JSONParser p) {
        List<AvailLinesResult> res = new List<AvailLinesResult>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new AvailLinesResult(p));
        }
        return res;
    }


}