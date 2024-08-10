import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PropTypes from "prop-types";

export function DropdownAE({ data, title, setValueAE }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    setValueAE(value);
  }, [value, setValueAE]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full m-auto sm:w-[330px] justify-between">
          {value ? data.find((item) => item.value === value)?.label : title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[60vw] m-auto sm:w-[330px] p-0">
        <Command>
          {/* <CommandInput onC placeholder={`Buscar ${title.toLowerCase()}...`} /> */}
          <CommandList>
            <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
DropdownAE.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  setValueAE: PropTypes.func.isRequired,
};
