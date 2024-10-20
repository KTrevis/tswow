import { std } from "wow/wotlk"

// now heals for 10% of maximum life
const spell = std.Spells.load(34428)
.Effects.addMod((eff) => {
    eff.Type.HEAL_PCT.set()
    .HealPctBase.set(9)
    .HealPctDieSides.set(1)
    .ImplicitTargetA.UNIT_CASTER.set()
})

spell.Description.enGB.set(
    spell.Description.enGB.get() + " Also heals you for $s2% of your maximum life when used."
)