 const pages = [
   {
      path: "/worker-types",
      name: "worker-types",
      show: true,
      component: ()=> import("pages/UserCabinet/PageWorkerTypes.vue"),
      meta:{
        title: "Xodimlari turlari",
        icon: 'mdi-account'
      }
    },
   {
     path: "/workers",
     name: "workers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageWorkers.vue"),
     meta:{
       title: "Xodimlar",
       icon: 'mdi-file-document-outline'
     }
   },
   {
     path: "/users",
     name: "users",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageUsers.vue"),
     meta:{
       title: "xshop_captions.l_users",
       icon: 'mdi-file-document-outline'
     }
   },
   {
     path: "/founders",
     name: "founders",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageFounders.vue"),
     meta:{
       title: "xshop_captions.l_founders",
       icon: 'mdi-file-document-outline'
     }
   },

   {
     path: "/founders-transactions",
     name: "foundersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageFoundersTransactions.vue"),
     meta:{
       title: "xshop_captions.l_founder_transactions",
       icon: 'mdi-file-document-outline'
     }
   },

   {
     path: "/measure-types",
     name: "MeasureTypes",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageMeasureTypes.vue"),
     meta:{
       title: "xshop_captions.l_measure_types",
       icon: 'mdi-file-document-outline'
     }
   },
   {
     path: "/products",
     name: "Products",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageProducts.vue"),
     meta:{
       title: "xshop_captions.l_products",
       icon: 'mdi-file-document-outline'
     }
   },
   {
     path: "/suppliers",
     name: "Suppliers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSuppliers.vue"),
     meta:{
       title: "xshop_captions.l_suppliers",
       icon: 'mdi-file-document-outline'
     }
   },
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
]

const main_user_cabinet_layout = {
  path: '/main-user-cabinet-layout',
  name: 'main-user-cabinet-layout',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_user_cabinet_layout;
