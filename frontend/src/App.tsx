import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/footer';
import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import AdminRoute from './components/adminRoute';
import SigninScreen from './screens/signinScreen';
import SignupScreen from './screens/signupScreen';
import ProfileScreen from './screens/profileScreen';
import DashboardScreen from './screens/dashboardScreen';
import UserListScreen from './screens/userListScreen';
import UserEditScreen from './screens/userEditScreen';
import HomeScreen from './screens/homeScreen';
import { ToastContainer } from 'react-toastify';
import ImageUploadScreen from './screens/imageUploadScreen';
import ImageGalleryScreen from './screens/imageGalleryScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <ToastContainer position="bottom-center" limit={1} />
        <Navbar />
        <main className="">
          <Routes>
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/image/:id"
              element={
                <ProtectedRoute>
                  <ImageGalleryScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/uploadimage"
              element={
                <ProtectedRoute>
                  <ImageUploadScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
