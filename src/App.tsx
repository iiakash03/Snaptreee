import {Routes,Route} from 'react-router-dom'
import './globals.css'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from "@/components/ui/toaster"

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  AllUsers,
} from '@/_root/pages/index'
import EditPost from './_root/pages/EditPost'
import PostDetails from './_root/pages/PostDetails'

const App = () => {

  return (
    <main className='flex h-screen'>
      <Routes>
        <Route element={<AuthLayout/>}>
        <Route path='/sign-in' element={<SigninForm/>} />
        <Route path='/sign-up' element={<SignupForm/>} />
        </Route>
        <Route element={<RootLayout/>}>
        <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/update-post/:id" element={<EditPost/>} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/posts/:id/*" element={<PostDetails />} />
        </Route>
      </Routes>
      <Toaster/>
    </main>
  )
}

export default App
