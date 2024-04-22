'use client'
import React, { useState, useEffect, useRef } from 'react';
import TimeSlider from '../components/TimeSlider';
import { RadioOptions, SmallOptions } from '../components/RadioOptions';
import FishCard from '../components/FishCard';
import Checkbox from '../components/Checkbox';
import GenericSlider from '../components/GenericSlider';
import Layout from '../components/layout';
import Accordion from '../components/Accordion'
import Tooltip from '../components/Tooltip'
import { getFishFromLocationAndSeason } from '../lib/locationdata';
import { getFishParameters } from '../lib/fishdata'; 
import { getJellyChance, rollFishPool } from '../lib/calculateChance';

export default function Home() {
  const [timeOfDay, setTimeOfDay] = useState(600);
  const [fishingLevel, setFishingLevel] = useState(10);
  const [waterDepth, setWaterDepth] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState('Town');
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [targetedBaitName, setTargetedBaitName] = useState("");
  const [trashRate, setTrashRate] = useState(1);
  const [jellyMode, setJellyMode] = useState("longterm");
  const [luckBuffs, setLuckBuffs] = useState(0);
  const [checkedItems, setCheckedItems] = useState({
    isCuriosityLureActive: false,
    isExtendedFamilyActive: false,
    isRaining: false,
    isTroutDerbyActive: false,
    isSquidFestActive: false,
    isUsingTrainingRod: false,
    dailyLuck: 0
  });

  // update and pull Locations.xnb and Fish.xnb
  const [locationFishData, setLocationFishData] = useState([]);
  // update and pull Fish.xnb only
  const [appendedFishData, setAppendedFishData] = useState([]);
  // update and only use stored data
  const [weightedFishData, setWeightedFishData] = useState([]);
  const [filteredFishData, setFilteredFishData] = useState([]);
  const [fishDataWithChance, setFishDataWithChance] = useState([]);
  

  // makes sure the fish window height doesn't overflow the main window
  const fishDisplayWindow = useRef();
  const parametersWindow = useRef();
  const [maxHeight, setMaxHeight] = useState(0);
  useEffect(() => {
    if (fishDisplayWindow.current && parametersWindow.current) {
      setMaxHeight(parametersWindow.current.clientHeight);
    }
  }, [fishDisplayWindow, parametersWindow])

  // pull new fish data if relevant settings are changed
  useEffect(() => {
    const updatedLocationFishData = getFishFromLocationAndSeason(selectedLocation, selectedSeason);
    setLocationFishData(updatedLocationFishData);
  }, [selectedLocation, selectedSeason]);

  // populate fish data with Fish.xnb if new location data is pulled
  useEffect(() => {
    let tempFishParamArray = []
    for (let i in locationFishData) {
      let fish = locationFishData[i]
      if (!fish.Id || !fish.Id.match(/\d+/)) {
        if (fish.Id && fish.Id.match(/Jelly/)) {
          fish.name = fish.Id.substring(3, fish.Id.length-5)+" Jelly"
          fish["weight"] = 0
          tempFishParamArray.push(fish);
        }
        continue
      }
      const newParams = getFishParameters(fish.Id.match(/\d+/)[0]);
      const mergedParams = {...fish, ...newParams};
      tempFishParamArray.push(mergedParams);
    }
    setAppendedFishData(tempFishParamArray);
  }, [locationFishData]);

    
  // catch rate modifiers changed
  useEffect(() => {
    let tempFishParamArray = [];
    for (let i in appendedFishData) {
      let fish = appendedFishData[i]
      if (!fish.Id.match(/Jelly/)) {
        fish["weight"] = calculateWeight(fish)
      }
      tempFishParamArray.push(fish)
    }
    setWeightedFishData(tempFishParamArray);
  }, [appendedFishData, checkedItems.isUsingTrainingRod, checkedItems.isCuriosityLureActive, fishingLevel, waterDepth, jellyMode, luckBuffs])


  // filter fish data using parameters
  useEffect(() => {
    let tempFilteredFishData = weightedFishData.slice()


    // filter extended family
    if (!checkedItems.isExtendedFamilyActive) {
      let noExtendedFamily = tempFilteredFishData
        .filter((fish) => !fish.Condition || !fish.Condition.includes("LEGENDARY_FAMILY"));
      tempFilteredFishData = noExtendedFamily
      };

    // filter training rod
    if (checkedItems.isUsingTrainingRod && selectedSeason != "MagicBait"){
      let setDifficultyCeiling = tempFilteredFishData
        .filter((fish) => !fish.difficulty || fish.difficulty < 50);
      tempFilteredFishData = setDifficultyCeiling
    }

    // filter fishing level requirements
    let fishingHighEnough = tempFilteredFishData
      .filter((fish) => !fish.requiredLevel || fish.requiredLevel <= fishingLevel);
    tempFilteredFishData = fishingHighEnough;

    // filter raining
    if (selectedSeason != "MagicBait") {
      if (checkedItems.isRaining) {
        let raining = tempFilteredFishData
          .filter((fish) => !(fish.weather == "sunny") || fish.IgnoreFishDataRequirements);
        tempFilteredFishData = raining
      } else {
        let sunny = tempFilteredFishData
          .filter((fish) => !(fish.weather == "rainy") || fish.IgnoreFishDataRequirements);
        tempFilteredFishData = sunny
      }
    }

    // trout derby
    // must be after raining and before time
    if (checkedItems.isTroutDerbyActive) {
      let rainbowTrout = weightedFishData.filter((fish) =>
        fish.Condition && fish.Condition.includes("TroutDerby"))
      if (rainbowTrout[0]) rainbowTrout[0].name = "Rainbow Trout (from event)"
      if (rainbowTrout[0]) rainbowTrout[0].time = ["0600", "2600"]
      tempFilteredFishData.concat(rainbowTrout)
    } else {
      let noTroutDerbyTrout = tempFilteredFishData.filter((fish) => 
      !fish.Condition ||
      (fish.Condition && !fish.Condition.includes("TroutDerby")))
      tempFilteredFishData = noTroutDerbyTrout
    }

    // squid fest
    if (checkedItems.isSquidFestActive) {
      let squid = weightedFishData.filter((fish) =>
        fish.Condition && fish.Condition.includes("SquidFest"))

      // squid time
      for (let i in squid) {
        let squidCondition = squid[i].Condition
        if (squidCondition.includes("TIME")) {
          let timeArray = squidCondition.split(" ")
          let timeIndex = timeArray.findIndex((e) => e == "TIME")
          let newTime = [timeArray[timeIndex + 1], timeArray[timeIndex + 2]]
          squid[i].time = newTime
          break;
        } else {
          squid[i].time = ["0600", "0600"]
        }
      }
      for (let i in squid) {if (squid[i]) squid[i].name = "Squid (from event)"}
      tempFilteredFishData.concat(squid)
    } else {
      let noSquidFestSquid = tempFilteredFishData.filter((fish) => 
      !fish.Condition ||
      (fish.Condition && !fish.Condition.includes("SquidFest")))
      tempFilteredFishData = noSquidFestSquid
    }

    // filter times
    if (selectedSeason != "MagicBait") {
      let timeFilter = tempFilteredFishData
      .filter((fish) =>
        fish.IgnoreFishDataRequirements
        || 
        // single window fish
        (fish.time[0] <= timeOfDay &&  fish.time[1] > timeOfDay)
        ||
        // double window fish
        (fish.time.length == 4 &&
        fish.time[2] <= timeOfDay && fish.time[3] > timeOfDay))
      tempFilteredFishData = timeFilter
    }

    setFilteredFishData(tempFilteredFishData)
  }, [weightedFishData, timeOfDay, checkedItems.isExtendedFamilyActive, checkedItems.isRaining, checkedItems.isTroutDerbyActive, checkedItems.isSquidFestActive])


  // calculate chances
  useEffect(() => {
    let tempFishParamArray = [];
    let tempTrashRate = 1
    if (filteredFishData.length > 0){
      if (targetedBaitName === "") {

        // get jelly chance
        if (jellyMode === "longterm") {
          let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
          jelly && (jelly.weight = getJellyChance(filteredFishData, luckBuffs))
        } else if (jellyMode === "nextcatch") {
          let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
          jelly && (jelly.weight = jelly.Chance + 0.05*luckBuffs)
        } else if (jellyMode === "goodseed") {
          let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
          jelly && (jelly.weight = 1)
        } else if (jellyMode === "badseed") {
          let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
          jelly && (jelly.weight = 0)
        }
  
        for (let i in filteredFishData) {
          let fish = filteredFishData[i]
          fish.finalChance = rollFishPool(filteredFishData, i)
          tempTrashRate -= fish.finalChance
          tempFishParamArray.push(fish);
        }
      }
  
      setTrashRate(Math.max(0, tempTrashRate))
      tempFishParamArray.sort((a, b) => b.finalChance-a.finalChance)
      setFishDataWithChance(tempFishParamArray);
    } else {
      setFishDataWithChance([])
    }
  }, [filteredFishData, targetedBaitName])


  function calculateWeight(fish) {
    let weight = fish.baseRate*fish.Chance
    weight *= (1 - Math.max(0, fish.maxDepth - waterDepth) * fish.depthMultiplier);
    weight += 0.02 * fishingLevel
    if (checkedItems.isUsingTrainingRod && selectedSeason != "MagicBait") weight *= 1.1
    weight = Math.min(weight, 0.9)
    if (checkedItems.isCuriosityLureActive && weight < 0.25) {
      if (fish.CuriosityLureBuff > -1) {
        weight += fish.CuriosityLureBuff
      } else {
        weight = (0.68 * weight + 0.085);
      }
    }
    if (targetedBaitName == fish.name) {
      weight *= 1.66
    }
    if (fish.ApplyDailyLuck) {
      weight += dailyLuck
    }
    return weight;
  }

  const handleTimeChange = (value) => setTimeOfDay(value);
  const handleFishingLevelChange = (value) => setFishingLevel(value);
  const handleDepthChange = (value) => setWaterDepth(value);
  const handleJellyModeChange = (value) => setJellyMode(value);
  const handleLuckBuffsChange = (value) => setLuckBuffs(value);
  const handleLocationChange = (value) => setSelectedLocation(value);
  const handleSeasonChange = (value) => setSelectedSeason(value);
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckedItems({
      ...checkedItems,
      [id]: checked,
    });
  };
  
  return (
    <Layout>
      <div className="items-center justify-center mt-16 mb-16 gap-6 grid md:grid-flow-row lg:grid-flow-col">
        <div ref={parametersWindow} className="bg-white p-8 rounded shadow-xl">
          <h1 className="lg:text-2xl md:text-lg font-bold mb-4 flex-wrap">Stardew Valley Fishing Calculator</h1>
          <p className="text-lg text-gray-700">Calculates how likely fish will bite!</p>

          <div className='mt-6 mb-6'>
            <div className="rounded-lg bg-green-200 text-green-800 p-2">
              <p className="lg:text-lg md:text-base font-bold mb-2">Season</p>
              <div className="flex gap-4 items-center flex-wrap">
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile018.png"
                  label="Spring"
                  deselectedColor="bg-white"
                  selectedColor="bg-green-300"
                  checked={selectedSeason === 'spring'}
                  onChange={() => handleSeasonChange('spring')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile402.png"
                  label="Summer"
                  deselectedColor="bg-white"
                  selectedColor="bg-green-300"
                  checked={selectedSeason === 'summer'}
                  onChange={() => handleSeasonChange('summer')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile408.png"
                  label="Fall"
                  deselectedColor="bg-white"
                  selectedColor="bg-green-300"
                  checked={selectedSeason === 'fall'}
                  onChange={() => handleSeasonChange('fall')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile416.png"
                  label="Winter"
                  deselectedColor="bg-white"
                  selectedColor="bg-green-300"
                  checked={selectedSeason === 'winter'}
                  onChange={() => handleSeasonChange('winter')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile908.png"
                  label="Magic Bait"
                  deselectedColor="bg-white"
                  selectedColor="bg-green-300"
                  checked={selectedSeason === 'MagicBait'}
                  onChange={() => handleSeasonChange('MagicBait')}
                />
              </div>
            </div>
          </div>

          <div className='mt-2 mb-2'>
            <div className="rounded-lg bg-blue-200 text-blue-800 p-2">
              <p className="lg:text-lg md:text-base font-bold mb-2">Fishing Location</p>
              <div className="flex gap-4 items-center flex-wrap">
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile325.png"
                  label="Pelican Town"
                  deselectedColor="bg-white"
                  selectedColor="bg-blue-300"
                  checked={selectedLocation === 'Town'}
                  onChange={() => handleLocationChange('Town')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile311.png"
                  label="Cindersap Forest"
                  deselectedColor="bg-white"
                  selectedColor="bg-blue-300"
                  checked={selectedLocation === 'Forest'}
                  onChange={() => handleLocationChange('Forest')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile372.png"
                  label="Beach"
                  deselectedColor="bg-white"
                  selectedColor="bg-blue-300"
                  checked={selectedLocation === 'Beach'}
                  onChange={() => handleLocationChange('Beach')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile032.png"
                  label="Mountain Lake"
                  deselectedColor="bg-white"
                  selectedColor="bg-blue-300"
                  checked={selectedLocation === 'Mountain'}
                  onChange={() => handleLocationChange('Mountain')}
                />
                <RadioOptions
                  customIcon="/stardew-fishing-calc/assets/tile090.png"
                  label="Desert"
                  deselectedColor="bg-white"
                  selectedColor="bg-blue-300"
                  checked={selectedLocation === 'Desert'}
                  onChange={() => handleLocationChange('Desert')}
                />
              </div>
            </div>
          </div>

          <div className='mt-6 mb-6'>
            <p className="text-lg font-bold mb-2">Fishing Time</p>
            <TimeSlider
              value={timeOfDay}
              disabled={(selectedSeason == 'MagicBait') ? true : false}
              onChange={handleTimeChange} 
            />
          </div>

          <div className='mt-6 mb-6'>
            <p className="text-lg font-bold mb-2">Fish Pool Modifiers</p>
            <div className="grid sm:grid-cols-1 md:grid-cols-2">
              <div>
                <Checkbox
                  label="Raining"
                  checked={checkedItems.isRaining}
                  disabled={(selectedSeason == 'MagicBait') ? true : false}
                  onChange={handleCheckboxChange}
                  id="isRaining"
                />
                <Checkbox
                  label="Using training rod"
                  checked={(selectedSeason == 'MagicBait') ? false : checkedItems.isUsingTrainingRod}
                  disabled={(selectedSeason == 'MagicBait') ? true : false}
                  onChange={handleCheckboxChange}
                  id="isUsingTrainingRod"
                />
              </div>
              <div>
              <Checkbox
                  label="Extended family quest"
                  onChange={handleCheckboxChange}
                  id="isExtendedFamilyActive"
                />
                <Checkbox
                  label="Trout derby active"
                  onChange={handleCheckboxChange}
                  id="isTroutDerbyActive"
                />
                <Checkbox
                  label="Squid fest active"
                  onChange={handleCheckboxChange}
                  id="isSquidFestActive"
                />
              </div>
            </div>
          </div>

          <div className='mt-6 mb-6'>
            <p className="text-base font-bold mb-2">Catch Rate Modifiers</p>
            <div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 mb-4 gap-16">
                <div>
                  <p className="text-base font-semibold mb-2">Fishing Level:</p>
                  <GenericSlider
                    min={0}
                    max={15}
                    value={fishingLevel}
                    onChange={handleFishingLevelChange} 
                  />
                  <p className="text-base font-semibold mb-2">Luck Buff Level:</p>
                  <GenericSlider
                    min={0}
                    max={8}
                    value={luckBuffs}
                    onChange={handleLuckBuffsChange} 
                  />
                </div>
                <div>
                  <p className="text-base font-semibold mb-2">Water Depth:</p>
                  <GenericSlider
                    min={0}
                    max={5}
                    value={waterDepth}
                    onChange={handleDepthChange} 
                  />
                  <Checkbox
                    label="Using curiosity lure"
                    onChange={handleCheckboxChange}
                    id="isCuriosityLureActive"
                  /> 
                </div>
              </div>
              <div>
                
              </div>
            </div>
          </div>

          <div className='mt-6 mb-6'>
            <Accordion
              title="Advanced Options"
            >
              <div className="rounded-lg p-2">
                <div className="flex flex-row gap-2">
                  <p className="text-base text-gray-800 font-semibold mb-2">Jelly Calculation Mode:</p>
                  <Tooltip>
                    <div className="w-96 text-wrap">
                      <p className="font-semibold">Jelly chance is a bit tricky.</p>
                      <p>Whether you catch it or not depends on a seed. That seed depends on the number of fish you caught (excluding trash and algae). So we&apos;ve included several options:</p>
                      <ul className="list-decimal list-inside">
                        <li>Long-term (default): The long term expected chance to catch jelly.</li>
                        <li>Next catch: The immediate chance to catch jelly given a random state. Your chance decreases when you catch trash.</li>
                        <li>Good seed: If you have the correct seed, the chance for jelly becomes 1. There&apos;s still other fish to account for, though.</li>
                        <li>Bad seed: If you have the wrong seed, the chance for jelly becomes 0.</li>
                      </ul>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <SmallOptions
                    label="Long-term"
                    deselectedColor="bg-gray-300"
                    selectedColor="bg-white"
                    checked={jellyMode === 'longterm'}
                    onChange={() => handleJellyModeChange('longterm')}
                  />
                  <SmallOptions
                    label="Next catch"
                    deselectedColor="bg-gray-300"
                    selectedColor="bg-white"
                    checked={jellyMode === 'nextcatch'}
                    onChange={() => handleJellyModeChange('nextcatch')}
                  />
                  <SmallOptions
                    label="Good seed"
                    deselectedColor="bg-gray-300"
                    selectedColor="bg-white"
                    checked={jellyMode === 'goodseed'}
                    onChange={() => handleJellyModeChange('goodseed')}
                  />
                  <SmallOptions
                    label="Bad seed"
                    deselectedColor="bg-gray-300"
                    selectedColor="bg-white"
                    checked={jellyMode === 'badseed'}
                    onChange={() => handleJellyModeChange('badseed')}
                  />
                </div>
              </div>
            </Accordion>
          </div>
        </div>
        
          <div ref={fishDisplayWindow} style={{ maxHeight }} className="bg-white rounded shadow-xl lg:w-80 lg:h-full lg:overflow-y-auto">
          <div className="sticky top-0 bg-gray-200 text-gray-600 p-4">
              <h3 className="text-xl font-bold">You will catch...</h3>
          </div>
          <div className="flex flex-grow flex-col bg-white py-4">
            {fishDataWithChance.map((fish, index) => {
              const iconNumber = (fish.Id) ? fish.Id.substring(3) : null;
              const iconPath = `/stardew-fishing-calc/assets/tile${iconNumber}.png`;

              return (
                <FishCard
                  key={index}
                  name={fish.name}
                  chance={parseFloat(fish.finalChance*100).toFixed(2)+"%"}
                  // chance={Math.round(fish.finalChance*10000)/10000}
                  icon={iconPath}
                />
              );
            })}
            <FishCard
                key={fishDataWithChance.length}
                name="Trash"
                chance={parseFloat(trashRate*100).toFixed(2)+"%"}
                icon={`/stardew-fishing-calc/assets/tile168.png`}
              />
          </div>

        </div>
      </div>
    </Layout>
    
   
  );
}