import { std } from "wow/wotlk";
import { CurrencyCategory } from "wow/wotlk/std/Currency/CurrencyCategory";
import { MODULE_NAME } from "../../utils/constants";

const MYTHIC_DUNGEON_CURRENCY_ITEM = std.Items.create(
  MODULE_NAME,
  "mythic-dungeon-currency-item"
)
  .BagFamily.CURRENCY_TOKENS.set(true)
  .Name.enGB.set("Mythic Dungeon Currency")
  .Quality.PURPLE.set()
  .DisplayInfo.setSimpleIcon(
    MODULE_NAME,
    "mythic-dungeon-currency-icon",
    "inv_jewelcrafting_gem_27"
  );

const MYTHIC_DUNGEON_CURRENCY = std.Currency.create(
  MODULE_NAME,
  "mythic-dungeon-currency"
)
  .Item.set(MYTHIC_DUNGEON_CURRENCY_ITEM.ID)
  .Category.set(22);
