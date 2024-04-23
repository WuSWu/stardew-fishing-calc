// targeted bait WIP, still on my PC as per first commit

// here be math and dragons
// used for targeted bait
// don't ask how I arrived in this code, I won't be able to explain but I'm sure you can replicate it
// basically for fish a = P(fish A), b = P(fish B), c = P(fish C), find (1-a)bc, a(1-b)c, ab(1-c) and generalize
function chanceOfNFishCaughtFromPool(n, resultArray) {
    let summedArray = []
    for (let i in resultArray) {
        let arraySum = sumArrayElements(resultArray[i])
        summedArray[i] = arraySum
    }
    
    let outputChance = 0
    let isEven = true
    for (let i = resultArray.length-n-1; i <= resultArray.length-1; i++) {
        let coefficient = binomial(i, resultArray.length-n-1)
        if (isEven) {
            isEven = false
        } else {
            coefficient = -coefficient
            isEven = true
        }
        summedArray[i] *= coefficient
        outputChance += summedArray[i]
    }
    return outputChance

    function binomial(n, k) {
        let binCoeff = 1;
        for (let x = n - k + 1; x <= n; x++) binCoeff *= x;
        for (let x = 1; x <= k; x++) binCoeff /= x;
        return binCoeff;
    }
}

// used as resultArray in multiple functions
// don't fucking read this if you need your brain unexploded
// takes [a,b,c,d,e,...], inverts it to [(1-a), (1-b), etc]
// and outputs [[1],[a,b,c,d,e...],[ab,ac,bc,ad,bd,...],[abc,abd,acd,bcd,abe,...],...]
// to use with random cumulative P(~fish) calculation in a list
// btw the array is recursed not the function
// it goes without saying that this gets factorially expensive, i don't know how expensive
// starts to lag after 20ish items in the array (at 25 the middle array has 3 million items) 
function recursiveMultiply(chanceArray) {
    let invertedArray = invertArray(chanceArray)
    let resultArray = (invertedArray.length > 0) ? [[invertedArray[0]]] : [];
    for (let i = 0; i < invertedArray.length - 1; i++) {
        let currentLength = resultArray.length;
        for (let j = 0; j < currentLength; j++) {
            let tempArray = [];
            for (let k = 0; k <= resultArray[currentLength - j - 1].length - 1; k++) {
                if (resultArray[currentLength - j - 1][k]) {
                let newValue = resultArray[currentLength - j - 1][k]*(invertedArray[i + 1])
                tempArray.push(newValue);
                }
            }
            if (resultArray.length <= currentLength - j) {
                resultArray[currentLength - j] = [];
            }
            resultArray[currentLength - j] =
                resultArray[currentLength - j].concat(tempArray);
        }
        resultArray[0] = [];
        let tempArray2 = [];
        for (let k = 0; k < resultArray.length; k++) {
           tempArray2.push(invertedArray[k]);
        }
        resultArray[0] = tempArray2;
    }
    // console.log([[1]].concat(resultArray))
    return [[1]].concat(resultArray);
}

// tested this and it matches blade's numbers but in a far more efficient way (because I said so)
// don't include the wanted fish in the same precedence array
function getNonTargetedChance(samePrecedence, higherPrecedence, chanceOfFishYouWant) {
    let samePrecedenceChance = getFirstCatchChance(recursiveMultiply(samePrecedence), chanceOfFishYouWant)
    let higherPrecedenceChance = multiplyArrayElements(invertArray(higherPrecedence))
    return samePrecedenceChance*higherPrecedenceChance
}

export function rollFishPool(filteredFishData, index) {
    let finalChance = 0
    let wantedFishWeight = filteredFishData[index].weight;
    let wantedFishPrecedence = filteredFishData[index].Precedence
    let dataWithoutCurrentFish = filteredFishData.slice();
    delete dataWithoutCurrentFish[index];

    if (dataWithoutCurrentFish.length > 1){
        let samePrecedence = [];
        let higherPrecedence = [];
        for (let j in dataWithoutCurrentFish) {
            if (dataWithoutCurrentFish[j].weight != 0) {
                let currentPrecedence = dataWithoutCurrentFish[j].Precedence
                if (currentPrecedence == wantedFishPrecedence){
                samePrecedence.push(dataWithoutCurrentFish[j].weight)
                } else if (currentPrecedence < wantedFishPrecedence) {
                higherPrecedence.push(dataWithoutCurrentFish[j].weight)
                }
            }
        };
        finalChance = getNonTargetedChance(samePrecedence, higherPrecedence, wantedFishWeight);  
    } else {
        finalChance = wantedFishWeight
    }
    return finalChance
}

