import { learnSpells } from "./level-change/learn-spells";
import { levelCap } from "./level-change/level-cap";

function onReload(player: TSPlayer, firstLogin: boolean) {
  levelCap(player);
}

function onLevelChanged(player: TSPlayer, oldLevel: uint8) {
  levelCap(player);
  // learnSpells(player);
}

function onLogin(player: TSPlayer, firstLogin: boolean) {
  levelCap(player);
  player.SendBroadcastMessage(
    "Type /join world in the chat if you want to speak with other players"
  );
}

export function playerEvents(events: TSEvents) {
  events.Player.OnLevelChanged(onLevelChanged);
  events.Player.OnLogin(onLogin);
  events.Player.OnReload(onReload);
}
