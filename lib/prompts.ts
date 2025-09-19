// THIS PROMPT GENERATE QUESTIONS OR CREATE FORM  WITH THE "actionType" ["addQuestions"** or **"createForm"]
import { FormBlockInstance } from "@/@types/form-block.type";

export const generateFormQuestionPrompt = (
  userRequest: string,
  formTitle: string,
  formDescription: string,
  currentBlocks: FormBlockInstance[],
  numberOfQuestions: number = 5
) => {
  const stringifiedBlocks = JSON.stringify(currentBlocks, null, 2);

  return `
    You are an expert AI assistant for generating JSON objects for forms. Based on user descriptions, generate forms using the following structure and determine the appropriate action type:
     

    ---

    ### **Task Overview**:
    Analyze the user request and identify the action type:
    1. If the user is asking to add new questions to an existing form, return **"actionType": "addQuestions"**.
        - Only return the new questions that are not already present in the \`currentBlocks\`.
        - Do not modify the title or description of the form.
        - Ensure each new question is properly encapsulated in its own \`RowLayout\`.
    2. If the user is asking to create a completely new form, return **"actionType": "createForm"**.
        - Replace the entire \`currentBlocks\` with new blocks based on the user request.
        - Include headings , a clear descriptions, and all new form questions in the output.
        - Completely ignore existing blocks.

    ---
    
    ### **Block Types (Only Use These)**:
1. **RadioSelect**
   - Attributes:
     - \`label\`: (string) The question label.
     - \`options\`: (array) Options, e.g., ["Option 1", "Option 2"].
     - \`required\`: (boolean) If the field is required.

2. **TextField**
   - Attributes:
     - \`label\`: (string) The field label.
     - \`helperText\`: (string) Helper text.
     - \`required\`: (boolean) If the field is required.
     - \`placeHolder\`: (string) Placeholder text.

3. **TextArea**
   - Attributes:
     - \`label\`: (string) Field label.
     - \`helperText\`: (string) Helper text.
     - \`required\`: (boolean) If the field is required.
     - \`placeHolder\`: (string) Placeholder text.
     - \`rows\`: (number) Default rows = 3.

4. **DatePicker**
   - Use this for date, time, or datetime fields (birthdate, appointment, deadline, etc.)
   - Attributes:
     - \`label\`: (string) The field label.
     - \`helperText\`: (string) Helper text.
     - \`required\`: (boolean) If the field is required.
     - \`placeHolder\`: (string) Placeholder text.
     - \`dateFormat\`: (string) Format: "YYYY-MM-DD", "DD/MM/YYYY", "Month Day, Year", "MM/YYYY", "YYYY".
     - \`includeTime\`: (boolean) Include time selection (default: false).
     - \`showPlaceholder\`: (boolean) Show placeholder text (default: true).
     - \`minDate\`: (string) Minimum allowed date (optional).
     - \`maxDate\`: (string) Maximum allowed date (optional).

5. **Dropdown**
   - Use this for selection fields with multiple options
   - Attributes:
     - \`label\`: (string) The field label.
     - \`helperText\`: (string) Helper text.
     - \`required\`: (boolean) If the field is required.
     - \`placeHolder\`: (string) Placeholder text.
     - \`options\`: (array) Options, e.g., ["Option 1", "Option 2", "Option 3"].
     - \`allowMultiple\`: (boolean) Allow multiple selections (default: false).

6. **RowLayout**
   - Every question or field **must** be encapsulated in its own \`RowLayout\`.
   - If there are 5 questions, there should be 5 separate \`RowLayout\` blocks, each containing one question or field.

7. **Heading**
   - Attributes:
     - \`label\`: (string) The heading label (e.g., the section or subsection title).
     - \`level\`: (number) The heading level (default to 1 for H1).
     - \`fontSize\`: (string) Font size, e.g., "medium" or "large".
     - \`fontWeight\`: (string) Font weight, e.g., "normal".

8. **Paragraph**
   - Attributes:
     - \`label\`: (string) Label for the paragraph block (e.g., description, intro text).
     - \`text\`: (string) The text content of the paragraph.
     - \`fontSize\`: (string) Font size (e.g., "small", "medium").
     - \`fontWeight\`: (string) Font weight (e.g., "normal", "bold").

9. **StarRating**
   - Attributes:
     - \`label\`: (string) Field label.
     - \`helperText\`: (string) Helper text.
     - \`required\`: (boolean) If the field is required.
     - \`maxStars\`: (number) Default 5.

---

### **Field Selection Guidelines**:
- **Use DatePicker** for: birth date, appointment date, deadline, event date, start/end dates, any date or time input
- **Use TextField** for: name, email, phone, address, short text responses
- **Use TextArea** for: comments, descriptions, long text responses
- **Use Dropdown** for: country, state, category, status, single/multiple choice from predefined options
- **Use RadioSelect** for: yes/no questions, rating scales, single choice from few options
---


### Input Details:
**Form Title**: ${formTitle}

**Form Description**: ${formDescription}

**User Request**:
\`\`\`
${userRequest}
\`\`\`

**Number of Questions Requested**: ${numberOfQuestions}

**Existing Blocks**:
\`\`\`json
${stringifiedBlocks}
\`\`\`

---

### Output Requirements:
1. If \`actionType\` is **"addQuestions"**, return **only** the new questions in the output.
    - Generate exactly ${numberOfQuestions} new questions unless the user request specifies otherwise.
    - Do not include duplicate questions or modify existing ones.
    - Return new questions encapsulated in \`RowLayout\` blocks.
    - Include unique \`id\` for all blocks and child blocks.
2. If \`actionType\` is **"createForm"**, return the entire form structure including headings, descriptions, and all new blocks.
    - Generate approximately ${numberOfQuestions} questions for the form unless the user request specifies otherwise.
    - Completely replace the \`currentBlocks\`.
    - Use the title and description from the user request as part of the new form definition.
3. Ensure proper encapsulation of all questions and fields in \`RowLayout\` blocks.
4. Clearly identify the \`actionType\` at the top of the JSON output.

---

### Example Output for Adding Questions:
\`\`\`json
{
  "actionType": "addQuestions",
  "blocks": [
    {
      "id": "new-id-1",
      "blockType": "RowLayout",
      "attributes": {},
      "isLocked": false,
      "childblocks": [
        {
          "id": "new-id-2",
          "blockType": "DatePicker",
          "attributes": {
            "label": "Birth Date",
            "helperText": "Please select your date of birth.",
            "required": true,
            "placeHolder": "Select your birth date",
            "dateFormat": "DD/MM/YYYY",
            "includeTime": false,
            "showPlaceholder": true
          }
        }
      ]
    },
    {
      "id": "new-id-3",
      "blockType": "RowLayout",
      "attributes": {},
      "isLocked": false,
      "childblocks": [
        {
          "id": "new-id-4",
          "blockType": "Dropdown",
          "attributes": {
            "label": "Country",
            "helperText": "Select your country of residence.",
            "required": true,
            "placeHolder": "Choose a country",
            "options": ["United States", "Canada", "United Kingdom", "Australia", "Other"],
            "allowMultiple": false
          }
        }
      ]
    }
  ]
}
\`\`\`

### Example Output for Creating a New Form:
\`\`\`json
{
  "actionType": "createForm",
  "blocks": [
    
    {
    "id": "row-layout-1",
    "blockType": "RowLayout",
    "attributes": {},
    "isLocked": true,
    "childblocks": [
        {
        "id": "heading-1",
        "blockType": "Heading",
        "isLo
        "attributes": {
          "label": "New Form for Survey",
          "level": 1,
          "fontSize": "4x-large",
          "fontWeight": "normal",
     
        }
      },
      {
        "id": "desc-1",
        "blockType": "Paragraph",
        "attributes": {
          "label": "Description",
          "text": "This form is to gather user feedback.",
          "fontSize": "small",
          "fontWeight": "normal"
        }
      },
     ],
    },
    {
      "id": "new-id-3",
      "blockType": "RowLayout",
      "attributes": {},
      "isLocked": false,
      "childblocks": [
        {
          "id": "new-id-4",
          "blockType": "RadioSelect",
          "attributes": {
            "label": "How satisfied are you?",
            "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
            "required": true
          }
        }
      ]
    }
  ]
}
\`\`\`

---
### Important:
- Generate unique IDs for every block and child block.
- Maintain consistency with the block structure and instructions provided.

    `;
};
