import { useQuery } from "@tanstack/react-query";
import { PollCard } from "@/components/polls/PollCard";
import { queries } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";

export default function CompletedPolls() {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    ...queries.completedPolls,
    select: (data) =>
      data?.filter(
        (poll) =>
          poll.endTime &&
          Number(poll.endTime.toString()) <= new Date().getTime()
      ),
  });

  const [sortBy, setSortBy] = useState("endTime");

  const sortedPolls = useMemo(() => {
    if (!polls) return [];

    const sorted = [...polls];

    sorted.sort((a, b) => {
      if (sortBy === "endTime") {
        if (!a.endTime || !b.endTime) {
          return 0;
        }
        return Number(b.endTime.toString()) - Number(a.endTime.toString());
      } else if (sortBy === "totalVotes") {
        const totalVotesA = a.options.reduce(
          (acc, option) => acc + Number(option.votes),
          0
        );
        const totalVotesB = b.options.reduce(
          (acc, option) => acc + Number(option.votes),
          0
        );
        return totalVotesB - totalVotesA;
      }
      return 0;
    });

    return sorted;
  }, [polls, sortBy]);

  if (error) {
    console.error("Error fetching completed polls:", error);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h1 className="text-4xl font-bold">Completed Polls</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <label htmlFor="sort" className="mr-2">
            Sort:
          </label>
          <div className="space-x-2">
            <button
              className={`border rounded px-2 py-1 ${
                sortBy === "endTime" ? "bg-[hsl(330_100%_90%)]" : ""
              }`}
              onClick={() => setSortBy("endTime")}
            >
              End Date
            </button>
            <button
              className={`border rounded px-2 py-1 ${
                sortBy === "totalVotes" ? "bg-[hsl(330_100%_90%)]" : ""
              }`}
              onClick={() => setSortBy("totalVotes")}
            >
              Total Votes
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {sortedPolls?.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
