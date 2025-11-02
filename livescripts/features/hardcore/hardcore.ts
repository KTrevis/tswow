import { BACKEND_URL } from "../../utils/constants";
import { UTAGS } from "../../utils/utag";
import { hardcoreNPC } from "./npc";

export function hardcore(events: TSEvents) {
  hardcoreNPC(events);
  events.Unit.OnDeathEarly((dying, killer) => {
    const player = ToPlayer(dying);

    if (!player || !player.HasAura(UTAGS.HARDCORE_AURA)) {
      return;
    }
    const message = `${player.GetName()} just died at level ${<int>(
      player.GetLevel()
    )}.`;
    SendWorldMessage(message);
    SyncHttpGet(
      `${BACKEND_URL}/api/hardcore/death?player=${player.GetName()}&level=${player.GetLevel()}`
    );
  });
}
