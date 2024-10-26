import { std } from "wow/wotlk";
import { AreaSort } from "../Utils/KillingQuest";

const name = "HyjalWelcome"

const GOBELIN = std.CreatureTemplates.create("trevis", name, 3453)
.FactionTemplate.NEUTRAL_PASSIVE.set()
.Spawns.add("trevis", name + "Goblin", {map:1,x:5467.351562,y:-3723.538330,z:1593.442993,o:6.238725},)

const GNOME = std.CreatureTemplates.create("trevis", name + "Questgiver", 1269)
.Spawns.add("trevis", name + "Gnome", {map:1,x:5493.827637,y:-3736.433838,z:1599.003784,o:1.510200},)
.FactionTemplate.NEUTRAL_PASSIVE.set()

const WELCOME_QUEST = std.Quests.create("trevis", name + "Quest")
.Questgiver.addCreatureStarter(GOBELIN.ID)
.Questgiver.addCreatureEnder(GNOME.ID)
.Name.enGB.set("Welcome to Hyjal!")
.AreaSort.set(AreaSort.HYJAL)
.ObjectiveText.enGB.set(`Speak to ${GNOME.Name.enGB.get()}.`)
.PickupText.enGB.set(
`Hey, recruit! 

You've been teleported here because our scouts and some gnome techs detected a powerful energy source at Nordrassil.

The Alliance and the Horde have to work together, because the Legion is nearby, eager to seize this power.
If we do not stop them, we're all done for.

We need you to explore the area and secure that energy before it falls into the wrong hands.

Get moving — Azeroth's future is at stake!
Speak to ${GNOME.Name.enGB.get()} inside, he will tell you what to do.`)