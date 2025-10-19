import { blockPlayerXP, unblockPlayerXP } from "../../utils/block-player-xp";

const MAX_LEVEL = 20;

export function levelCap(player: TSPlayer) {
  if (player.GetLevel() >= MAX_LEVEL) {
    player.SetLevel(MAX_LEVEL);
    blockPlayerXP(player);
  } else {
    unblockPlayerXP(player);
  }
}
