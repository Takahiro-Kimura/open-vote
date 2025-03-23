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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
      endTime: BigInt(4102412400000),
      options: [
        { text: "", votes: 0 },
        { text: "", votes: 0 },
      ], // Default to 2 options
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const createPollMutation = useMutation({
    mutationFn: async (data: Poll) => {
      // Format the data
      const formattedData = {
        question: data.question,
        end_time: [data.endTime],
        options: data.options.map((option) => option.text),
      };
      console.log("Submitting poll data:", formattedData);
      try {
        const res = await ic.createPoll(formattedData);
        if (!res.Ok) {
          throw new Error(res.Err);
        }
        return res;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Poll created successfully!",
      });
      // Update cache and transition screen
      queryClient.invalidateQueries({ queryKey: [QueryKeys.polls] });
      setLocation(`/poll/${res.Ok}`);
    },
    onError: (error) => {
      console.error("Poll creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create poll. Please try again.",
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
          e.preventDefault(); // Stop default action
          onSubmit(e);
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter poll question" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            return (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(23, 59, 59);
                      field.onChange(BigInt(tomorrow.getTime()));
                    }}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      nextWeek.setHours(23, 59, 59);
                      field.onChange(BigInt(nextWeek.getTime()));
                    }}
                  >
                    1 Week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      nextMonth.setHours(23, 59, 59);
                      field.onChange(BigInt(nextMonth.getTime()));
                    }}
                  >
                    1 Month
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextYear = new Date();
                      nextYear.setFullYear(nextYear.getFullYear() + 1);
                      nextYear.setHours(23, 59, 59);
                      field.onChange(BigInt(nextYear.getTime()));
                    }}
                  >
                    1 Year
                  </Button>
                </div>
                <DatePicker
                  selected={field.value ? new Date(Number(field.value)) : null}
                  onChange={(date) => {
                    if (date) {
                      field.onChange(BigInt(date.getTime()));
                    }
                  }}
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                  timeFormat="HH:mm"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Options</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ text: "", votes: 0 })}
              disabled={fields.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
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
                      <Input {...field} placeholder={`Option ${index + 1}`} />
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
          {createPollMutation.isPending ? "Creating..." : "Create Poll"}
        </Button>
      </form>
    </Form>
  );
}
