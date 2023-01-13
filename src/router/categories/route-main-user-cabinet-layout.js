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
     path: "/ware-house",
     name: "ware-house",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageWareHouse"),
     meta:{
       title: "Omborxona",
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
