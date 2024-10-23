import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";
import { std } from "wow/wotlk";
import { Quest } from "wow/wotlk/std/Quest/Quest";
import { Position } from "wow/wotlk/std/Misc/Position";

export interface KillingQuestObjective {
    id: number,
    quantity: number
}

export enum AreaSort {
    ELWYNN = 12,
    NORTHSHIRE = 9
}

export function createKillingQuest(questName: string, questgiver: CreatureTemplate, toKill: KillingQuestObjective[], questLevel: number): Quest {
    const quest = std.Quests.create("trevis", questName)
    .PrevQuest.set(0)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
    .Questgiver.addCreatureBoth(questgiver.ID, true)
    .Name.enGB.set(questName)
    .CompleteLogText.enGB.set(`Return to ${questgiver.Name.enGB.get()}.`)
    .CompleteText.enGB.set("Great job!")
    .Rewards.Difficulty.set(5)

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