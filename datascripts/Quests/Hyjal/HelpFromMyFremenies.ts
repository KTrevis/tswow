import { std } from "wow/wotlk";
import { GOBLIN_WORKSHOP } from "./Welcome";
import { quest as branchingOutProblems } from "./BranchingOutProblems"
import { AreasID } from "../Utils/QuestCreator";

const name = "A Little Help from My Frenemies"

export const GearmasterGizwizzle = std.CreatureTemplates.create("trevis", name + "NPC", 1268)
    .FactionTemplate.NEUTRAL_PASSIVE.set()
    .Spawns.add("trevis", name + "NPC", { map: 1, x: 5367.099121, y: -3739.899414, z: 1624.543213, o: 4.325414 },)
    .Name.enGB.set("Gearmaster Gizwizzle")

export const helpFromMyFremenies = std.Quests.create("trevis", name + "Quest")
    .Name.enGB.set(name)
    .Questgiver.addCreatureStarter(GOBLIN_WORKSHOP.ID)
    .Questgiver.addCreatureEnder(GearmasterGizwizzle.ID)
    .CompleteText.enGB.set(`Ah, so you're the muscle my goblin friend sent over!
Good, good. Not everyone can handle the kind of genius we're cooking up here!
Now, let's see if we can really take control of this energy situation, shall we?`)
    .PickupText.enGB.set(`Nice job thinning out those treants!

But, of course, goblin engineering can only go so far without a bit of… gnomish 'refinement.'
Head over to the smaller building down the path and talk to Gearmaster Gizwizzle.
He's got some high-tech ideas about handling the local wildlife that I, uh, reluctantly admit might be worth a try.

Don't let his gnome babble throw you off!`)
    .ObjectiveText.enGB.set(`Speak to ${GearmasterGizwizzle.Name.enGB.get()}.`)
    .PrevQuest.set(branchingOutProblems.ID)
    .POIs.forEach(value => {
        value.WorldMapArea.set(AreasID.HYJAL)
        value.Map.set(1)
    })
    .AreaSort.set(AreasID.HYJAL)