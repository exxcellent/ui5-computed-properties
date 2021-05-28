sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "../BaseController",
    "ui5-demo/model/DataService",
    "computed-properties-lib/ComputedPropertyBuilder"
], function (
    JSONModel,
    BaseController,
    DataService,
    ComputedPropertyBuilder
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
            new ComputedPropertyBuilder(this, "local>/count")
                .withFuncExpressionBinding(data => data.length, ["/data"])
                .add();

            // wrappedData
            const tempMap = this.createTempMap();
            const wrappingFunction = list => list.map(it => ({
                    obj: it,
                    temp: tempMap.getOrCreate(it.login)
                }));
            new ComputedPropertyBuilder(this, "local>/wrappedData")
                .withFuncExpressionBinding(wrappingFunction, ["/data"])
                .add();

            // prettyEmail
            new ComputedPropertyBuilder(this, "local>temp/prettyEmail")
                .withFuncExpressionBinding(
                    (vorname, nachname, email) => `${vorname} ${nachname} <${email}>`,
                    ["local>obj/vorname", "local>obj/nachname", "local>obj/email"])
                .addById("rowTemplate");
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
            bindingContext.setProperty("temp/editEmail", email);
            bindingContext.setProperty("temp/editMode", true);
        },

        saveChanges: function (oEvent) {
            const bindingContext = this.getBindingContextForEvent(oEvent, "local");
            const email = bindingContext.getProperty("temp/editEmail");
            bindingContext.setProperty("obj/email", email);
            bindingContext.setProperty("temp/editMode", false);
        },

        cancelEditing: function (oEvent) {
            const bindingContext = this.getBindingContextForEvent(oEvent, "local");
            bindingContext.setProperty("temp/editMode", false);
        }
    });
});
