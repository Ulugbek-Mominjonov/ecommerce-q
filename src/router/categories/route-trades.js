 const pages = [
   {
     path: "/supplier-trades",
     name: "SupplierTrades",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSupplierTrades.vue"),
     meta:{
       title: "xshop_captions.l_supplier_trades",
       icon: 'mdi-file-document-outline'
     }
   },
   {
     path: "/customer-trades",
     name: "CutomerTrades",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomerTrades.vue"),
     meta:{
       title: "Xaridor xaridlari",
       icon: 'mdi-file-document-outline'
     }
   },
]

const main_trades = {
  path: '/main-transactions',
  name: 'main-transactions',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_trades;
