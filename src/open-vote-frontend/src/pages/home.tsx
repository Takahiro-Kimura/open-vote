import { useQuery } from '@tanstack/react-query';
import { PollCard } from '@/components/polls/PollCard';
import { queries } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

export default function Home() {
  const [sortOrder, setSortOrder] = useState('endDate');

  const { data: initialPolls, isLoading, error } = useQuery({
    ...queries.polls,
    select: (data) => data?.filter(poll => poll.endTime && Number(poll.endTime.toString()) > new Date().getTime())
  });

  const [polls, setPolls] = useState(initialPolls);

  useEffect(() => {
    setPolls(initialPolls);
  }, [initialPolls]);

  if (error) {
    console.error('Error fetching polls:', error);
  }

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Active Polls</h1>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2">ソート:</label>
          <div className="space-x-2">
            <button
              className={`border rounded px-2 py-1 ${
                sortOrder === 'endDate' ? 'bg-[hsl(330_100%_90%)]' : ''
              }`}
              onClick={() => {
                setSortOrder('endDate');
                if (initialPolls) {
                  const sortedPolls = [...initialPolls];
                  sortedPolls.sort((a: any, b: any) => {
                    if (!a.endTime || !b.endTime) return 0;
                    return new Date(Number(a.endTime.toString())).getTime() - new Date(Number(b.endTime.toString())).getTime();
                  });
                  setPolls(sortedPolls);
                }
              }}
            >
              投票終了日
            </button>
            <button
              className={`border rounded px-2 py-1 ${
                sortOrder === 'votes' ? 'bg-[hsl(330_100%_90%)]' : ''
              }`}
              onClick={() => {
                setSortOrder('votes');
                if (initialPolls) {
                  const sortedPolls = [...initialPolls];
                  sortedPolls.sort((a: any, b: any) => {
                    const totalVotesA = a.options.reduce((acc: any, option: any) => acc + BigInt(option.votes), BigInt(0));
                    const totalVotesB = b.options.reduce((acc: any, option: any) => acc + BigInt(option.votes), BigInt(0));
                    return Number(totalVotesB - totalVotesA);
                  });
                  setPolls(sortedPolls);
                }
              }}
            >
              投票数
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls?.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
