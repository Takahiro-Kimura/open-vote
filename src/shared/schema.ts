import * as z from "zod";

export const PollOptionSchema = z.object({
  text: z.string().min(1, {
    message: "選択肢は1文字以上である必要があります。",
  }),
  votes: z.number(),
});

export type PollOption = z.infer<typeof PollOptionSchema>;

export const PollSchema = z.object({
  id: z.string(),
  question: z.string().min(1, {
    message: "タイトルは1文字以上である必要があります。",
  }),
  endTime: z.bigint().optional(),
  options: z.array(PollOptionSchema).min(2, {
    message: "選択肢は2つ以上必要です。",
  }),
  creator: z.string(),
});

export type Poll = z.infer<typeof PollSchema>;

export const CreatePollSchema = PollSchema.omit({
  id: true,
  creator: true,
  options: true,
}).extend({
  options: z.array(PollOptionSchema.omit({ votes: true })).min(2, {
    message: "選択肢は2つ以上必要です。",
  }),
});

export type CreatePoll = z.infer<typeof CreatePollSchema>;

export const VoteRequestSchema = z.object({
  pollId: z.string(),
  option: z.string(),
});

export type VoteRequest = z.infer<typeof VoteRequestSchema>;
