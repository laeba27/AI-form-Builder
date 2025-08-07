import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategoryType,
  HandleBlurFunc,
  ObjectBlockType,
} from "@/@types/form-block.type";
import { z } from "zod";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Dropdown";

type attributesType = {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  options: string[];
  allowMultiple?: boolean;
  defaultValue?: string;
  searchable?: boolean;
};

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const propertiesValidateSchema = z.object({
  placeHolder: z.string().trim().optional(),
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  helperText: z.string().trim().max(255).optional(),
});

type NewInstance = FormBlockInstance & {
  attributes: attributesType;
};

function DropdownCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { helperText, label, placeHolder, required, options = [] } = block.attributes;
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-default"
          disabled
        >
          <option value="">{placeHolder}</option>
          {options.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">
          {helperText}
        </p>
      )}
    </div>
  );
}

function DropdownFormComponent({
  blockInstance,
  handleBlur,
  isError: isSubmitError,
  errorMessage,
}: {
  blockInstance: FormBlockInstance;
  handleBlur?: HandleBlurFunc;
  isError?: boolean;
  errorMessage?: string;
}) {
  const block = blockInstance as NewInstance;
  const { helperText, label, placeHolder, required, options = [], allowMultiple } = block.attributes;

  const [value, setValue] = useState<string | string[]>(allowMultiple ? [] : "");
  const [isError, setIsError] = useState(false);

  const validateField = (val: any) => {
    if (required) {
      if (allowMultiple) {
        return Array.isArray(val) && val.length > 0;
      }
      return val && val.toString().trim().length > 0;
    }
    return true;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base !font-normal mb-2 ${
          isError || isSubmitError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <select
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white ${
            isError || isSubmitError ? "!border-red-500" : ""
          }`}
          multiple={allowMultiple}
          value={value}
          onChange={(event) => {
            const newValue = allowMultiple 
              ? Array.from(event.target.selectedOptions, option => option.value)
              : event.target.value;
            setValue(newValue);
          }}
          onBlur={(event) => {
            const inputValue = allowMultiple 
              ? Array.from(event.target.selectedOptions, option => option.value)
              : event.target.value;
            const isValid = validateField(inputValue);
            setIsError(!isValid);
            if (handleBlur) {
              handleBlur(block.id, Array.isArray(inputValue) ? inputValue.join(', ') : inputValue);
            }
          }}
        >
          <option value="">{placeHolder}</option>
          {options.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}

      {isError || isSubmitError ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && (!value || (Array.isArray(value) && value.length === 0))
            ? `This field is required.`
            : ""}
        </p>
      ) : (
        errorMessage && (
          <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>
        )
      )}
    </div>
  );
}

function DropdownPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { updateChildBlock } = useBuilder();

  const propertiesValidateSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeHolder: z.string().max(50),
    options: z.array(z.string()).min(1, "At least one option is required"),
    allowMultiple: z.boolean().default(false),
    searchable: z.boolean().default(false),
    defaultValue: z.string().optional(),
  });

  type PropertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

  const form = useForm<PropertiesValidateSchemaType>({
    resolver: zodResolver(propertiesValidateSchema),
    mode: "onBlur",
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      options: block.attributes.options || ["Option 1", "Option 2", "Option 3"],
      allowMultiple: block.attributes.allowMultiple || false,
      searchable: block.attributes.searchable || false,
      defaultValue: block.attributes.defaultValue || "",
    },
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      options: block.attributes.options || ["Option 1", "Option 2", "Option 3"],
      allowMultiple: block.attributes.allowMultiple || false,
      searchable: block.attributes.searchable || false,
      defaultValue: block.attributes.defaultValue || "",
    });
  }, [block.attributes, form]);

  function setChanges(values: PropertiesValidateSchemaType) {
    if (!parentId) return null;
    updateChildBlock(parentId, block.id, {
      ...block,
      attributes: {
        ...block.attributes,
        ...values,
      },
    });
  }

  const addOption = () => {
    const currentOptions = form.getValues("options");
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    form.setValue("options", newOptions);
    setChanges({
      ...form.getValues(),
      options: newOptions,
    });
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length > 1) {
      const newOptions = currentOptions.filter((_, i) => i !== index);
      form.setValue("options", newOptions);
      setChanges({
        ...form.getValues(),
        options: newOptions,
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = form.getValues("options");
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    form.setValue("options", newOptions);
    setChanges({
      ...form.getValues(),
      options: newOptions,
    });
  };

  return (
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Dropdown {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full space-y-3 px-4"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Label</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        className="max-w-[187px]"
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            label: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placeHolder"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Placeholder</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        className="max-w-[187px]"
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            placeHolder: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="helperText"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Helper Text</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Textarea
                        {...field}
                        className="max-w-[187px] resize-none"
                        rows={2}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            helperText: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Required</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setChanges({
                          ...form.getValues(),
                          required: checked,
                        });
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowMultiple"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Allow Multiple</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setChanges({
                          ...form.getValues(),
                          allowMultiple: checked,
                        });
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Options Management */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel className="text-[13px] font-normal">Options</FormLabel>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {form.watch("options").map((option: string, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 h-8 text-xs"
                    placeholder="Enter option"
                  />
                  <Button
                    type="button"
                    onClick={() => removeOption(index)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    disabled={form.getValues("options").length === 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export const DropdownBlock = {
  blockType,
  blockCategory,
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Dropdown",
      helperText: "",
      required: false,
      placeHolder: "Select an option",
      options: ["Option 1", "Option 2", "Option 3"],
      allowMultiple: false,
      defaultValue: "",
      searchable: false,
    },
  }),
  blockBtnElement: {
    icon: ChevronDown,
    label: "Dropdown",
  },
  canvasComponent: DropdownCanvasComponent,
  formComponent: DropdownFormComponent,
  propertiesComponent: DropdownPropertiesComponent,
};
