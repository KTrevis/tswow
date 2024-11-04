import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";
import { std } from "wow/wotlk";
import { Quest } from "wow/wotlk/std/Quest/Quest";
import { Position } from "wow/wotlk/std/Misc/Position";
import { ItemTemplate } from "wow/wotlk/std/Item/ItemTemplate";
import { MainEntityID } from "wow/wotlk/std/Misc/Entity";
import { GameObjectGoober } from "wow/wotlk/std/GameObject/GameObjectTemplate";

export interface ObjectiveQuest<TObjective> {
    objective: TObjective,
    quantity: number
}

export enum AreasID {
    GNOMEREGAN = 721,
    NORTHSHIRE = 9,
    STORMWIND = 1519,
    ELWYNN = 12,
    ORGRIMMAR = 1637,
    DUROTAR = 14,
    DUN_MOROGH = 1,
    IRONFORGE = 1537,
    TELDRASSIL = 141,
    DARNASSUS = 1657,
    UNDERCITY = 1497,
    TIRISFAL_GLADES = 85,
    MULGORE = 215,
    THUNDER_BLUFF = 1638,
    DEEPRUN_TRAM = 2257,
    HYJAL = 616,
}

function createKillingQuest(questName: string, questgiver: CreatureTemplate, toKill: ObjectiveQuest<CreatureTemplate>[], questLevel: number, area: AreasID): Quest {
    const quest = std.Quests.create("trevis", "KillingQuestCreator" + questName)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
    .Questgiver.addCreatureBoth(questgiver.ID, true)
    .Name.enGB.set(questName)
    .CompleteLogText.enGB.set(`Return to ${questgiver.Name.enGB.get()}.`)
    .CompleteText.enGB.set("Great job!")
    .Rewards.Difficulty.set(5)
    .AreaSort.set(area)

    function setObjectives() {
        let str = "Kill "

        toKill.forEach((curr, index) => {
            str += curr.quantity + " "
            str += curr.objective.Name.enGB.get() + ", "
			quest.Objectives.Entity.add(curr.objective.ID, curr.quantity)
        })
        str += `then return to ${questgiver.Name.enGB.get()}.`
        quest.ObjectiveText.enGB.set(str)
    }
    setObjectives()
    return quest
}

function createCollectQuest(name: string, questgiver: CreatureTemplate, toCollect: ObjectiveQuest<ItemTemplate>[], questLevel: number, area: AreasID) {
    const quest = std.Quests.create("trevis", "KillingQuestCreator" + name)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
    .Questgiver.addCreatureBoth(questgiver.ID, true)
    .Name.enGB.set(name)
    .CompleteLogText.enGB.set(`Return to ${questgiver.Name.enGB.get()}.`)
    .CompleteText.enGB.set("Great job!")
    .Rewards.Difficulty.set(5)
    .AreaSort.set(area)

    function setObjectives() {
        let str = "Collect "

        toCollect.forEach((curr, index) => {
            str += curr.quantity + " "
            str += curr.objective.Name.enGB.get() + ", "
        })
        str += `then return to ${questgiver.Name.enGB.get()}.`
        quest.ObjectiveText.enGB.set(str)
    }
    setObjectives()
    return quest
}

function createSpeakingQuest(name: string, questgiverStart: CreatureTemplate, questgiverEnd: CreatureTemplate, questLevel: number, area: AreasID): Quest {
	const quest = std.Quests.create("trevis", "trevisSpeakingquest" + name)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
	.Questgiver.addCreatureStarter(questgiverStart.ID)
	.Questgiver.addCreatureEnder(questgiverEnd.ID, true)
	.Name.enGB.set(name)
	.ObjectiveText.enGB.set(`Speak to ${questgiverEnd.Name.enGB.get()}.`)
	.AreaSort.set(area)
    .Rewards.Difficulty.set(1)

	questgiverEnd.NPCFlags.QUEST_GIVER.set(true)
	questgiverStart.NPCFlags.QUEST_GIVER.set(true)
	return quest
}

function createInteractQuest(name: string, questgiver: CreatureTemplate, toInteract: ObjectiveQuest<GameObjectGoober>[], questLevel: number, area: AreasID): Quest {
	const quest = std.Quests.create("trevis", "interactquest" + name)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
	.Name.enGB.set(name)
	.Questgiver.addCreatureBoth(questgiver.ID, true)
	.AreaSort.set(area)
    .Rewards.Difficulty.set(5)
	toInteract.forEach(value => quest.Objectives.Entity.add(-value.objective.ID, value.quantity))
	return quest
}

export const QuestCreator = {
    createKillingQuest,
    createCollectQuest,
    createSpeakingQuest,
	createInteractQuest
}