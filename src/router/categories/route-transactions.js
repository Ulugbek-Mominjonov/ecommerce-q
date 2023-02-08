 const pages = [
   {
     path: "/users-transactions",
     name: "usersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageUsersTransactions.vue"),
     meta:{
       title: "Фойдаланувчи транзаксиялри",
       icon: 'mdi-account-convert-outline'
     }
   },
   {
     path: "/founders-transactions",
     name: "foundersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageFoundersTransactions.vue"),
     meta:{
       title: "Таъсисчи транзаксиялари",
       icon: 'mdi-cash'
     }
   },

   {
     path: "/suppliers-transactions",
     name: "suppliersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSuppliersTransactions.vue"),
     meta:{
       title: "Таъминотчи транзаксиялари",
       icon: 'mdi-truck-outline'
     }
   },

   {
     path: "/cutomers-transactions",
     name: "customersTransactions",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomersTransactions.vue"),
     meta:{
       title: "Харидор транзаксиялри",
       icon: 'mdi-account-outline'
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
