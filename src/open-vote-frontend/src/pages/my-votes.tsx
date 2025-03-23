import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../lib/queries';
import { useAuth } from '../lib/auth';

interface Vote {
  poll_id: string;
  option: string;
  voter: string;
}

const MyVotes = () => {
  const { principal: userId } = useAuth();
  const { data: votes, isLoading, isError } = useQuery(queries.userVotes(userId) as any);

  if (!userId) {
    return <div>Please connect your wallet to view your votes.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching votes.</div>;
  }

  if (!votes || !Array.isArray(votes) || votes.length === 0) {
    return <div>No votes found for this user.</div>;
  }

  return (
    <div>
      <h1>My Votes</h1>
      <ul>
        {votes.map((vote: Vote) => (
          <li key={vote.poll_id}>
            Poll: {vote.poll_id}, Choice: {vote.option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyVotes;
