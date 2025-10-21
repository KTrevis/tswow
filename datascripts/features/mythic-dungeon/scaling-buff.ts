import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID, MODULE_NAME } from "../../utils/constants";

const PERCENT = 10;

export const MYTHIC_DUNGEON_SCALING_BUFF = std.Spells.create(
  MODULE_NAME,
  "mythic-dungeon-scaling-buff"
)
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_DAMAGE_PERCENT_DONE.set()
      .PercentBase.set(PERCENT - 1)
  )
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_INCREASE_HEALTH_PERCENT.set()
      .PercentBase.set(PERCENT - 1)
  )
  .Stacks.set(255)
  .Duration.set(INFINITE_DURATION_ID)
  .AuraDescription.enGB.set("Increases damage and health by $s1%.")
  .Tags.addUnique(MODULE_NAME, "mythic-dungeon-scaling-buff")
  .Icon.setPath("achievement_boss_lordmarrowgar");
