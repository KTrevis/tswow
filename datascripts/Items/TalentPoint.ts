import { std } from "wow/wotlk";

const name = "Talent Point"
const spell = std.Spells.create("trevis", name + " Spell")
.Tags.addUnique("trevis", name + " Spell")
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
.InlineScripts.OnApply((effect, application, type) => {
    const stacks = application.GetAura().GetStackAmount()
    const player = ToPlayer(effect.GetCaster())
    if (!player) return
    player.SetFreeTalentPoints(player.GetFreeTalentPoints() + 1)
    const tier = player.GetLevel() / 10
    if (stacks % 8 == 0)
        player.RemoveFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
})

std.InlineScripts.Player.OnTalentsReset((player, noCost) => {
    const id = UTAG("trevis", "Talent Point Spell")
    const stacks = player.GetAura(id)?.GetStackAmount()
    let talentPoints = stacks != undefined ? stacks : 0
    talentPoints += player.GetLevel() - 9
    player.DoDelayed((obj, mgr) => {
        const player = ToPlayer(obj)
        if (!player) return
        player.SetFreeTalentPoints(talentPoints)
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
.RequiredLevel.set(10)

function addTalentPointItemToQuest(id: number) {
    const quest = std.Quests.load(id)
    .Rewards.Item.add(talentPointItem.ID, 1)
}

const quest = [176]
quest.forEach(id => addTalentPointItemToQuest(id))