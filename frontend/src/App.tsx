import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import StudentSubmission from './pages/StudentSubmission';
import StudentDashboard from './pages/StudentDashboard';
import InstructorPanel from './pages/InstructorPanel';
import { Toaster } from '@/components/ui/sonner';

// Layout component with Navigation + Footer
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: StudentSubmission,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: StudentDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: InstructorPanel,
});

const routeTree = rootRoute.addChildren([homeRoute, submitRoute, dashboardRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
