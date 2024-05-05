'use client'
import locationData from '../data/Locations.json';

export const getFishFromLocationAndSeason = (location, season) => {
    const noBoss = locationData[location].Fish.filter((fish) => !fish.IsBossFish
    );

    let filterSeason = []
    if (season != "MagicBait"){
        filterSeason = noBoss.filter((fish) => 
        (!fish.Season
            || (fish.Season && fish.Season.toLowerCase() == season)) 
        &&
        (!fish.Condition
            || (fish.Condition && !fish.Condition.includes("SEASON"))
            || (fish.Condition && fish.Condition.includes("LEGENDARY_FAMILY"))
            || (fish.Condition && fish.Condition.includes(season)))
        && fish.RequireMagicBait === false)
    
    } else {
        filterSeason = noBoss
    }
    // console.log("all fish in season: ", filterSeason)
    const locationFishData = filterSeason;
    return locationFishData;
}

export const getFishAreas = () => {
    let fishLocations = {}
    const locations = Object.keys(locationData).forEach(key => {    
        let fishAreas = []
        const areas = Object.keys(locationData[key].FishAreas).forEach(key => {
            fishAreas.push(key)
        })
        if (fishAreas.length != 0) {
            fishLocations[key] = fishAreas
        }
    })
    return fishLocations
}