import { std } from "wow/wotlk";

const name = "HyjalWelcome"

const QUEST_GIVER = std.CreatureTemplates.create("trevis", name + "Questgiver", 3453)
.Spawns.add("trevis", name + "QuestgiverSpawn", {map:1,x:5486.141602,y:-3718.412109,z:1605,o:5.390880})

export const QUEST_ENDER = std.CreatureTemplates.create("trevis", name + "Questender", 3453)
.Spawns.add("trevis", name + "QuestenderSpawn", {map:1,x:5493.827637,y:-3736.433838,z:1599.003784,o:1.510200},)

const WELCOME_QUEST = std.Quests.create("trevis", name + "Quest")
.Questgiver.addCreatureStarter(QUEST_GIVER.ID)
.Questgiver.addCreatureEnder(QUEST_ENDER.ID)

console.log(std.CreatureTemplates.load(32767).Spawns.objectify())