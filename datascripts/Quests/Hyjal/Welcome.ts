import { std } from "wow/wotlk";
import { AreasID, createKillingQuest } from "../Utils/KillingQuest";
import { HYJAL_MAP } from "./Setup/Map";

const name = "HyjalWelcome"

export const GNOME = std.CreatureTemplates.create("trevis", name + "Questgiver", 1269)
.Spawns.add("trevis", name + "Gnome", {map:1,x:5490.265137,y:-3744.139893,z:1598.955811,o:1.093496},)

const GOBELIN = std.CreatureTemplates.create("trevis", name, 3453)
.FactionTemplate.NEUTRAL_PASSIVE.set()
.Spawns.add("trevis", name + "Goblin", {map:1,x:5489.537598,y:-3724.523926,z:1596.751709,o:5.189344},)
.FactionTemplate.NEUTRAL_PASSIVE.set()

export const WELCOME_QUEST = std.Quests.create("trevis", name + "Quest")
.Questgiver.addCreatureStarter(GOBELIN.ID)
.Questgiver.addCreatureEnder(GNOME.ID)
.Name.enGB.set("Welcome to Hyjal!")
.AreaSort.set(AreasID.HYJAL)
.CompleteText.enGB.set("Nice, you found me!")
.ObjectiveText.enGB.set(`Speak to ${GNOME.Name.enGB.get()}.`)
.PickupText.enGB.set(`Hey, recruit!

You've been teleported here because our scouts and some gnome techs detected a powerful energy source at Nordrassil.

The Alliance and the Horde have to work together, because the Legion is nearby, eager to seize this power.
If we do not stop them, we're all done for.

We need you to explore the area and secure that energy before it falls into the wrong hands.

Get moving — Azeroth's future is at stake!
Speak to ${GNOME.Name.enGB.get()} inside, he will tell you what to do.`)
.POIs.forEach(value => value.WorldMapArea.set(HYJAL_MAP.ID))