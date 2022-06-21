export default Instructions

function Instructions () {
    return <div className="instructions">
        <h2>Instructions</h2>
        <p>This web app simulates space combat for the board game Twilight Imperium (4th ed.). Start by adding ships to each fleet. The list of ships represents the order in which they will be destroyed in the course of combat, with ships on the top being destroyed before ships on the bottom. Click and drag groups of ships to reorder them. Shift-click and drag to only one one ship in a group. Ctrl-click or Cmd-click and drag to move half of them. Each press of the "Battle!" button simulates 1000 battles.</p>
        <p>Results are stored by fleet composition. The app will show you the total results generated so far, by all users, for a given fleet-composition matchup. </p>
    </div>
}