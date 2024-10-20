import { std } from "wow/wotlk";

const name = "Talent Point"
const spell = std.Spells.create("trevis", name + " Spell")
.Description.enGB.set("Grants you a bonus talent point.")
.AuraDescription.enGB.set("You have unlocked as many bonus talent points as stacks this aura has.")
.Duration.setSimple(-1, 1, -1)
.Name.enGB.set("Talent Points Unlocked")
.Icon.setFullPath("Interface\\Icons\\inv_misc_coin_11")
.Attributes.IS_NEGATIVE.set(true)
.Attributes.PERSISTS_DEATH.set(true)
.Effects.addMod(eff => {
    eff.Type.APPLY_AURA.set()
    .Aura.DUMMY.set()
    .ImplicitTargetA.UNIT_CASTER.set()
})
.Stacks.set(255)
.Tags.addUnique("trevis", name + " Spell")

std.InlineScripts.Player.OnTalentsReset((player, noCost) => {
    const id = UTAG("trevis", "Talent Point Spell")
    const stacks = player.GetAura(id)?.GetStackAmount()
    let talentsPoints = stacks != undefined ? stacks : 0
    talentsPoints += player.GetLevel() - 9
    player.DoDelayed((obj, mgr) => {
        const player = ToPlayer(obj)
        if (!player) return
        player.SetFreeTalentPoints(talentsPoints)
    })
})

export const talentPointItem = std.Items.create("trevis", name + " Item", 6948)
.Name.enGB.set(name)
.Quality.HEIRLOOM.set()
.MaxStack.set(20)
.Tags.addUnique("trevis", name)
.MaxCount.set(0)
.Spells.mod(0, itemSpell =>
    itemSpell.Spell.set(spell.ID)
    .Charges.set(1, "DELETE_ITEM")
)
.DisplayInfo.modRefCopy("trevis", "Talent Point Item Icon", (value) => {
    value.Icon.set("Interface\\Icons\\inv_misc_coin_11")
})