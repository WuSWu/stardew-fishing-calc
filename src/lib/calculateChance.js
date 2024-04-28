// TARGETED BAIT CHANCE
//
// So there's actually 3 possible end conditions:
// case A: Complete two iterations of the list with 2 or less items passing: Return trash
//          or complete iteration 1 with exactly 2 items
// case B: 3 items pass at any point: Return the third item
// case C: Targeted fish passes at any point: Return the targeted fish
//
//  P(start iteration 2 with 1 fish) =
//      P(no non-target catch)
//      * (1 - P(target.caught))
//
//  P(start iteration 2 with 2 fish) = 
//      P(catch exactly 1 non-target fish)
//      * (1 - P(target.caught))
//
//  P(case A, iteration 1) = 
//      P(catch exactly 2 non-target fish)
//      * (1 - P(target.caught))
//
//  P(case B, iteration 1) =
//      (1 - P(no non-target catch) - P(catch exactly 1 non-target fish) - P(catch exactly 2 non-target fish))      basically else
//      * (1 - P(target.caught) + P(target.caught_fourth_or_later))
//      =
//      (1 - P(no non-target catch) - P(catch exactly 1 non-target fish) - P(catch exactly 2 non-target fish))
//      * (1 - P(target.caught_first) - P(target.caught_second) - P(target.caught_third))
//
//  P(case C, iteration 1) =
//      P(target.caught)
//      - (1 - P(no non-target catch) - P(catch exactly 1 non-target fish) - P(catch exactly 2 non-target fish)
//      * P(target.caught_fourth_or_later)
//      =
//      P(target.caught)
//      - (1 - P(no non-target catch) - P(catch exactly 1 non-target fish) - P(catch exactly 2 non-target fish)
//      * (P(target.caught) - P(target.caught_first) - P(target.caught_second) - P(target.caught_third))
//
//  P(case A, iteration 2 start with 1 fish) =
//      (P(no non-target catch) + P(catch exactly 1 non-target fish))
//      * (1 - P(target.caught))
//
//  P(case B, iteration 2 start with 1 fish) =
//      (1 - P(no non-target catch) - P(catch exactly 1 non-target fish))
//      * (1 - P(target.caught) + P(target.caught_third_or_later))
//      =
//      (1 - P(no non-target catch) - P(catch exactly 1 non-target fish))
//      * (1 - P(target.caught_first) - P(target.caught_second))
//
//  P(case C, iteration 2 start with 1 fish) =
//      P(target.caught)
//      - (1 - P(no non-target catch) - P(catch exactly 1 non-target fish))
//      * P(target.caught_third_or_later)
//      =
//      P(target.caught)
//      - (1 - P(no non-target catch) - P(catch exactly 1 non-target fish))
//      * (P(target.caught) - P(target.caught_first) - P(target.caught_second))
//
//  P(case A, iteration 2 start with 2 fish) =
//      P(no non-target catch)
//      * (1 - P(target.caught))
//
//  P(case B, iteration 2 start with 2 fish) =
//      (1 - P(no non-target catch))
//      * (1 - P(target.caught) + P(target.caught_second_or_later))
//      =
//      (1 - P(no non-target catch))
//      * (1 - P(target.caught_first))
//
//  P(case C, iteration 2 start with 1 fish) =
//      P(target.caught)
//      - (1 - P(no non-target catch))
//      * P(target.caught_second_or_later)
//      =
//      P(target.caught)
//      - (1 - P(no non-target catch))
//      * (P(target.caught) - P(target.caught_first))
//
//  Find actual non-target fish chances
//  case A:                                 only trash
//  case B iteration 1:                     case chance * P(n.third)
//  case B iteration 2, start with 1 fish:  case chance * P(n.second)
//  case B iteration 2, start with 2 fish:  case chance * P(n.first)
//  case C:                                 only target
//  
export function targetedBaitSingle(nonTargetedFish, targetedFishArray) {
    let pTargetCaughtArray = []
    let pTargetCaughtBefore_2ndArray = []
    let pTargetCaughtBefore_3rdArray = []
    let pTargetCaughtBefore_4thArray = []
    for (let i in targetedFishArray){
        let targetedFish = targetedFishArray[i]

        let targetedFishWeight = (targetedFish) ? targetedFish.weight : 0
        let targetedFishPrecedence = (targetedFish) ? targetedFish.Precedence : 0

        let targetedFishArrayWithoutCurrent = targetedFishArray.slice()
        delete targetedFishArrayWithoutCurrent[i];
        let allFishWithoutCurrent = targetedFishArrayWithoutCurrent.concat(nonTargetedFish)

        let samePrecedence = [];
        let higherPrecedence = [];
        for (let j in allFishWithoutCurrent) {
            if (allFishWithoutCurrent[j].weight != 0) {
                let currentPrecedence = allFishWithoutCurrent[j].Precedence
                if (currentPrecedence == targetedFishPrecedence){
                    samePrecedence.push(allFishWithoutCurrent[j].weight)
                } else if (currentPrecedence < targetedFishPrecedence) {
                    higherPrecedence.push(allFishWithoutCurrent[j].weight)
                }
            }
        }
        let recursedSamePrecedence = recursiveMultiply(samePrecedence)
        let recursedHigherPrecedence = recursiveMultiply(higherPrecedence)
    
        let pCatchExactly_0_FromHigherPrecedence = multiplyArrayElements(invertArray(higherPrecedence))
        let pCatchExactly_1_FromHigherPrecedence = chanceOfNFishCaughtFromPool(1, recursedHigherPrecedence)
        let pCatchExactly_2_FromHigherPrecedence = chanceOfNFishCaughtFromPool(2, recursedHigherPrecedence)
        
        let pTargetCaught = targetedFishWeight
        
        let pTargetCaught_1st_AmongSamePrecedence = getFirstCatchChance(recursedSamePrecedence, targetedFishWeight)
        let pTargetCaught_2nd_AmongSamePrecedence = getNthCatchChance(2, recursedSamePrecedence, targetedFishWeight)
        let pTargetCaught_3rd_AmongSamePrecedence = getNthCatchChance(3, recursedSamePrecedence, targetedFishWeight)

        let pTargetCaught_1st = pCatchExactly_0_FromHigherPrecedence * pTargetCaught_1st_AmongSamePrecedence
        let pTargetCaught_2nd = pCatchExactly_1_FromHigherPrecedence * pTargetCaught_1st_AmongSamePrecedence + pCatchExactly_0_FromHigherPrecedence * pTargetCaught_2nd_AmongSamePrecedence
        let pTargetCaught_3rd = pCatchExactly_2_FromHigherPrecedence * pTargetCaught_1st_AmongSamePrecedence + pCatchExactly_1_FromHigherPrecedence * pTargetCaught_2nd_AmongSamePrecedence + pCatchExactly_0_FromHigherPrecedence * pTargetCaught_3rd_AmongSamePrecedence

        let pTargetCaughtBefore_2nd = pTargetCaught -  pTargetCaught_1st
        let pTargetCaughtBefore_3rd = pTargetCaught -  pTargetCaught_1st - pTargetCaught_2nd
        let pTargetCaughtBefore_4th = pTargetCaught -  pTargetCaught_1st - pTargetCaught_2nd - pTargetCaught_3rd

        pTargetCaughtArray.push(pTargetCaught)
        pTargetCaughtBefore_2ndArray.push(pTargetCaughtBefore_2nd)
        pTargetCaughtBefore_3rdArray.push(pTargetCaughtBefore_3rd)
        pTargetCaughtBefore_4thArray.push(pTargetCaughtBefore_4th)
    } 

    let nonTargetedFishWeights = []
    for (let i in nonTargetedFish) {
        nonTargetedFishWeights.push(nonTargetedFish[i].weight)
    }

    let recursedNonTargetedFish = recursiveMultiply(nonTargetedFishWeights)
    let pCatchExactly0 = multiplyArrayElements(invertArray(nonTargetedFishWeights))
    let pCatchExactly1 = chanceOfNFishCaughtFromPool(1, recursedNonTargetedFish)
    let pCatchExactly2 = chanceOfNFishCaughtFromPool(2, recursedNonTargetedFish)

    let pTargetCaught = union(pTargetCaughtArray)
    let pTargetCaughtBefore_2nd = intersection(pTargetCaughtBefore_2ndArray)
    let pTargetCaughtBefore_3rd = intersection(pTargetCaughtBefore_3rdArray)
    let pTargetCaughtBefore_4th = intersection(pTargetCaughtBefore_4thArray)

    let pCase_A_InIteration_1 = pCatchExactly2 * (1 - pTargetCaught)
    let pCase_B_InIteration_1 = (1 - pCatchExactly0 - pCatchExactly1 - pCatchExactly2) * (1 - pTargetCaught + pTargetCaughtBefore_4th)
    let pCase_C_InIteration_1 = pTargetCaught - (1 - pCatchExactly0 - pCatchExactly1 - pCatchExactly2) * pTargetCaughtBefore_4th
    
    let pStartIteration_2_With_1_Fish = pCatchExactly0 * (1 - pTargetCaught)
    let pStartIteration_2_With_2_Fish = pCatchExactly1 * (1 - pTargetCaught)

    let pCase_A_InIteration_2_With_1_Fish = pStartIteration_2_With_1_Fish * (pCatchExactly0 + pCatchExactly1) * (1 - pTargetCaught)
    let pCase_B_InIteration_2_With_1_Fish = pStartIteration_2_With_1_Fish * (1 - pCatchExactly0 - pCatchExactly1) * (1 - pTargetCaught + pTargetCaughtBefore_3rd)
    let pCase_C_InIteration_2_With_1_Fish = pStartIteration_2_With_1_Fish * (pTargetCaught - (1 - pCatchExactly0 - pCatchExactly1) * pTargetCaughtBefore_3rd)

    let pCase_A_InIteration_2_With_2_Fish = pStartIteration_2_With_2_Fish * pCatchExactly0 * (1 - pTargetCaught)
    let pCase_B_InIteration_2_With_2_Fish = pStartIteration_2_With_2_Fish * (1 - pCatchExactly0) * (1 - pTargetCaught + pTargetCaughtBefore_2nd)
    let pCase_C_InIteration_2_With_2_Fish = pStartIteration_2_With_2_Fish * (pTargetCaught - (1 - pCatchExactly0) * pTargetCaughtBefore_2nd)

    let pCase_A = pCase_A_InIteration_1 + pCase_A_InIteration_2_With_1_Fish + pCase_A_InIteration_2_With_2_Fish
    let pCase_B = pCase_B_InIteration_1 + pCase_B_InIteration_2_With_1_Fish + pCase_B_InIteration_2_With_2_Fish
    let pCase_C = pCase_C_InIteration_1 + pCase_C_InIteration_2_With_1_Fish + pCase_C_InIteration_2_With_2_Fish

    let targetedBaitParameters = {
        caseAChance: pCase_A,
        caseBFirstCatchChance: pCase_B_InIteration_2_With_2_Fish,
        caseBSecondCatchChance: pCase_B_InIteration_2_With_1_Fish,
        caseBThirdCatchChance: pCase_B_InIteration_1,
        caseBChance: pCase_B,
        caseCChance: pCase_C,
        pCatchExactly0: pCatchExactly0,
        pCatchExactly1: pCatchExactly1,
        pCatchExactly2: pCatchExactly2
    }

    function union(probabilityArray) {
        let recursedArray = recursiveMultiply(invertArray(probabilityArray))
        let summedArray = []
        for (let i in recursedArray) {
            let arraySum = sumArrayElements(recursedArray[i])
            summedArray[i] = arraySum
        }
        let outputChance = 0
        let isEven = true
        for (let i = 1; i < summedArray.length; i++) {
            let coefficient = 1
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
    }

    function intersection(probabilityArray) {
        if (probabilityArray.length != 0) {
            return multiplyArrayElements(probabilityArray)
        } else {
            return 0
        }
    }
    return targetedBaitParameters
}

export function rollFishPoolWithTargetedBait(targetedBaitParameters, nonTargetedFish, index) {
    let finalChance = 0
    let wantedFishWeight = nonTargetedFish[index].weight;
    let wantedFishPrecedence = nonTargetedFish[index].Precedence
    let dataWithoutCurrentFish = nonTargetedFish.slice();
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
        let tbp = targetedBaitParameters

        let recursedSamePrecedence = recursiveMultiply(samePrecedence)
        let recursedHigherPrecedence = recursiveMultiply(higherPrecedence)

        let firstCatchChance = getFirstCatchChance(recursedSamePrecedence, wantedFishWeight)
        let secondCatchChance = getNthCatchChance(2, recursedSamePrecedence, wantedFishWeight)
        let thirdCatchChance = getNthCatchChance(3, recursedSamePrecedence, wantedFishWeight)

        let pCatchExactly_0_FromHigherPrecedence = multiplyArrayElements(invertArray(higherPrecedence))
        let pCatchExactly_1_FromHigherPrecedence = chanceOfNFishCaughtFromPool(1, recursedHigherPrecedence)
        let pCatchExactly_2_FromHigherPrecedence = chanceOfNFishCaughtFromPool(2, recursedHigherPrecedence)

        let catch_1st = firstCatchChance * pCatchExactly_0_FromHigherPrecedence
        let catch_2nd = ((firstCatchChance * pCatchExactly_1_FromHigherPrecedence) + (secondCatchChance * pCatchExactly_0_FromHigherPrecedence))
        let catch_3rd = ((firstCatchChance * pCatchExactly_2_FromHigherPrecedence) + (secondCatchChance * pCatchExactly_1_FromHigherPrecedence) + (thirdCatchChance * pCatchExactly_0_FromHigherPrecedence))

        if (catch_1st !== 0 && (1 - tbp.pCatchExactly0) !== 0) {
            finalChance += tbp.caseBFirstCatchChance * catch_1st / (1 - tbp.pCatchExactly0)
        }
        if (catch_2nd !== 0 && (1 - tbp.pCatchExactly0 - tbp.pCatchExactly1) !== 0) {
            finalChance += tbp.caseBSecondCatchChance * catch_2nd / (1 - tbp.pCatchExactly0 - tbp.pCatchExactly1)
        }
        if (catch_3rd !== 0 && (1 - tbp.pCatchExactly0 - tbp.pCatchExactly1 - tbp.pCatchExactly2) !== 0) {
            finalChance += tbp.caseBThirdCatchChance * catch_3rd / (1 - tbp.pCatchExactly0 - tbp.pCatchExactly1 - tbp.pCatchExactly2)
        }
    } else {
        finalChance = wantedFishWeight
    }
    return finalChance
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
                if (resultArray[currentLength - j - 1][k] !== undefined) {
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

// tested this and it matches blade's numbers but in a far more efficient way (because I said so)
// don't include the wanted fish in the same precedence array
function getNonTargetedChance(samePrecedence, higherPrecedence, chanceOfFishYouWant) {
    let samePrecedenceChance = getFirstCatchChance(recursiveMultiply(samePrecedence), chanceOfFishYouWant)
    let higherPrecedenceChance = multiplyArrayElements(invertArray(higherPrecedence))
    return samePrecedenceChance * higherPrecedenceChance
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

    let goodSeedSubstates = jellyRate / (1 - totalTrashWithJelly)
    let badSeedSubstates = (1 - jellyRate) / (1 - totalTrashWithoutJelly)
    let trueJellyRate = goodSeedSubstates / (goodSeedSubstates + badSeedSubstates)

    return trueJellyRate
}

// basically finds the chance of catching fish when there are 0 fish in front of it, 1 fish, 2 fish, etc
// all fish has to fail for the wanted fish to get caught first
// the only function you want if you're not using targeted bait
// array needs to be recursively multiplied first
function getFirstCatchChance(resultArray, chanceOfFishYouWant) {
    let outputChance = 0
    let totalCoefficient = resultArray.length
    for (let i in resultArray) {
        let currentCoefficient = resultArray[i].length
        let arraySum = sumArrayElements(resultArray[i])
        arraySum /= currentCoefficient
        arraySum /= totalCoefficient
        outputChance += arraySum
    }
    return outputChance*chanceOfFishYouWant
}

// generalized Nth (first, second, etc) catch chance
// equivalent to the above on n=1, ALWAYS USE THE ABOVE WHEN POSSIBLE; THIS IS EXPENSIVE
function getNthCatchChance(n, resultArray, chanceOfFishYouWant) {
    let outputChance = 0
    let totalCoefficient = resultArray.length
    for (let i in resultArray) {
        let currentCoefficient = resultArray[i].length
        let iChance = chanceOfNFishCaughtFromSelectMFromPool(n-1, i, resultArray)
        iChance /= currentCoefficient
        iChance /= totalCoefficient
        outputChance += iChance
    }
    return outputChance*chanceOfFishYouWant
}

// here be math and dragons
// used for targeted bait
// don't ask how I arrived in this code, I won't be able to explain but I'm sure you can replicate it
// basically for fish a = P(fish A), b = P(fish B), c = P(fish C), find (1-a)bc, a(1-b)c, ab(1-c) and generalize
// checksum for n from 0 to nPool should be 1
function chanceOfNFishCaughtFromPool(n, resultArray) {
    let summedArray = []
    for (let i in resultArray) {
        let arraySum = sumArrayElements(resultArray[i])
        summedArray[i] = arraySum
    }
    
    let nPool = (resultArray[1] !== undefined) ? resultArray[1].length : 0
    if (nPool < n) {
        return 0
    }

    let outputChance = 0
    let isEven = true
    for (let i = nPool-n; i <= nPool; i++) {
        if (i >= 0) {
            let coefficient = binomial(i, nPool-n)
            if (isEven) {
                isEven = false
            } else {
                coefficient = -coefficient
                isEven = true
            }
            summedArray[i] *= coefficient
            outputChance += summedArray[i]
        }
    }
    return outputChance
}

// here be math and dungeons and dragons
// same as above but generalized as chance of N fish caught from select M from pool
// somehow this is needed when finding the chance of targeted fish caught second and third in list
// basically for fish a = P(fish A), b = P(fish B), c = P(fish C), d = P(fish D), find (1-a)bc, a(1-b)c, ab(1-c), (1-a)bd... (1-a)cd.... bc(1-d)
// make sure result is the same as the above function on m = resultArray
function chanceOfNFishCaughtFromSelectMFromPool(n, m, resultArray) {
    let summedArray = []
    for (let i in resultArray) {
        let arraySum = sumArrayElements(resultArray[i])
        summedArray[i] = arraySum
    }

    let nPool = (resultArray[1] !== undefined) ? resultArray[1].length : 0
    if (nPool < m) {
        return 0
    }

    let nCombinations = binomial(m, n) * binomial(nPool, m)
    let outputChance = 0
    let isEven = true
    for (let i = m-n; i <= m; i++) {
        if (i >= 0) {
            let coefficient1 = binomial(nPool, i)
            if (isEven) {
                isEven = false
            } else {
                coefficient1 = -coefficient1
                isEven = true
            }
            let coefficient2 = binomial(n, i-(m-n))
            summedArray[i] *= coefficient2 * nCombinations / coefficient1
            outputChance += summedArray[i]
        }
    }
    return outputChance
}

// util for the above functions
function binomial(n, k) {
    let binCoeff = 1;
    for (let x = n - k + 1; x <= n; x++) binCoeff *= x;
    for (let x = 1; x <= k; x++) binCoeff /= x;
    return binCoeff;
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