import { useQuery } from '@tanstack/react-query';
import { PollCard } from '@/components/polls/PollCard';
import { queries } from '@/lib/queries';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function MyPolls() {
  const { principal, login } = useAuth();
  const { data: polls, isLoading } = useQuery(queries.userPolls(principal));

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">My Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!principal ? (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="mb-4">Please log in to display your polls.</p>
            <Button onClick={() => login()}>
              Login to display your polls
            </Button>
          </div>
        ) : isLoading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))
        ) : (
          polls?.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))
        )}
      </div>
    </div>
  );
}
