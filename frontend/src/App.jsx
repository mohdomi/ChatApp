import { useState , useEffect } from 'react'
import {Routes , Route} from 'react-router-dom'
import  HomePage from './routes/HomeButton'
import  SignUpPage from './routes/SignUpPage'
import  LogInPage from './routes/LogInPage'
import  SettingsPage from './routes/SettingsPage'
import  ProfilePage from './routes/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {LoaderPinwheel} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import NavBar from './components/NavBar'

function App() {

  const {authUser , checkAuth , isCheckingAuth , onlineUsers} = useAuthStore();

  useEffect(()=>{
    checkAuth()
  } , [checkAuth])

  console.log(authUser);

  console.log("Online Users : " , onlineUsers);

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <LoaderPinwheel className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div >
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LogInPage/> : <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />

      </Routes>

      <Toaster />
    </div>



  )
}

export default App
