import { std } from "wow/wotlk"
import { ItemCreator } from "../../Utils/ItemCreator"
import { addItemQuestTooltipToCreature } from "../../Utils/ItemQuestTooltip"
import { AreasID, QuestCreator } from "../../Utils/QuestCreator"
import { GearmasterGizwizzle } from "./HelpFromMyFremenies"

const name = "Saber Snacks"

const meat = ItemCreator.createBasicItemQuest("Nightsaber Meat", "inv_misc_food_135_meat")

const nightsaber = std.CreatureTemplates.create("trevis", name + "Nightsaber", 2042)
    .Level.set(3, 4)
    .Spawns.add("trevis", name + "NightsaberSpawn", [
        { map: 1, x: 5740.338867, y: -3310.225342, z: 1600.442749, o: 4.211556 },
        { map: 1, x: 5713.351074, y: -3305.100342, z: 1593.597168, o: 3.811004 },
        { map: 1, x: 5692.159668, y: -3331.728760, z: 1591.661255, o: 4.356853 },
        { map: 1, x: 5703.805176, y: -3351.373535, z: 1593.482056, o: 5.668463 },
        { map: 1, x: 5735.064941, y: -3359.248047, z: 1597.907959, o: 6.155406 },
        { map: 1, x: 5753.208008, y: -3365.534424, z: 1599.471802, o: 5.448550 },
        { map: 1, x: 5751.252930, y: -3392.030029, z: 1596.326172, o: 3.316199 },
        { map: 1, x: 5730.144043, y: -3386.695557, z: 1593.698975, o: 2.691807 },
        { map: 1, x: 5707.396484, y: -3373.765625, z: 1593.603027, o: 2.515093 },
        { map: 1, x: 5681.655273, y: -3351.830566, z: 1590.166870, o: 2.405137 },
        { map: 1, x: 5658.890625, y: -3340.586182, z: 1587.102295, o: 3.324053 },
        { map: 1, x: 5650.670898, y: -3350.722900, z: 1587.706909, o: 4.411827 },
        { map: 1, x: 5655.015137, y: -3380.390381, z: 1587.963379, o: 5.444617 },
        { map: 1, x: 5674.824219, y: -3396.480713, z: 1589.419434, o: 5.754844 },
        { map: 1, x: 5700.653809, y: -3408.619385, z: 1591.562622, o: 5.860870 },
        { map: 1, x: 5732.782715, y: -3422.489014, z: 1591.948486, o: 5.896212 },
    ])
    .Spawns.forEach(value => value.MovementType.RANDOM_MOVEMENT.set()
        .WanderDistance.set(10))
    .NormalLoot.modRefCopy(table => table.addItem(meat.ID, 100, 1, 1, true))

addItemQuestTooltipToCreature(nightsaber.ID, 0, meat.ID)

const saberSnack = QuestCreator.createCollectQuest(name, GearmasterGizwizzle, [{ objective: meat, quantity: 8 }], 3, AreasID.HYJAL)
    .PickupText.enGB.set(`Hey there, friend!
    
We're in a bit of a... food crisis up here on top of Mount Hyjal.
You see, goblins and gnomes aren't exactly the best hunters, and with supply deliveries cut off, our team is running low on rations.
But there's hope! We've seen plenty of nightsabers prowling nearby. How about you bring us back some fresh meat from those beasts?
We'll make do with whatever you can find. And hey, I'll even throw in a little something extra for your trouble!`)
    .CompleteText.enGB.set(`Ah, perfect! That meat looks... er, fresh enough!
The goblins are already firing up their grills, and the gnomes are whipping up something they call "Nightsaber Surprise".
Thanks to you, we won't have to resort to eating our emergency rations (which, frankly, taste like bolts and sprockets).

You've saved the day and our taste buds!`)
    .POIs.add(4, [
        { map: 1, x: 5627.518555, y: -3352.805664, z: 1587.587769, o: 5.275746 },
        { map: 1, x: 5709.182129, y: -3468.471191, z: 1601.472656, o: 0.653679 },
        { map: 1, x: 5766.827148, y: -3297.857178, z: 1618.272217, o: 1.007108 },
    ])
    .POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))