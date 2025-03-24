import { CreatePollForm } from '@/components/polls/CreatePollForm';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function CreatePoll() {
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Create New Poll</h1>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-4">Please log in to create a poll.</p>
          <Button onClick={() => login()}>
            Sign in to create a poll
          </Button>
        </div>
      ) : (
        <CreatePollForm />
      )}
    </div>
  );
}
