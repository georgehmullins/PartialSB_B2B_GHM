d('cartUploaderUtils', function() {
    //--------------CSV Functions--------------
    return function UtilsCSV(fileInputId){
    //--------------Upload--------------
        this.loadDataCSV = function(csvFile, chunkSize, processData){
            if (window.FileReader) {
                this.readFile(csvFile,chunkSize,processData);
            } else {
                alert('FileReader is not supported in this browser.');
            }
        };
        // Function to create file reader
        this.readFile = function(file,chunkSize,processData) {
          var v = this,
          reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = (function(chunkSize,processData){
                return function(event){
                    var csvData = event.target.result,
                        result = [],
                        data, chunkData, event;
                    csvData = XLSX.read(csvData, {type: 'binary'});
                    csvData.SheetNames.forEach(function(sheetName) {
                        var csv = XLSX.utils.sheet_to_csv(csvData.Sheets[sheetName]);
                        if(csv.length){
                            result.push(csv);
                        }
                    });
                    csvData = result.join('\n');
                    data = processData ? processData(csvData) : v.extractCSVData(csvData),
                    chunkData = v.getDataChunks(data,chunkSize),
                    event = new CustomEvent("finishedLoadingCSVData"+fileInputId, { "detail": chunkData});
                    document.dispatchEvent(event);



                };
          })(chunkSize,processData);
          reader.onerror = v.errorHandler;
        };

        // Function to extract data from csv file
        this.extractCSVData = function(csvData) {
            var textLines = csvData.split(/\r\n|\n/),
                data = [];
            for (var i=1; i<textLines.length; i++) {
                if(textLines[i] != ''){
                    var lineData = textLines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/g),
                        item = [];
                    for (var j=0; j<lineData.length; j++) {
                        var tmp = lineData[j];
                        if(tmp.startsWith("\"") && tmp.endsWith("\"")){
                            tmp = tmp.substring(1,(tmp.length-1));
                        }
                        item.push(tmp);
                    }
                    data.push(item);
                }
            }
            return data;
        };


        // Function to split data into chunks
        this.getDataChunks = function(data, chunkSize){
            var dataChunks = [],
                chunksCount = Math.ceil(data.length / chunkSize);
            for (var i = 0, j = 0; i < chunksCount; i++, j += chunkSize) {
                dataChunks[i] = data.slice(j, j + chunkSize);
            }
            return dataChunks;
        };

        // Function to execute on error
        this.errorHandler = function(event) {
            if(event.target.error.name == "NotReadableError") {
                alert("Error during reading file!");
            }
        };
    //--------------Download--------------
        // Function to create and download CSV file
        this.exportToCSV = function(dataName, data){
                   var workbook = { SheetNames: [], Sheets: {} };
                   workbook.Props = {
                      Title: dataName,
                      Author: "Salesforce"
                   };
                   var worksheet = XLSX.utils.aoa_to_sheet(data),
                   worksheet_name = dataName;
                   XLSX.utils.book_append_sheet(workbook, worksheet, worksheet_name);
                   XLSX.writeFile(workbook,dataName + '.xlsx')
        };
    }
});
