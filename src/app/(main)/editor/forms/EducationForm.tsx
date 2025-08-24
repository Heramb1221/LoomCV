import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { educationSchema, EducationValues } from "@/lib/validation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

const groupedDegreeOptions: Record<string, string[]> = {
  "Undergraduate Degrees": [
    "Associate of Arts (AA)",
    "Associate of Science (AS)",
    "Associate of Applied Science (AAS)",
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (BTech)",
    "Bachelor of Architecture (BArch)",
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Pharmacy (BPharm)",
    "Bachelor of Education (BEd)",
    "Bachelor of Law (LLB)",
    "Bachelor of Nursing (BN/BSc Nursing)",
    "Bachelor of Social Work (BSW)",
    "Bachelor of Design (BDes)",
    "Bachelor of Journalism & Mass Communication (BJMC)",
  ],
  "Graduate Degrees": [
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Fine Arts (MFA)",
    "Master of Business Administration (MBA)",
    "Master of Commerce (MCom)",
    "Master of Computer Applications (MCA)",
    "Master of Engineering (ME)",
    "Master of Technology (MTech)",
    "Master of Architecture (MArch)",
    "Master of Public Administration (MPA)",
    "Master of Public Health (MPH)",
    "Master of Education (MEd)",
    "Master of Laws (LLM)",
    "Master of Pharmacy (MPharm)",
    "Master of Nursing (MSc Nursing)",
    "Master of Social Work (MSW)",
    "Master of Design (MDes)",
    "Master of Journalism & Mass Communication (MJMC)",
  ],
  "Doctoral / Research Degrees": [
    "Doctor of Philosophy (PhD)",
    "Doctor of Science (DSc)",
    "Doctor of Education (EdD)",
    "Doctor of Business Administration (DBA)",
    "Doctor of Engineering (DEng)",
  ],
  "Professional Degrees": [
    "Doctor of Medicine (MD)",
    "Doctor of Dental Surgery (DDS)",
    "Doctor of Dental Medicine (DMD)",
    "Doctor of Pharmacy (PharmD)",
    "Doctor of Veterinary Medicine (DVM)",
    "Doctor of Nursing Practice (DNP)",
    "Juris Doctor (JD)",
  ],
  "Other / Specialized Degrees": [
    "Diploma",
    "Postgraduate Diploma (PGD)",
    "Certificate",
    "Higher National Diploma (HND)",
    "Other",
  ],
};

export default function EducationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((edu) => edu !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add as many educations as you like.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <EducationItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  degree: "",
                  school: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              Add education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [customDegree, setCustomDegree] = useState("");

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <div>
                <select
                  {...field}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value !== "Other") {
                      setCustomDegree("");
                    }
                  }}
                >
                  <option value="">Select a degree</option>
                  {Object.entries(groupedDegreeOptions).map(([group, options]) => (
                    <optgroup key={group} label={group}>
                      {options.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {field.value === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter your degree"
                    value={customDegree}
                    onChange={(e) => {
                      setCustomDegree(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
