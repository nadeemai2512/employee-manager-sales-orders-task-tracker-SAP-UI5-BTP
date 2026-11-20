# employee-manager - HR Employee Manager

SAP BTP project: **CAP (Node.js) backend** + **SAPUI5 frontend**.

## Run locally (Node.js 18+, internet needed for UI5 libraries from ui5.sap.com)
    npm install
    npm start
Open http://localhost:4004/employees/webapp/index.html
(in-memory SQLite, sample data loaded automatically, mocked auth - no login needed)

## Features
- Employee list with department, search by name/e-mail, filter by department
- Add / edit (dialog with department select, date picker, active switch) / delete
- Live statistics (total, active, average salary) from OData function stats()
- Server validation (e-mail format, non-negative salary)

## Structure
- db/ - CDS data model + sample CSV data
- srv/ - OData V4 service (/odata/v4/hr) + business logic
- app/employees/webapp/ - SAPUI5 app (manifest, views, controllers, fragments, i18n)
- approuter/, xs-security.json, mta.yaml - BTP Cloud Foundry deployment (HANA + XSUAA)

## Deploy to SAP BTP (Cloud Foundry)
    npm install -g @sap/cds-dk mbt
    cf login
    npm run build
    npm run deploy
Needs SAP HANA Cloud + XSUAA entitlements. Build on Mac/Linux/WSL.
