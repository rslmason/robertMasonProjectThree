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
            let shown100 = false;
            if (propsSurvivalClone[props.fleet.shipGroups[i].type]) {
                survivalRates[i] = propsSurvivalClone[props.fleet.shipGroups[i].type]
                    .splice(0,props.fleet.shipGroups[i].number)
                    .reverse() 
                    .map(function(val, index, array) 
                        {let percentage = val/total * 100;
                            if (percentage !== 100) {
                                return (array.length - index) + ": " + percentage.toFixed(1) + "% "
                                // return (index + 1) + ": " + percentage.toFixed(1) + "% "
                            }
                            else {
                                if (!shown100) {
                                    shown100 = true
                                    if (index === 0) {
                                        return `${array.length}: ${percentage.toFixed(1)}%`
                                    }
                                    else {
                                        return (array.length - index) + ": " + percentage.toFixed(1) + "% "
                                        // return index + 1 + ": " + percentage.toFixed(1) + "% "
                                    }
                                }
                                else {
                                    return ""       
                                }
                            }
                        }
                    )
                    .reverse()
            }
            else {
                survivalRates[i] = '0%'
            }
        }
    }
    else {
        for (let i = props.fleet.shipGroups.length -1; i >=0; i--) {
            survivalRates[i] = ''
        }
    }

    return <div className="shipContainer">
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
}