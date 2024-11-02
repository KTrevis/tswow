import { std } from "wow/wotlk"
import { AreasID, QuestCreator } from "../../Utils/QuestCreator"
import { Area } from "wow/wotlk/std/Area/Area"
import { ItemCreator } from "../../Utils/ItemCreator"
import { krixieKlankbolt } from "./LoveCircuitsAndComplications"
import { addItemQuestTooltipToCreature } from "../../Utils/ItemQuestTooltip"

const name = "Demon Delay"

export const wrathguard = std.CreatureTemplates.create("trevis", name + "Wrath Guard", 18975)
    .Level.set(4, 5)
    .Spawns.add("trevis", name + "Wrathguard", [
        {map:1,x:5357.203125,y:-3550.576904,z:1577.693237,o:5.393540},
        {map:1,x:5331.425781,y:-3549.105713,z:1581.264893,o:4.026947},
        {map:1,x:5331.140137,y:-3525.613037,z:1580.810547,o:3.096249},
        {map:1,x:5342.820312,y:-3501.779785,z:1574.747803,o:1.812124},
        {map:1,x:5323.918945,y:-3484.418213,z:1581.077026,o:2.562179},
        {map:1,x:5349.829102,y:-3450.172119,z:1576.005981,o:1.541162},
        {map:1,x:5332.301270,y:-3436.845947,z:1574.191895,o:2.448297},
        {map:1,x:5284.346191,y:-3435.133301,z:1572.237061,o:3.308308},
        {map:1,x:5267.528809,y:-3414.816650,z:1571.928101,o:2.432589},
        {map:1,x:5316.571289,y:-3461.973877,z:1576.036255,o:3.320107},
    ])
    .Spawns.forEach(value => value.MovementType.RANDOM_MOVEMENT.set()
        .WanderDistance.set(10))
    .Stats.set(1.5, 1.5, 1.5, 1.5, 1.5)

export const netherhound = std.CreatureTemplates.create("trevis", name + "netherhound", 16950)
    .Level.set(4, 5)
    .Spawns.add("trevis", name + "Netherhound", [
        {map:1,x:5285.409180,y:-3426.290283,z:1573.802856,o:4.105491},
        {map:1,x:5279.004883,y:-3459.869385,z:1574.939575,o:5.366052},
        {map:1,x:5317.720215,y:-3439.970459,z:1574.747559,o:0.520143},
        {map:1,x:5352.062012,y:-3451.174805,z:1573.177002,o:5.931538},
        {map:1,x:5338.115723,y:-3468.906250,z:1575.284302,o:3.936631},
        {map:1,x:5303.576172,y:-3484.463135,z:1582.376831,o:4.674902},
        {map:1,x:5336.752930,y:-3501.760742,z:1580.396973,o:6.131809},
        {map:1,x:5319.465820,y:-3514.007080,z:1578.813721,o:5.177547},
        {map:1,x:5366.112305,y:-3530.796631,z:1571.486694,o:5.456361},
        {map:1,x:5325.791016,y:-3546.334717,z:1585.889526,o:4.564940},        
    ])
    .Spawns.forEach(value => value.MovementType.RANDOM_MOVEMENT.set()
        .WanderDistance.set(10))
    .Stats.set(1.5, 1.5, 1.5, 1.5, 1.5)

const demonDelay = QuestCreator.createKillingQuest(name, krixieKlankbolt, [{ id: wrathguard.ID, quantity: 8 }], 4, AreasID.HYJAL)
    .PickupText.enGB.set(`Hey, it's Krixie here, and we've hit a bit of a timing issue.
    
Those Legion demons creeping up on us are getting bolder, and Whirley and I need more time to finish this machine to zap them out of here for good!
So how about this: you head over to the demon camps nearby and take out some of those fiends.
It'll give us the time we need, and hey, it's not like we're short on demons to clobber!`)
    // .POIs.add(0, [
    // ])
    .POIs.forEach(value => value.Map.set(1)
        .WorldMapArea.set(AreasID.HYJAL))