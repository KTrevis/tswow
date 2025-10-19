import { levelCap } from "./level-change/level-cap";

function onReload(player: TSPlayer, firstLogin: boolean) {
  levelCap(player);
}

function onLevelChanged(player: TSPlayer, oldLevel: uint8) {
  levelCap(player);
}

export function playerEvents(events: TSEvents) {
  events.Player.OnLevelChanged(onLevelChanged);
  events.Player.OnReload(onReload);
}
