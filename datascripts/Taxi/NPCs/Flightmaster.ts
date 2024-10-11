import {std} from "wow/wotlk"
import { CreatureInstancePosition } from "wow/wotlk/std/Creature/CreatureTemplate"

enum Faction {
    ALLIANCE,
    HORDE
}

function spawnFlightMasters(faction: Faction, spawns: CreatureInstancePosition[]) {
    const name = faction == Faction.ALLIANCE ? "AllianceFlightMaster" : "HordeFlightMaster"
    const modelID = faction == Faction.ALLIANCE ? 5128 : 2098

    std.CreatureTemplates.create('trevis', name)
    .Name.enGB.set('Flightmaster')
    .Models.addIds(modelID)
    .NPCFlags.FLIGHT_MASTER.set(true)
    .NPCFlags.GOSSIP.set(true)
    .Gossip.modNew(gossip=>{
        gossip.Text.add({enGB:'Haha'})
    })
    .Spawns.add('trevis', name, spawns)
}

spawnFlightMasters(Faction.ALLIANCE,
    [
        {map:0,x:-9437.098633,y:86.529785,z:57.098427,o:5.460080},      // goldshire
        {map:0,x:-5658.920410,y:-494.865540,z:396.980682,o:1.205576},   // kharanos
        {map:1,x:9968.129883,y:2627.334473,z:1315.407471,o:4.194031},   // darnassus
        {map:1,x:9872.507812,y:979.104309,z:1309.955811,o:3.467300},    // dolanaar
    ]
)

spawnFlightMasters(Faction.HORDE,
    [
        {map:1,x:-2170.129150,y:-365.931702,z:-4.222373,o:0.5},    // bloodhoof village
    ]
)