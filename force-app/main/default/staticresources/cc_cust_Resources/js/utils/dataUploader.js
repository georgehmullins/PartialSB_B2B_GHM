d('dataUploader',['cartUploaderUtils','cartUploaderCollection'], function(cartUploaderUtils,cartUploaderCollection) {
    return function Uploader(controller, method, fileInputId, optionalParams){
        this.csvUtils = new cartUploaderUtils(fileInputId);
        this.controller = controller;
        this.method = method;
        this.fileInputId = fileInputId;
        this.isCloudCraze = optionalParams && optionalParams['remoteActionType'] === 'CloudCraze' ? true : false;
        this.eventInitialized = false;
        this.processData = optionalParams && optionalParams['processData'] ? optionalParams['processData'] : undefined;
        this.chunkSize = optionalParams && optionalParams['chunkSize'] ? optionalParams['chunkSize'] : 1000;
        this.displayErrorMsg = optionalParams && optionalParams['displayErrorMsg'] ? optionalParams['displayErrorMsg'] : false;
        this._dataUploaderForCC = this.isCloudCraze ? new CCRZ.models.cc_cust_CartUploaderModelCollection() : undefined;
        this._remoteActionCloudCraze = function (data, callback) {
            this._dataUploaderForCC.dataUploaderCCModel(data,callback);
        }
        this._remoteActionSFDC = function (data,callback){
                                var v = this;
                                v.controller[v.method](data,function(result, event){
                                    var processedSuccesfully = result;
                                    if(v.displayErrorMsg){
                                        processedSuccesfully = result.isSuccess;
                                    }
                                    if (!event.status || !processedSuccesfully) {
                                        if(v.displayErrorMsg && result.errorMessages.length >0){
                                            var errorMsg = result.errorMessages[0]
                                            if(result.errorMessages.length > 1){
                                                for(var i = 1;i<result.errorMessages.length;i++){
                                                    errorMsg += '\n'+result.errorMessages[i];
                                                }
                                            }
                                            alert(errorMsg)
                                        }else{
                                            alert('Error during upload. Try again.');
                                        }
                                    } else {
                                        v.actualProgressCount++;
                                        if(v.actualProgressCount == v.finishProgressCount){
                                            var event = new CustomEvent("finishedLoadingData"+v.fileInputId, { "detail": 'Success'});
                                            document.dispatchEvent(event);
                                            v.data = null;
                                        } else {
                                            callback(result);
                                        }
                                    }
                                },
                                {escape: true, timeout: 120000}
                                );
                            };
        this.remoteAction = optionalParams && optionalParams['remoteActionType'] === 'CloudCraze' ? this._remoteActionCloudCraze : this._remoteActionSFDC;
        this.uploadData = function(){
                                   var v = this;
                                   var i = this.isCloudCraze ? this._dataUploaderForCC.actualProgressCount : v.actualProgressCount;
                                   v.remoteAction(v.data[i], function(response){
                                       if(response){
                                          v.uploadData();
                                       }
                                   })
                        };
        this.initEvents = function(){
                                    var v = this;
                                    document.addEventListener("finishedLoadingCSVData"+v.fileInputId, function(e) {
                                        v.data = e.detail;
                                        if(v.isCloudCraze){
                                            v._dataUploaderForCC.finishProgressCount = v.data.length;
                                        } else{
                                            v.finishProgressCount = v.data.length;
                                        }
                                         if((v.data.length == 0 && optionalParams === undefined)){
                                            alert('File does not contains data to upload!');
                                        } else {
                                            v.uploadData();
                                        }
                                    });
                                    if(!v.isCloudCraze){
                                        document.addEventListener("finishedLoadingData"+v.fileInputId, function(e) {
                                            alert('Data updating has been successfully completed');
                                        });
                                    }
                                    v.eventInitialized = true;
        };
        this.action = function(){
                            if(optionalParams === undefined){
                                alert('Upload started. This may take a while');
                            }
                            var v = this,
                                csvFile = document.getElementById(v.fileInputId).files[0];
                            if(!v.eventInitialized){
                                v.initEvents();
                            }
                            if(csvFile){
                                    if(this.isCloudCraze){
                                        v._dataUploaderForCC.actualProgressCount = 0;
                                    } else{
                                        v.actualProgressCount = 0;
                                        v.finishProgressCount = 0;
                                    }
                                    v.csvUtils.loadDataCSV(csvFile,v.chunkSize, v.processData);
                            }else{
                                if(this.isCloudCraze){
                                     $('#uploadProductsModal').modal('hide');
                                     setTimeout(function(){
                                         $('#uploadProductsModalError').modal('show');
                                     }, 200);
                                }else{
                                    alert('No file selected');
                                }
                            }
                        };
    }
});