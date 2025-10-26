import { hardcore } from "./features/hardcore/hardcore";
import { mythicDungeon } from "./features/mythic-dungeon/mythic-dungeon";
import { playerEvents } from "./player/player-events";
import { UTAGS } from "./utils/utag";

export function Main(events: TSEvents) {
  playerEvents(events);
  mythicDungeon(events);
  hardcore(events);
  events.Creature.OnKilledUnit((killer, killed) => {
    const player = ToPlayer(killer);

    if (!player || !player.HasAura(UTAGS.HARDCORE_AURA)) {
      return;
    }
    SendWorldMessage(
      `${player.GetName()} just died at level ${<int>player.GetLevel()}`
    );
  });
}
