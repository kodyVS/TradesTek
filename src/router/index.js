import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Team from "../views/Team.vue";
import CreateWO from "../views/WorkOrders/CreateWO.vue";
import OverviewWO from "../views/WorkOrders/OverviewWO.vue";
import Customers from "../views/Customers.vue";
import Jobs from "../views/Jobs.vue";
import Test1 from "../views/Test1.vue";
import SingleWorkOrder from "../views/WorkOrders/SingleWO.vue";
import TimeManager from "../views/TimeManager.vue";
import TimeSheets from "../views/timeSheets/TimeHome.vue";
import TimeCalendar from "../views/timeSheets/TimeCalendar.vue";
import TimeList from "../views/timeSheets/TimeList.vue";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  { path: "/Projects", name: "Projects", component: Projects },
  {
    path: "/Team",
    name: "Team",
    component: Team,
  },
  {
    path: "/CreateWO",
    name: "CreateWO",
    component: CreateWO,
  },
  {
    path: "/WorkOrders",
    name: "OverviewWO",
    component: OverviewWO,
  },
  {
    path: "/Customers",
    name: "Customers",
    component: Customers,
  },
  {
    path: "/Jobs",
    name: "Jobs",
    component: Jobs,
  },
  { path: "/Test1", name: "Test1", component: Test1 },
  {
    path: "/WorkOrders/:id",
    name: "SingleWorkOrder",
    component: SingleWorkOrder,
  },
  {
    path: "/TimeManager",
    name: "TimeManager",
    component: TimeManager,
  },
  {
    path: "/TimeSheets",
    name: "TimeSheets",
    component: TimeSheets,
    children: [
      {
        path: "Calendar",
        name: "TimeCalendar",
        component: TimeCalendar,
      },
      {
        path: "List",
        name: "TimeList",
        component: TimeList,
      },
    ],
  },
  {
    path: "*",
    name: "Wild",
    component: Dashboard,
  },
];
// route level code-splitting // this generates a separate chunk (about.[hash].js) for this route // which is lazy-loaded when the route is visited.
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
export default router;
