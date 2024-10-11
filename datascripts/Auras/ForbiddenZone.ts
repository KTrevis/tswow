import { std } from "wow/wotlk";

const name = "Forbidden Zone"

const spell = std.Spells.create("trevis", name)
.Tags.addUnique("trevis", name)
.Icon.setFullPath("Interface\\Icons\\Inv_Misc_QuestionMark")
.Name.enGB.set(name)
.Duration.setSimple(10000, 1, 100)
.AuraDescription.enGB.set("You are in a forbidden zone! Leave this place!")
.Attributes.IS_NEGATIVE.set(true)
// .Attributes.CAN_TARGET_DEAD.set(true)
.Effects.addMod(eff =>
    eff.Type.APPLY_AURA.set()
    .Aura.DUMMY.set()
    .ImplicitTargetA.UNIT_CASTER.set()
)