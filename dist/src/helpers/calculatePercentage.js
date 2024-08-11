Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    calculateAnswersPercentages: function() {
        return calculateAnswersPercentages;
    },
    calculatePercentage: function() {
        return calculatePercentage;
    }
});
const calculatePercentage = (total, correct)=>total === 0 ? 0 : correct / total * 100;
const calculateAnswersPercentages = (data)=>{
    return data.map((answersGroup)=>{
        const totalAnswers = answersGroup.reduce((sum, quiz)=>sum + quiz.totalAnswers, 0);
        const rightAnswers = answersGroup.reduce((sum, quiz)=>sum + quiz.rightAnswers, 0);
        const wrongAnswers = answersGroup.reduce((sum, quiz)=>sum + quiz.wrongAnswers, 0);
        const answersLength = answersGroup.length;
        const percentRight = calculatePercentage(totalAnswers, rightAnswers);
        const percentWrong = calculatePercentage(totalAnswers, wrongAnswers);
        return {
            answersLength,
            percentRight: parseFloat(percentRight.toFixed(2)),
            percentWrong: parseFloat(percentWrong.toFixed(2))
        };
    });
};
