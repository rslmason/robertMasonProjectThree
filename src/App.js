import { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import firebase from './firebase';
import './App.css';
import Fleet from './components/Fleet'
import Results from './components/Results';
import Instructions from './components/Instructions';

import FleetObj from './components/FleetObj';

function App() {
	
	
	const [fleetOne, fleetOneUpdate] = useState(new FleetObj(()=>{}, "DummyOne"))
	const [fleetTwo, fleetTwoUpdate] = useState(new FleetObj(()=>{}, "DummyTwo"))
	
	// I assume there are better ways to do this with hooks.
	let firstRender = useRef(true)
	if (firstRender.current === true) {
		fleetOneUpdate({...new FleetObj(fleetOneUpdate, "One")})
		fleetTwoUpdate({...new FleetObj(fleetTwoUpdate, "Two")})
		firstRender.current = false
	}

	const [results, setResults] = useState({})

	useEffect(()=>{
		const dataBase = getDatabase(firebase)
		const dbRef = ref(dataBase)
		
		onValue(dbRef, (response) => {
			setResults(response.val() || {})
		})
	}, [])

	let greaterFleetKey;
	let lesserFleetKey;
	let survivalOne;
	let survivalTwo;
	let resultsArray;
	let bcOneIndex;
	let bcTwoIndex;
	if (fleetOne.customStringify() > fleetTwo.customStringify()) {
		greaterFleetKey = fleetOne.customStringify()
		lesserFleetKey = fleetTwo.customStringify()
		resultsArray = results['winsLosses']?.[greaterFleetKey]?.[lesserFleetKey]
		bcOneIndex = 0;
		bcTwoIndex = 1;
		survivalOne = "greaterFleet";
		survivalTwo = "lesserFleet";
	}
	else {
		greaterFleetKey = fleetTwo.customStringify()
		lesserFleetKey = fleetOne.customStringify()
		if (results['winsLosses']?.[greaterFleetKey]?.[lesserFleetKey]) {
			resultsArray = [
				results['winsLosses'][greaterFleetKey][lesserFleetKey][1],
				results['winsLosses'][greaterFleetKey][lesserFleetKey][0],
				results['winsLosses'][greaterFleetKey][lesserFleetKey][2]
			]
		}
		bcOneIndex = 1;
		bcTwoIndex = 0;
		survivalOne = "lesserFleet";
		survivalTwo = "greaterFleet";
	}



	return <>
		<Instructions/>
		<div className="fleets">
			<Fleet fleet={fleetOne} survival={results[survivalOne]?.[greaterFleetKey]?.[lesserFleetKey]} results={results['winsLosses']?.[greaterFleetKey]?.[lesserFleetKey]}/> 
			<Fleet fleet={fleetTwo} survival={results[survivalTwo]?.[greaterFleetKey]?.[lesserFleetKey]} results={results['winsLosses']?.[greaterFleetKey]?.[lesserFleetKey]}/>
		</div>
		<div className = 'lower'>
			<Results results={
				resultsArray
			}/>
			
			<button onClick={()=>{

				// this works. 
				let resultsArray = [0,0,0];

				let bcOneSurvivalArrays = {
				}
				let bcTwoSurvivalArrays = {
				}
				for (let i = 0; i < 1000; i++) {
					let bcOne = fleetOne.BattleCopy()
					let bcTwo = fleetTwo.BattleCopy()
					bcOne.assignHits(bcTwo.antiFighterBarrage(), 'fighter')
					bcTwo.assignHits(bcOne.antiFighterBarrage(), 'fighter')
					while (bcOne.shipStack.length && bcTwo.shipStack.length) {
						let tempHits = bcOne.battle();
						bcOne.assignHits(bcTwo.battle());
						bcTwo.assignHits(tempHits);
					}
					if (bcOne.shipStack.length) {
						resultsArray[bcOneIndex]++
						
						let shipCounters = {
							"fighter": 0,
							"fighter sustain": 0,
							"destroyer": 0,
							"destroyer sustain": 0,
							"cruiser": 0,
							"cruiser sustain": 0,
							"dreadnought": 0,
							"dreadnought sustain": 0,
							"war sun": 0,
							"war sun sustain": 0,
							"carrier": 0,
							"carrier sustain": 0,
							"flagship": 0,
							"flagship sustain": 0,
						}
						for (let i = bcOne.shipStack.length -1; i>=0; i--) {

							if (bcOneSurvivalArrays[bcOne.shipStack[i].type] === undefined) {
								bcOneSurvivalArrays[bcOne.shipStack[i].type] = []
							}

							if (bcOneSurvivalArrays[bcOne.shipStack[i].type][shipCounters[bcOne.shipStack[i].type]] === undefined) {
								bcOneSurvivalArrays[bcOne.shipStack[i].type][shipCounters[bcOne.shipStack[i].type]] = 1
							}
							else {
								bcOneSurvivalArrays[bcOne.shipStack[i].type][shipCounters[bcOne.shipStack[i].type]] ++
							}
							shipCounters[bcOne.shipStack[i].type]++
						}
					}
					else if (bcTwo.shipStack.length) {
						resultsArray[bcTwoIndex]++

						let shipCounters = {
							"fighter": 0,
							"fighter sustain": 0,
							"destroyer": 0,
							"destroyer sustain": 0,
							"cruiser": 0,
							"cruiser sustain": 0,
							"dreadnought": 0,
							"dreadnought sustain": 0,
							"war sun": 0,
							"war sun sustain": 0,
							"carrier": 0,
							"carrier sustain": 0,
							"flagship": 0,
							"flagship sustain": 0,
						}
						for (let i = bcTwo.shipStack.length -1; i>=0; i--) {

							if (bcTwoSurvivalArrays[bcTwo.shipStack[i].type] === undefined) {
								bcTwoSurvivalArrays[bcTwo.shipStack[i].type] = []
							}

							if (bcTwoSurvivalArrays[bcTwo.shipStack[i].type][shipCounters[bcTwo.shipStack[i].type]] === undefined) {
								bcTwoSurvivalArrays[bcTwo.shipStack[i].type][shipCounters[bcTwo.shipStack[i].type]] = 1
							}
							else {
								bcTwoSurvivalArrays[bcTwo.shipStack[i].type][shipCounters[bcTwo.shipStack[i].type]] ++
							}
							shipCounters[bcTwo.shipStack[i].type]++
						}
					}
					else {
						resultsArray[2]++
					}
				}

				let resultObj = {};

				if (results && results['winsLosses'] && results['winsLosses'][greaterFleetKey]) {
					resultObj = results['winsLosses'][greaterFleetKey];
				}
				if (resultObj[lesserFleetKey] !== undefined) {
					resultObj[lesserFleetKey].forEach(function (val, i, arr) {arr[i] += resultsArray[i]})
				}
				else {
					resultObj[lesserFleetKey] = resultsArray
				}
				let pathObj = {}
				pathObj[greaterFleetKey] = resultObj

				update(ref(getDatabase(firebase), 'winsLosses'), pathObj)

				resultObj = {}
				if (results && results[survivalOne] && results[survivalOne][greaterFleetKey]) {
					resultObj = results[survivalOne][greaterFleetKey];
				}
				if (resultObj[lesserFleetKey] !== undefined) {
					for (let shipTypeArray in resultObj[lesserFleetKey]) {
						resultObj[lesserFleetKey][shipTypeArray].forEach(function (val, i, arr) {arr[i] += (bcOneSurvivalArrays[shipTypeArray]?.[i] || 0)})
					}
				}
				else {
					resultObj[lesserFleetKey] = bcOneSurvivalArrays
				}
				
				pathObj[greaterFleetKey] = resultObj
				update(ref(getDatabase(firebase), survivalOne), pathObj)
				
				resultObj = {}
				if (results && results[survivalTwo] && results[survivalTwo][greaterFleetKey]) {
					resultObj = results[survivalTwo][greaterFleetKey];
				}
				if (resultObj[lesserFleetKey] !== undefined) {
					for (let shipTypeArray in resultObj[lesserFleetKey]) {
						resultObj[lesserFleetKey][shipTypeArray].forEach(function (val, i, arr) {arr[i] += (bcTwoSurvivalArrays[shipTypeArray]?.[i] || 0)})
					}
				}
				else {
					resultObj[lesserFleetKey] = bcTwoSurvivalArrays
				}
				
				pathObj[greaterFleetKey] = resultObj
				update(ref(getDatabase(firebase), survivalTwo), pathObj)

			}}>Battle!</button>
		</div>
  	</>
}

export default App;
