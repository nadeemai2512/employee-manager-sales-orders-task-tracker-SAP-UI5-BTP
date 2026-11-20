# task-tracker - Task Tracker

SAP BTP project: **CAP (Node.js) backend** + **SAPUI5 frontend**.

## Run locally (Node.js 18+, internet needed for UI5 libraries from ui5.sap.com)
    npm install
    npm start
Open http://localhost:4004/tasks/webapp/index.html
(in-memory SQLite, sample data loaded automatically, mocked auth - no login needed)

## Features
- IconTabBar by status (All / Open / In Progress / Done) with live counts
- Create tasks with priority, due date and assignee; Start / Complete / Reopen via bound action setStatus
- Overdue indicator from OData function summary(); delete with confirmation

## Structure
- db/ - CDS data model + sample CSV data
- srv/ - OData V4 service (/odata/v4/tasks) + business logic
- app/tasks/webapp/ - SAPUI5 app (manifest, views, controllers, fragments, i18n)
- approuter/, xs-security.json, mta.yaml - BTP Cloud Foundry deployment (HANA + XSUAA)

## Deploy to SAP BTP (Cloud Foundry)
    npm install -g @sap/cds-dk mbt
    cf login
    npm run build
    npm run deploy
Needs SAP HANA Cloud + XSUAA entitlements. Build on Mac/Linux/WSL.
