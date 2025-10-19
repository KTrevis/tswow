import { Languages } from "wow/data/dbc/Localization";
import { std } from "wow/wotlk";

const EARTHEN_RING_TOTEM = std.Items.load(46978);

const HEARTHSTONE = std.Items.load(6948).TotemCategory.set(
  EARTHEN_RING_TOTEM.TotemCategory.get()
);

for (const lang of Languages) {
  HEARTHSTONE.Description[lang].set(EARTHEN_RING_TOTEM.Description[lang].get());
}
