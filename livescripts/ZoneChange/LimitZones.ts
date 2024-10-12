export enum ZoneID {
    STORMWIND = 1519,
    ELWYNN = 12,
    ORGRIMMAR = 1637,
    DUROTAR = 14,
    DUN_MOROGH = 1,
    IRONFORGE = 1537,
    TELDRASSIL = 141,
    DARNASSUS = 1657,
    UNDERCITY = 1497,
    TIRISFAL_GLADES = 85,
    MULGORE = 215,
    THUNDER_BLUFF = 1638,
}

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

export default function restrictZones(player: TSPlayer, newZone: number) {
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