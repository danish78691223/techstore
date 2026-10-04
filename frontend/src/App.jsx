import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import "./styles/global.css";

export default function App(){
 return <AuthProvider><CartProvider><BrowserRouter><Navbar/><Routes>
  <Route path="/" element={<Home/>}/><Route path="/products" element={<Products/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/cart" element={<Cart/>}/>
  <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/><Route path="/orders" element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
  <Route path="/admin" element={<ProtectedRoute admin><AdminLayout/></ProtectedRoute>}>
    <Route index element={<Dashboard/>}/><Route path="products" element={<AdminProducts/>}/><Route path="products/add" element={<AddProduct/>}/><Route path="products/:id/edit" element={<EditProduct/>}/><Route path="orders" element={<AdminOrders/>}/><Route path="analytics" element={<Analytics/>}/>
  </Route>
 </Routes><Footer/></BrowserRouter></CartProvider></AuthProvider>;
}