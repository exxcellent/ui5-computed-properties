sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/model/json/JSONModel",
    "ui5-demo/util/BaseController",
    "ui5-demo/model/DataService",
], function (
    deepClone,
    JSONModel,
    BaseController,
    DataService,
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.simple.Simple3", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            this.setModel(new JSONModel({
                editMode: false
            }), "local");
            this.setModel(new JSONModel({}), "orig");

            const benutzer = DataService.generateBenutzer();
            this.setModel(new JSONModel(benutzer));

            const concatBenutzerFelder = (login, vorname, nachname, email) =>
                `${login}_${vorname}_${nachname}_${email}`;

            this.addComputedProperty("local>/benutzerHash",
                this.buildFuncExpressionBinding(
                    concatBenutzerFelder,
                    "/login", "/vorname", "/nachname", "/email"));
            this.addComputedProperty("local>/origHash",
                this.buildFuncExpressionBinding(
                    concatBenutzerFelder,
                    "orig>/login", "orig>/vorname", "orig>/nachname", "orig>/email"));
            this.addComputedProperty("local>/changed",
                this.buildFuncExpressionBinding(
                    (benutzerHash, origHash) => benutzerHash !== origHash,
                    "local>/benutzerHash", "local>/origHash"));
        },

        startEditing: function (oEvent) {
            const orig = this.getModel().getData();
            this.getModel("orig").setData(deepClone(orig));
            this.getModel("local").setProperty("/editMode", true);
        },

        saveChanges: function (oEvent) {
            // Saving..
            this.getModel("local").setProperty("/editMode", false);
        },

        cancelEditing: function (oEvent) {
            this.getModel("local").setProperty("/editMode", false);
            const orig = this.getModel("orig").getData();
            this.getModel().setData(orig);
        }
    });
});
