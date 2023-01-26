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

  // transactions
  FOUNDERS_TRANSACTIONS: prf.BASE_API + "/founder-transactions",
  SUPPLIERS_TRANSACTIONS: prf.BASE_API + "/supplier-transactions",
  CUSTOMERS_TRANSACTIONS: prf.BASE_API + "/customer-transactions",
}
// 'http://65.108.83.140:8282/api/v1'
