Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const shuffleAnswers = (array)=>{
    return array.reduce((acc, curr, i)=>{
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const newArray = [
            ...acc
        ];
        newArray[i] = newArray[randomIndex];
        newArray[randomIndex] = curr;
        return newArray;
    }, [
        ...array
    ]);
};
const _default = shuffleAnswers;
