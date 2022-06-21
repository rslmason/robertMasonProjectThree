export default ShipElement

function ShipElement (props) {
    return <div className={"ship " + props.shipGroup.className}
            onMouseDown={ (event) => {
                if (event.ctrlKey){
                    props.moving.current = props.shipGroup.pull(Math.ceil(props.shipGroup.number/2));
                }
                else if (event.shiftKey){
                    props.moving.current = props.shipGroup.pull(1);
                }
                else {
                    props.moving.current = props.shipGroup;
                }

                if (props.shipGroup !== props.moving.current){
                    props.shipGroup.merge(props.moving.current,'merging')
                }

                props.moving.current.className = "moving";
                props.moving.current.index = props.index;
                props.fleet.updateState()

                document.addEventListener('mouseup',()=>{
                    props.moving.current.className = null;
                    props.moving.current = null;
                    props.fleet.shipGroups.forEach(shipGroup=>{
                        shipGroup.className = "";
                        shipGroup.mergeCount = 0
                    })
                    props.fleet.updateState()
                }, {once:true})

            }}

            onMouseOver = { () => {
                if (props.moving.current) {
                    props.shipGroup.index = props.index;
                    props.fleet.move(props.moving.current, props.shipGroup)
                }
                
            }}
        >
            {props.shipGroup.number} {props.shipGroup.type + (props.shipGroup.number > 1 ? "s" : "")} {props.shipGroup.mergeCount ? `(${props.shipGroup.number - props.shipGroup.mergeCount} + ${props.shipGroup.mergeCount})` : ""}<span>{props.rates}</span>
            {/* <button onClick = {()=>{
                props.shipGroup.number += 1;
                props.fleet.updateState()
            }}>+</button> */}
        </div>
}
