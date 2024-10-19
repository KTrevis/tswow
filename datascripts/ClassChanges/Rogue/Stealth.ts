import { std } from "wow/wotlk";

const spell = std.Spells.load(1784)
.Description.enGB.set("Allows the rogue to sneak around. Lasts until cancelled.")
.AuraDescription.enGB.set("Stealthed.")
spell.Effects.get(2).clear() // removed move speed malus