import { createBrowserRouter } from "react-router-dom";
import Home from "./Components/Home/Home.jsx";
import Error from "./Common/Error.jsx";
import Contact from "./Common/Contact.jsx";

import About from "./Common/About.jsx";
import Signup from "./Common/Signup.jsx";
import RegisterPage from "./Common/RegisterPage.jsx";
import Leadership from "./Common/Leadership.jsx";
import Profilepage from "./Common/Profilepage.jsx";

import IdeasMainPage from "./Components/Ideas/IdeasMainPage.jsx";
import PostIdea from "./Components/Ideas/PostIdea.jsx";
import IdeaDescription from "./Components/Ideas/IdeaDescription.jsx";

import DashBoard from "./Components/Funding/DashBoard.jsx";
import FounderForm from "./Components/Funding/FounderForm.jsx";

import Postproject from "./Components/Collaboration/Postproject.jsx";
import DashBoardProjects from "./Components/Collaboration/DashBoardProjects.jsx";
import DescriptionProject from "./Components/Collaboration/DescriptionProject.jsx";

import JobsPage from "./Components/Jobs/JobsPage.jsx";
import JobDescription from "./Components/Jobs/JobDescription.jsx";
import JobsDashBoard from "./Components/Jobs/JobsDashBoard.jsx";
import FreelancersDashboard from "./Components/Jobs/FreelancersDashboard.jsx";
import JobCreationForm from "./Components/Jobs/JobCreationForm.jsx";
import FreelancerProfile from "./Components/Jobs/FreelancerProfile.jsx";
import FreelancersExplore from "./Components/Jobs/FreelancersExplore.jsx";
import FreelancerRegistration from "./Components/Jobs/FreelancerRegistration.jsx";

import { AppLayout } from "./App.jsx";

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/pitchideas",
        element: <IdeasMainPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/funding",
        element: <DashBoard />,
      },
      {
        path: "/signin",
        element: <Signup />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/funding/register",
        element: <FounderForm />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/jobs/dashboard",
        element: <JobsDashBoard />,
      },
      {
        path: "/jobs/create",
        element: <JobCreationForm />,
      },
      {
        path: "/jobs/edit/:id",
        element: <JobCreationForm />,
      },
      {
        path: "/freelancers",
        element: <FreelancersExplore />,
      },
      {
        path: "/freelancers/dashboard",
        element: <FreelancersDashboard />,
      },
      {
        path: "/freelancers/:id",
        element: <FreelancerProfile />,
      },
      {
        path: "/freelancer/register",
        element: <FreelancerRegistration />,
      },
      {
        path: "/collaboration",
        element: <DashBoardProjects />,
      },
      {
        path: "/collaboration/postidea",
        element: <Postproject />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/leadership",
        element: <Leadership />,
      },
      {
        path: "/ideas/postidea",
        element: <PostIdea />,
      },
      {
        path: "/collaboration/projects/:id",
        element: <DescriptionProject />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/profile",
    element: <Profilepage />,
    errorElement: <Error />,
  },
  {
    path: "/pitchideas/idea/:id",
    element: <IdeaDescription />,
    errorElement: <Error />,
  },
  {
    path: "/jobs/job/:id",
    element: <JobDescription />,
    errorElement: <Error />,
  },
]);
