import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart2, User, Home, ClockIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div className="flex items-center justify-between h-16 bg-header border-b border-header-border p-3">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold hidden md:inline">OpenVote</h1>
      </div>

      <nav className="flex items-center">
        <Link href="/">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === "/"
                ? "bg-header-accent text-header-accent-foreground"
                : "hover:bg-header-accent/50"
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
              location === "/completed-polls"
                ? "bg-header-accent text-header-accent-foreground"
                : "hover:bg-header-accent/50"
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
              location === "/create-poll"
                ? "bg-header-accent text-header-accent-foreground"
                : "hover:bg-header-accent/50"
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
              location === "/my-polls"
                ? "bg-header-accent text-header-accent-foreground"
                : "hover:bg-header-accent/50"
            }`}
          >
            <User className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">My Polls</span>
          </Button>
        </Link>
      
        <Link href="/my-votes">
          <Button
            variant="ghost"
            className={`justify-start ${
              location === "/my-votes"
                ? "bg-header-accent text-header-accent-foreground"
                : "hover:bg-header-accent/50"
            }`}
          >
            <User className="w-2 h-2 md:mr-0" />
            <span className="hidden md:inline">My Votes</span>
          </Button>
        </Link>
      </nav>
      {isAuthenticated ? (
        <Button onClick={logout}>Sign Out</Button>
      ) : (
        <Button onClick={login}>Sign in</Button>
      )}
    </div>
  );
}
