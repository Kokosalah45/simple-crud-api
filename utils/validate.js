const validateData = async (inputData, schema) => {
  try {
    return await schema.parseAsync(inputData);
  } catch (e) {
    throw e;
  }
};

export default validateData;
