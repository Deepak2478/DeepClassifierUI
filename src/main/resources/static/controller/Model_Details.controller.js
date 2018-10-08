sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, Filter, ChartFormatter, JSONModel) {
    "use strict";

    return Controller.extend("com.sapML_Analysis.controller.Model_Details", {
        onInit: function() {
            this._attachRouteMatchedEvents(this);
        },
        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        _attachRouteMatchedEvents: function(oController) {
            this.getRouter().attachRoutePatternMatched(function(oEvent) {
                var sPattern = oEvent.getParameter("name");
                var sObjectId = oEvent.getParameter("arguments").objectId;
                switch (sPattern) {
                    case "Models":
                        this._createMasterRouteMatched(oController);
                        break;
                    case "object":
                        this._createDetailRouteMatched(oController, sObjectId);
                        break;
                    default:
                        break;
                }
            }, this);
        },
        _createMasterRouteMatched: function(oController) {
            var oModelDetails = new JSONModel();
            this.getView().setModel(oModelDetails, "oModelDetails");
            oController.setModelDetails();

        },
        _createDetailRouteMatched: function(oController, sObjectId) {
            var sObjectPath = this.getView().getModel("oModelDetails").getContext('/data/' + sObjectId);
            this._bindView(sObjectPath);
        },
        _bindView: function(sObjectPath) {
            this.getView().setBindingContext(sObjectPath, "oModelDetails");
        },
        onSelectionChange: function(oEvent) {
            this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
        },
        _showDetail: function(oItem) {
            var context = oItem.getBindingContextPath();
            var objectId = context.match(/\d+/g);
            this.getRouter().navTo("object", {
                objectId: objectId[0]
            }, true);
        },
        onExit: function() {
            if (this._oPopover) {
                this._oPopover.destroy();
            }
        },

        addModel: function(oEvent) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("com.sapML_Analysis.view.AddModel", this);
                this.getView().addDependent(this._oPopover);
            }

            this._oPopover.openBy(oEvent.getSource());
        },

        handleCloseButton: function(oEvent) {
            this._oPopover.close();
        },
        handleOkButton: function(oEvent) {
            var modelName = oEvent.getSource().getModel("data").getData().modelName;
            var modelId = oEvent.getSource().getParent().getParent().getContent()[0].getContent()[3].getSelectedItem().getKey();
            var viewData = this.getView().getModel("oModelDetails").getData().data;
            viewData.push({"model" :{"id":modelId, "name" : modelName}});
            this.getView().getModel("oModelDetails").updateBindings();

        },
        filterModel: function(oEvent) {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("com.sapML_Analysis.view.FilterModel", this);
            }

            this._oDialog.setModel(this.getView().getModel("data"));
            // toggle compact style
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
            this._oDialog.open();
        },
        setModelDetails: function() {
            var oController = this;
            $.ajax({
                url: "http://localhost:8080/model",
                type: "GET",
                async: "async",
                contentType: 'application/json',
                headers: {
                             "X-Payroll-Results-Auth-API-Key":localStorage.getItem('apiKey'),
                             "X-Payroll-Results-Application": localStorage.getItem('appName'),
                             "X-Payroll-Results-Auth-Token": localStorage.getItem('authToken')
                          },
                success: function(response) {
                    //var response = JSON.parse(response);
                    oController.getView().getModel("oModelDetails").setData(response);
                    oController.getView().getModel("oModelDetails").updateBindings();
                    var oList = oController.getView().byId("listModel").getItems()[0];
                    oController._showDetail(oList);
                },
                error: function(e) {
                    var error = e;
                }
            });
        },
        handlePressConfiguration: function(){
          window.history.back();
        },
        handleLogoffPress: function(){
         		  window.location.href = "http://localhost:9090/";
        }
    });
});