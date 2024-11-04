import { std } from "wow/wotlk";
import { CORRUPTED_TREANT } from "./BranchingOutProblems";
import { GOBLIN_WORKSHOP, WELCOME_QUEST } from "./WelcomeToHyjal";
import { ItemCreator } from "../../Utils/ItemCreator";
import { AreasID, QuestCreator } from "../../Utils/QuestCreator";
import { addItemQuestTooltipToCreature } from "../../Utils/ItemQuestTooltip";

const name = "Timber Takedown"

const wood = ItemCreator.createBasicItemQuest("Treant Wood", "inv_tradeskillitem_03")

const treantTable = std.Loot.Creature.create()
.addItem(wood.ID, 100, 1, 1, true)
CORRUPTED_TREANT.NormalLoot.set(treantTable.ID)

const timberTakedown = QuestCreator.createCollectQuest(name, GOBLIN_WORKSHOP, [{objective: wood, quantity: 8}], 1, AreasID.HYJAL)
    .PickupText.enGB.set(`So, I heard you've already got a job to take out some pesky treants for that gnome technician?

Perfect! While you're at it, how about gathering some wood from those treants?
We could use it for repairs around the factory. Efficient, right?

Just bring back a bundle of treant wood, and we'll make sure it goes to good use!`)
    .CompleteText.enGB.set(`Great work!
    
You took down those treants and gathered some solid wood for us.
The factory team's already thrilled—they'll have enough material to patch up all the damage from the last malfunction.

Thanks for making the most of that treant trouble; now we're in much better shape!`)
.PrevQuest.set(WELCOME_QUEST.ID)
.POIs.add(4, [
    { map: 1, x: 5531.914551, y: -3655.350586, z: 1593.751831, o: 0.001773 },
    { map: 1, x: 5646.271973, y: -3640.696045, z: 1617.398438, o: 6.041487 },
    { map: 1, x: 5669.409668, y: -3770.125732, z: 1630.355713, o: 4.780927 },
    { map: 1, x: 5519.863770, y: -3810.039551, z: 1609.844360, o: 3.418262 },
])
.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))

addItemQuestTooltipToCreature(CORRUPTED_TREANT.ID, 0, wood.ID)