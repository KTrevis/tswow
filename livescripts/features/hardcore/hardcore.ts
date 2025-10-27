import { UTAGS } from "../../utils/utag";
import { hardcoreAura } from "./aura";
import { hardcoreNPC } from "./npc";

export function hardcore(events: TSEvents) {
  hardcoreNPC(events);
  hardcoreAura(events);
  events.Unit.OnDeathEarly((dying, killer) => {
    const player = ToPlayer(dying);

    if (!player || !player.HasAura(UTAGS.HARDCORE_AURA)) {
      return;
    }
    SendWorldMessage(
      `${player.GetName()} just died at level ${<int>player.GetLevel()}`
    );
  });
}
