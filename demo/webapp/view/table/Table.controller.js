sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "ui5-demo/util/BaseController",
    "ui5-demo/model/DataService",
], function (
    JSONModel,
    BaseController,
    DataService,
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.table.Table", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            this.setModel(new JSONModel({
                count: 0,
                wrappedData: [
                    {obj: {}, temp: {prettyEmail: "", editMode: false, email: ""}}
                ]
            }), "local");

            DataService.loadData()
                .then(data => this.setModel(new JSONModel(data)));

            this.addComputedProperties();
        },

        addComputedProperties: function () {
            // count
            this.addComputedProperty("local>/count",
                this.buildFuncExpressionBinding(
                    data => data.length,
                    "/data"));

            // wrappedData
            const tempMap = this.createTempMap();
            const wrappingFunction = list => list.map(it => ({
                    obj: it,
                    temp: tempMap.getOrCreate(it.login)
                }));
            this.addComputedProperty("local>/wrappedData",
                this.buildFuncExpressionBinding(wrappingFunction, "/data"));

            // prettyEmail
            this.addComputedPropertyForElement(this.byId("rowTemplate"), "local>temp/prettyEmail",
                this.buildFuncExpressionBinding(
                    (vorname, nachname, email) => `${vorname} ${nachname} <${email}>`,
                    "local>obj/vorname", "local>obj/nachname", "local>obj/email"));
        },

        createTempMap: function () {
            let map = {};
            return {
                getOrCreate: key => {
                    map[key] = map[key] || {};
                    return map[key];
                }
            }
        },

        doAdd: function () {
            const data = this.getModel().getProperty("/data");
            const newData = data.concat([DataService.generateBenutzer()]);
            this.getModel().setProperty("/data", newData);
        },

        startEditing: function (oEvent) {
            const bindingContext = this.getBindingContextForEvent(oEvent, "local");
            const email = bindingContext.getProperty("obj/email");
            bindingContext.setProperty("temp/email", email);
            bindingContext.setProperty("temp/editMode", true);
        },

        saveChanges: function (oEvent) {
            const bindingContext = this.getBindingContextForEvent(oEvent, "local");
            const email = bindingContext.getProperty("temp/email");
            bindingContext.setProperty("obj/email", email);
            bindingContext.setProperty("temp/editMode", false);
        },

        cancelEditing: function (oEvent) {
            const bindingContext = this.getBindingContextForEvent(oEvent, "local");
            bindingContext.setProperty("temp/editMode", false);
        }
    });
});
