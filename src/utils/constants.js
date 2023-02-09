export const cfghttp = {
  BASE_TIMEOUT: 1 * 60 * 1000,
  UPLOAD_TIMEOUT: 2 * 60 * 1000,
  EXCEL_TIMEOUT: 3 * 60 * 1000,
  BG_TIMEOUT: 3 * 60 * 1000
}

export const prf = {
  BASE_API: 'http://localhost:8585/api/v1',
};

export const urls = {
  LOGIN: prf.BASE_API + "/login",
  ROLES: prf.BASE_API + "/roles",
  WORKER_TYPES: prf.BASE_API + "/worker-types",
  WORKERS: prf.BASE_API + "/workers",
  WORKER_SALARY: prf.BASE_API + "/worker-salaries",
  KASSA_OUTPUTS: prf.BASE_API + "/kassa-outputs",
  USERS: prf.BASE_API + "/users",
  FOUNDERS: prf.BASE_API + "/founders",
  MEASURE_TYPES: prf.BASE_API + "/measure-types",
  PRODUCTS: prf.BASE_API + "/products",
  SUPPLIERS: prf.BASE_API + "/suppliers",
  CUSTOMERS: prf.BASE_API + "/customers",
  STORES: prf.BASE_API + "/stores",


  // Trades
  SUPPLIER_TRADES: prf.BASE_API + "/supplier-trades",
  CUSTOMER_TRADES: prf.BASE_API + "/customer-trades",
  USER_TRADES: prf.BASE_API + "/user-trades",

  // transactions
  FOUNDERS_TRANSACTIONS: prf.BASE_API + "/founder-transactions",
  SUPPLIERS_TRANSACTIONS: prf.BASE_API + "/supplier-transactions",
  CUSTOMERS_TRANSACTIONS: prf.BASE_API + "/customer-transactions",
  USERS_TRANSACTIONS: prf.BASE_API + "/user-transactions",

  // report
  USER_REPORT: prf.BASE_API + "/report",
  DASHBOARD_CARD_INFO: prf.BASE_API + "/dashboard/card-info",
  DASHBOARD_DEBITOR_STORE: prf.BASE_API + "/dashboard/top-debtor-stores",
  DASHBOARD_DEBITOR_CUSTOMER: prf.BASE_API + "/dashboard/top-debtor-customers",
}
// 'http://65.108.83.140:8282/api/v1'
