import main_sprav from "src/router/categories/route-main-sprav";
import main from "src/router/categories/route-main";
import main_transactions from "src/router/categories/route-transactions";
import main_trades from "src/router/categories/route-trades";
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    ]
  },
  main_sprav,
  main,
  main_transactions,
  main_trades,

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404')
  }
]



export default routes
