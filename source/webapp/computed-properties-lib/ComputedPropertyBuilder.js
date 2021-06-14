sap.ui.define([
    "sap/base/Log",
    "sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "./ComputedProperty"
], function (
    Log,
    ManagedObject,
    JSONModel,
    ComputedProperty
) {
    "use strict";
    
    var FUNC_MODEL_NAME = "$funcs";

    /**
     * ComputedPropertyBuilder is a builder class for the ComputedProperty custom element.
     *
     * <h3>Overview</h3>
     *
     * This builder allows defining a ComputedProperty in the controller.
     * It works in 3 steps:
     * - Construct the ComputedPropertyBuilder with controller/view and 'var' name.
     * - Set the expression binding or JavaScript function and parameters.
     * - Add the final ComputedProperty to the root or some sub-element of the view.
     *
     * This class logs on debug level as component "computed-property", so you can filter for this text.
     *
     * <h3>Example</h3>
     *
     * <pre>
     * new ComputedPropertyBuilder(this, "/computed")
     *      .withFunction(func, ["/var1", "/var2"])
     *      .add();
     * </pre>
     */
    return ManagedObject.extend("computed-properties-lib.ComputedPropertyBuilder", {

        /**
         * Constructor for ComputedPropertyBuilder.
         *
         * @constructor
         * @public
         * @param {sap.ui.core.mvc.View|sap.ui.core.mvc.Controller} oViewOrController - either parent view or controller
         * @param {string} sComputedPropertyVar - ComputedProperty 'var' binding without braces
         */
        constructor: function(oViewOrController, sComputedPropertyVar) {
            function getView(_oViewOrController) {
                if (_oViewOrController && _oViewOrController.getMetadata().isA("sap.ui.core.mvc.View")) {
                    return _oViewOrController;
                } else if (_oViewOrController && _oViewOrController.getMetadata().isA("sap.ui.core.mvc.Controller")) {
                    return getView(_oViewOrController.getView());
                }
                throw new Error("Parameter 'oViewOrController' must be a sap.ui.core.mvc.View or sap.ui.core.mvc.Controller");
            }

            ManagedObject.call(this);
            if (typeof sComputedPropertyVar !== "string") {
                throw new Error("Parameter 'sComputedPropertyVar' must be a string");
            }
            this.oView = getView(oViewOrController);
            this.sVar = sComputedPropertyVar;
        },

        /**
         * Define the 'value' binding with a JavaScript function and parameters as model bindings.
         * This stores the given function in an internal model of the view (given in constructor) and constructs an expression binding.
         *
         * @param {function} fComputationFunc - JavaScript function with n parameters
         * @param {array<string>} aParams - Bindings (without braces) for the n parameters
         * @returns {object} this builder
         */
        withFunction: function (fComputationFunc, aParams) {
            function getAndInitFuncModel(_oView, _sFuncModelName) {
                if (!_oView.getModel(_sFuncModelName)) {
                    _oView.setModel(new JSONModel({}), _sFuncModelName);
                }
                return _oView.getModel(_sFuncModelName);
            }

            if (typeof fComputationFunc !== "function") {
                throw new Error("Parameter 'fComputationFunc' must be a string");
            }
            if (!Array.isArray(aParams)) {
                throw new Error("Parameter 'aParams' must be an array");
            }

            var randomNr = Math.floor(Math.random() * 1000000);
            var funcName = fComputationFunc.name + "_" + randomNr;
            var paramsString = aParams
                .map(function (p) { return "%{" + p + "}"; })
                .join(", ");
            var oFuncModel = getAndInitFuncModel(this.oView, FUNC_MODEL_NAME);
            oFuncModel.setProperty("/" + funcName, fComputationFunc);
            // e.g. {= %{funcs>/f1}( %{v1}, %{v2} ) }
            return this.withBinding("{= %{" + FUNC_MODEL_NAME + ">/" + funcName + "}( " + paramsString + " ) }");
        },

        /**
         * Define the 'value' binding with the final (expression) binding (including braces).
         *
         * @param {string} sValueBinding - expression binding or any other binding
         * @returns {object} this builder
         */
        withBinding: function (sValueBinding) {
            if (typeof sValueBinding !== "string") {
                throw new Error("Parameter 'sValueBinding' must be a string");
            }
            this.sExpressionBinding = sValueBinding;
            return this;
        },

        /**
         * Add the final ComputedProperty to the root of the view.
         */
        add: function () {
            var oParentControl = this.oView.getContent()[0];
            this.addToSpecificElement(oParentControl);
        },

        /**
         * Add the final ComputedProperty to an sub-element of the view by ID.
         *
         * @param {string} sId - ID in the context of the view (given in constructor)
         */
        addById: function (sId) {
            var oParentControl = this.oView.byId(sId);
            this.addToSpecificElement(oParentControl);
        },

        /**
         * Add the final ComputedProperty to a specific element.
         *
         * @param {sap.ui.core.Element} oElement - ComputedProperty is added to 'dependents' aggregation of this element
         */
        addToSpecificElement: function (oElement) {
            if (typeof this.sExpressionBinding !== "string") {
                throw new Error("Field 'sExpressionBinding' must be defined via .withFunction(..) or .withBinding(..)");
            }
            var sVarBinding = "{" + this.sVar + "}";
            var oConfig = {
                label: this.sVar,
                var: sVarBinding,
                value: this.sExpressionBinding
            };
            var oComputedProperty = new ComputedProperty(oConfig);
            Log.debug("Adding computed property '" + oConfig.label + "' with binding '" + oConfig.value + "'", null, "computed-property");
            oElement.addDependent(oComputedProperty);
        }

    });
});
