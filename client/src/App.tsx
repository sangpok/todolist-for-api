import LandingPage from '@Pages/LandingPage';
import MainPage from '@Pages/MainPage';

import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/home',
    element: <MainPage />,
  },
]);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
