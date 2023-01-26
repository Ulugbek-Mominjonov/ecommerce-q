 const pages = [
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
     path: "/customers",
     name: "Customers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageCustomers.vue"),
     meta:{
       title: "Xaridorlar",
       icon: 'mdi-file-document-outline'
     }
   },

   {
     path: "/map",
     name: "map",
     show: true,
     component: ()=> import("../../pages/UserCabinet/Map.vue"),
     meta:{
       title: "Xaridorlar",
       icon: 'mdi-file-document-outline'
     }
   },

   {
     path: "/stores",
     name: "stores",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageStores.vue"),
     meta:{
       title: "Dokonlar",
       icon: 'mdi-file-document-outline'
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
