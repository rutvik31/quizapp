import * as XLSX from "xlsx";

export async function uploadQuestions(file, api, bus) {
  if (!file) {
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const arrayBuffer = e.target.result;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const questions = XLSX.utils.sheet_to_json(worksheet);

    const questionObjects = questions.map((questionData) => {
      const items = questionData.tags.split(",");
      const resultObjects = items.map((item) => {
        const matches = item.trim().match(/^(.*?)\s+\((.*?)\)$/);
        if (matches) {
          return {
            name: matches[1],
            color: matches[2],
          };
        } else {
          return null;
        }
      });
      questionData.tags = resultObjects;
      questionData.options = questionData.options
        ? questionData.options.split(", ")
        : [];

      return {
        question: questionData.question,
        meta: {
          options: questionData.options,
          tags: resultObjects,
        },
        answer: questionData.answer,
        notes: questionData.notes,
        difficulty: questionData.difficulty,
        ansType: questionData.ansType,
      };
    });
    api.question
      .bulkUploadQuestions(questionObjects)
      .then(() => {
        bus.$emit("showSnakeBar", "Question created successfully", "success");
      })
      .catch(() => {
        bus.$emit("showSnakeBar", "Error creating question", "error");
      });
  };

  fileReader.readAsArrayBuffer(file);
}
