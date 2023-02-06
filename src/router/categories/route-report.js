 const pages = [
   {
     path: "/report-users",
     name: "reportUsers",
     show: true,
     component: ()=> import("../../pages/UserCabinet/PageReportUsers.vue"),
     meta:{
       title: "Foydalanuvchilar hisoboti",
       icon: 'mdi-file-document-outline'
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
