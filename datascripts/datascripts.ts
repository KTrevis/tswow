import { std } from "wow/wotlk";

// const item = std.Items.load(42950) // heirloom to see how to create xp buff
// const spell = item.Spells.get(0).Spell.getRef()
// console.log(spell.objectify())

function changeHearthstoneCooldown() {
    const item = std.Items.load(6948)
    const spell = item.Spells.get(0).Spell.getRef()
    spell.Cooldown.CategoryTime.set(600 * 1000)
}

changeHearthstoneCooldown()