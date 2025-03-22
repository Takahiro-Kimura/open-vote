import { Link, useLocation } from 'wouter';
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { open_vote_backend } from "declarations/open-vote-backend";
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2, User, Home, ClockIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Sidebar() {
  const [location] = useLocation();
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border p-4 justify-between">
      <div className="flex items-center gap-2 mb-8">
        <BarChart2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">OpenVote</h1>
      </div>

      <nav className="flex-1">
        <Link href="/">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              location === '/' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Active Polls
          </Button>
        </Link>

        <Link href="/completed-polls">
          <Button
            variant="ghost"
            className={`w-full justify-start mt-2 ${
              location === '/completed-polls' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <ClockIcon className="w-5 h-5 mr-2" />
            Completed Polls
          </Button>
        </Link>

        <Link href="/create-poll">
          <Button
            variant="ghost"
            className={`w-full justify-start mt-2 ${
              location === '/create-poll' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Poll
          </Button>
        </Link>

        <Link href="/my-polls">
          <Button
            variant="ghost"
            className={`w-full justify-start mt-2 ${
              location === '/my-polls' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            My Polls
          </Button>
        </Link>
      </nav>
      {isAuthenticated ? (
        <>
          <Button
            className="w-full mt-2"
            onClick={logout}
          >
            ログアウト
          </Button>
          <div className="absolute bottom-16 left-4 flex flex-col">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{principal?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">{principal}</p>
            </div>
          </div>
        </>
      ) : (
        <Button
          className="w-full mt-2"
          onClick={login}
        >
          ログイン
        </Button>
      )}
    </div>
  );
}
