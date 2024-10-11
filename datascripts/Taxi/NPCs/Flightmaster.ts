import {std} from "wow/wotlk"

std.CreatureTemplates.create('trevis','flightmaster')
.Name.enGB.set('Test Flightmaster')
.Models.addIds(5128)
.NPCFlags.FLIGHT_MASTER.set(true)
.NPCFlags.GOSSIP.set(true)
.Gossip.modNew(gossip=>{
    gossip.Text.add({enGB:'Haha'})
})
.Spawns.add('trevis','flightmaster-test-spawns',
    [
        {map:0,x:-9437.098633,y:86.529785,z:57.098427,o:5.460080},
    ]
)