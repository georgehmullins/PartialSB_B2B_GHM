/**
 *  Namespace related to logging. To make it works ccLog key should be set in parameter
 *  @module log
 */
d('log',['ccrz'], function(CCRZ) {
    return {
        /**
          * Method logs message given as parameter
          * @param {String} message to be logged
          */
        debug : function(message){
            CCRZ.console.log(message,"DEBUG",new Date().getTime(),'JS');
        },
        error : function(message){
            CCRZ.console.log(message,"ERROR",new Date().getTime(),'JS');
        },
        info : function(message){
            CCRZ.console.log(message,"INFO",new Date().getTime(),'JS');
        }
    }
});