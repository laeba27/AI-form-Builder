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
import { ChevronDown, CalendarDays } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "DatePicker";

type attributesType = {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  dateFormat?: string;
  includeTime?: boolean;
  showPlaceholder?: boolean;
  autoComplete?: boolean;
  readOnly?: boolean;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
  minDate?: string;
  maxDate?: string;
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

function DatePickerCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { 
    helperText, 
    label, 
    placeHolder, 
    required, 
    includeTime, 
    dateFormat,
    showPlaceholder 
  } = block.attributes;

  const getInputType = () => {
    if (includeTime) return "datetime-local";
    if (dateFormat === "MM/YYYY") return "month";
    if (dateFormat === "YYYY") return "number";
    return "date";
  };

  const getPlaceholderText = () => {
    if (!showPlaceholder) return "";
    
    switch (dateFormat) {
      case "DD/MM/YYYY":
        return includeTime ? "DD/MM/YYYY HH:MM" : "DD/MM/YYYY";
      case "YYYY-MM-DD":
        return includeTime ? "YYYY-MM-DD HH:MM" : "YYYY-MM-DD";
      case "Month Day, Year":
        return includeTime ? "Month Day, Year HH:MM" : "Month Day, Year";
      case "MM/YYYY":
        return "MM/YYYY";
      case "YYYY":
        return "YYYY";
      default:
        return placeHolder;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        readOnly
        type={getInputType()}
        className="!pointer-events-none cursor-default h-10"
        placeholder={getPlaceholderText()}
        min={dateFormat === "YYYY" ? "1900" : undefined}
        max={dateFormat === "YYYY" ? "2100" : undefined}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">
          {helperText}
        </p>
      )}
    </div>
  );
}

function DatePickerFormComponent({
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
  const { 
    helperText, 
    label, 
    placeHolder, 
    required,
    readOnly
  } = block.attributes;

  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);

  const validateField = (val: string) => {
    if (required) {
      return val.trim().length > 0;
    }
    return true;
  };

  const getInputType = () => {
    if (includeTime) return "datetime-local";
    if (dateFormat === "MM/YYYY") return "month";
    if (dateFormat === "YYYY") return "number";
    return "date";
  };

  const getPlaceholderText = () => {
    if (!showPlaceholder) return "";
    
    switch (dateFormat) {
      case "DD/MM/YYYY":
        return includeTime ? "DD/MM/YYYY HH:MM" : "DD/MM/YYYY";
      case "YYYY-MM-DD":
        return includeTime ? "YYYY-MM-DD HH:MM" : "YYYY-MM-DD";
      case "Month Day, Year":
        return includeTime ? "Month Day, Year HH:MM" : "Month Day, Year";
      case "MM/YYYY":
        return "MM/YYYY";
      case "YYYY":
        return "YYYY";
      default:
        return placeHolder;
    }
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
      <Input
        type={getInputType()}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={(event) => {
          const inputValue = event.target.value;
          const isValid = validateField(inputValue);
          setIsError(!isValid);
          if (handleBlur) {
            handleBlur(block.id, inputValue);
          }
        }}
        className={`h-10 ${isError || isSubmitError ? "!border-red-500" : ""}`}
        placeholder={getPlaceholderText()}
        min={dateFormat === "YYYY" ? "1900" : minDate}
        max={dateFormat === "YYYY" ? "2100" : maxDate}
        readOnly={readOnly}
        disabled={readOnly}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}

      {isError || isSubmitError ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && value.trim().length === 0
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

function DatePickerPropertiesComponent({
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
    includeTime: z.boolean().default(false),
    showPlaceholder: z.boolean().default(true),
    autoComplete: z.boolean().default(false),
    readOnly: z.boolean().default(false),
    allowPastDates: z.boolean().default(true),
    allowFutureDates: z.boolean().default(true),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
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

      includeTime: block.attributes.includeTime || false,
      showPlaceholder: block.attributes.showPlaceholder ?? true,
      autoComplete: block.attributes.autoComplete || false,
      readOnly: block.attributes.readOnly || false,
      allowPastDates: block.attributes.allowPastDates ?? true,
      allowFutureDates: block.attributes.allowFutureDates ?? true,
      minDate: block.attributes.minDate || "",
      maxDate: block.attributes.maxDate || "",
    },
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      includeTime: block.attributes.includeTime || false,
      showPlaceholder: block.attributes.showPlaceholder ?? true,
      autoComplete: block.attributes.autoComplete || false,
      readOnly: block.attributes.readOnly || false,
      allowPastDates: block.attributes.allowPastDates ?? true,
      allowFutureDates: block.attributes.allowFutureDates ?? true,
      minDate: block.attributes.minDate || "",
      maxDate: block.attributes.maxDate || "",
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

  return (
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Date Picker {positionIndex}
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

          {/* <FormField
            control={form.control}
            name="dateFormat"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Date Format</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <Select
                      onValueChange={(value: string) => {
                        field.onChange(value);
                        setChanges({
                          ...form.getValues(),
                          dateFormat: value as any,
                        });
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="max-w-[187px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="Month Day, Year">Month Day, Year</SelectItem>
                        <SelectItem value="MM/YYYY">MM/YYYY</SelectItem>
                        <SelectItem value="YYYY">YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeTime"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Include Time</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setChanges({
                          ...form.getValues(),
                          includeTime: checked,
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
            name="showPlaceholder"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Show Placeholder</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setChanges({
                          ...form.getValues(),
                          showPlaceholder: checked,
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
            name="readOnly"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Read Only</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setChanges({
                          ...form.getValues(),
                          readOnly: checked,
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
            name="minDate"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Min Date</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="max-w-[187px]"
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            minDate: e.target.value,
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
            name="maxDate"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Max Date</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="max-w-[187px]"
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            maxDate: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </form>
      </Form>
    </div>
  );
}

export const DatePickerBlock = {
  blockType,
  blockCategory,
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Date field",
      helperText: "",
      required: false,
      placeHolder: "Select a date",
      dateFormat: "YYYY-MM-DD",
      includeTime: false,
      showPlaceholder: true,
      autoComplete: false,
      readOnly: false,
      allowPastDates: true,
      allowFutureDates: true,
      minDate: "",
      maxDate: "",
    },
  }),
  blockBtnElement: {
    icon: CalendarDays,
    label: "Date Picker",
  },
  canvasComponent: DatePickerCanvasComponent,
  formComponent: DatePickerFormComponent,
  propertiesComponent: DatePickerPropertiesComponent,
};
