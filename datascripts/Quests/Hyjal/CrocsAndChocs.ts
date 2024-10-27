import { std } from "wow/wotlk";
import { helpFromMyFremenies, GearmasterGizwizzle } from "./HelpFromMyFremenies";
import { AreasID, QuestCreator } from "../Utils/QuestCreator";
import { creature_questitemRow } from "wow/wotlk/sql/creature_questitem";
import { addItemQuestTooltipToCreature } from "../Utils/ItemQuestTooltip";
import { ItemCreator } from "../Utils/ItemCreator";

const name = "Crocs and Chocs"

const crocImbre = ItemCreator.createBasicItemQuest("Croc-imbres", "inv_misc_monsterfang_02")

const crocolisk = std.CreatureTemplates.create("trevis", name + "Crocolisk", 3110)
    .MovementType.RANDOM_MOVEMENT.set()
    .Level.set(2, 3)
    .Spawns.add("trevis", name + "Mob", [
        { map: 1, x: 5478.243652, y: -3576.353271, z: 1559.312012, o: 0.418051 },
        { map: 1, x: 5498.031250, y: -3570.278076, z: 1561.661499, o: 0.308095 },
        { map: 1, x: 5536.981934, y: -3536.490234, z: 1563.570679, o: 1.140618 },
        { map: 1, x: 5534.632812, y: -3495.189453, z: 1561.231323, o: 2.087023 },
        { map: 1, x: 5517.856934, y: -3464.539795, z: 1560.880981, o: 2.012410 },
        { map: 1, x: 5501.501465, y: -3432.828857, z: 1559.642090, o: 2.841005 },
        { map: 1, x: 5466.268066, y: -3437.481201, z: 1559.674927, o: 3.889512 },
        { map: 1, x: 5440.664062, y: -3457.995361, z: 1560.350342, o: 2.880276 },
        { map: 1, x: 5405.697754, y: -3453.857178, z: 1558.833374, o: 3.897367 },
        { map: 1, x: 5383.370605, y: -3475.226318, z: 1561.791626, o: 4.623860 },
        { map: 1, x: 5381.856445, y: -3511.955566, z: 1560.410889, o: 5.566336 },
        { map: 1, x: 5418.386230, y: -3545.207031, z: 1561.992065, o: 4.977290 },
        { map: 1, x: 5408.507324, y: -3576.876221, z: 1562.077026, o: 4.266507 },
        { map: 1, x: 5436.062500, y: -3581.884033, z: 1557.141846, o: 0.885365 },
        { map: 1, x: 5412.158203, y: -3504.099121, z: 1558.894287, o: 1.666837 },
        { map: 1, x: 5421.802246, y: -3490.142334, z: 1558.894287, o: 1.411582 },
        { map: 1, x: 5445.999512, y: -3492.646729, z: 1558.894287, o: 0.009646 },
        { map: 1, x: 5468.637695, y: -3470.919678, z: 1558.894287, o: 0.315951 },
        { map: 1, x: 5501.463867, y: -3506.242188, z: 1558.894287, o: 4.509981 },
        { map: 1, x: 5400.831055, y: -3524.451416, z: 1559.481445, o: 0.143126 },
        { map: 1, x: 5498.320312, y: -3432.403564, z: 1559.346436, o: 5.943292 },
        { map: 1, x: 5508.982422, y: -3451.171387, z: 1559.602417, o: 5.185388 },
        { map: 1, x: 5524.987793, y: -3488.682129, z: 1560.029175, o: 5.205022 },
        { map: 1, x: 5528.919922, y: -3539.338379, z: 1560.688843, o: 4.203643 },
        { map: 1, x: 5493.217285, y: -3567.960938, z: 1560.095581, o: 3.818799 },
        { map: 1, x: 5452.302734, y: -3600.858398, z: 1560.570435, o: 3.818799 },
        { map: 1, x: 5416.311523, y: -3618.397461, z: 1560.329834, o: 2.448279 },
    ], spawn => spawn.WanderDistance.set(10))
crocolisk.NormalLoot.modRefCopy(table => table.addItem(crocImbre.ID, 100, 1, 1, true))

export const crocsAndChocs = QuestCreator.createCollectQuest(name, GearmasterGizwizzle, [{id: crocImbre.ID, quantity: 8}], 3, AreasID.HYJAL)
    .PrevQuest.set(helpFromMyFremenies.ID)
    .PickupText.enGB.set(`Ah, the World Tree! A majestic place filled with mysteries... and hungry crocodiles!
    
The goblins and gnomes have tried to uncover the secrets of this energy, but these pesky reptiles have decided to play gatekeepers.
Your mission, should you choose to accept it, is to head under the World Tree and gather the stolen items from these crocodiles.
These treasures, which the gnomes call “Croc-imbres,” are essential for their research.

In exchange, I promise you a dazzling reward and a few laughs along the way!`)
    .CompleteText.enGB.set(`Congratulations, adventurer!

Thanks to your bravery (and your quick dodging of those jaws), you've managed to gather the necessary Croc-imbres!
The gnomes are already tinkering away, crafting strange machines with these treasures. Who knows, maybe one of them will actually work... or explode.

Either way, you've proven that not even crocodiles can stop the determination of a gnome!`)
    .POIs.add(4, [
        { map: 1, x: 5542.913574, y: -3519.349365, z: 1574.275391, o: 1.266280 },
        { map: 1, x: 5403.406250, y: -3461.992432, z: 1576.825439, o: 2.974522 },
        { map: 1, x: 5361.490723, y: -3568.422852, z: 1584.017456, o: 4.439283 },
        { map: 1, x: 5433.708984, y: -3650.525146, z: 1588.555786, o: 5.982573 },
    ])
    .AreaSort.set(AreasID.HYJAL)
    .POIs.forEach(value => {
        value.WorldMapArea.set(AreasID.HYJAL)
            .Map.set(1)
    })
    .QuestLevel.set(3)

addItemQuestTooltipToCreature(crocolisk.ID, 0, crocImbre.ID)