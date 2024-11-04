import { std } from "wow/wotlk"
import { whirleySparktwist } from "./DemonTech"
import { NPCCreator } from "../../Utils/NPCCreator"
import { AreasID, QuestCreator } from "../../Utils/QuestCreator"
import { StringDecoder } from "string_decoder"

const name = "Contact In The Crater"

export const zevrinRustwhistle = NPCCreator.createNPC("Zevrin Rustwhitstle", [{ map: 1, x: 5409.562988, y: -3181.318848, z: 1580.059692, o: 3.045231 },])
	.Models.addIds(5567)
	.NPCFlags.QUEST_GIVER.set(true)
	.FactionTemplate.NEUTRAL_PASSIVE.set()
	.Level.set(10)

const quest = QuestCreator.createSpeakingQuest(name, whirleySparktwist, zevrinRustwhistle, 5, AreasID.HYJAL)
	.QuestLevel.set(5)
	.MinLevel.set(5)
	.PickupText.enGB.set(`Hey, listen up!
    
We're finally getting a lead on what's going on in Bleakhollow Crater, but we can't go in blind.
Lucky for us, a veteran scout named Zevrin Rustwhistle managed to slip into the crater and gather intel on the Legion's forces.
Problem is, he's surrounded by demons, and we've lost communication.

Head to Bleakhollow Crater and find Zevrin—he'll get you up to speed on the situation and guide you through the Legion's defenses. And, uh, try not to get fried by fel fire on the way!`)
	.CompleteText.enGB.set(`Ah, so you're the backup they sent, huh? 
About time! The Legion's got a full setup here—summoning pits, infernal forges, the works.
I'll guide you through it all, but it's not going to be a walk in the park.
Stick close, and we'll turn this invasion into a demon disaster.`)
	.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))
	.Tags.addUnique("trevis", "Contact In The Crater")