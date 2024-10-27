import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";
import { std } from "wow/wotlk";
import { Quest } from "wow/wotlk/std/Quest/Quest";
import { Position } from "wow/wotlk/std/Misc/Position";

export interface ObjectiveQuest {
    id: number,
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

function createKillingQuest(questName: string, questgiver: CreatureTemplate, toKill: ObjectiveQuest[], questLevel: number, area: AreasID): Quest {
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
            const creature = std.CreatureTemplates.load(curr.id)
            str += curr.quantity + " "
            str += creature.Name.enGB.get() + ", "
            quest.Objectives.Entity.add(curr.id, curr.quantity)
        })
        str += `then return to ${questgiver.Name.enGB.get()}.`
        quest.ObjectiveText.enGB.set(str)
    }
    setObjectives()
    return quest
}

function createCollectQuest(name: string, questgiver: CreatureTemplate, toCollect: ObjectiveQuest[], questLevel: number, area: AreasID) {
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
            const creature = std.Items.load(curr.id)
            str += curr.quantity + " "
            str += creature.Name.enGB.get() + ", "
            quest.Objectives.Item.add(curr.id, curr.quantity)
        })
        str += `then return to ${questgiver.Name.enGB.get()}.`
        quest.ObjectiveText.enGB.set(str)
    }
    setObjectives()
    return quest
}

export const QuestCreator = {
    createKillingQuest,
    createCollectQuest,
}