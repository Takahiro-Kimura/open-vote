import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import type { Poll } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const [_, setLocation] = useLocation();

  const totalVotes = poll.options.reduce((sum, option) => sum + (Number(option.votes) || 0), 0);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-bold">{poll.question}</h3>
        <p className="text-sm text-muted-foreground">
          {poll.endTime && Number(poll.endTime.toString()) > new Date().getTime()
            ? `${formatDistanceToNow(new Date(Number(poll.endTime.toString())))} left`
            : 'Voting ended'}
        </p>
        <p className="text-sm text-muted-foreground">Total votes: {totalVotes}</p>
      </CardHeader>
      <CardContent>
        
        <div className="flex flex-col gap-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? ((Number(option.votes) || 0) / totalVotes) * 100 : 0;

            return (
              <div key={option.text} className="flex justify-between items-center">
                <span>{option.text}</span>
                <span className="text-sm text-muted-foreground">
                  {option.votes.toString()} votes ({percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setLocation(`/poll/${poll.id}`)} className="w-full">
          View Poll
        </Button>
      </CardFooter>
    </Card>
  );
}
