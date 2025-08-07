"use client";
import React from "react";
import FormItem from "./_common/FormItem";
import { softDeleteForm } from "@/actions/delete-form.action";
import { useRouter } from "next/navigation";
import { FormListType } from "@/@types/form.type";

type FormListClientProps = {
  forms: FormListType[];
};

const FormListClient = ({ forms }: FormListClientProps) => {
  const router = useRouter();

  const handleDelete = async (formId: string) => {
    try {
      const result = await softDeleteForm(formId);
      
      if (result.success) {
        // Show success message or toast here if needed
        console.log(result.message);
        // Refresh the page to show updated form list
        router.refresh();
      } else {
        console.error('Failed to delete form:', result.message);
        // Show error message or toast here if needed
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('An unexpected error occurred while deleting the form.');
    }
  };

  return (
    <>
      {forms?.map((form) => (
        <FormItem 
          key={form.id}
          id={form.id}
          formId={form.formId}
          name={form.name}
          published={form.published}
          createdAt={form.createdAt}
          responses={form.responses}
          views={form.views}
          backgroundColor={form.settings.backgroundColor}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default FormListClient;
