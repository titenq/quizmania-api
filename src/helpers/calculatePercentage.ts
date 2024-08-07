const calculatePercentage = (total: number, correct: number) => (total === 0 ? 0 : (correct / total) * 100);

const getAnswersPercentages = (data: any[][]) => {
  return data.map(answersGroup => {
    const totalAnswers = answersGroup.reduce((sum, quiz) => sum + quiz.totalAnswers, 0);
    const rightAnswers = answersGroup.reduce((sum, quiz) => sum + quiz.rightAnswers, 0);
    const wrongAnswers = answersGroup.reduce((sum, quiz) => sum + quiz.wrongAnswers, 0);

    const percentRight = calculatePercentage(totalAnswers, rightAnswers);
    const percentWrong = calculatePercentage(totalAnswers, wrongAnswers);

    return {
      percentRight: parseFloat(percentRight.toFixed(2)),
      percentWrong: parseFloat(percentWrong.toFixed(2))
    };
  });
};

export {
  calculatePercentage,
  getAnswersPercentages
};
