import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import { useSelector } from 'react-redux';

// importing pages components
import Home from './pages/home'
import Login from './pages/login'
import SignUp from './pages/signUp'
import About from './pages/about'
import ConfigNewUser from './pages/configNewUser';
import CreatePost from './pages/createPost';
import Friends from './pages/friends';
import Profile from './pages/profile'
import EditProfile from './pages/editProfile';



// Private Routing
const PrivateRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  console.log(user);
  return <Outlet />
}

function App() {
  const user = useSelector(state => state.user.user)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute user={user} />}>
          <Route path="/home" element={<Home />} />
          <Route path='/configNewUser' element={<ConfigNewUser/>} />
          <Route path='/createNewPost' element={<CreatePost/>} />
          <Route path='/friends' element={<Friends/>} />
          <Route path='/profile/:profile_id' element={<Profile/>} />
          <Route path='/editProfile/:profile_id' element={<EditProfile/>} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;