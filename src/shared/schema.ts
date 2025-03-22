import * as z from "zod";

export const PollOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, {
    message: "選択肢は1文字以上である必要があります。",
  }),
  count: z.number(),
});

export type PollOption = z.infer<typeof PollOptionSchema>;

export const PollSchema = z.object({
  id: z.string(),
  title: z.string().min(1, {
    message: "タイトルは1文字以上である必要があります。",
  }),
  description: z.string().optional(),
  endDate: z.string(),
  options: z.array(PollOptionSchema).min(2, {
    message: "選択肢は2つ以上必要です。",
  }),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
});

export type Poll = z.infer<typeof PollSchema>;

export const CreatePollSchema = PollSchema.omit({ id: true, createdAt: true, options: true }).extend({
  options: z.array(PollOptionSchema.omit({ id: true, count: true })).min(2, {
    message: "選択肢は2つ以上必要です。",
  }),
});

export type CreatePoll = z.infer<typeof CreatePollSchema>;

export const VoteRequestSchema = z.object({
  pollId: z.string(),
  optionId: z.string(),
});

export type VoteRequest = z.infer<typeof VoteRequestSchema>;
