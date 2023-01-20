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
]

const main_transactions = {
  path: '/main-transactions',
  name: 'main-transactions',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_transactions;
