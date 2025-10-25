import { UTAGS } from "../../utils/utag";

function onHardcoreAuraRemove(
  effect: TSAuraEffect,
  application: TSAuraApplication,
  type: uint32
) {
  const player = ToPlayer(application.GetTarget());
  if (!player) {
    return;
  }
  player.ResurrectPlayer(100, false);
  player.AddTimer(1000, 1, 0, (owner, timer) => {
    const player = ToPlayer(owner);
    if (!player) {
      return;
    }
    const GHOST_AURA = 8326;
    player.AddAura(GHOST_AURA, player);
    player.AddAura(UTAGS.HARDCORE_AURA, player);
  });
}

export function hardcoreAura(events: TSEvents) {
  events.Spell.OnRemove(UTAGS.HARDCORE_AURA, onHardcoreAuraRemove);
}
