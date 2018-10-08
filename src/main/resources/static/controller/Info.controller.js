sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, Filter, ChartFormatter, JSONModel) {
    "use strict";

    return Controller.extend("com.sapML_Analysis.controller.Info", {
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
        handlePressConfiguration: function(){
                   window.history.back();
        },
        handleLogoffPress: function(){
                    window.location.href = "http://localhost:9090/";
        }
    });
});