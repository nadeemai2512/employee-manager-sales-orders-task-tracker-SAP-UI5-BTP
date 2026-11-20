# sales-orders - Sales Order Management

SAP BTP project: **CAP (Node.js) backend** + **SAPUI5 frontend**.

## Run locally (Node.js 18+, internet needed for UI5 libraries from ui5.sap.com)
    npm install
    npm start
Open http://localhost:4004/orders/webapp/index.html
(in-memory SQLite, sample data loaded automatically, mocked auth - no login needed)

## Features
- Order list to order detail (UI5 routing, master/detail navigation)
- Create order with deep insert (header + item); order number, item amounts and total calculated on the server
- Bound actions: submitOrder, cancelOrder (state rules enforced, 409 on invalid transition)

## Structure
- db/ - CDS data model + sample CSV data
- srv/ - OData V4 service (/odata/v4/sales) + business logic
- app/orders/webapp/ - SAPUI5 app (manifest, views, controllers, fragments, i18n)
- approuter/, xs-security.json, mta.yaml - BTP Cloud Foundry deployment (HANA + XSUAA)

## Deploy to SAP BTP (Cloud Foundry)
    npm install -g @sap/cds-dk mbt
    cf login
    npm run build
    npm run deploy
Needs SAP HANA Cloud + XSUAA entitlements. Build on Mac/Linux/WSL.
