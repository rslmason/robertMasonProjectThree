import { useRef } from 'react'
import ShipElement from './ShipElement.js'
export default ShipContainer;


function ShipContainer (props) {
    let moving = useRef(null)

    let total;
    if (props.results) {
        total = props.results.reduce((a,b) => a + b, 0)
    }

    let survivalRates = [];
    let propsSurvivalClone = {};
    if (props.results) {
        for (let key in props.survival) {
            propsSurvivalClone[key] = props.survival[key].slice()
        }
        for (let i = props.fleet.shipGroups.length -1; i >=0; i--) {
            if (propsSurvivalClone[props.fleet.shipGroups[i].type]) {
                survivalRates[i] = propsSurvivalClone[props.fleet.shipGroups[i].type]
                    .splice(0,props.fleet.shipGroups[i].number)
                    .map(function(val, index) 
                        {let percentage = val/total * 100;
                            if (percentage !== 100) {
                                return index + 1 + ": " + percentage.toFixed(1) + "% "
                            }
                            else {
                                return ""
                            }
                        }
                    )
            }
            else {
                survivalRates[i] = '0%'
            }
        
        
        // survivalRates[i] = propsSurvivalClone?.[props.fleet.shipGroups[i].type]?.splice(0,props.fleet.shipGroups[i].number).map(function(val, index) {return index+1 + ": " + (val/total*100).toFixed(1) + "% "}) || "specialString"
        }
    }
    else {
        for (let i = props.fleet.shipGroups.length -1; i >=0; i--) {
            survivalRates[i] = ''
        }
    }

    
    // for (let i = props.fleet.shipGroups.length -1; i >=0; i--) {
        
    //         if (propsSurvivalClone[props.fleet.shipGroups[i].type]) {
    //             survivalRates[i] = propsSurvivalClone[props.fleet.shipGroups[i].type].splice(0,props.fleet.shipGroups[i].number).map(function(val, index) {return index+1 + ": " + (val/total*100).toFixed(1) + "% "})
    //         }
    //         else {
    //             survivalRates[i] = 's0%'
    //         }
        
        
    //     // survivalRates[i] = propsSurvivalClone?.[props.fleet.shipGroups[i].type]?.splice(0,props.fleet.shipGroups[i].number).map(function(val, index) {return index+1 + ": " + (val/total*100).toFixed(1) + "% "}) || "specialString"
    // }

    return <>
        
        <div className="shipContainer">
            {props.fleet.shipGroups.map(function (shipGroup, index) {
                return <ShipElement 
                    key = {index}
                    index = {index}
                    shipGroup={shipGroup} 
                    moving={moving} 
                    fleet={props.fleet}
                    rates = {survivalRates[index]}
                />
            })}
        </div>

    </>
}