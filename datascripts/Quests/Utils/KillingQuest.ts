import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";
import { std } from "wow/wotlk";
import { Quest } from "wow/wotlk/std/Quest/Quest";
import { Position } from "wow/wotlk/std/Misc/Position";

export interface KillingQuestObjective {
    id: number,
    quantity: number
}

export function createKillingQuest(questName: string, questgiver: CreatureTemplate, toKill: KillingQuestObjective[], questLevel: number): Quest {
    const quest = std.Quests.create("trevis", questName, 7)
    .PrevQuest.set(0)
    .MinLevel.set(questLevel)
    .QuestLevel.set(questLevel + 1)
    .Questgiver.addCreatureBoth(questgiver.ID, true)
    .Name.enGB.set(questName)
    .CompleteLogText.enGB.set(`Return to ${questgiver.Name.enGB.get()}.`)
    .CompleteText.enGB.set("Great job!")
    .Rewards.Difficulty.set(5)
    .POIs.forEach(value => value.delete())

    function setObjectives() {
        quest.Objectives.Entity.clearAll()
        let str = "Kill "

        toKill.forEach((curr, index) => {
            const creature = std.CreatureTemplates.load(curr.id)
            str += curr.quantity + " "
            str += creature.Name.enGB.get() + ", "
            quest.Objectives.Entity.addMod(value => {
                value.ID.set(curr.id)
                .Count.set(curr.quantity)
            })
        })
        str += `then return to ${questgiver.Name.enGB.get()}.`
        quest.ObjectiveText.enGB.set(str)
    }
    setObjectives()
    return quest
}