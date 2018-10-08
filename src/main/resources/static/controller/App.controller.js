sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.sapML_Analysis.controller.App", {
		onInit: function() {
			var sessionModel = new JSONModel([]);
			this.getView().setModel(sessionModel, "sessionModel");
			var userDetails = new JSONModel([]);
            this.getView().setModel(userDetails, "userDetails");
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onLoginTap: function() {
			//this.getRouter().navTo("Tile");
			var self = this;
			var username = this.getView().byId("uid").getValue();
			var password = this.getView().byId("pasw").getValue();
			var data = {"username" : username, "password": password};
			$.ajax({
				url: "http://www.services.com:8081/login",
				type: "POST",
				data: JSON.stringify(data),
				async: "async",
				contentType: 'application/json',
				headers: {
                        "X-Payroll-Results-Auth-API-Key":"abcdefghijklmno",
                        "X-Payroll-Results-Application":"UI5 Client"
                    },
				success: function(response) {
					var response = response;
					console.log("test");
					if(response.status === "OK"){
					   localStorage.setItem('authToken', response.data.authToken);
					   localStorage.setItem('apiKey', "abcdefghijklmno");
					   localStorage.setItem('appName', "UI5 Client");
					   self.getRouter().navTo("Tile");
					}
				},
				error: function(e) {
					var error = e;
				}
			});
		},
		addUser: function(oEvent) {
                    if (!this._oPopover) {
                        this._oPopover = sap.ui.xmlfragment("com.sapML_Analysis.view.SignUp", this);
                        this.getView().addDependent(this._oPopover);
                    }

                    this._oPopover.openBy(oEvent.getSource());
        },
        handleOkButton:function(oEvent){
            console.log("test");
            var userForm=this.getView().getModel("userDetails").getData();
            var username = userForm.username;
            var password = userForm.password;
            var firstName = userForm.firstName;
            var lastName = userForm.lastName;
            var data = {"username" : username, "password": password ,"firstName":firstName, "lastName": lastName};
            var self = this;
            $.ajax({
            				url: "http://www.services.com:8081/signup",
            				type: "POST",
            				data: JSON.stringify(data),
            				async: "async",
            				contentType: 'application/json',
            				headers: {
                                    "X-Payroll-Results-Auth-API-Key":"abcdefghijklmno",
                                    "X-Payroll-Results-Application":"UI5 Client"
                                },
            				success: function(response) {
            					var response = response;
            					console.log("test");
            					if(response.status === "OK"){
            					   localStorage.setItem('authToken', response.data.authToken);
            					   localStorage.setItem('apiKey', "abcdefghijklmno");
            					   localStorage.setItem('appName', "UI5 Client");
            					   self.getRouter().navTo("Tile");
            					}
            				},
            				error: function(e) {
            					var error = e;
            				}
            			});

        }
	});
});