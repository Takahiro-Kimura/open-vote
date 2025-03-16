import { useQuery } from '@tanstack/react-query';
import { PollCard } from '@/components/polls/PollCard';
import { queries } from '@/lib/queries';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyPolls() {
  const { principal } = useAuth();
  const { data: polls, isLoading } = useQuery(queries.userPolls(principal));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">My Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls?.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}