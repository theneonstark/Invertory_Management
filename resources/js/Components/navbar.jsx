import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { useState } from "react";

export function Navbar({ className, setActiveSection }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [activeSection, setActiveSection] = useState("dashboard")
  // console.log(activeSection);
  
  return (
    <header className={cn("sticky top-0 left-0 w-full z-50 flex h-16 items-center border-b bg-white shadow-md px-4 lg:px-6", className)}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <Sidebar setActiveSection={setActiveSection} />
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-4">
        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Toggle search</span>
        </Button>

        {/* Search Bar */}
        <div
          className={cn(
            "absolute left-0 top-16 w-full bg-white p-4 md:static md:block md:w-auto md:p-0",
            isSearchOpen ? "block" : "hidden"
          )}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-white pl-8 md:w-[300px]" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
