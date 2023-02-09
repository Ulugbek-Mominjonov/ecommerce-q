 const pages = [
   {
     path: "/workers",
     name: "workers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageWorkers.vue"),
     meta:{
       title: "Ходимлар",
       icon: 'mdi-account-outline'
     }
   },
   {
     path: "/workers-salary",
     name: "workers-salary",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageWorkersSalary.vue"),
     meta:{
       title: "Ишчилар иш ҳақи",
       icon: 'mdi-account-cash-outline'
     }
   },
   {
     path: "/users",
     name: "users",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageUsers.vue"),
     meta:{
       title: "xshop_captions.l_users",
       icon: 'mdi-account-key-outline'
     }
   },

   {
     path: "/founders",
     name: "founders",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageFounders.vue"),
     meta:{
       title: "xshop_captions.l_founders",
       icon: 'mdi-cash'
     }
   },

   {
     path: "/suppliers",
     name: "Suppliers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageSuppliers.vue"),
     meta:{
       title: "xshop_captions.l_suppliers",
       icon: 'mdi-truck-outline'
     }
   },
   {
     path: "/customers",
     name: "Customers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomers.vue"),
     meta:{
       title: "Харидорлар",
       icon: 'mdi-account-cash-outline'
     }
   },
   {
     path: "/stores",
     name: "stores",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageStores.vue"),
     meta:{
       title: "Дўконлар",
       icon: 'mdi-store-outline'
     }
   },
   {
     path: "/products",
     name: "Products",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageProducts.vue"),
     meta:{
       title: "xshop_captions.l_products",
       icon: 'mdi-food-apple-outline'
     }
   },
]

const main = {
  path: '/main',
  name: 'main',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main;
