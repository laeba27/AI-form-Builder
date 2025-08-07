import React from "react";
import FormBuilder from "../../../_components/FormBuilder";
import BuilderContextProvider from "@/context/builder-provider";
import { ThemeProvider } from "@/context/theme-provider";

const Builder = () => {
  return (
    <ThemeProvider>
      <BuilderContextProvider>
        <FormBuilder />
      </BuilderContextProvider>
    </ThemeProvider>
  );
};

export default Builder;
