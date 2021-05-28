sap.ui.define([
    "sap/ui/core/UIComponent"
], function (
    UIComponent
) {
    "use strict";

    return UIComponent.extend("ui5-demo.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        }
    });
});
