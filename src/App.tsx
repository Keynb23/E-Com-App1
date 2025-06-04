import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home/Home';
import Profile from './pages/Profile';
import Cart from './components/Cart/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import CRUD from './pages/crud/crud';

{/* test */}

function App() {

  const client = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ProductProvider>
          <AuthProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/crud' element={<CRUD />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ProductProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;