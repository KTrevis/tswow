import { std } from "wow/wotlk"
import { QuestCreator, AreasID } from "../../Utils/QuestCreator"
import { WELCOME_QUEST } from "./WelcomeToHyjal"
import { GNOME_WORKSHOP } from "./WelcomeToHyjal"
import { HYJAL_MAP } from "../Setup/Map"

const name = "HyjalFirstTask"

export const CORRUPTED_TREANT = std.CreatureTemplates.create("trevis", name + "Treant", 299)
    .Level.set(1, 2)
    .Spawns.add("trevis", name + "SylvainSpawn", [
        { map: 1, x: 5542.886719, y: -3801.468018, z: 1606.622925, o: 0.264890 },
        { map: 1, x: 5562.910645, y: -3772.938232, z: 1603.568359, o: 1.871030 },
        { map: 1, x: 5560.844238, y: -3765.051758, z: 1601.266357, o: 1.768928 },
        { map: 1, x: 5510.171875, y: -3781.245361, z: 1599.428345, o: 1.054224 },
        { map: 1, x: 5519.947754, y: -3766.730957, z: 1595.653076, o: 0.987466 },
        { map: 1, x: 5529.458008, y: -3752.040771, z: 1594.982056, o: 1.007101 },
        { map: 1, x: 5546.854980, y: -3721.674316, z: 1598.519775, o: 1.058151 },
        { map: 1, x: 5555.425781, y: -3706.446533, z: 1599.611694, o: 1.058151 },
        { map: 1, x: 5572.592773, y: -3675.945557, z: 1598.988770, o: 1.058151 },
        { map: 1, x: 5581.176270, y: -3660.695312, z: 1600.362671, o: 1.058151 },
        { map: 1, x: 5586.604004, y: -3668.719482, z: 1600.671631, o: 4.619925 },
        { map: 1, x: 5586.911621, y: -3684.906494, z: 1603.427368, o: 5.495639 },
        { map: 1, x: 5600.574707, y: -3700.521240, z: 1609.807617, o: 4.729880 },
        { map: 1, x: 5597.337402, y: -3717.719238, z: 1608.715576, o: 4.525678 },
        { map: 1, x: 5594.088867, y: -3734.915039, z: 1607.868774, o: 4.525678 },
        { map: 1, x: 5591.535645, y: -3752.219971, z: 1608.226562, o: 4.615995 },
        { map: 1, x: 5590.018555, y: -3787.176758, z: 1611.457275, o: 4.686677 },
        { map: 1, x: 5589.568359, y: -3804.671143, z: 1612.476318, o: 4.686677 },
        { map: 1, x: 5582.085938, y: -3832.343994, z: 1611.076416, o: 3.477169 },
    ], spawn => 
        spawn.MovementType.RANDOM_MOVEMENT.set()
        .WanderDistance.set(10)
    )
    .Models.mod(0, ref => ref.set(18922))
    .Name.enGB.set("Corrupted Treant")
    .Type.ELEMENTAL.set()
    .TypeFlags.clearAll()
    .Auras.set('')

export const quest = QuestCreator.createKillingQuest("Branching Out Problems", GNOME_WORKSHOP, [{ id: CORRUPTED_TREANT.ID, quantity: 8 }], 1, AreasID.HYJAL)
    .PickupText.enGB.set(`Finally, a recruit who's not just here to grab energy!
Those goblins can hardly see past the gold glint, but we've got some... roots to dig up here.

The corrupted treants around Nordrassil—forest spirits with a serious attitude problem—have become downright nasty.
We suspect they've had a bit too much of that magical residue left from Archimonde's "grand finale." 

Take a few down so we can get to work without dodging thorny attitudes!`)
    .CompleteText.enGB.set(`Excellent! With those cranky sylvans out of the way, we can finally dig a little deeper into what's going on here.
    
Just, uh, keep it under wraps from the goblins, or they'll be selling 'souvenir twigs' before we know it.
Thanks for the help, recruit!`)
    .POIs.add(0, [
        { map: 1, x: 5531.914551, y: -3655.350586, z: 1593.751831, o: 0.001773 },
        { map: 1, x: 5646.271973, y: -3640.696045, z: 1617.398438, o: 6.041487 },
        { map: 1, x: 5669.409668, y: -3770.125732, z: 1630.355713, o: 4.780927 },
        { map: 1, x: 5519.863770, y: -3810.039551, z: 1609.844360, o: 3.418262 },
    ])
    .POIs.forEach(value => value.WorldMapArea.set(HYJAL_MAP.ID))
    .PrevQuest.set(WELCOME_QUEST.ID)