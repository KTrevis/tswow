import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID, MODULE_NAME } from "../../utils/constants";

export const MYTHIC_DUNGEON_SCALING_BUFF = std.Spells.create(
  MODULE_NAME,
  "mythic-dungeon-scaling-buff"
)
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set().Aura.MOD_DAMAGE_PERCENT_DONE.set()
  )
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set().Aura.MOD_INCREASE_HEALTH_PERCENT.set()
  )
  .Stacks.set(1000)
  .Duration.set(INFINITE_DURATION_ID)
  .AuraDescription.enGB.set("Increases damage and health by $s1%.")
  .Tags.addUnique(MODULE_NAME, "mythic-dungeon-scaling-buff");
