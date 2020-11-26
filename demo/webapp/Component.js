sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (
    Device,
    UIComponent,
    JSONModel
) {
    "use strict";

    return UIComponent.extend("ui5-demo.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // Device Model
            const oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");
        }
    });
});
