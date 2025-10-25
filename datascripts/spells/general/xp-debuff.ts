import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID, MODULE_NAME } from "../../utils/constants";

const XP_DEBUFF_PERCENT = 20;

const XP_DEBUFF = std.Spells.create(MODULE_NAME, "xp-debuff")
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_XP_PCT.set()
      .PercentBase.set(-XP_DEBUFF_PERCENT)
  )
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_XP_QUEST_PCT.set()
      .PercentBase.set(-XP_DEBUFF_PERCENT)
  )
  .Name.enGB.set("Adventurer's Pace")
  .Duration.set(INFINITE_DURATION_ID)
  .Attributes.IS_NEGATIVE.set(true)
  .Attributes.PERSISTS_DEATH.set(true)
  .Icon.setPath("inv_misc_book_11")
  .AuraDescription.enGB.set(`XP gains are reduced by ${XP_DEBUFF_PERCENT}%.`)
  .Tags.addUnique(MODULE_NAME, "xp-debuff");
