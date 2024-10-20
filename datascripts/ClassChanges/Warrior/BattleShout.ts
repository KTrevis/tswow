import { std } from "wow/wotlk";

// battle shout now has a 1 minute cooldown, and grants 20 rage
const ids = [6673]

ids.forEach(id => {
    const spell = std.Spells.load(id)
    .Cooldown.CategoryTime.set(60 * 1000)
    .Cooldown.Category.set(971)
    .Power.CostBase.set(0)
    .Effects.addMod(eff => {
        eff.Type.ENERGIZE.set()
        .PowerType.RAGE.set()
        .PowerBase.set(200)
        .ImplicitTargetA.UNIT_CASTER.set()
    })
    spell.Description.enGB.set(spell.Description.enGB.get() + " Also grants 20 rage.")
})