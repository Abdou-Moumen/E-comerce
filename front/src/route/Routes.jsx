import React, { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Dynamically import components
const Home = lazy(() => import("../pages/client/Home.jsx"));
const Client = lazy(() => import("../pages/client/Client.jsx"));
const ProductDetails = lazy(() => import("../pages/client/ProductDetails.jsx"));
const CartPage = lazy(() => import("../pages/client/CartPage.jsx"));
const AppLayout = lazy(() => import("../pages/Shared/AppLayout.jsx"));
const Product = lazy(() => import("../pages/admin/Product/Product.jsx"));
const AddProduct = lazy(() => import("../pages/admin/Product/AddProduct.jsx"));
const EditProduct = lazy(() =>
  import("../pages/admin/Product/EditProduct.jsx")
);
const Dashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));
const Employee = lazy(() => import("../pages/admin/Employee/Employee.jsx"));
const AddEmployee = lazy(() =>
  import("../pages/admin/Employee/AddEmployee.jsx")
);
const EditEmployee = lazy(() => import("../pages/admin/Employee/EditEmployee.jsx"))

const Order = lazy(() => import("../pages/admin/Order/Order.jsx"));
const AddOrder = lazy(() => import("../pages/admin/Order/EditOrder.jsx"));
const Log = lazy(() => import("../pages/admin/Log.jsx"));
const Login = lazy(() => import("../pages/admin/Login.jsx"));
const OrderCompleted = lazy(() => import("../pages/client/OrderCompleted.jsx"));

// Define a LoadingScreen component for the fallback
import LoadingScreen from "../components/commun/LoadingScreen.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ProductDetails />
      </Suspense>
    ),
  },
  {
    path: "/orderCompleted/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <OrderCompleted />
      </Suspense>
    ),
  },
  {
    path: "/panier/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/admin/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        // Protected route for employee and admin
        element: <ProtectedRoute roles={["employee", "admin"]} />,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Dashboard />
              </Suspense>
            ),
          },
          //1-Product Page
          {
            path: "product",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Product />
              </Suspense>
            ),
          },
          {
            path: "product/add",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <AddProduct />
              </Suspense>
            ),
          },
          {
            path: "product/edit/:id",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <EditProduct />
              </Suspense>
            ),
          },
          {
            path: "order",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: "order/edit/:id",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <AddOrder />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [
          {
            path: "employee",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Employee />
              </Suspense>
            ),
          },
          {
            path: "employee/add",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <AddEmployee />
              </Suspense>
            ),
          },
          {
            path: "employee/edit/:id",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <EditEmployee />
              </Suspense>
            ),
          },
          {
            path: "log",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Log />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
