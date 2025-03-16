import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { Sidebar } from "./components/layout/Sidebar";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import CreatePoll from "./pages/create-poll";
import Poll from "./pages/poll";
import MyPolls from "./pages/my-polls";
import CompletedPolls from "./pages/completed-polls";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/completed-polls" component={CompletedPolls} />
          <Route path="/create-poll" component={CreatePoll} />
          <Route path="/poll/:id" component={Poll} />
          <Route path="/my-polls" component={MyPolls} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
