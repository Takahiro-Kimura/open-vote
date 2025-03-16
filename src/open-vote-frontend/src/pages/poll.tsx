import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { queries, QueryKeys } from '@/lib/queries';
import { PollResults } from '@/components/polls/PollResults';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ic } from '@/lib/ic';

export default function Poll() {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>();
  const queryClient = useQueryClient();

  const { data: poll, isLoading } = useQuery(queries.poll(id));

  const voteMutation = useMutation({
    mutationFn: () => {
      if (!selectedOption) throw new Error('No option selected');
      return ic.vote({ pollId: id, optionId: selectedOption });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your vote has been recorded!'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries(QueryKeys.poll(id));
      queryClient.invalidateQueries(QueryKeys.polls);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit vote. Please try again.',
        variant: 'destructive'
      });
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[500px] m-6" />;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{poll.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{poll.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cast Your Vote</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            voteMutation.mutate();
          }}>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-4"
            >
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              type="submit"
              className="mt-4"
              disabled={!selectedOption || voteMutation.isPending}
            >
              {voteMutation.isPending ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <PollResults poll={poll} />
        </div>
      </div>
    </div>
  );
}