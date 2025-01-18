export function findMixByIng(mixes, requiredIng) {
    let resultArr = [];
    if (!Boolean(Object.keys(mixes).length)) {
        return []
    }
        for (let mixName in mixes) {
            const ingredients = Object.keys(mixes[mixName].ingredients)
            doesContainIng(ingredients, requiredIng) ? resultArr.push(mixes[mixName]) : null
        }
    return resultArr;
}

export function doesContainIng(ingredients, requiredIng) {
    for (let ing of ingredients) {
        if (ing.includes(requiredIng)) {
            return true
        }
    }
}

export function getIngredients(relevantMixesArr) {
    let resultString = ''  
    if (Boolean(relevantMixesArr.length)) {
        let result = relevantMixesArr.map((mix) => {
            const ings = Object.keys(mix.ingredients)
            let resultArr = []
            for (let ing of ings) {
                let response = `${ing} ${mix.ingredients[ing].percentage}%`
                resultArr.push(response)
            }
            return resultArr.join(' + ')
        })
        for (let i = 0; i < result.length; i++) {
            resultString = `${resultString}\n${i + 1}. ${result[i]}`
        }
    }
    return resultString;
}