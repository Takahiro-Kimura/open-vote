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

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-bold">{poll.question}</h3>
        <p className="text-sm text-muted-foreground">
          {poll.endTime
            ? `${formatDistanceToNow(new Date(Number(poll.endTime)))} left`
            : '無期限'}
        </p>
      </CardHeader>
      <CardContent>
        
        <div className="flex flex-col gap-2">
          {poll.options.map((option) => (
            <div key={option.text} className="flex justify-between items-center">
              <span>{option.text}</span>
              <span className="text-sm text-muted-foreground">
                {option.votes} votes
              </span>
            </div>
          ))}
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
