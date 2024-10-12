import { std } from "wow/wotlk";

const name = "Forbidden Zone"

const spell = std.Spells.create("trevis", name)
.Tags.addUnique("trevis", name)
.Icon.setFullPath("Interface\\Icons\\Inv_Misc_QuestionMark")
.Name.enGB.set(name)
.Duration.setSimple(10000, 1, 100)
.AuraDescription.enGB.set("You are in a forbidden zone! Leave this place!")
.Attributes.IS_NEGATIVE.set(true)
.Attributes.CAN_TARGET_DEAD.set(true)
.Effects.addMod(eff =>
    eff.Type.APPLY_AURA.set()
    .Aura.DUMMY.set()
    .ImplicitTargetA.UNIT_CASTER.set()
)
.InlineScripts.OnRemove((effect, application, type) => {
    console.log()
    if (application.GetAura().GetDuration() != 0) return
    const player = ToPlayer(effect.GetCaster())
    if (!player) return
    if (player.IsAlliance())
        player.Teleport(0, -8825.294922, 624.907715, 93.822655, 3.754547); // stormwind
    else 
        player.Teleport(1, 1629.359985, -4373.390137, 31.256399, 3.548390); // orgrimmar
})