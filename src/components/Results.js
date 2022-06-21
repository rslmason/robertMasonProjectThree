export default function Results (props) {
    if (props.results) {
        let total = props.results.reduce((a,b) => a + b, 0)
        return <ul>
            {/* {props.results.map((r, index) => <li key = {index}>{(r/total*100).toFixed(2) + '% — ' + r}</li>)} */}
            <li key = {0}>{"Fleet One: " + (props.results[0]/total*100).toFixed(2) + '% — ' + props.results[0]}</li>
            <li key = {2}>{"Tie: " + (props.results[2]/total*100).toFixed(2) + '% — ' + props.results[2]}</li>
            <li key = {1}>{"Fleet Two: " + (props.results[1]/total*100).toFixed(2) + '% — ' + props.results[1]}</li>
        </ul>
    }
    else {
        return <ul><li>No battle results yet.</li></ul>
    }
}