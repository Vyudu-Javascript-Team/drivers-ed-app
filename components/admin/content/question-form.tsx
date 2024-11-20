import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

const questionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: "Question is required" }),
      explanation: z.string().min(1, { message: "Explanation is required" }),
      options: z.array(
        z.object({
          text: z.string().min(1, { message: "Option text is required" }),
          isCorrect: z.boolean().default(false),
        })
      ).min(2, { message: "At least two options are required" }),
    })
  ),
})

export function QuestionForm() {
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          explanation: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  function onSubmit(values: z.infer<typeof questionSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {questionFields.map((field, questionIndex) => {
          const optionsPath = `questions.${questionIndex}.options` as const
          const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
            control: form.control,
            name: optionsPath,
          })

          return (
            <Card key={field.id} className="p-6">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
                  {questionIndex > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Options</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendOption({ text: "", isCorrect: false })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                  {optionFields.map((optionField, optionIndex) => (
                    <div key={optionField.id} className="flex items-start space-x-4">
                      <FormField
                        control={form.control}
                        name={`${optionsPath}.${optionIndex}.text`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`${optionsPath}.${optionIndex}.isCorrect`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  // Uncheck all other options
                                  optionFields.forEach((_, index) => {
                                    if (index !== optionIndex) {
                                      form.setValue(
                                        `${optionsPath}.${index}.isCorrect`,
                                        false
                                      )
                                    }
                                  })
                                  field.onChange(value === "true")
                                }}
                                value={field.value ? "true" : "false"}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id={`correct-${questionIndex}-${optionIndex}`} />
                                  <Label htmlFor={`correct-${questionIndex}-${optionIndex}`}>Correct</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {optionIndex > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(optionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain the correct answer..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )
        })}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendQuestion({
                question: "",
                explanation: "",
                options: [
                  { text: "", isCorrect: false },
                  { text: "", isCorrect: false },
                ],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button type="submit">Save Test</Button>
        </div>
      </form>
    </Form>
  )
}
