import { UTAGS } from "../../utils/utag";

function onHardcoreHello(
  creature: TSCreature,
  player: TSPlayer,
  cancel: TSMutable<boolean, boolean>
) {
  cancel.set(true);
  player.GossipClearMenu();

  if (player.HasAura(UTAGS.HARDCORE_AURA)) {
    player.GossipSendTextMenu(
      creature,
      "I can tell you are a mortal. I wish you a long life."
    );
    return;
  }

  if (player.GetLevel() > 1) {
    player.GossipSendTextMenu(
      creature,
      "I'm sorry, but you are too powerful to become a mortal. Maybe in another life..."
    );
    return;
  }

  player.GossipMenuAddItem(
    GossipOptionIcon.CHAT,
    "Turn on Hardcore mode.",
    0,
    0
  );
  player.GossipSendTextMenu(
    creature,
    `Being immortal can be boring...
Do you want to become a mortal?

WARNING:
- Once you turned on hardcore mode on a character, you cannot go back.
- Any death is definitive, even if it happened because of a bug.
- Once you get above level 1 you cannot turn on hardcore mode anymore.`
  );
}

function onHardcoreSelect(
  creature: TSCreature,
  player: TSPlayer,
  menuId: number,
  selectionId: number,
  cancel: TSMutable<boolean, boolean>
) {
  player.GossipComplete();
  player.AddAura(UTAGS.HARDCORE_AURA, player);
}

export function hardcoreNPC(events: TSEvents) {
  events.Creature.OnGossipHello(UTAGS.HARDCORE_NPC, onHardcoreHello);
  events.Creature.OnGossipSelect(UTAGS.HARDCORE_NPC, onHardcoreSelect);
}
