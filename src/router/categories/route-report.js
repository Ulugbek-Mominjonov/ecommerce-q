 const pages = [
   {
     path: "/report-users",
     name: "reportUsers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportUsers.vue"),
     meta:{
       title: "Тарқатувчилар ҳисоботи",
       icon: 'mdi-book-account-outline'
     }
   },

   {
     path: "/report-store",
     name: "reportStore",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportStore.vue"),
     meta:{
       title: "Омборчилар ҳисоботи",
       icon: 'mdi-checkbook'
     }
   },

   {
     path: "/report-supliers",
     name: "reportSupliers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportSupliers.vue"),
     meta:{
       title: "Таъминотчилар ҳисоботи",
       icon: 'mdi-notebook-check-outline'
     }
   },

   {
     path: "/report-customers",
     name: "reportCustomers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportCustomers.vue"),
     meta:{
       title: "Харидорлар ҳисботи",
       icon: 'mdi-bookshelf'
     }
   },

   {
     path: "/report-stores",
     name: "reportStores",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportStores.vue"),
     meta:{
       title: "Дўконлар ҳисоботи",
       icon: 'mdi-note-text-outline'
     }
   },

]

const main_reports = {
  path: '/main-reports',
  name: 'main-reports',
  component: ()=> import('../../pages/UserCabinet/UserCabinet'),
  children: pages,
}

export default main_reports;
