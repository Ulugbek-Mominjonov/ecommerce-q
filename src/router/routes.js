import main_user_cabinet_layout from "src/router/categories/route-main-user-cabinet-layout";
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    ]
  },
  main_user_cabinet_layout,

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404')
  }
]



export default routes
