import { UseQueryOptions } from '@tanstack/react-query';
import type { Poll } from '@shared/schema';
import { ic } from './ic';

// Define query keys as constants
export const QueryKeys = {
  polls: ['polls'] as const,
  completedPolls: ['completed-polls'] as const,
  poll: (id: string) => ['poll', id] as const,
  userPolls: (principal: string) => ['user-polls', principal] as const,
};

// Define query options
export const queries = {
  polls: {
    queryKey: QueryKeys.polls,
    queryFn: () => ic.getPolls(),
    retry: 1,
    staleTime: 30000, // 30秒
    select: (data: Poll[]) => data.filter(poll => poll.isActive),
  } as UseQueryOptions<Poll[]>,

  completedPolls: {
    queryKey: QueryKeys.completedPolls,
    queryFn: () => ic.getPolls(),
    retry: 1,
    staleTime: 30000,
  } as UseQueryOptions<Poll[]>,

  poll: (id: string) => ({
    queryKey: QueryKeys.poll(id),
    queryFn: () => ic.getPoll(id),
    enabled: !!id,
    retry: 1,
  }) as UseQueryOptions<Poll | null>,

  userPolls: (principal: string | null) => ({
    queryKey: QueryKeys.userPolls(principal ?? ''),
    queryFn: () => principal ? ic.getUserPolls(principal) : Promise.resolve([]),
    enabled: !!principal,
    retry: 1,
  }) as UseQueryOptions<Poll[]>,
};