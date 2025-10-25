import { hardcoreAura } from "./aura";
import { hardcoreNPC } from "./npc";

export function hardcore(events: TSEvents) {
  hardcoreNPC(events);
  hardcoreAura(events);
}
