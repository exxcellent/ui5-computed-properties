/**
 * Controller for the "App-background".
 * This should remain mostly without functionality.
 * Basic functionality to be shared among all controllers should be implemented in the dedicated {@see BaseController}.
 */
sap.ui.define([
    "ui5-demo/util/BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.App", {
        onInit: function () {
            // Erbt vom BaseController - daher wird die Content-Density-Class gesetzt.
            BaseController.prototype.onInit.apply(this, arguments);

            this.getRouter().initialize();
        },

        onNav: function (oEvent) {
            const destination = oEvent.getSource().data("dest");
            this.getRouter().navTo(destination);
        },
        onNavToSimple: function () {
            this.getRouter().navTo("simple")
        },
        onNavToTable: function () {
            this.getRouter().navTo("table")
        }
    });
});
