"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const states = [
  { value: "ga", label: "Georgia" },
  { value: "fl", label: "Florida" },
  { value: "nj", label: "New Jersey" },
  { value: "ca", label: "California" },
  { value: "la", label: "Louisiana" },
  { value: "in", label: "Indiana" },
]

export function StateSelector() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? states.find((state) => state.value === value)?.label
            : "Select state..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup>
            {states.map((state) => (
              <CommandItem
                key={state.value}
                value={state.value}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  setOpen(false)
                  router.push(`/states/${currentValue}`)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === state.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {state.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}