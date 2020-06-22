d("dataDownloader",['cartUploaderUtils'], function(cartUploaderUtils) {
    return function Downloader(controller, method, fileName, chunkSize){
        this.csvUtils = new cartUploaderUtils();
        this.controller = controller;
        this.method = method;
        this.fileName = fileName;
        this.chunkSize = chunkSize ? chunkSize : 1000;
        this.remoteAction = function(lastId, chunkSize, callback){
                                    this.controller[this.method](
                                        lastId,
                                        chunkSize,
                                        function(result, event){
                                            if (event.status) {
                                                callback(result);
                                            }
                                        },
                                        {escape: false, timeout: 120000}
                                    );
                            };
        this.getData = function(lastId, chunkSize, callback) {
                           var v = this;
                           v.remoteAction(lastId, chunkSize, function(response){
                               if (response.lastId != undefined) {
                                   v.getData(response.lastId, chunkSize, function(nextItems){
                                       callback(response.items += nextItems);
                                   });
                               } else {
                                   callback(response.items);
                               }
                           });
                       };
        this.action = function(){
                          alert('Download started. This may take a while');
                          var v = this;
                          v.getData('', v.chunkSize, function(items){
                              v.csvUtils.exportToCSV(fileName,items);
                          });
                      };
    }
});