'use client'
import locationData from '../data/Locations.json';

export const getFishFromLocationAndSeason = (location, season) => {
    // sometimes I wish I'm using elixir right now
    const filters = locationData[location].Fish.filter((fish) =>
    // OOP is a fucking mistake
        !fish.IsBossFish
        && !fish.Id.includes("F")
        && !fish.Id.includes("|")
    );

    var filterSeason = []
    if (season != "MagicBait"){
        filterSeason = filters.filter((fish) => 
        ((fish.Season && fish.Season.toLowerCase() == season)
            || !fish.Season) 
        &&
        ((fish.Condition && fish.Condition.includes(season))
            || (fish.Condition && !fish.Condition.includes("SEASON"))
            || (fish.Condition && fish.Condition.includes("LEGENDARY_FAMILY"))
            || !fish.Condition));
    
    } else {
        filterSeason = filters
    }
    // console.log("all fish in season: ", filterSeason)
    const locationFishData = filterSeason;
    return locationFishData;
}
  