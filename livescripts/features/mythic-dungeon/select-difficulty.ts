
import { MAX_GOSSIP_MENU_ITEMS } from "../../utils/constants";
import { UTAGS } from "../../utils/utag";
import { calculateReward } from "./calculate-reward";

function onGossipHello(
  creature: TSCreature,
  player: TSPlayer,
  cancel: TSMutable<boolean, boolean>
) {
  cancel.set(true);
  player.GossipClearMenu();

  if (creature.HasAura(UTAGS.MYTHIC_DUNGEON_SCALING_BUFF)) {
    player.GossipSendTextMenu(creature, "You already picked your difficulty.");
    return;
  }
  const creatures = creature.GetMap().GetCreatures();
  const averageLevel =
    creatures.reduce((acc, curr) => acc + curr.GetLevel(), 0) /
    creatures.length;

  for (let i: uint8 = 0; i < MAX_GOSSIP_MENU_ITEMS; i += 1) {
    const difficulty = i + 1;

    player.GossipMenuAddItem(
      GossipOptionIcon.CHAT,
      `+${difficulty} (Currency: ${calculateReward(difficulty, averageLevel)})`,
      0,
      difficulty
    );
  }

  player.GossipSendTextMenu(
    creature,
    "Select your difficulty. Each difficulty increases damage and health of every enemy by 10%. The higher the difficulty, the bigger the reward."
  );
}

function onGossipSelect(
  creature: TSCreature,
  player: TSPlayer,
  menuId: number,
  selectionId: number,
  cancel: TSMutable<boolean, boolean>
) {
  const difficulty = selectionId;
  player.GossipComplete();
  const creatures = creature.GetMap().GetCreatures();
  const averageLevel =
    creatures.reduce((acc, curr) => acc + curr.GetLevel(), 0) /
    creatures.length;

  for (const creature of creatures) {
    creature.RemoveAura(UTAGS.MYTHIC_DUNGEON_SCALING_BUFF);

    for (let i = 0; i < difficulty; i += 1) {
      creature.AddAura(UTAGS.MYTHIC_DUNGEON_SCALING_BUFF, creature);
    }
  }
}

export function selectDifficulty(events: TSEvents) {
  events.Creature.OnGossipHello(UTAGS.MYTHIC_DUNGEON_NPC, onGossipHello);
  events.Creature.OnGossipSelect(UTAGS.MYTHIC_DUNGEON_NPC, onGossipSelect);
}
