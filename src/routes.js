import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import("./Demo/Dashboard/Default"));

const UIBasicButton = React.lazy(() =>
  import("./Demo/UIElements/Basic/Button")
);
const UIBasicBadges = React.lazy(() =>
  import("./Demo/UIElements/Basic/Badges")
);
const UIBasicBreadcrumbPagination = React.lazy(() =>
  import("./Demo/UIElements/Basic/BreadcrumbPagination")
);

const UIBasicCollapse = React.lazy(() =>
  import("./Demo/UIElements/Basic/Collapse")
);
const UIBasicTabsPills = React.lazy(() =>
  import("./Demo/UIElements/Basic/TabsPills")
);
const UIBasicBasicTypography = React.lazy(() =>
  import("./Demo/UIElements/Basic/Typography")
);

const FormsElements = React.lazy(() => import("./Demo/Forms/FormsElements"));

const BootstrapTable = React.lazy(() => import("./Demo/Tables/BootstrapTable"));

const Nvd3Chart = React.lazy(() => import("./Demo/Charts/Nvd3Chart/index"));

const GoogleMap = React.lazy(() => import("./Demo/Maps/GoogleMap/index"));

const OtherSamplePage = React.lazy(() => import("./Demo/Other/SamplePage"));
const OtherDocs = React.lazy(() => import("./Demo/Other/Docs"));
const Settings = React.lazy(() => import("./Containers/Settings"));
const Evaluation = React.lazy(() => import("./Containers/Evaluation"));
const RadarChart = React.lazy(() => import("./Containers/Dashboard"));
const Employees = React.lazy(() => import("./Employees"));
const Profile = React.lazy(() => import("./Profile"));
const Team = React.lazy(() => import("./Team"));
const Register = React.lazy(() => import("./Register"));
const EmployeeProfile = React.lazy(() => import("./EmployeeProfile"));
const TeamMemberProfile = React.lazy(() => import("./TeamMemberProfile"));
const Signout = React.lazy(() => import("./Signout"));

export const nonAdminRoutes = [
  {
    path: "/evaluation",
    exact: true,
    name: "Evaluation",
    component: Evaluation,
  },
  {
    path: "/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },
  {
    path: "/team",
    exact: true,
    name: "Team",
    component: Team,
  },
  {
    path: "/teamMemberProfile",
    exact: true,
    name: "Team Member Profile",
    component: TeamMemberProfile,
  },
  {
    path: "/signout",
    exact: true,
    name: "Sign out",
    component: Signout,
  },
  { path: "/docs", exact: true, name: "Documentation", component: OtherDocs },
];

export const routes = [
  // {
  //   path: "/dashboard/default",
  //   exact: true,
  //   name: "Default",
  //   component: DashboardDefault,
  // },
  {
    path: "/employees",
    exact: true,
    name: "Employees",
    component: Employees,
  },

  {
    path: "/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },

  {
    path: "/register",
    exact: true,
    name: "Register",
    component: Register,
  },
  {
    path: "/team",
    exact: true,
    name: "Team",
    component: Team,
  },
  {
    path: "/settings",
    exact: true,
    name: "Settings",
    component: Settings,
  },
  {
    path: "/evaluation",
    exact: true,
    name: "Evaluation",
    component: Evaluation,
  },
  {
    path: "/radar-chart",
    exact: true,
    name: "Radar Chart",
    component: RadarChart,
  },
  {
    path: "/signout",
    exact: true,
    name: "Sign out",
    component: Signout,
  },
  {
    path: "/employeeProfile",
    exact: true,
    name: "Employee Profile",
    component: EmployeeProfile,
  },
  {
    path: "/teamMemberProfile",
    exact: true,
    name: "Team Member Profile",
    component: TeamMemberProfile,
  },

  // {
  //   path: "/basic/button",
  //   exact: true,
  //   name: "Basic Button",
  //   component: UIBasicButton,
  // },
  // {
  //   path: "/basic/badges",
  //   exact: true,
  //   name: "Basic Badges",
  //   component: UIBasicBadges,
  // },
  // {
  //   path: "/basic/breadcrumb-paging",
  //   exact: true,
  //   name: "Basic Breadcrumb Pagination",
  //   component: UIBasicBreadcrumbPagination,
  // },
  // {
  //   path: "/basic/collapse",
  //   exact: true,
  //   name: "Basic Collapse",
  //   component: UIBasicCollapse,
  // },
  // {
  //   path: "/basic/tabs-pills",
  //   exact: true,
  //   name: "Basic Tabs & Pills",
  //   component: UIBasicTabsPills,
  // },
  // {
  //   path: "/basic/typography",
  //   exact: true,
  //   name: "Basic Typography",
  //   component: UIBasicBasicTypography,
  // },
  // {
  //   path: "/forms/form-basic",
  //   exact: true,
  //   name: "Forms Elements",
  //   component: FormsElements,
  // },
  // {
  //   path: "/tables/bootstrap",
  //   exact: true,
  //   name: "Bootstrap Table",
  //   component: BootstrapTable,
  // },
  // {
  //   path: "/charts/nvd3",
  //   exact: true,
  //   name: "Nvd3 Chart",
  //   component: Nvd3Chart,
  // },
  // {
  //   path: "/maps/google-map",
  //   exact: true,
  //   name: "Google Map",
  //   component: GoogleMap,
  // },
  // {
  //   path: "/sample-page",
  //   exact: true,
  //   name: "Sample Page",
  //   component: OtherSamplePage,
  // },

  // { path: "/docs", exact: true, name: "Documentation", component: OtherDocs },
];

// export default routes;
