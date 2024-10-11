import {ZoneID} from "../../utils/Enums"

const allowedZones: number[] = [
    ZoneID.DUROTAR,
    ZoneID.ELWYNN,
    ZoneID.ORGRIMMAR,
    ZoneID.STORMWIND,
    ZoneID.DUN_MOROGH,
    ZoneID.DARNASSUS,
    ZoneID.TELDRASSIL,
    ZoneID.MULGORE,
    ZoneID.THUNDER_BLUFF,
    ZoneID.TIRISFAL_GLADES,
    ZoneID.UNDERCITY,
]

const aura = UTAG("trevis", "Forbidden zone")
const timerName = "forbiddenZoneTeleport"

function onTimeout(effect: TSAuraEffect, application: TSAuraApplication) {
    if (effect.GetID() != aura) return
    if (application.GetAura().GetDuration() != 0) return
    const player = ToPlayer(effect.GetCaster())
    if (!player) return
    if (player.IsAlliance()) 
        player.Teleport(0, -8825.294922, 624.907715, 93.822655, 3.754547); // stormwind
    else 
        player.Teleport(1, 1629.359985, -4373.390137, 31.256399, 3.548390); // orgrimmar
}

function restrictZones(player: TSPlayer, newZone: number) {
    if (player.IsGM()) return
    if (allowedZones.includes(newZone)) {
        player.RemoveAura(aura)
        return
    }
    if (player.HasAura(aura)) 
        return
    player.AddAura(aura, player)
    player.SendAreaTriggerMessage(`You are not allowed to be here. You will be teleported to your capital in 10 seconds if you do not leave this zone.`)
}

export default function setupZoneRestriction(events: TSEvents) {
    events.Player.OnUpdateZone(restrictZones)
    events.Spell.OnRemove(onTimeout)
}