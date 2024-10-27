import { std } from "wow/wotlk"
import { ItemCreator } from "../Utils/ItemCreator"
import { QuestCreator } from "../Utils/QuestCreator"
import { GearmasterGizwizzle } from "./HelpFromMyFremenies"
import { AreasID } from "../Utils/QuestCreator"

const name = "Bits And Bots"

const robotPart = ItemCreator.createBasicItemQuest("Robot Part", "inv_misc_gear_01")

const bitsAndBots = QuestCreator.createCollectQuest(name, GearmasterGizwizzle, [{id: robotPart.ID, quantity: 6}], 1, AreasID.HYJAL)
.POIs.add(4, [
    {map:1,x:5568.344727,y:-3494.653320,z:1597.479614,o:1.537250},
    {map:1,x:5562.239746,y:-3412.375000,z:1609.523315,o:1.655060},
    {map:1,x:5629.793945,y:-3394.290283,z:1603.088867,o:0.099970},
    {map:1,x:5645.541992,y:-3494.579346,z:1603.500488,o:4.474646},
])
.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))

const object = std.GameObjectTemplates.Chests.create("trevis", name + "Chest")
.Display.set(1209)
.Spawns.add("trevis", name + "ChestSpawns", [
    {map:1,x:5614.006348,y:-3471.007568,z:1592.275146,o:0.908935},
    {map:1,x:5600.344727,y:-3441.508789,z:1594.451538,o:2.377630},
    {map:1,x:5610.847168,y:-3412.202148,z:1594.451538,o:0.610484},
    {map:1,x:5631.618652,y:-3434.750977,z:1594.451538,o:4.949814},
    {map:1,x:5626.488770,y:-3457.910156,z:1594.451538,o:4.832000},
    {map:1,x:5586.925293,y:-3469.617676,z:1592.276245,o:2.444391},
    {map:1,x:5574.975586,y:-3464.759521,z:1599.273193,o:1.168118},
    {map:1,x:5604.483398,y:-3476.589600,z:1605.668335,o:0.288473},
    {map:1,x:5586.694824,y:-3440.143799,z:1606.502197,o:0.096050},
])
.Loot.modRef(table => table.addItem(robotPart.ID, 100, 1, 1))
.Flags.CONDITIONAL_SELECT.set(true)
.IsConsumable.set(1)
.Lock.set(43)
.Quest.set(bitsAndBots.ID)