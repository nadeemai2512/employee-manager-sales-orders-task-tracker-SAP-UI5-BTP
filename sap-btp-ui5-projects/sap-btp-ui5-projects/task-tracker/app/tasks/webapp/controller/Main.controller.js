sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.demo.tasks.controller.Main", {

    onInit: function () {
      this.getView().setModel(new JSONModel({ total: 0, open: 0, inProgress: 0, done: 0, overdue: 0 }), "summary");
      this._loadSummary();
    },

    _t: function (k) { return this.getView().getModel("i18n").getResourceBundle().getText(k); },

    _loadSummary: function () {
      var oSummary = this.getView().getModel("summary");
      this.getView().getModel().bindContext("/summary()").requestObject().then(function (o) {
        oSummary.setData(o);
      }).catch(function () { /* summary is optional */ });
    },

    _error: function (e) { MessageBox.error((e && e.message) || this._t("errorGeneric")); },

    _selectedContext: function () {
      var oItem = this.byId("taskList").getSelectedItem();
      if (!oItem) { MessageToast.show(this._t("selectOne")); return null; }
      return oItem.getBindingContext();
    },

    onTabSelect: function (oEvent) {
      var sKey = oEvent.getParameter("key");
      var aFilters = sKey === "all" ? [] : [new Filter("status", FilterOperator.EQ, sKey)];
      this.byId("taskList").getBinding("items").filter(aFilters);
    },

    onAdd: function () {
      this.byId("inTitle").setValue("").setValueState("None");
      this.byId("inDesc").setValue("");
      this.byId("selPriority").setSelectedKey("Medium");
      this.byId("inDue").setValue("");
      this.byId("inAssignee").setValue("");
      this.byId("taskDialog").open();
    },

    onCancel: function () { this.byId("taskDialog").close(); },

    onSave: function () {
      var that = this;
      var sTitle = this.byId("inTitle").getValue().trim();
      if (!sTitle) { this.byId("inTitle").setValueState("Error"); MessageToast.show(this._t("titleRequired")); return; }
      var oBinding = this.byId("taskList").getBinding("items");
      var oCtx = oBinding.create({
        title: sTitle,
        description: this.byId("inDesc").getValue(),
        priority: this.byId("selPriority").getSelectedKey(),
        status: "Open",
        dueDate: this.byId("inDue").getValue() || null,
        assignee: this.byId("inAssignee").getValue()
      });
      oCtx.created().then(function () {
        that.byId("taskDialog").close();
        MessageToast.show(that._t("created"));
        oBinding.refresh();
        that._loadSummary();
      }).catch(function (e) { if (!e.canceled) { that._error(e); } });
    },

    onSetStatus: function (oEvent) {
      var that = this, oCtx = this._selectedContext();
      if (!oCtx) { return; }
      var sStatus = oEvent.getSource().data("status");
      var oOp = this.getView().getModel().bindContext("TaskService.setStatus(...)", oCtx);
      oOp.setParameter("status", sStatus);
      oOp.execute().then(function () {
        MessageToast.show(that._t("updated"));
        that.byId("taskList").getBinding("items").refresh();
        that._loadSummary();
      }).catch(function (e) { that._error(e); });
    },

    onDelete: function () {
      var that = this, oCtx = this._selectedContext();
      if (!oCtx) { return; }
      MessageBox.confirm(this._t("confirmDelete"), {
        onClose: function (a) {
          if (a === MessageBox.Action.OK) {
            oCtx.delete().then(function () {
              MessageToast.show(that._t("deleted"));
              that._loadSummary();
            }).catch(function (e) { that._error(e); });
          }
        }
      });
    }
  });
});
