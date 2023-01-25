 const pages = [
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
     path: "/suppliers-transactions",
     name: "suppliersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSuppliersTransactions.vue"),
     meta:{
       title: "Tranzaksiyalar (yetkazib beruvchilar)",
       icon: 'mdi-file-document-outline'
     }
   },

   {
     path: "/cutomers-transactions",
     name: "CustomersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomersTransactions.vue"),
     meta:{
       title: "Tranzaksiyalar (Xaridorlar)",
       icon: 'mdi-file-document-outline'
     }
   },
]

const main_transactions = {
  path: '/main-transactions',
  name: 'main-transactions',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_transactions;
