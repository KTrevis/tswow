import { std } from "wow/wotlk";
import { AreasID } from "./Quests/Utils/QuestCreator";

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
    if (application.GetAura().GetDuration() != 0) return
    const player = ToPlayer(effect.GetCaster())
    if (!player || player.IsGM()) return
    player.Teleport(1, 5496.201172, -3734.774414, 1597.045044, 2.593613)
})

std.InlineScripts.Player.OnUpdateZone((player: TSPlayer, newZone: number) => {
    const allowedZones: number[] = [
        616, // HYJAL
    ]
    const aura = UTAG("trevis", "Forbidden zone")
    if (player.IsGM()) return
    if (player.HasUnitState(256)) return // this means the player is on a taxi
    if (allowedZones.includes(newZone))
        return player.RemoveAura(aura)
    console.log(`${player.GetName()} entered a forbidden zone: ${newZone}`)
    if (player.HasAura(aura)) return
    player.AddAura(aura, player)
    player.SendAreaTriggerMessage(`You are not allowed to be here. You will be teleported to Hyjal in 10 seconds if you do not leave this zone.`)
})