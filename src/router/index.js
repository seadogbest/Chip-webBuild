import { createRouter, createWebHistory } from "vue-router";
import DomainHomePage from "../pages/DomainHomePage.vue";
import DomainDetailPage from "../pages/DomainDetailPage.vue";
import ChipCategoryPage from "../pages/ChipCategoryPage.vue";

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
    },
    {
      path: "/chip-category/:categoryKey",
      name: "chip-category",
      component: ChipCategoryPage
    }
  ]
});

export default router;
