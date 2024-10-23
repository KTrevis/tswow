import { std } from "wow/wotlk";
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs";

// const item = std.Items.load(42950) // heirloom to see how to create xp buff
// const spell = item.Spells.get(0).Spell.getRef()
// console.log(spell.objectify())

function changeHearthstoneCooldown() {
    const item = std.Items.load(6948)
    const spell = item.Spells.get(0).Spell.getRef()
    spell.Cooldown.CategoryTime.set(600 * 1000) // 10 minutes
}

changeHearthstoneCooldown()

export const TEST_MAP = std.Maps
    .create('trevis','test-map')
    .Directory.set('testmap')
    .Name.enGB.set('Test Map')
    .LoadingScreen.setSimple('LoadingScreen\\LoadingScreen.blp')
    .Tiles.add('trevis',[[1,1,6,6,'testmap']])
    .Flags.set(std.Maps.load(0).Flags.get())
    .Tags.addUnique('trevis','test-map')