// export default Fighter;
exports.Ships = [Fighter,Destroyer,Cruiser,Dreadnought,WarSun,Carrier]

const shipPrototype = {
    rollDie: function () {
        return Math.ceil(Math.random()*10)
    },
    battle: function () {
        return this.rollDie() >= this.battleValue
    },
    antiFighterBarrage: function () {
        return 0
    },
    sustain: false,

    takeHit: function () {
        if (this.sustain) {
            // this.sustain = false
            return 'destroyed'
        }
        else {
            return 'destroyed'
        }
    },

    SustainCopy: function () {
        let copy = {
            type: this.type + " sustain",
            battle: function () {return 0},
            antiFighterBarrage: function () {return 0},
            takeHit: function () {
                // ask the fleet to take a hit of this type?
                // splice self out of array?
                // the former is preferable, since that allows us to restore sustain
                // after a round of combat, etc.
                return 'destroyed'
            }
        }
        return copy
    }
}

let fighterPrototype = Object.assign(Object.create(shipPrototype), {
    type: 'fighter',
    battleValue: 9,
})

function Fighter () {
    return Object.create(fighterPrototype)
}
Fighter.prototype = fighterPrototype

let destroyerPrototype = Object.assign(Object.create(shipPrototype), {
    type: "destroyer",
    battleValue: 9,
    afbShots: 2,
    afbValue: 9,
    antiFighterBarrage: function () {
        let hits = 0;
        for  (let i=0;i<this.afbShots;i++) {
            hits += Math.ceil(Math.random()*10) >= this.afbValue
        }
        return hits
    }
})

function Destroyer () {
    return Object.create(destroyerPrototype)
}
Destroyer.prototype = destroyerPrototype

let dreadnoughtPrototype = Object.assign(Object.create(shipPrototype), {
    battleValue: 5,
    type: "dreadnought",
    sustain: true,
})

function Dreadnought () {
    return Object.create(dreadnoughtPrototype)
}
Dreadnought.prototype = dreadnoughtPrototype

let carrierPrototype = Object.assign(Object.create(shipPrototype), {
    type: 'carrier',
    battleValue: 9,
})

function Carrier () {
    return Object.create(carrierPrototype)
}
Carrier.prototype = carrierPrototype

let cruiserPrototype = Object.assign(Object.create(shipPrototype), {
    type: 'cruiser',
    battleValue: 7,
})

function Cruiser () {
    return Object.create(cruiserPrototype)
}
Cruiser.prototype = cruiserPrototype

let warSunPrototype = Object.assign(Object.create(shipPrototype), {
    type: 'war sun',
    battleValue: 3,
    battle: function () {
        let hits = 0
        for (let i = 0; i<3;i++) {
            hits += this.rollDie() >= this.battleValue
        }
        return hits
    },
    sustain: true,
})

function WarSun () {
    return Object.create(warSunPrototype)
}
WarSun.prototype = warSunPrototype;
