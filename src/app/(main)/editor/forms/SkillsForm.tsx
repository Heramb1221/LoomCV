"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import skillsData from "@/data/skills.json";
import { Badge } from "@/components/ui/badge";

export default function SkillsForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(skillsData, {
        threshold: 0.3,
      }),
    []
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        skills: (values.skills?.filter((s): s is string => typeof s === "string" && Boolean(s)) || []),
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  function addSkill(skill: string) {
    if (!form.getValues("skills")?.includes(skill)) {
      form.setValue("skills", [...(form.getValues("skills") || []), skill]);
    }
    setQuery("");
    setSuggestions([]);
  }

  function removeSkill(skill: string) {
    form.setValue(
      "skills",
      form.getValues("skills")?.filter((s) => s !== skill) || []
    );
  }

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(query).slice(0, 8); // show top 8
    setSuggestions(results.map((r) => r.item));
  }, [query, fuse]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Add relevant skills to showcase your expertise.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem>
                <FormLabel>Add a skill</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && query.trim()) {
                          e.preventDefault();
                          addSkill(query.trim());
                        }
                      }}
                      placeholder="Type a skill..."
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                        {suggestions.map((s, idx) => (
                          <div
                            key={idx}
                            className="cursor-pointer px-3 py-2 hover:bg-accent"
                            onClick={() => addSkill(s)}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-2">
            {form.getValues("skills")?.map((skill, index) => (
              <Badge
                key={index}
                className="cursor-pointer bg-primary text-primary-foreground"
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </Badge>
            ))}
          </div>
        </form>
      </Form>
    </div>
  );
}
