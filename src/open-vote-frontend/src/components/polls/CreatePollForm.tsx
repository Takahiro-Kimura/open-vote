import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Poll } from "@shared/schema";
import { CreatePollSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { ic } from "@/lib/ic";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { QueryKeys } from "@/lib/queries";

export function CreatePollForm() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<Poll>({
    resolver: zodResolver(CreatePollSchema),
    defaultValues: {
      question: "",
      endTime: 4102412400,
      options: [
        { text: "", votes: 0 },
        { text: "", votes: 0 },
      ], // デフォルトで2つの選択肢
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const createPollMutation = useMutation({
    mutationFn: async (data: Poll) => {
      console.log(99312, data.options);
      // データを整形
      const formattedData = {
        question: data.question,
        end_time: [data.endTime],
        options: data.options.map((option) => option.text),
      };
      console.log("Submitting poll data:", formattedData);
      return ic.createPoll(formattedData);
    },
    onSuccess: (pollId) => {
      toast({
        title: "成功",
        description: "投票が作成されました！",
      });
      // キャッシュを更新して画面遷移
      queryClient.invalidateQueries({ queryKey: [QueryKeys.polls] });
      setLocation(`/poll/${pollId}`);
    },
    onError: (error) => {
      console.error("Poll creation error:", error);
      toast({
        title: "エラー",
        description: "投票の作成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      createPollMutation.mutate(data);
    },
    (errors) => {
      console.error("Validation Errors:", errors);
    }
  );

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // デフォルト動作を止める
          onSubmit(e);
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>質問</FormLabel>
              <FormControl>
                <Input {...field} placeholder="投票の質問を入力" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>終了日時</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>終了日を選択</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>選択肢</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ text: "", votes: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              選択肢を追加
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder={`選択肢 ${index + 1}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index >= 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" disabled={createPollMutation.isPending}>
          {createPollMutation.isPending ? "作成中..." : "投票を作成"}
        </Button>
      </form>
    </Form>
  );
}
