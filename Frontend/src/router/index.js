import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";

//pages
import Settings from "../views/adminViews/Settings.vue";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Employees from "../views/Employees.vue";
import WorkOrderForum from "../views/WorkOrders/WorkOrderForum.vue";
import OverviewWO from "../views/WorkOrders/OverviewWO.vue";
import Customers from "../views/Customers.vue";
import Jobs from "../views/Jobs.vue";
import Home from "../views/userViews/Home.vue";
import SingleWorkOrder from "../views/WorkOrders/SingleWO.vue";
import TimeManager from "../views/TimeManager.vue";
import TimeSheets from "../views/timeSheets/TimeHome.vue";
import TimeCalendar from "../views/timeSheets/TimeCalendar.vue";
import TimeList from "../views/timeSheets/TimeList.vue";
import RegisterUser from "../views/RegisterUser.vue";
import Login from "../views/Login.vue";
import Test from "../views/test.vue";
import ErrorPage from "../views/ErrorPage.vue";
import Profile from "../views/Profile.vue";
import UserManagement from "../views/adminViews/UserManagement.vue";

//Router for routes
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Base",
    component: Dashboard,
    meta: { requiresAdmin: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAdmin: true },
  },
  { path: "/Projects", name: "Projects", component: Projects, meta: { requiresAdmin: true } },
  {
    path: "/Employees",
    name: "Employees",
    component: Employees,
    meta: { requiresAdmin: true },
  },
  //todo Change this to modifyWO's

  {
    path: "/WorkOrderForum",
    name: "WorkOrderForum",
    component: WorkOrderForum,
    meta: { workOrderAuth: true },
  },
  {
    path: "/WorkOrders",
    name: "OverviewWO",
    component: OverviewWO,
    meta: { requiresAdmin: true },
  },
  {
    path: "/Customers",
    name: "Customers",
    component: Customers,
    meta: { customersAuth: true },
  },
  {
    path: "/Jobs",
    name: "Jobs",
    component: Jobs,
    meta: { jobsAuth: true },
  },
  { path: "/Home", name: "Home", component: Home, meta: { requiresAuth: true } },
  {
    path: "/WorkOrders/:id",
    name: "SingleWorkOrder",
    component: SingleWorkOrder,
    meta: { requiresAuth: true },
  },
  {
    path: "/test",
    name: "test",
    component: Test,
    meta: { requiresAuth: true },
  },
  {
    path: "/TimeManager",
    name: "TimeManager",
    component: TimeManager,
    meta: { requiresAdmin: true },
  },
  {
    path: "/RegisterUser",
    name: "RegisterUser",
    component: RegisterUser,
    meta: { requiresAdmin: true },
  },
  {
    path: "/UserManagement",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAdmin: true },
  },
  {
    path: "/TimeSheets",
    name: "TimeSheets",
    component: TimeSheets,
    meta: { timesheetAuth: true },
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
    component: Login,
  },
  {
    path: "/ErrorPage",
    name: "ErrorPage",
    component: ErrorPage,
  },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/Settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAdmin: true },
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
    props: true,
    meta: { requiresAuth: true },
  },
];

// route level code-splitting // this generates a separate chunk (about.[hash].js) for this route // which is lazy-loaded when the route is visited.
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//specific page protection calendars

router.beforeEach(async (to, from, next) => {
  store.dispatch("autoLogin").then(async () => {
    let access;
    let settings;
    if (store.state.settings.permissions) {
      settings = store.state.settings;
      access = settings.permissions.access;
    }
    let userRole = store.state.userRole;

    //Admin Only
    if (to.matched.some((route) => route.meta.requiresAdmin)) {
      if (store.state.userRole === "admin") {
        return next();
      } else {
        return next("/login");
      }
    }
    //User Only
    if (to.matched.some((route) => route.meta.requiresUser)) {
      if (userRole === "User") {
        return next();
      } else {
        return next("/login");
      }
    }

    //User or admin
    if (to.matched.some((route) => route.meta.requiresAuth)) {
      if (store.state.userRole) {
        return next();
      } else {
        return next("/login");
      }
    }

    //Timesheet auth
    if (to.matched.some((route) => route.meta.timesheetAuth)) {
      if (!store.state.settings.permissions) {
        return next("/login");
      }
      if (
        access.accessTimeSheet.roles.indexOf(store.state.userRole) > -1 ||
        store.state.userRole === "admin"
      ) {
        return next();
      }
      return next("/login");
    }

    // view jobs auth
    if (to.matched.some((route) => route.meta.jobsAuth)) {
      if (!store.state.settings.permissions) {
        return next("/login");
      }
      if (
        access.accessJobs.roles.indexOf(store.state.userRole) > -1 ||
        store.state.userRole === "admin"
      ) {
        return next();
      }

      return next("/login");
    }

    // view customers Auth
    if (to.matched.some((route) => route.meta.customersAuth)) {
      if (!store.state.settings.permissions) {
        return next("/login");
      }
      if (
        access.accessCustomers.roles.indexOf(store.state.userRole) > -1 ||
        store.state.userRole === "admin"
      ) {
        return next();
      }
      return next("/login");
    }

    // view customers Auth
    if (to.matched.some((route) => route.meta.workOrderAuth)) {
      if (!store.state.settings.permissions) {
        return next("/login");
      }
      if (
        access.createWorkOrder.roles.indexOf(store.state.userRole) > -1 ||
        store.state.userRole === "admin"
      ) {
        return next();
      }
      return next("/login");
    }

    next();
  });
});

export default router;
