 const pages = [
   {
      path: "/worker-types",
      name: "worker-types",
      show: true,
      component: ()=> import("pages/UserCabinet/PageWorkerTypes.vue"),
      meta:{
        title: "Ходим турлари",
        icon: 'mdi-account-outline'
      }
    },
   {
     path: "/measure-types",
     name: "MeasureTypes",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageMeasureTypes.vue"),
     meta:{
       title: "xshop_captions.l_measure_types",
       icon: 'mdi-counter'
     }
   },
]

const main_sprav = {
  path: '/main-sprav',
  name: 'main-sprav',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_sprav;
