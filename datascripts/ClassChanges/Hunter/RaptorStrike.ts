import { std } from "wow/wotlk";
import { quest_templateQuery } from "wow/wotlk/sql/quest_template";
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs";

const spell = std.Spells.load(2973)
.Attributes.NEXT_SWING.set(0)
.Attributes.NEXT_SWING2.set(0)
.Attributes.MELEE_COMBAT_START.set(1)
.Effects.addMod(eff => {
    eff.Type.WEAPON_PERCENT_DAMAGE.set()
    .DamagePctBase.set(49)
})
.Description.enGB.set(`A strong attack that deals $s1 damage plus $s2% weapon damage.`)
.Cooldown.CategoryTime.set(12 * 1000)