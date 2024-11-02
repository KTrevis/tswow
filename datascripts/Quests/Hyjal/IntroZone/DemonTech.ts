import { std } from "wow/wotlk"
import { AreasID, QuestCreator } from "../../Utils/QuestCreator"
import { ItemCreator } from "../../Utils/ItemCreator"
import { netherhound, wrathguard } from "./DemonDelay"
import { addItemQuestTooltipToCreature } from "../../Utils/ItemQuestTooltip"

const name = "Demon Tech"

export const whirleySparktwist = std.CreatureTemplates.create("trevis", name + "Whirley Sparktwist") // male gnome
.Models.addIds(3117)
.Name.enGB.set("Whirley Sparktwist")
.Spawns.add("trevis", name + "Whirley Sparktwist Spawn", {map:1,x:5132.416016,y:-3334.420166,z:1638.273071,o:5.452465},)
.NPCFlags.QUEST_GIVER.set(1)

const infernalCircuitryComponents = ItemCreator.createBasicItemQuest("Infernal Circuitry Components", "inv_ore_feliron")

const table = std.Loot.Creature.create()
.addItem(infernalCircuitryComponents.ID, 100, 1, 2, true)

wrathguard.NormalLoot.set(table.ID)
addItemQuestTooltipToCreature(wrathguard.ID, 0, infernalCircuitryComponents.ID)
netherhound.NormalLoot.set(table.ID)
addItemQuestTooltipToCreature(netherhound.ID, 0, infernalCircuitryComponents.ID)

const quest = QuestCreator.createCollectQuest(name, whirleySparktwist, [{id: infernalCircuitryComponents.ID, quantity: 12}], 4, AreasID.HYJAL)
.PickupText.enGB.set(`Hi, nice to meet you!
    
Krixie and I were just brainstorming, and it hit us—those demons are dragging around some fascinating tech!
If you can help us loot some of their gear, we can adapt it for our machine.
Think about it! Demon-infused circuitry could give us a serious edge.

I just need you to grab some of those parts while you're out there fighting.`)
.CompleteText.enGB.set(`Brilliant! Look at these ${infernalCircuitryComponents.Name.enGB.get()}!

They're even better than I imagined. With these, Krixie and I can really amp up our machine.
If we channel the power of this demon tech correctly, we might just turn the tide against that invasion!
You've really come through for us, adventurer.

Now, stand back—things are about to get electrifying!`)
.POIs.add(4, [
    {map:1,x:5242.865723,y:-3413.852295,z:1579.837646,o:6.265349},
    {map:1,x:5359.047363,y:-3447.433594,z:1577.778687,o:5.955123},
    {map:1,x:5324.839355,y:-3518.721924,z:1584.212646,o:4.262593},
    ])
.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))