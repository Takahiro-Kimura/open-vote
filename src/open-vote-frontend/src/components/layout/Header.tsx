import { Link, useLocation } from 'wouter';
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { open_vote_backend } from "declarations/open-vote-backend";
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2, User, Home, ClockIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div className="flex items-center justify-between h-16 bg-header border-b border-header-border p-4">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold hidden md:inline">OpenVote</h1>
      </div>

      <nav className="flex items-center gap-4">
        <Link href="/">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === '/' ? 'bg-header-accent text-header-accent-foreground' : 'hover:bg-header-accent/50'
            }`}
          >
            <Home className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">Active Polls</span>
          </Button>
        </Link>

        <Link href="/completed-polls">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === '/completed-polls' ? 'bg-header-accent text-header-accent-foreground' : 'hover:bg-header-accent/50'
            }`}
          >
            <ClockIcon className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">Completed Polls</span>
          </Button>
        </Link>

        <Link href="/create-poll">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === '/create-poll' ? 'bg-header-accent text-header-accent-foreground' : 'hover:bg-header-accent/50'
            }`}
          >
            <PlusCircle className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">Create Poll</span>
          </Button>
        </Link>

        <Link href="/my-polls">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === '/my-polls' ? 'bg-header-accent text-header-accent-foreground' : 'hover:bg-header-accent/50'
            }`}
          >
            <User className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">My Polls</span>
          </Button>
        </Link>
      </nav>
      {isAuthenticated ? (
        <>
          <Button
            onClick={logout}
          >
            Sign Out
          </Button>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>{principal?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium leading-none">{principal}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (
        <Button
          onClick={login}
        >
          Sign in
        </Button>
      )}
    </div>
  );
}
