sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Fragment, Filter, FilterOperator, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.demo.employees.controller.Main", {

    onInit: function () {
      this.getView().setModel(new JSONModel({ total: 0, active: 0, avgSalary: 0 }), "stats");
      this.getView().setModel(new JSONModel({}), "form");
      this._searchQuery = "";
      this._deptKey = "";
      this._loadStats();
    },

    _t: function (k) { return this.getView().getModel("i18n").getResourceBundle().getText(k); },

    _loadStats: function () {
      var oStats = this.getView().getModel("stats");
      this.getView().getModel().bindContext("/stats()").requestObject().then(function (o) {
        oStats.setData(o);
      }).catch(function () { /* stats are optional */ });
    },

    _selectedContext: function () {
      var oItem = this.byId("empTable").getSelectedItem();
      if (!oItem) { MessageToast.show(this._t("selectOne")); return null; }
      return oItem.getBindingContext();
    },

    _error: function (e) { MessageBox.error((e && e.message) || this._t("errorGeneric")); },

    _applyFilters: function () {
      var aFilters = [];
      if (this._deptKey) { aFilters.push(new Filter("department_ID", FilterOperator.EQ, this._deptKey)); }
      if (this._searchQuery) {
        aFilters.push(new Filter({
          filters: [
            new Filter("firstName", FilterOperator.Contains, this._searchQuery),
            new Filter("lastName", FilterOperator.Contains, this._searchQuery),
            new Filter("email", FilterOperator.Contains, this._searchQuery)
          ], and: false
        }));
      }
      this.byId("empTable").getBinding("items").filter(aFilters);
    },

    onSearch: function (oEvent) { this._searchQuery = oEvent.getParameter("query"); this._applyFilters(); },

    onDeptFilter: function (oEvent) {
      var oItem = oEvent.getParameter("selectedItem");
      this._deptKey = oItem ? oItem.getKey() : "";
      this._applyFilters();
    },

    _openDialog: function () {
      var oView = this.getView();
      if (!this._pDialog) {
        this._pDialog = Fragment.load({ id: oView.getId(), name: "com.demo.employees.fragment.EmployeeDialog", controller: this })
          .then(function (d) { oView.addDependent(d); return d; });
      }
      return this._pDialog.then(function (d) { d.open(); });
    },

    onAdd: function () {
      this._editCtx = null;
      this.getView().getModel("form").setData({
        title: this._t("addEmployee"), firstName: "", lastName: "", email: "", jobTitle: "",
        department_ID: "", salary: "", joiningDate: null, active: true
      });
      this._openDialog();
    },

    onEdit: function () {
      var oCtx = this._selectedContext();
      if (!oCtx) { return; }
      var o = oCtx.getObject();
      this._editCtx = oCtx;
      this.getView().getModel("form").setData({
        title: this._t("editEmployee"), firstName: o.firstName, lastName: o.lastName, email: o.email || "",
        jobTitle: o.jobTitle || "", department_ID: o.department_ID || "", salary: o.salary, joiningDate: o.joiningDate,
        active: !!o.active
      });
      this._openDialog();
    },

    onCancel: function () { this._pDialog.then(function (d) { d.close(); }); },

    onSave: function () {
      var that = this, f = this.getView().getModel("form").getData();
      if (!f.firstName.trim() || !f.lastName.trim()) { MessageBox.warning(this._t("fillRequired")); return; }
      var data = {
        firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email || null,
        jobTitle: f.jobTitle || null, department_ID: f.department_ID || null,
        salary: f.salary === "" || f.salary === null ? null : String(parseFloat(f.salary)),
        joiningDate: f.joiningDate || null, active: !!f.active
      };
      var close = function () { that._pDialog.then(function (d) { d.close(); }); that._loadStats(); };

      if (this._editCtx) {
        var oCtx = this._editCtx;
        Object.keys(data).forEach(function (k) { oCtx.setProperty(k, data[k]); });
        this.getView().getModel().submitBatch("$auto").then(function () {
          MessageToast.show(that._t("updated")); close();
          that.byId("empTable").getBinding("items").refresh();
        }).catch(function (e) { that._error(e); });
      } else {
        var oCreated = this.byId("empTable").getBinding("items").create(data);
        oCreated.created().then(function () {
          MessageToast.show(that._t("created")); close();
          that.byId("empTable").getBinding("items").refresh();
        }).catch(function (e) { if (!e.canceled) { that._error(e); } });
      }
    },

    onDelete: function () {
      var that = this, oCtx = this._selectedContext();
      if (!oCtx) { return; }
      MessageBox.confirm(this._t("confirmDelete"), {
        onClose: function (a) {
          if (a === MessageBox.Action.OK) {
            oCtx.delete().then(function () { MessageToast.show(that._t("deleted")); that._loadStats(); })
              .catch(function (e) { that._error(e); });
          }
        }
      });
    }
  });
});
