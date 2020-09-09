import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Team from "../views/Team.vue";
import CreateWO from "../views/WorkOrders/CreateWO.vue";
import OverviewWO from "../views/WorkOrders/OverviewWO.vue";
import Customers from "../views/Customers.vue";
import Test1 from "../views/Test1.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/Projects",
    name: "Projects",
    component: Projects
  },
  {
    path: "/Team",
    name: "Team",
    component: Team
  },
  {
    path: "/CreateWO",
    name: "CreateWO",
    component: CreateWO
  },
  {
    path: "/OverviewWO",
    name: "OverviewWO",
    component: OverviewWO
  },
  {
    path: "/Customers",
    name: "Customers",
    component: Customers
  },
  {
    path: "/Test1",
    name: "Test1",
    component: Test1
  },
  {
    path: "*",
    name: "Wild",
    component: Dashboard
  }
];
// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
