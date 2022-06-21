import ShipContainer from './ShipContainer.js'
import ShipTotals from './ShipTotals.js'
import ShipStats from './ShipStats.js'

export default Fleet;

function Fleet (props) {
    return <div>
        <h2>Fleet {props.fleet.number}</h2>
        <ShipContainer fleet={props.fleet} survival={props.survival} results={props.results}/>
        <ShipTotals fleet={props.fleet}/>
        <ShipStats fleet={props.fleet}/>
    </div>
}