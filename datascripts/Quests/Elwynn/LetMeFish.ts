import { std } from "wow/wotlk";
import { FactionTemplateValues } from "wow/wotlk/std/Faction/FactionTemplates";
import { QuestObjective } from "wow/wotlk/std/Quest/QuestObjective";
import {createKillingQuest, KillinQuestObjective} from "../Utils/KillingQuest";
import { Position } from "wow/wotlk/std/Misc/Position";

const name = "Let Me Fish!"

const questgiver = std.CreatureTemplates.load(383)
const toKill: KillinQuestObjective[] = [
    {id: 735, quantity: 6},
    {id: 285, quantity: 6},
]

const POI: Position[] = [
    {map:0,x:-9414.875977,y:-231.562073,z:68.066475,o:4.139144},
    {map:0,x:-9571.332031,y:-295.855164,z:70.425819,o:4.667538},
    {map:0,x:-9533.109375,y:-486.165283,z:66.901962,o:5.021841},
    {map:0,x:-9401.033203,y:-478.712280,z:71.112885,o:1.307343},
]

createKillingQuest(name, questgiver, toKill, 6)
.POIs.add(0, POI)
.POIs.add(1, POI)
.PickupText.enGB.set(`Me and my friend Lee Brown just want to fish, but those stupids Murlocs are scaring the fish away! 
Please do something about that, this is our business.`)
.Rewards.Item.add(4496, 1)
