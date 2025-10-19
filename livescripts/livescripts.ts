import { playerEvents } from "./player/player-events";
import { mythicDungeon } from "./mythic-dungeon/mythic-dungeon";

export function Main(events: TSEvents) {
  playerEvents(events);
  mythicDungeon(events);
}
