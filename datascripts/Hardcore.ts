import { std } from "wow/wotlk";

let name = "Hardcore"

// Hardcore debuff
std.Spells.create("trevis", name)
.Tags.addUnique("trevis", name)
.Icon.setFullPath("Interface\\Icons\\inv_misc_bone_humanskull_01")
.Name.enGB.set(name)
.Duration.setSimple(-1, 1, -1)
.AuraDescription.enGB.set("You are in hardcore mode. Die once, and you are dead forever.")
.Attributes.IS_NEGATIVE.set(true)
.Effects.addMod(eff =>
    eff.Type.APPLY_AURA.set()
    .Aura.DUMMY.set()
    .ImplicitTargetA.UNIT_CASTER.set()
)
.InlineScripts.OnRemove((effect, application, type) => {
    const player = ToPlayer(effect.GetCaster())
    if (!player || player.IsGM()) return
    player.DoDelayed((obj, mgr) => {
        player.ResurrectPlayer(0, false)
        player.AddAura(8326, player)
        player.AddAura(effect.GetID(), player)
    })
})

const spawns = [
    {map:0,x:-8928.311523,y:-140.488068,z:81.962692,o:1.735730}, // elwynn
    {map:0,x:-6213.854004,y:329.414124,z:383.668518,o:3.142673}, // dun morogh
    {map:1,x:10313.512695,y:820.463257,z:1326.432861,o:1.046102}, // teldrassil
    {map:0,x:1656.171631,y:1684.373291,z:120.718842,o:6.195381}, // tirisfal
    {map:1,x:-605.991211,y:-4248.711426,z:38.956310,o:3.098237}, // durotar
    {map:1,x:-2910.163574,y:-252.802460,z:52.939739,o:3.102943}, // mulgore
]

name = "Hardcore NPC"
// Hardcore NPC
std.CreatureTemplates.create("trevis", name, 24437)
.Subname.enGB.set("Harcore Enjoyer")
.Spawns.add("trevis", name + "Spawn", spawns)
.NPCFlags.GOSSIP.set(true)
.InlineScripts.OnGossipHello((creature, player, cancel) => {
    const HARDCORE = 0
    const aura = UTAG("trevis", "hardcore")
    cancel.set(true)
    player.GossipClearMenu()
    if (player.HasAura(aura))
        return player.GossipSendTextMenu(creature, "I can tell you are a mortal. I wish you a long life.")
    if (player.GetLevel() > 1)
        return player.GossipSendTextMenu(creature, "I'm sorry, but you are too powerful to become a mortal. Maybe in another life...")
    player.GossipMenuAddItem(GossipOptionIcon.CHAT, "Turn on Hardcore mode.", 0, HARDCORE)
    player.GossipSendTextMenu(creature, 
`Being immortal can be boring...
Do you want to become a mortal?

WARNING:
- Once you turned on hardcore mode on a character, you cannot go back.
- Any death is definitive, even if it happened because of a bug.
- Once you get above level 1 you cannot turn on hardcore mode anymore.`)
})
.InlineScripts.OnGossipSelect((creature, player, menuID, selectionID, cancel) => {
    const HARDCORE = 0
    const aura = UTAG("trevis", "hardcore")
    player.GossipComplete()
    if (selectionID != HARDCORE) return
    if (player.HasAura(aura) || player.GetLevel() > 1) return;
    player.AddAura(aura, player)
})