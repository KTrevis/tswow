import { DBC } from "wow/wotlk";

const lfgDungeons = DBC.LfgDungeons.queryAll({});

for (const lfg of lfgDungeons) {
  lfg.MinLevel.set(255);
}
