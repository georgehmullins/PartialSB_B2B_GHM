d("customCasesModel", ["ccrz", "log"], function(CCRZ, LOG) {
    CCRZ.models.customCasesModel = CCRZ.CloudCrazeCollection.extend({
        className: "B2B_CustomerServiceController",
        orderCase: function(e) {
            
        },
        closeModal: function(e) {
            clearFields();
        }
    });
    
    function clearFields(){
        
    }
    
    
    return CCRZ.models.customCasesModel;
});