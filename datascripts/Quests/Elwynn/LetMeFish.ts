import { std } from "wow/wotlk";
import {AreasID, QuestCreator, ObjectiveQuest} from "../Utils/QuestCreator";
import { Position } from "wow/wotlk/std/Misc/Position";
import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";

const name = "Let Me Fish!"

const questgiver = std.CreatureTemplates.load(383)
const objectives: ObjectiveQuest<CreatureTemplate>[] = [
    {objective: std.CreatureTemplates.load(735), quantity: 6},
    {objective: std.CreatureTemplates.load(285), quantity: 6},
]

const POI: Position[] = [
    {map:0,x:-9414.875977,y:-231.562073,z:68.066475,o:4.139144},
    {map:0,x:-9571.332031,y:-295.855164,z:70.425819,o:4.667538},
    {map:0,x:-9533.109375,y:-486.165283,z:66.901962,o:5.021841},
    {map:0,x:-9401.033203,y:-478.712280,z:71.112885,o:1.307343},
]

const quest = QuestCreator.createKillingQuest(name, questgiver, objectives, 6, AreasID.ELWYNN)
.PickupText.enGB.set(`Me and my friend Lee Brown just want to fish, but those stupids Murlocs are scaring the fishes away! 
Please do something about it, this is our business.`)
.Rewards.Item.add(4496, 1)
.POIs.add(0, POI)
.POIs.add(1, POI)
.POIs.forEach(value => value.WorldMapArea.set(0))