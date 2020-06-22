d("customCasesView", ["ccrz", "util"], function(CCRZ, UTIL) {
    CCRZ.views.customCasesView = CCRZ.CloudCrazeView.extend({
        el: CCRZ.uiProperties.customCasesView.desktop.selector,
        viewName: "customCasesView",
        templateDesktop: CCRZ.util.template(CCRZ.uiProperties.customCasesView.desktop.tmpl.case),
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
        validateData : function(){
        
        },
        setUpScreen : function(){
            $('#name').val(CCRZ.currentUser.FirstName +' '+CCRZ.currentUser.LastName);
            $('#email').val(CCRZ.currentUser.Email);
            $('#phone').val(CCRZ.currentUser.MobilePhone);
        },
        events: {
        }
    });
    function setUpScreen(){
        $('#name').val(CCRZ.currentUser.FirstName +' '+CCRZ.currentUser.LastName);
        $('#email').val(CCRZ.currentUser.Email);
        $('#phone').val(CCRZ.currentUser.Phone);
        $('#company').val(CCRZ.currentUser.CompanyName);
    }
    return  CCRZ.views.customCasesView;
});