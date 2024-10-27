import { std } from "wow/wotlk"

export function addItemQuestTooltipToCreature(creature: number, index: number, item: number) {
    std.SQL.creature_questitem.add(creature, index, {CreatureEntry: creature, Idx: index, ItemId: item})
}

export function addItemQuestTooltipToGameobject(gameObject: number, index: number, item: number) {
    std.SQL.gameobject_questitem.add(gameObject, index, {GameObjectEntry: gameObject, Idx: index, ItemId: item})
}