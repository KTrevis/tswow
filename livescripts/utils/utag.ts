// tswow cannot be stored in a constant because UTAG only takes literal strings
export namespace UTAGS {
  export const XP_DEBUFF = UTAG("tswow", "xp-debuff");
  export const MYTHIC_DUNGEON_SCALING_BUFF = UTAG(
    "tswow",
    "mythic-dungeon-scaling-buff"
  );
  export const MYTHIC_DUNGEON_NPC = UTAG("tswow", "mythic-dungeon-npc");
  export const HARDCORE_NPC = UTAG("tswow", "hardcore-npc");
  export const HARDCORE_AURA = UTAG("tswow", "hardcore-aura");
}
