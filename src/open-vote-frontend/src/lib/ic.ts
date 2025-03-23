import type { Poll, CreatePoll, VoteRequest } from "@shared/schema";
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { open_vote_backend } from "declarations/open-vote-backend";

class ICClient {
  private actor: any;

  constructor() {
    this.actor = open_vote_backend;
  }

  private async changeAgent() {
    const authClient = await AuthClient.create();
    const agent = Actor.agentOf(this.actor);
    if (authClient && agent && agent.replaceIdentity) {
      agent.replaceIdentity(authClient.getIdentity());
    }
    return agent;
  }

  async createPoll(poll: any): Promise<{Ok: string; Err: string}> {
    await this.changeAgent();
    // todo: anyをCreatePollにする
    try {
      console.log("Creating poll with data:", poll);
      const result = await this.actor.create_poll(poll);
      console.log("Create poll result:", result);
      return result;
    } catch (error) {
      console.error("Failed to create poll:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  async getPoll(id: string): Promise<Poll | null> {
    try {
      console.log("Getting poll:", id);
      const result = await this.actor.get_poll(id);
      console.log("Get poll result:", result);
      return result.length > 0 ? {...result[0], endTime: result[0].end_time} : null;
    } catch (error) {
      console.error("Failed to get poll:", error);
      return null;
    }
  }

  async getPolls(): Promise<Poll[]> {
    try {
      console.log("Fetching polls...");
      const polls = await this.actor.get_polls();
      console.log("Fetched polls:", polls);
      return polls ? polls.map((poll: any) => { return { ...poll, endTime: poll.end_time }}) : [];
    } catch (error) {
      console.error("Failed to get polls:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      return []; // エラー時は空配列を返す
    }
  }

  async getUserPolls(principal: string): Promise<Poll[]> {
    try {
      console.log("Fetching user polls for principal:", principal);
      const polls = await this.actor.get_user_polls(principal);
      console.log("Fetched user polls:", polls);
      return polls || [];
    } catch (error) {
      console.error("Failed to get user polls:", error);
      return []; // エラー時は空配列を返す
    }
  }

  async getUserVotes(principal: string): Promise<Poll[]> {
    try {
      console.log("Fetching user votes for principal:", principal);
      const polls = await this.actor.get_user_votes(principal);
      console.log("Fetched user votes:", polls);
      return polls || [];
    } catch (error) {
      console.error("Failed to get user votes:", error);
      return []; // エラー時は空配列を返す
    }
  }

  async vote(request: VoteRequest): Promise<{Ok: string; Err: string}> {
    await this.changeAgent();
    try {
      console.log("Submitting vote:", request);
      return await this.actor.vote(request.pollId, { option: request.option });
    } catch (error) {
      console.error("Failed to vote:", error);
      throw error;
    }
  }

  async getPrincipal(): Promise<string> {
    try {
      const principal = await this.actor.get_principal();
      console.log("Got principal:", principal);
      return principal;
    } catch (error) {
      console.error("Failed to get principal:", error);
      return "anonymous";
    }
  }
}

export const ic = new ICClient();
