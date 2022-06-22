import { Ships } from './Ships.js'

export default FleetObj;

function ShipGroup (shipType, n) {
    this.type = shipType
    this.number = n
    this.merge = function (shipGroup, className) {
        this.className = className;
        if (this.type === shipGroup.type) {
            this.number += shipGroup.number;
        } 
        this.mergeCount = shipGroup.number;
    }
    this.pull = function (n) {
        if (this.mergeCount) {
            this.number -= this.mergeCount;
            let removed = this.mergeCount;
            this.mergeCount = null;
            this.className = null;
            return new ShipGroup (this.type, removed)
        }
        if (n < this.number) {
            this.number -= n;
            return new ShipGroup (this.type, n)
        }
        else return this
    }
}

function FleetObj (updateFunc, number) {
    this.number = number
    this.shipGroups = [];

    this.stateFunction = updateFunc;

    this.updateState = function () {
        this.stateFunction({...this})
    }

    this.addShips = function (shipType, n = 1) {

        let i = 0
        while (i<this.shipGroups.length && n > 0) {
            if (this.shipGroups[i].type === shipType) {
                this.shipGroups[i].number += n;
                n = 0;
            }
            i++
        }
        if (n) {
            this.shipGroups.push(new ShipGroup(shipType, n))
        }
        this.updateState()
    }

    this.removeShips = function (shipType, n = 1) {

        let i = this.shipGroups.length - 1;
        while (i>=0 && n > 0) {
            if (this.shipGroups[i].type === shipType) {
                if (this.shipGroups[i].number <= n) {
                    n -= this.shipGroups[i].length
                    this.shipGroups.splice(i,1)
                }
                else {
                    this.shipGroups[i].number -= n
                    n = 0
                }
            }
            i--
        }
        this.updateState()
    }

    this.count = function (str) {
        let count = 0;
        for (let i=0;i<this.shipGroups.length;i++){
            if (this.shipGroups[i].type === str) {
                count += this.shipGroups[i].number
            }
        }
        return count
    }

    this.move = function (moving, target) {
        if (moving !== target && !target.className?.includes('merging')) {

            let targetWasStaticMerging = target.className?.includes('staticMerging');

            if (this.shipGroups[moving.index].className?.includes('merging')) {         
                this.shipGroups.splice(moving.index, 0, this.shipGroups[moving.index].pull())
                if (moving.index < target.index) {
                    target.index ++
                }
                else {
                    // ?
                }
            }

            if (this.shipGroups[moving.index-1]?.type === this.shipGroups[moving.index+1]?.type) {
                this.shipGroups[moving.index-1].merge(this.shipGroups[moving.index+1],'staticMerging')
                this.shipGroups.splice(moving.index + 1, 1)
                if (target.index === moving.index + 1) {
                    target.index = moving.index;
                }
                else if (moving.index < target.index) {
                    target.index --
                }
                else {
                    // ?
                }
            }

            this.shipGroups.splice(moving.index, 1)
            this.shipGroups.splice(target.index, 0, moving)
            moving.index = target.index
            if (targetWasStaticMerging) {
                this.shipGroups.splice(moving.index + 1, 0, target.pull())
            }

            if (this.shipGroups[moving.index+1]?.type === moving.type) {
                this.shipGroups[moving.index+1].merge(moving,'merging')
                this.shipGroups.splice(moving.index, 1)
            }
            else if (this.shipGroups[moving.index-1]?.type === moving.type){
                this.shipGroups[moving.index-1].merge(moving,'merging')
                this.shipGroups.splice(moving.index, 1)
                moving.index -= 1;
            }

            // now check for sustain legality?

            this.updateState()
        }
    }



    //firebase stuff

    this.customStringify = function () {
        let str = ""
        this.shipGroups.forEach(shipGroup => {
            str += shipGroup.type.match(/\b([a-z][a-z])|(su)/g).join("") + shipGroup.number
        })

        return str || "empty"
    }


    // This is battle stuff.  
    this.BattleCopy = function () {

        let shipArray = [];
        for (let i = 0; i<this.shipGroups.length; i++) {
            for (let j = 0; j< this.shipGroups[i].number;j++){
                if (this.shipGroups[i].type.includes("sustain")) {
                    // shipArray.push(Ships.find(element => element.name.toLowerCase() === this.shipGroups[i].type.slice(0,this.shipGroups[i].type.length-8)).prototype.SustainCopy())
                    shipArray.push(Ships.find(element => element.prototype.type === this.shipGroups[i].type.slice(0,this.shipGroups[i].type.length-8)).prototype.SustainCopy())
                    // console.log(Ships.find(element => element.prototype.type === this.shipGroups[i].type.slice(0,this.shipGroups[i].type.length-8)).prototype.SustainCopy())
                }
                else {
                    shipArray.push(Ships.find(element => element.prototype.type === this.shipGroups[i].type)())
                }
            }
        }

        let battleCopy = {
            shipStack: shipArray.slice(),
            assignHits: function (n, type = undefined, strict = true) {
                if (type) {
                        for (let i = 0; i < this.shipStack.length && n > 0; i++) {
                            if (this.shipStack[i].type === type) {
                                if (this.shipStack[i].takeHit() === 'destroyed') {
                                    this.shipStack.splice(i,1)
                                }
                                n--
                            }
                        }
                }
                if (!type || !strict) {
                        for (let i = 0; i < this.shipStack.length && n > 0; i++) {
                            if (this.shipStack[i].takeHit() === 'destroyed') {
                                this.shipStack.splice(i,1)
                            }
                            n--
                        }
                }
            },

            battle: function () {
                return this.cycleAbilities('battle')
            },
            antiFighterBarrage: function () {
                return this.cycleAbilities('antiFighterBarrage')
            },
            cycleAbilities: function (func) {
                let result = 0;
                for (let ship of this.shipStack) {
                    result += ship[func]()
                }
                return result
            }
        }

        return battleCopy
    }
}