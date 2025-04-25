
import { useState } from "react";
import { Bell, User, Store } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [currentBranch, setCurrentBranch] = useState("Main Branch");
  
  // Temporary branches data - would come from an API/context in real implementation
  const branches = [
    { id: 1, name: "Main Branch" },
    { id: 2, name: "Branch 2" },
    { id: 3, name: "Branch 3" }
  ];

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">Offline POS Pro</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Store size={16} />
              <span>{currentBranch}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {branches.map(branch => (
              <DropdownMenuItem 
                key={branch.id} 
                onClick={() => setCurrentBranch(branch.name)}
                className="cursor-pointer"
              >
                {branch.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 text-sm font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-gray-500">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
