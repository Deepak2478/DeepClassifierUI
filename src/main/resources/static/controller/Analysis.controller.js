sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/Sorter',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
], function(jQuery, Controller, Filter, Sorter, ChartFormatter, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.sapML_Analysis.controller.Analysis", {
        onInit: function() {
            this.oModel = new JSONModel();
            this.oModel.loadData(jQuery.sap.getModulePath("sap.ui.comp.sample.filterbar.DynamicPageListReport", "/model.json"), null, false);
            this.getView().setModel(this.oModel);
            var oModelDetails = new JSONModel();
            this.getView().setModel(oModelDetails, "oModelDetails");
            this.setModelDetails();
            this.aKeys = ["Name", "Category", "SupplierName"];
            this.oSelectName = this.getSelect("slName");
            this.oSelectCategory = this.getSelect("slCategory");
            this.oSelectSupplierName = this.getSelect("slSupplierName");
            this.oModel.setProperty("/Filter/text", "Filtered by None");
            var oVizFrame = this.getView().byId('DueDateGridFrame');
            var oVizPopover = this.getView().byId('vizPopover');
            oVizPopover.connect(oVizFrame.getVizUid());
            var oVizFrame1 = this.getView().byId('idChartParkRight');
            var oVizPopover1 = this.getView().byId('vizPopover1');
            var dataModel = new JSONModel();
            this.getView().setModel(dataModel, "dataModel");
            //		oVizPopover1.connect(oVizFrame1.getVizUid());

        },
        analyzePress: function() {
            var oController = this;
            var modelId = this.getView().byId("idModelList").getSelectedItem().getKey();
            var formData = new FormData();
            formData.append("file", document.getElementsByName("uploadCsv")[0].files[0]);
            formData.append("modelId", modelId);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(e) {
                if (4 == this.readyState) {
                    var response = JSON.parse(this.responseText);
                    var correctRecords = response.data[0].correctCount;
                    var incorrectRecords = response.data[0].incorrectCount;
                    oController.jsonObj = response.data[0].predictions;
                    response.data[0].displayData = [{
                            "Payroll Classifier": "Correct",
                            "Count": correctRecords
                        },
                        {
                            "Payroll Classifier": "Incorrect",
                            "Count": incorrectRecords
                        }
                    ]
                    oController.getView().getModel("dataModel").setData(response.data[0]);
                    oController.getView().getModel("dataModel").updateBindings();
                }
            };
            xhr.open('post', 'http://localhost:8080/model/analysis');
            xhr.setRequestHeader("X-Payroll-Results-API-Key", localStorage.getItem('apiKey'));
            xhr.setRequestHeader("X-Payroll-Results-Application", localStorage.getItem('appName'));
            xhr.setRequestHeader("X-Payroll-Results-Auth-Token", localStorage.getItem('authToken'));
            xhr.send(formData);
        },

        onExit: function() {
            this.aKeys = [];
            this.aFilters = [];
            this.oModel = null;
        },
        onToggleHeader: function() {
            this.getPage().setHeaderExpanded(!this.getPage().getHeaderExpanded());
        },
        onToggleFooter: function() {
            this.getPage().setShowFooter(!this.getPage().getShowFooter());
        },
        onSelectChange: function() {
            var aCurrentFilterValues = [];

            aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
            aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
            aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

            this.filterTable(aCurrentFilterValues);
        },

        filterTable: function(aCurrentFilterValues) {
            this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
            this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
        },

        updateFilterCriterias: function(aFilterCriterias) {
            //this.removeSnappedLabel(); /* because in case of label with an empty text, */
            //this.addSnappedLabel(); /* a space for the snapped content will be allocated and can lead to title misalignment */
            this.oModel.setProperty("/Filter/text", this.getFormattedSummaryText(aFilterCriterias));
        },



        getFilters: function(aCurrentFilterValues) {
            this.aFilters = [];

            this.aFilters = this.aKeys.map(function(sCriteria, i) {
                return new sap.ui.model.Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
            });

            return this.aFilters;
        },
        getFilterCriteria: function(aCurrentFilterValues) {
            return this.aKeys.filter(function(el, i) {
                if (aCurrentFilterValues[i] !== "") return el;
            });
        },
        getFormattedSummaryText: function(aFilterCriterias) {
            if (aFilterCriterias.length > 0) {
                return "Filtered by (" + aFilterCriterias.length + "): " + aFilterCriterias.join(", ");
            } else {
                return "Filtered by None";
            }
        },

        getTable: function() {
            return this.getView().byId("idProductsTable");
        },
        getTableItems: function() {
            return this.getTable().getBinding("items");
        },
        getSelect: function(sId) {
            return this.getView().byId(sId);
        },
        getSelectedItemText: function(oSelect) {
            return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
        },
        getPage: function() {
            return this.getView().byId("dynamicPageId");
        },
        getPageTitle: function() {
            return this.getPage().getTitle();
        },
        getSnappedLabel: function() {
            return new sap.m.Label({
                text: "{/Filter/text}"
            });
        },
        handleViewSettingsDialogButtonPressed: function(oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("com.sapML_Analysis.view.Settings", this);
            }
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            this._oDialog.open();
        },
        handleSettingsConfirm: function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("idRecordTable");

            var mParams = oEvent.getParameters();
            var oBinding = oTable.getBinding("items");

            // apply sorter to binding
            // (grouping comes before sorting)
            var sPath;
            var bDescending;
            var aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);

            // apply filters to binding
            var aFilters = [];
            jQuery.each(mParams.filterItems, function(i, oItem) {
                var aSplit = oItem.getKey().split("___");
                var sPath = aSplit[0];
                var sOperator = aSplit[1];
                var sValue1 = aSplit[2];
                var oFilter = new Filter(sPath, sOperator, sValue1);
                aFilters.push(oFilter);
            });
            oBinding.filter(aFilters);

            // update filter bar
            //            oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
            //            oView.byId("vsdFilterLabel").setText(mParams.filterString);
        },
        handlePressConfiguration: function() {
            window.history.back();
        },
        onDataExport: function() {
            var JSONData = this.jsonObj;
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            CSV += "PredictionResults" + '\r\n\n';

            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }

            var fileName = "PredictionExports";
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (navigator.appName == "Microsoft Internet Explorer" || msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                var oWin = window.open();
                oWin.document.write(CSV);
                oWin.document.close();
                oWin.document.execCommand('SaveAs', true, fileName + ".csv");
                oWin.close();
            } else {
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                var link = document.createElement("a");
                link.href = uri;
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }



        },
        handleLogoffPress: function() {
            window.location.href = 'http://localhost:9090/'
        },
        csvUploadUpdated: function(oEvent) {
            var sResponse = oEvent.getParameter("response");
            if (sResponse) {
                var sMsg = "";
                var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
                if (m[1] == "200") {
                    sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
                    oEvent.getSource().setValue("");
                } else {
                    sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
                }

                MessageToast.show(sMsg);
            }
        },
        handleUploadPress: function(oEvent) {
            var oFileUploader = this.getView().byId("fileUploader");
            if (!oFileUploader.getValue()) {
                MessageToast.show("Choose a file first");
                return;
            }
            oFileUploader.upload();
        },

        handleTypeMissmatch: function(oEvent) {
            var aFileTypes = oEvent.getSource().getFileType();
            jQuery.each(aFileTypes, function(key, value) {
                aFileTypes[key] = "*." + value;
            });
            var sSupportedFileTypes = aFileTypes.join(", ");
            MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                " is not supported. Choose one of the following types: " +
                sSupportedFileTypes);
        },

        onCsvUpload: function(oEvent) {
            MessageToast.show("Press 'Upload File' to upload file '" +
                oEvent.getParameter("newValue") + "'");
        },

        setModelDetails: function() {
            var oController = this;
            $.ajax({
                url: "http://localhost:8080/model",
                type: "GET",
                async: "async",
                contentType: 'application/json',
                headers: {
                    "X-Payroll-Results-Auth-API-Key": localStorage.getItem('apiKey'),
                    "X-Payroll-Results-Application": localStorage.getItem('appName'),
                    "X-Payroll-Results-Auth-Token": localStorage.getItem('authToken')
                },
                success: function(response) {
                    //var response = JSON.parse(response);
                    oController.getView().getModel("oModelDetails").setData(response.data);
                 /*   var progressBar = oController.getView().byId("idAccuracy");
                    progressBar.setPercentValue(response.data[0].analysis.accuracy);
                    progressBar.setDisplayValue(response.data[0].analysis.accuracy + "%");
                    if(response.data[0].analysis.accuracy > 80){
                        progressBar.setState("Success");
                    }else{
                        progressBar.setState("Error");
                    } */
                    oController.getView().getModel("oModelDetails").updateBindings();
                },
                error: function(e) {
                    var error = e;
                }
            });
        },
        setAccuracy : function(oEvent){
         var selectedKey = oEvent.getSource().getSelectedItem().getKey();
         var data =  this.getView().getModel("oModelDetails").getData();
         var progressBar = this.getView().byId("idAccuracy");
         for(var i=0; i<data.length; i++){
            if(data[i].analysis.id == selectedKey){
                progressBar.setPercentValue(parseInt(data[i].analysis.accuracy));
                progressBar.setDisplayValue(data[i].analysis.accuracy + "%");
                if(data[i].analysis.accuracy > 80){
                     progressBar.setState("Success");
                }else{
                     progressBar.setState("Error");
                }
                break;
                }
            }
         }


    });
});