sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (
    Controller
) {
    "use strict";

    var CONTENT_DENSITY_CLASS = "sapUiSizeCompact";

    /**
     * Base Controller for common functionality among all pages.
     * Page-specific controllers are to extend the BaseController.
     * The BaseController is not to be used directly by and view.
     */
    return Controller.extend("ui5-demo.view.BaseController", {

        onInit: function () {
            // Content-Density-Class setzen
            this.getView().addStyleClass(CONTENT_DENSITY_CLASS);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         */
        setModel: function (oModel, sName) {
            this.getView().setModel(oModel, sName);
        },

        getBindingContextForEvent: function (oEvent, sModel) {
            function setProperty(sPath, oValue) {
                var model = this.getModel();
                var fullPath = this.getPath(sPath);
                model.setProperty(fullPath, oValue);
            }

            var bindingContext = oEvent.getSource().getBindingContext(sModel || undefined);
            if (!bindingContext) {
                throw Error("No binding context for model '" + sModel + "' found!");
            }
            bindingContext.setProperty = setProperty.bind(bindingContext);
            return bindingContext;
        }

    });
});
