export function blockPlayerXP(player: TSPlayer) {
  player.SetFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN);
}

export function unblockPlayerXP(player: TSPlayer) {
  player.RemoveFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN);
}
