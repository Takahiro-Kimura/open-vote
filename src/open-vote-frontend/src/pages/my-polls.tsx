import { useQuery } from "@tanstack/react-query";
import { PollCard } from "@/components/polls/PollCard";
import { queries } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MyPolls() {
  const { principal, login, isAuthenticated } = useAuth();
  const { data: polls, isLoading } = useQuery(queries.userPolls(principal));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Polls</h1>
        {isAuthenticated && (
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>{principal?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-80">
                  <p className="text-sm font-medium leading-none">{principal}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!principal ? (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="mb-4">Please log in to display your polls.</p>
            <Button onClick={() => login()}>Login to display your polls</Button>
          </div>
        ) : isLoading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))
        ) : (
          polls?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center">
              <p className="mb-4">You don't have any polls yet. Create one now!</p>
            </div>
          ) : (
            polls?.map((poll) => <PollCard key={poll.id} poll={poll} />)
          )
        )}
      </div>
    </div>
  );
}