//  JELLY CHANCE
// so there are two states right, one where you can catch jelly and one where you cannot.
// there are P(Jelly) of the former state and 1-P(Jelly) of the latter state.
// but the states don't correlate with your fishing attempts since you can get stuck fishing trash in the 1-P(jelly) state without switching states
// instead, your fishing attempts correlate with the amount of sub-states each state has.
// in the 1-P(Jelly) state, you have 1-P(trash) chance of exiting the state immediately, P(trash)(1-P(trash)) chance of staying there for 2 substates, and so on.
// so the average number of substates in the 1-P(jelly) state follows, 1*(1-P(trash)) + 2(P(trash)(1-P(trash)) + 3((P(trash)P(trash)(1-P(trash))
// plugged sum of i*a(i-1) into wolfram alpha (because I don't understand how series work with derivatives) and the partial sum formula is sum(n) = (na^(n+1) - (n+1)a^n + 1)/(a-1)^2
// the limit for na^(n+1) - (n+1)a^n for n->infinity is 0 no matter how large a is as long as it's not 1
// therefore the infinite sum is just 1/(a-1)^2 which in our case is 1/(P(trash)-1)^2 or rather 1/(1-P(trash))^2 since the former gives a negative answer if factored
// therefore the average number of substates is ((1-P(trash))/1-P(trash))^2 = 1/(1-P(trash))
// this works with the P(Jelly) state as well, just with different P(trash) numbers
// so on a given substate, the chance of it being in P(Jelly) state is P(Jelly) * n(substates in P(Jelly)) / (P(Jelly) * n(substates in P(Jelly)) + (1-P(Jelly) * n(substates in 1-P(Jelly))))
// which gives us a final formula of  P(Jelly)/(1-P(trash_with_jelly)) / ( P(Jelly)/(1-P(trash_with_jelly)) + (1-P(Jelly))/(1-P(trash_without_jelly)) )
// 
// this function takes the trashChance and outputs the jelly coefficient. trashChance includes algae and seaweed.
// run this after everything (including targeted bait calculation)
export function getJellyChance(filteredFishData, luckBuffs) {
    let trashFishRate = 0
    let trashTrashRate = 1
    let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
    let jellyRate = jelly.Chance + 0.05*luckBuffs

    let modifiedPool = filteredFishData.slice()
    let jellyInModifiedPool = modifiedPool.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))

    let trashFishWithJellyRate = 0
    let trashTrashWithJellyRate = 1
    jellyInModifiedPool.weight = 1
    for (let i in modifiedPool) {
        if (modifiedPool[i].Id === "(O)152" || modifiedPool[i].Id === "(O)153" || modifiedPool[i].Id === "(O)157") {
            let currentFinalChance = rollFishPool(modifiedPool, i)
            trashFishWithJellyRate += currentFinalChance
        }
    }
    for (let i in modifiedPool) {
        trashTrashWithJellyRate *= (1-modifiedPool[i].weight)
    }
    let totalTrashWithJelly = trashFishWithJellyRate + trashTrashWithJellyRate

    let trashFishWithoutJellyRate = 0
    let trashTrashWithoutJellyRate = 1
    jellyInModifiedPool.weight = 0
    for (let i in modifiedPool) {
        if (modifiedPool[i].Id === "(O)152" || modifiedPool[i].Id === "(O)153" || modifiedPool[i].Id === "(O)157") {
            let currentFinalChance = rollFishPool(modifiedPool, i)
            trashFishWithoutJellyRate += currentFinalChance
        }
    }
    for (let i in modifiedPool) {
        trashTrashWithoutJellyRate *= (1-modifiedPool[i].weight)
    }
    let totalTrashWithoutJelly = trashFishWithoutJellyRate + trashTrashWithoutJellyRate

    let goodSeedSubstates = jellyRate*(1-totalTrashWithJelly)
    let badSeedSubstates = (1-jellyRate)/(1-totalTrashWithoutJelly)
    let trueJellyRate = goodSeedSubstates / (goodSeedSubstates+badSeedSubstates)

    return trueJellyRate
}

// basically finds the chance of catching fish when there are 0 fish in front of it, 1 fish, 2 fish, etc
// all fish has to fail for the wanted fish to get caught first
// the only function you want if you're not using targeted bait
// array needs to be recursively multiplied first
function getFirstCatchChance(resultArray, chanceOfFishYouWant) {
    let summedArray = []
    let totalCoefficient = resultArray.length
    // if resultArray is null returns [1]
    for (let i in resultArray) {
        let currentCoefficient = resultArray[i].length
        let arraySum = sumArrayElements(resultArray[i])
        arraySum /= currentCoefficient
        arraySum /= totalCoefficient
        summedArray[i] = arraySum
    }
    
    // sums the outer array as well
    // returns float
    let additionResult = 0
    for (let i in summedArray) {
        additionResult += summedArray[i]
    }
    summedArray = additionResult
    return summedArray*chanceOfFishYouWant
}

// util
function sumArrayElements(inputArray){
    let additionResult = 0
    for (let i in inputArray) {
        additionResult += inputArray[i]
    }
    return additionResult
}

// util
function multiplyArrayElements(inputArray){
    let multResult = 1
    for (let i in inputArray) {
        multResult *= inputArray[i]
    }
    return multResult
}

// util
function invertArray(chanceArray) {
    let invertedArray = chanceArray.slice()
    for (let i in invertedArray) {
        invertedArray[i] = 1 - invertedArray[i]
    }
    return invertedArray
}

// naive chance using:
// chance of fish you want * chance of any catch / sum of all fish chances
// use for comparison with the true chance
// actually based on my testing doesn't deviate more than 25% than the true chance for non-targeted fish
function naiveChance(chanceArray, chanceOfFishYouWant) {
    let combinedArray = chanceArray.slice()
    combinedArray.push(chanceOfFishYouWant)
    let numerator = 1
    let denominator = 0
    for (let i in combinedArray) {
        numerator *= 1-combinedArray[i]
        denominator += combinedArray[i]
    }
    return (1-numerator) / denominator * chanceOfFishYouWant
}