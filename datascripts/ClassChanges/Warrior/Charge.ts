import { std } from "wow/wotlk";

const spell = std.Spells.load(100)
.Attributes.CANNOT_USE_IN_COMBAT.set(0)
spell.Description.enGB.set(spell.Description.enGB.get().replace(" Cannot be used in combat.", ""))