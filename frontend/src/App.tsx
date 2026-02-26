import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import StudentSubmission from './pages/StudentSubmission';
import StudentDashboard from './pages/StudentDashboard';
import InstructorPanel from './pages/InstructorPanel';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useRef, useState } from 'react';

// Animated page wrapper that fades/slides in on route change
function AnimatedPage({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [key, setKey] = useState(pathname);
  const [animating, setAnimating] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setKey(pathname);
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 350);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <div
      key={key}
      className={animating ? 'animate-page-enter' : 'animate-fade-in'}
      style={{ animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

// Layout component with Navigation + Footer
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <AnimatedPage>
        <Outlet />
      </AnimatedPage>
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
