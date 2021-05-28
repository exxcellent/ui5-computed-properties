sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/model/json/JSONModel",
    "../BaseController",
    "ui5-demo/model/DataService"
], function (
    deepClone,
    JSONModel,
    BaseController,
    DataService
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.simple.Simple1", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            const benutzer = DataService.generateBenutzer();

            this.setModel(new JSONModel({
                editMode: false
            }), "local");
            this.setModel(new JSONModel(benutzer));
            this.setModel(new JSONModel(benutzer), "backup");
        },

        startEditing: function () {
            const current = this.getModel().getData();
            this.getModel("backup").setData(deepClone(current));
            this.getModel("local").setProperty("/editMode", true);
        },

        saveChanges: function () {
            const current = this.getModel().getData();
            this.getModel("backup").setData(current);
            this.getModel("local").setProperty("/editMode", false);
        },

        cancelEditing: function () {
            this.getModel("local").setProperty("/editMode", false);
            const backup = this.getModel("backup").getData();
            this.getModel().setData(backup);
        }
    });
});
