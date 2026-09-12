function vehicle(){return VEHICLES[state.vehicleIndex]}
function equipped(type){return findPart(state.tank.equipped[type])||chapterPart(type,0)}
function loadUsed(){return ['main','sub','se','engine','armor'].reduce((s,t)=>s+(equipped(t).weight||0),0)}
function loadMax(){return vehicle().load+equipped('engine').capacity+state.tank.upgrades.engine*2+(state.party.taoyao?2:0)}
function tankMax(){return Math.round(vehicle().max*(1+state.tank.upgrades.armor*.1)+(equipped('armor').hp||0))}
function tankDef(){return vehicle().armor+(equipped('armor').def||0)+state.tank.upgrades.armor}
function tankAtk(slot='main'){const p=equipped(slot),lv=state.tank.upgrades[slot]||0;return Math.round(p.power*(1+lv*.14))}
function tankName(){return vehicle().name}
