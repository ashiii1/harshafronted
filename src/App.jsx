import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import appStore from "./Utils/appStore.js";
import AppLayout from "../src/AppLayout.jsx";
import HomeLayout from "./HomeLayout.jsx";
// import CreatorInbox from "./Components/explore/CreatorInbox.jsx";
import NotificationManager from "./Components/NotificationManager.jsx";
import { Toaster } from "react-hot-toast";
import NotificationsPage from "./Common/NotificationsPage.jsx";

const Home = lazy(() => import("./Components/Home/Home.jsx"));
const Error = lazy(() => import("./Common/Error.jsx"));
const Contact = lazy(() => import("./Common/Contact.jsx"));
const Workflow = lazy(() => import("./Common/Workflow.jsx"));
const About = lazy(() => import("./Common/About.jsx"));
const Signup = lazy(() => import("./Common/Signup.jsx"));
const RegisterPage = lazy(() => import("./Common/RegisterPage.jsx"));
const Leadership = lazy(() => import("./Common/Leadership.jsx"));
const ProfilePage = lazy(() => import("./Common/Profilepage.jsx"));
const PaymentPage = lazy(() => import("./Common/PaymentSection.jsx"));
const PaymentResultScreens = lazy(() => import("./Common/PaymentResult.jsx"));
const ChatScreen = lazy(() => import("./Common/ChatScreen.jsx"));
const PasswordReset = lazy(() => import("./Common/PasswordReset.jsx"));
const TestPage = lazy(() => import("./Common/Test.jsx"));
const CompanyDetailsPage = lazy(() =>
  import("./Components/Funding/CompanyDetailsPage.jsx")
);
const Connections = lazy(() => import("./Pages/Connections.jsx"));
const Discover = lazy(() => import("./Pages/Discover.jsx"));

const IdeasMainPage = lazy(() =>
  import("./Components/Ideas/IdeasMainPage.jsx")
);
const PostIdea = lazy(() => import("./Components/Ideas/PostIdea.jsx"));
const IdeaDescription = lazy(() =>
  import("./Components/Ideas/IdeaDescription.jsx")
);

const DashBoard = lazy(() => import("./Components/Funding/DashBoard.jsx"));
const FounderForm = lazy(() => import("./Components/Funding/FounderForm.jsx"));

const Postproject = lazy(() =>
  import("./Components/Collaboration/Postproject.jsx")
);
const DashBoardProjects = lazy(() =>
  import("./Components/Collaboration/DashBoardProjects.jsx")
);
const DescriptionProject = lazy(() =>
  import("./Components/Collaboration/DescriptionProject.jsx")
);

const JobsPage = lazy(() => import("./Components/Jobs/JobsPageLinkedin.jsx"));
const JobsDashBoard = lazy(() => import("./Components/Jobs/JobsDashBoard.jsx"));
const Jobs = lazy(() => import("./Components/Jobs/Jobs.jsx"));
const Freelancers = lazy(() => import("./Components/Jobs/Freelancers.jsx"));
const FreelancerRegistration = lazy(() =>
  import("./Components/Jobs/FreelancerRegistration.jsx")
);
const JobDescription = lazy(() =>
  import("./Components/Jobs/JobDescription.jsx")
);
const JobCreationForm = lazy(() =>
  import("./Components/Jobs/JobCreationForm.jsx")
);
const FreelancersExplore = lazy(() =>
  import("./Components/Jobs/FreelancersExplore.jsx")
);
const FreelancerProfile = lazy(() =>
  import("./Components/Jobs/FreelancerProfile.jsx")
);

const Explore = lazy(() => import("./Components/explore/Explore.jsx"));

const App = () => {
  return (
    <div>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <NotificationManager />
          <Toaster />
          <Suspense
            fallback={
              <div className="text-center mt-5 text-xl font-bold">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route path="/pitchideas" element={<IdeasMainPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/funding" element={<DashBoard />} />
                <Route
                  path="/collaboration/projects/:id"
                  element={<DescriptionProject />}
                />
                <Route path="/funding/register" element={<FounderForm />} />
                <Route path="/jobs/dashboard" element={<JobsDashBoard />} />
                <Route path="/jobs/create" element={<JobCreationForm />} />
                <Route path="/jobs/edit/:id" element={<JobCreationForm />} />
                <Route path="/linkedin-jobs" element={<JobsPage />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/freelancers" element={<FreelancersExplore />} />
                <Route
                  path="/freelancers/:id"
                  element={<FreelancerProfile />}
                />
                <Route
                  path="freelancer/register"
                  element={<FreelancerRegistration />}
                />
                <Route path="/connections" element={<Connections />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/collaboration" element={<DashBoardProjects />} />
                <Route
                  path="/collaboration/new-project"
                  element={<Postproject />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/ideas/postidea" element={<PostIdea />} />

                <Route path="/contact" element={<Contact />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/chat" element={<ChatScreen />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                {/* <Route path="/inbox" element={<CreatorInbox />} /> */}
              </Route>
              <Route path="/register" element={<TestPage />} />
              <Route path="*" element={<Error />} />
              <Route path="/signin" element={<Signup />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route
                path="/pitchideas/idea/:id"
                element={<IdeaDescription />}
              />
              <Route
                path="/companydetails/:id"
                element={<CompanyDetailsPage />}
              />
              <Route path="/jobs/job/:id" element={<JobDescription />} />

              <Route path="/workflow" element={<Workflow />} />
              <Route path="/payment" element={<PaymentPage />} />

              <Route
                path="/paymentTransaction"
                element={<PaymentResultScreens />}
              />
              <Route path="/home" element={<HomeLayout />}>
                <Route path="/home" element={<Home />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
