import { std } from "wow/wotlk"

std.Spells.load(34428)
.InlineScripts.OnCast((spell) => {
	const ids = TAG("trevis", "Victory Rush Healing Legendary")
	const healID = UTAG("trevis", "10% Heal")
	const player = ToPlayer(spell.GetCaster())

	if (!player) return
	for (let i = EquipmentSlots.START; i < EquipmentSlots.END; i++) {
		const item = player.GetEquippedItemBySlot(i)
		if (!item) continue
		if (ids.includes(item.GetEntry())) {
			player.SendAreaTriggerMessage("test")
			player.CastSpell(player, healID)
			return;
		}
	}
})

const healAura = std.Spells.create("trevis", "10% Heal")
.Name.enGB.set("10% Heal")
.Effects.addMod((eff) => {
	eff.Type.HEAL_PCT.set()
	.HealPctBase.set(9)
	.HealPctDieSides.set(1)
	.ImplicitTargetA.UNIT_CASTER.set()
})
.InlineScripts.OnCast((spell) => {
	const player = ToPlayer(spell.GetCaster())?.GetName()
	if (!player) return
})
.Tags.addUnique("trevis", "10% Heal")

const victoryRushLegEffect = std.Spells.create("trevis", "victoryRushLegEffect")
	.Description.enGB.set("Victory Rush now heals you for 10% of your maximum life.")

const victoryRushRing = std.Items.create("trevis", "Victory Rush Ring")
	.Name.enGB.set(`Victory Rush Ring`)
	.DisplayInfo.setSimpleIcon("trevis", "Victory Rush Ring Icon", "Interface\\Icons\\inv_pants_plate_29")
	.InventoryType.FINGER.set()
	.Quality.ORANGE.set()
	.Material.JEWELRY.set()
	.ClassMask.clearAll()
	.ClassMask.WARRIOR.set(true)
	.SocketBonus.set(0)
	.Spells.addMod(itemSpell => itemSpell
		.Spell.set(victoryRushLegEffect.ID)
		.Trigger.ON_EQUIP.set()
	)
	.Bonding.BINDS_ON_PICKUP.set()
	.Flags.UNIQUE_EQUIPPED.set(true)
	.Tags.add("trevis", "Victory Rush Healing Legendary")