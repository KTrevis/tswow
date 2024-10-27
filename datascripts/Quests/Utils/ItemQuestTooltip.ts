import { std } from "wow/wotlk"
    
export function addItemQuestTooltipToCreature(creature: number, index: number, item: number) {
    std.SQL.creature_questitem.add(creature, index, {CreatureEntry: creature, Idx: index, ItemId: item})
}