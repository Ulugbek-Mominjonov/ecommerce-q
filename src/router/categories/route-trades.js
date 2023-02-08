 const pages = [
   {
     path: "/user-trades",
     name: "UserTrades",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageUserTrades.vue"),
     meta:{
       title: "Фойдаланувчи савдолари",
       icon: 'mdi-account-cash-outline'
     }
   },
   {
     path: "/supplier-trades",
     name: "SupplierTrades",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSupplierTrades.vue"),
     meta:{
       title: "Таъминотчи савдолари",
       icon: 'mdi-truck-outline'
     }
   },
   {
     path: "/customer-trades",
     name: "CutomerTrades",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomerTrades.vue"),
     meta:{
       title: "Харидор савдолари",
       icon: 'mdi-account-outline'
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
