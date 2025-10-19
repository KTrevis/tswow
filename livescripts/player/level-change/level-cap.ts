import { blockPlayerXP, unblockPlayerXP } from "../../utils/block-player-xp";
import { UTAGS } from "../../utils/utag";

export const MAX_LEVEL: uint8 = 20;

function applyXPDebuff(player: TSPlayer) {
  if (MAX_LEVEL == 20) {
    player.AddAura(UTAGS.XP_DEBUFF, player);
    return;
  }

  if (MAX_LEVEL - 10 <= player.GetLevel()) {
    player.AddAura(UTAGS.XP_DEBUFF, player);
    return;
  }
  player.RemoveAura(UTAGS.XP_DEBUFF);
}

export function levelCap(player: TSPlayer) {
  if (player.GetLevel() >= MAX_LEVEL) {
    player.SetLevel(MAX_LEVEL);
    blockPlayerXP(player);
  } else {
    unblockPlayerXP(player);
  }
  applyXPDebuff(player);
}
