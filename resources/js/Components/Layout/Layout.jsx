import React, { useState } from 'react'
import { Sidebar } from '../sidebar';
import { Navbar } from '../navbar';

function Layout({children}) {
     const [activeSection, setActiveSection] = useState("dashboard");
  return (
    <div>
       <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="flex-1 flex">
        <aside className="fixed hidden h-full w-64 lg:block">
          <Sidebar setActiveSection={setActiveSection}  />
        </aside>
        <main className="flex-1 lg:pl-64">
          <Navbar className="lg:pl-64" setActiveSection={setActiveSection} />
          {children}
        </main>
      </div>
    </div>
    </div>
  )
}

export default Layout
