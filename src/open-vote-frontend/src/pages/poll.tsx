import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { queries, QueryKeys } from "@/lib/queries";
import { PollResults } from "@/components/polls/PollResults";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ic } from "@/lib/ic";
import { useAuth } from "@/lib/auth";
import {
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function Poll() {
  const { id: pollId } = useParams();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();

  const { data: poll, isLoading } = useQuery(queries.poll(pollId!));

  const voteMutation = useMutation({
    mutationFn: async() => {
      if (!selectedOption) throw new Error("No option selected");
      const res = await ic.vote({ pollId: pollId!, option: selectedOption });
      if (!res.Ok) {
        throw new Error(res.Err);
      }
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your vote has been recorded!",
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QueryKeys.poll(pollId!)] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.polls] });
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[500px] m-6" />;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const totalVotes = poll.options.reduce((acc, option) => acc + Number(option.votes), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{poll.question}</h1>
      <div className="flex items-center space-x-6 text-lg">
        <div className="flex items-center space-x-2 text-primary">
          <ChartBarIcon className="h-5 w-5" />
          <span>Total Votes: {totalVotes}</span>
        </div>
        <div className="flex items-center space-x-2 text-primary">
          <ClockIcon className="h-5 w-5" />
          <span>
            {poll.endTime && Number(poll.endTime.toString()) > new Date().getTime()
              ? `${formatDistanceToNow(new Date(Number(poll.endTime.toString())))} left`
              : poll.endTime
              ? `Voting ended (${new Date(
                  Number(poll.endTime.toString())
                ).toLocaleString()})`
              : `Voting ended`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {poll.endTime && Number(poll.endTime.toString()) > new Date().getTime()
              ? "Cast Your Vote"
              : "Options"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              voteMutation.mutate();
            }}
          >
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-4"
            >
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.text} id={index.toString()} />
                  <Label htmlFor={index.toString()}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
            {poll.endTime && Number(poll.endTime.toString()) > new Date().getTime() ? (
              isAuthenticated ? (
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={!selectedOption || voteMutation.isPending}
                >
                  {voteMutation.isPending ? "Submitting..." : "Submit Vote"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="mt-4"
                  onClick={() => login()}
                >
                  Login to Vote
                </Button>
              )
            ) : null}
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
