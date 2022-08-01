const fieldIsEmpty = (fields) => {
  const filteredKeys = Object.keys(fields).filter(
    (key) =>
      fields[key] == false || fields[key] == "" || fields[key] == undefined
  );

  return filteredKeys;
};

module.exports = { fieldIsEmpty };
