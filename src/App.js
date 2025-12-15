import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import CartScreen from './screens/CartScreen';
import OrderScreen from './screens/OrderScreen.js';
import PaymentScreen from './screens/PaymentScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            
            <Route path="/admin/manageproducts" element={<ProductListScreen />} />
            <Route path="/admin/product/create" element={<ProductCreateScreen />} />
            <Route path="/admin/product/:id" element={<ProductEditScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;