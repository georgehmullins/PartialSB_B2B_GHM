d("contactUs", ["ccrz", "util"], function(CCRZ, UTIL) {
    CCRZ.views.contactUs  = CCRZ.CloudCrazeView.extend({
        el: CCRZ.uiProperties.contactUs.desktop.selector,
        viewName: "contactUs",
        templateDesktop: CCRZ.util.template(CCRZ.uiProperties.contactUs.desktop.tmpl.lead),
        init: function() {
            this.render();
        },
        render:function(){
            this.$el.html(this.templateDesktop());
            if(!CCRZ.pagevars.isGuest){
                setTimeout(function(){ 
                    setUpScreen();
                }, 2000);
            }
        },
        closeModal: function(e) {
            this.model.closeModal(e)
        },
        toggleForm : function(){
            if(CCRZ.pagevars.isGuest){
                $('#supportCase').remove();
            }else{
                $('#newLead').remove();
            }
        },
        validateData : function(){
        
        },
        events: {
        }
    });
    function setUpScreen(){
        $('#first_name').val(CCRZ.currentUser.FirstName );
        $('#last_name').val(CCRZ.currentUser.LastName);
        $('#email').val(CCRZ.currentUser.Email);
        $('#phone').val(CCRZ.currentUser.Phone);
        $('#company').val(CCRZ.currentUser.CompanyName);
    }
    return  CCRZ.views.contactUs;
});