import { createRouter, createWebHistory } from "vue-router";
import DomainHomePage from "../pages/DomainHomePage.vue";
import DomainDetailPage from "../pages/DomainDetailPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: DomainHomePage
    },
    {
      path: "/domain/:domainKey",
      name: "domain-detail",
      component: DomainDetailPage
    }
  ]
});

export default router;
