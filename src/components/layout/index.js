import React from "react"

import Header from './Header'
//import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = () => {
    return (
        <>
            <Header />
            {/* <Navbar /> */}
            <Sidebar />
            <Footer />
        </>
    )
}

export default Layout;