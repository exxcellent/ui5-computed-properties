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

    /**
     * This is a very simple editor with 4 text inputs and a couple of buttons.
     * Some controls are shown/hidden when edit mode is activated and any of the inputs are changed.
     *
     * It's implemented in this controller using the 'ComputedPropertyBuilder' from this library.
     * This allows reusing parts of the visibility logic and keeping it out of the view.
     */
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

            // ComputedProperty 'local>/currentHash' is added to the root of the view
            new ComputedPropertyBuilder(this, "local>/currentHash")
                .withFunction(concatBenutzerFelder,
                    ["/login", "/vorname", "/nachname", "/email"])
                .add();
            // ComputedProperty 'local>/backupHash' is added to the root of the view
            new ComputedPropertyBuilder(this, "local>/backupHash")
                .withFunction(concatBenutzerFelder,
                    ["backup>/login", "backup>/vorname", "backup>/nachname", "backup>/email"])
                .add();
            // ComputedProperty 'local>/changed' is calculated using the other two ComputedProperties
            new ComputedPropertyBuilder(this, "local>/changed")
                .withFunction(function (benutzerHash, origHash) { return benutzerHash !== origHash; },
                    ["local>/currentHash", "local>/backupHash"])
                .add();
        }
    });
});
