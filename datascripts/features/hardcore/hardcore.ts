import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID, MODULE_NAME } from "../../utils/constants";

const HARDCORE_AURA = std.Spells.create(MODULE_NAME, "hardcore-aura")
  .Icon.setPath("inv_misc_bone_humanskull_01")
  .Name.enGB.set("Hardcore")
  .AuraDescription.enGB.set("You are in hardcore mode.")
  .Duration.set(INFINITE_DURATION_ID)
  .InlineScripts.OnRemove((effect, application, type) => {
    const player = ToPlayer(application.GetTarget());
    if (!player) {
      return;
    }
    const GHOST_AURA = 8326;
    player.ResurrectPlayer(100, false);
    player.AddTimer(1000, 1, 0, (owner, timer) => {
      const player = ToPlayer(owner);
      if (!player) {
        return;
      }
      player.AddAura(8326, player);
    });
  })
  .Tags.addUnique(MODULE_NAME, "hardcore-aura")
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set().Aura.DUMMY.set().ImplicitTargetA.UNIT_CASTER.set()
  )
  .Attributes.IS_NEGATIVE.set(true);

const SPAWNS = [
  { map: 0, x: -8928.311523, y: -140.488068, z: 81.962692, o: 1.73573 }, // elwynn
  { map: 0, x: -6213.854004, y: 329.414124, z: 383.668518, o: 3.142673 }, // dun morogh
  { map: 1, x: 10313.512695, y: 820.463257, z: 1326.432861, o: 1.046102 }, // teldrassil
  { map: 0, x: 1656.171631, y: 1684.373291, z: 120.718842, o: 6.195381 }, // tirisfal
  { map: 1, x: -605.991211, y: -4248.711426, z: 38.95631, o: 3.098237 }, // durotar
  { map: 1, x: -2910.163574, y: -252.80246, z: 52.939739, o: 3.102943 }, // mulgore
];

const HARDCORE_NPC = std.CreatureTemplates.create(
  MODULE_NAME,
  "hardcore-npc",
  24437
)
  .NPCFlags.GOSSIP.set(true)
  .Spawns.add(MODULE_NAME, "hardcore-npc-spawns", SPAWNS)
  .Tags.addUnique(MODULE_NAME, "hardcore-npc");
