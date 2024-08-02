const shuffleAnswers = (array: string[]): string[] => {
  return array.reduce((acc, curr, i) => {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const newArray = [...acc];

    newArray[i] = newArray[randomIndex];
    newArray[randomIndex] = curr;

    return newArray;
  }, [...array]);
};

export default shuffleAnswers;
