sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/model/json/JSONModel",
    "../BaseController",
    "ui5-demo/model/DataService",
    "computed-properties-lib/ComputedPropertyBuilder"
], function (
    deepClone,
    JSONModel,
    BaseController,
    DataService,
    ComputedPropertyBuilder
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.simple.Simple3", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            var benutzer = DataService.generateBenutzer();

            this.setModel(new JSONModel({
                editMode: false
            }), "local");
            this.setModel(new JSONModel(benutzer));
            this.setModel(new JSONModel(benutzer), "backup");

            this.addComputedProperties();
        },

        startEditing: function () {
            var current = this.getModel().getData();
            this.getModel("backup").setData(deepClone(current));
            this.getModel("local").setProperty("/editMode", true);
        },

        saveChanges: function () {
            var current = this.getModel().getData();
            this.getModel("backup").setData(current);
            this.getModel("local").setProperty("/editMode", false);
        },

        cancelEditing: function () {
            this.getModel("local").setProperty("/editMode", false);
            var backup = this.getModel("backup").getData();
            this.getModel().setData(backup);
        },

        addComputedProperties: function () {
            var concatBenutzerFelder = function (login, vorname, nachname, email) {
                return login + "_" + vorname + "_" + nachname + "_" + email;
            }

            new ComputedPropertyBuilder(this, "local>/currentHash")
                .withFuncExpressionBinding(concatBenutzerFelder,
                    ["/login", "/vorname", "/nachname", "/email"])
                .add();
            new ComputedPropertyBuilder(this, "local>/backupHash")
                .withFuncExpressionBinding(concatBenutzerFelder,
                    ["backup>/login", "backup>/vorname", "backup>/nachname", "backup>/email"])
                .add();
            new ComputedPropertyBuilder(this, "local>/changed")
                .withFuncExpressionBinding(function (benutzerHash, origHash) { return benutzerHash !== origHash; },
                    ["local>/currentHash", "local>/backupHash"])
                .add();
        }
    });
});
