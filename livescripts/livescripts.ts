import { hardcore } from "./features/hardcore/hardcore";
import { mythicDungeon } from "./features/mythic-dungeon/mythic-dungeon";
import { playerEvents } from "./player/player-events";

export function Main(events: TSEvents) {
  playerEvents(events);
  mythicDungeon(events);
  hardcore(events);
}
