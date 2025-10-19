import { std } from "wow/wotlk";

export enum ArmorKitID {
  LIGHT = 2304,
  MEDIUM = 2313,
  HEAVY = 4265,
  THICK = 8173,
  RUGGED = 15564,
}

const ARMOR_KITS = [
  {
    itemID: ArmorKitID.LIGHT,
    armor: 8,
    stamina: 1,
  },
  {
    itemID: ArmorKitID.MEDIUM,
    armor: 16,
    stamina: 2,
  },
  {
    itemID: ArmorKitID.HEAVY,
    armor: 24,
    stamina: 3,
  },
  {
    itemID: ArmorKitID.THICK,
    armor: 32,
    stamina: 4,
  },
  {
    itemID: ArmorKitID.RUGGED,
    armor: 40,
    stamina: 5,
  },
];

for (const { itemID, armor, stamina } of ARMOR_KITS) {
  const item = std.Items.load(itemID);

  const spellId = item.Spells.get(0).Spell.get();

  const spell = std.Spells.load(spellId);

  spell.Description.enGB.set(
    spell.Description.enGB.get().replace(".", ",") +
      " and increases stamina by 1."
  );

  const enchantId = spell.Effects.get(0).Type.ENCHANT_ITEM.set().Enchant.get();

  const enchant = std.Enchantments.load(enchantId);
  enchant.Effects.mod(0, (eff) => eff.Type.ADD_ARMOR.set().MinArmor.set(armor))
    .Effects.addMod((eff) =>
      eff.Type.STAT.set().Stat.STAMINA.set().MinStat.set(stamina)
    )
    .Name.enGB.set(`Reinforced (+${armor} armor, +${stamina} stamina)`);
}
