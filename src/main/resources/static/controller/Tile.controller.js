sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/Device",
	'sap/m/Button',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/format/DateFormat',
], function(Controller, MessageToast, Device, Button, Fragment, JSONModel, DateFormat) {
	"use strict";
	return Controller.extend("com.sapML_Analysis.controller.Tile", {
		onInit: function() {
			// set mock model
			var sPath = jQuery.sap.getModulePath("com.sap.model", "/tile.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel, "tile");
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
 
		handleBusyPress : function (evt) {
			var oTileContainer = this.getView().byId("container");
			var newValue = ! oTileContainer.getBusy();
			oTileContainer.setBusy(newValue);
			evt.getSource().setText(newValue ? "Done" : "Busy state");
		},
 
		navToInfo : function(){
			this.getRouter().navTo("Map");
		},
		navToTraining   : function(){
			this.getRouter().navTo("Models");
		},
		navToPrediction: function(){
			this.getRouter().navTo("Analysis");
		},
		navToInfo: function(){
        	this.getRouter().navTo("Info");
        },
		handleLogoffPress: function(){
		  window.location.href = 'http:http://localhost:9090/'
		}

	});
});