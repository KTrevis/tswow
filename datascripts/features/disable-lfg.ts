import { std } from "wow/wotlk";
import { MODULE_NAME } from "../utils/constants";

const dungeons = std.Maps.queryAll({
  InstanceType: 1,
});

for (const [i, dungeon] of dungeons.entries()) {
  dungeon.Type.DUNGEON.set(MODULE_NAME, `remove-lfg-${i}`).LFGDungeons.forEach(
    (value) => {
      value.delete();
    }
  );
}
