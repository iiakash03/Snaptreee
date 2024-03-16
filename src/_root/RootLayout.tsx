import Bottombar from "@/shared/Bottombar"
import TopBar from "@/shared/TopBar"
import LeftSideBar from "@/shared/LeftSideBar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <TopBar/>
      <LeftSideBar/>
      <section className="flex flex-1 h-full">
        <Outlet/>
      </section>
      <Bottombar/>
    </div>
  )
}

export default RootLayout
