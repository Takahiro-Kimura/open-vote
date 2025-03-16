import { CreatePollForm } from '@/components/polls/CreatePollForm';

export default function CreatePoll() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Create New Poll</h1>
      <CreatePollForm />
    </div>
  );
}
