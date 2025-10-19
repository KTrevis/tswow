import { levelCap } from "./level-change/level-cap";

function onReload(player: TSPlayer, firstLogin: boolean) {
  levelCap(player);
}

export function playerEvents(events: TSEvents) {
  events.Player.OnLevelChanged((player) => levelCap(player));
  events.Player.OnReload(onReload);
}
