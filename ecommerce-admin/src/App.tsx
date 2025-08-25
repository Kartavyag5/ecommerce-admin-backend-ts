// src/App.tsx
import { Layout } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import OrderItems from "./pages/Orderitems";
import CustomerCart from "./pages/CustomerCart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/StripeCheckoutForm";
import FailPage from "./components/Fail";
import SuccessPage from "./components/Success";
import Payments from "./pages/Payments";

const { Content } = Layout;

const App = () => {

  const location = useLocation();
  const isLoginRoute = location.pathname === '/';

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isLoginRoute && <Sidebar />}
      <Layout>
        <Content style={{ margin: "16px" }}>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/order-items" element={<OrderItems />} />
              <Route path="/cart-items" element={<CustomerCart />} />
              <Route path="/payment-fail" element={<FailPage />} />
              <Route path="/payment-success" element={<SuccessPage />} />
            </Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
