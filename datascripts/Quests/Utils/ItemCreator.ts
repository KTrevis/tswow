import { std } from "wow/wotlk"

function createBasicItemQuest(name: string, icon: string) {
    const item = std.Items.create("trevis", name + "item")
    .Name.enGB.set("Croc-imbres")
    .DisplayInfo.setSimpleIcon("trevis", name + "ItemIcon", "Interface\\Icons\\" + icon)
    .Flags.HAS_QUEST_GLOW.set(true)
    .Quality.WHITE.set()
    .Bonding.QUEST_ITEM.set()
    .MaxStack.set(20)
    return item
}

export const ItemCreator = {
    createBasicItemQuest,
}