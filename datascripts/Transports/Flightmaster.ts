import {std} from "wow/wotlk"
import { CreatureInstancePosition } from "wow/wotlk/std/Creature/CreatureTemplate"
import { FactionTemplateValues } from "wow/wotlk/std/Faction/FactionTemplates"

enum Faction {
    ALLIANCE,
    HORDE
}

function spawnFlightMasters(faction: Faction, spawns: CreatureInstancePosition[]) {
    let name
    let modelID
    if (faction == Faction.HORDE) {
        name = "HordeFlightMaster"
        modelID = 2098
    } else {
        name = "AllianceFlightMaster"
        modelID = 5128
    }

    std.CreatureTemplates.create('trevis', name)
    .Name.enGB.set('Flightmaster')
    .Models.addIds(modelID)
    .FactionTemplate.set(faction ? FactionTemplateValues.ORGRIMMAR : FactionTemplateValues.STORMWIND)
    .NPCFlags.FLIGHT_MASTER.set(true)
    .NPCFlags.GOSSIP.set(true)
    .Gossip.modNew(gossip=>{
        gossip.Text.add({enGB:'Haha'})
    })
    .Spawns.add('trevis', name + "Spawn", spawns)
    .Level.set(80)
    .Rank.ELITE.set()
    .PvPFlags.set(0)
}

spawnFlightMasters(Faction.ALLIANCE,
    [
        {map:0,x:-9462.375977,y:-1310.017822,z:44.422550,o:2.580904}, // elwynn logging camp
        {map:0,x:-9437.098633,y:86.529785,z:57.098427,o:5.460080}, // goldshire
        {map:0,x:-5658.920410,y:-494.865540,z:396.980682,o:1.205576}, // kharanos
        {map:1,x:9968.129883,y:2627.334473,z:1315.407471,o:4.194031}, // darnassus
        {map:1,x:9872.507812,y:979.104309,z:1309.955811,o:3.467300}, // dolanaar
    ]
)

spawnFlightMasters(Faction.HORDE,
    [
        {map:1,x:-2170.129150,y:-365.931702,z:-4.222373,o:0.5}, // bloodhoof village
        {map:1,x:268.859802,y:-4770.269531,z:12.135162,o:0.908925}, // durotar
        {map:0,x:2268.025391,y:361.607971,z:35.176403,o:6.132594}, // tirisfal
    ]
)

std.GameObjectInstances.create("trevis", "GoldshireGryphonRoost")
.Template.set(182254)
.Position.set({map:0,x:-9438.624023,y:89.859406,z:57.452370,o:5.062848},)