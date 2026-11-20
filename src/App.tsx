import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from '@/components/Layout'
import { CalendarPage } from '@/pages/CalendarPage'
import { DriversPage } from '@/pages/DriversPage'
import { HomePage } from '@/pages/HomePage'
import { RacePage } from '@/pages/RacePage'

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/races/:round', element: <RacePage /> },
      { path: '/drivers', element: <DriversPage /> },
    ],
  },
]

export const App = () => <RouterProvider router={createBrowserRouter(routes)} />
