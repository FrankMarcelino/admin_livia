import { Textarea } from '@/components/ui/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'

interface PromptTextareaProps {
  form: UseFormReturn<any>
  name: string
  label: string
  placeholder: string
  description?: string
  rows?: number
  maxLength?: number
}

export function PromptTextarea({
  form,
  name,
  label,
  placeholder,
  description,
  rows = 8,
  maxLength = 5000
}: PromptTextareaProps) {
  const value = form.watch(name) || ''
  const charCount = value.length

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className="resize-none font-mono text-sm"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <FormMessage />
            <span>
              {charCount} / {maxLength}
            </span>
          </div>
        </FormItem>
      )}
    />
  )
}
