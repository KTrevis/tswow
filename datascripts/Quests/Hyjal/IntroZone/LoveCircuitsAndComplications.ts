import { std } from "wow/wotlk"
import { GearmasterGizwizzle } from "./HelpFromMyFremenies"

const name = "Love, Circuits, and Complications"

export const krixieKlankbolt = std.CreatureTemplates.create("trevis", name + "Krixie Klankbolt") // female goblin
.NPCFlags.QUEST_GIVER.set(1)
.Models.addIds(7909)
.Name.enGB.set("Krixie Klankbolt")
.Spawns.add("trevis", "Krixie Klankbolt Spawn", {map:1,x:5145.976074,y:-3324.662842,z:1638.936035,o:4.918397},)

const quest = std.Quests.create("trevis", name + "Quest")
.Name.enGB.set(name)
.Questgiver.addCreatureStarter(GearmasterGizwizzle.ID)
.Questgiver.addCreatureEnder(krixieKlankbolt.ID)
.PickupText.enGB.set(`Well, you're quite the bot-basher, aren't you?
Gizwizzle here with a new task—no more robot smashing for now, don't worry!

I need you to speak with a... unique team working on our latest machine-stabilizing project.
Meet Krixie Klankbolt and Whirley Sparktwist, a goblin and gnome duo with some serious chemistry—both romantically and scientifically!
They've been experimenting with new designs, but I suspect their partnership has gotten, shall we say, complicated.

Go see them and help sort things out before our whole operation goes up in smoke!`)
.CompleteText.enGB.set(`Hey, you actually made it here! And just in time, too.

Whirley's been babbling on about fixing the “Legion problem” nearby—seems there's a small invasion creeping up from the forest.
He's got a brilliant plan to build some gizmo that'll help us push 'em back, but he's so scatterbrained that we've been stuck on step one for days!
With you keeping him on track, maybe we can actually get this machine up and running before those Legion creeps get too close.

Thanks for the backup—let's show those demons what goblin-gnome teamwork can do!`)
.QuestLevel.set(5)
.MinLevel.set(4)
.ObjectiveText.enGB.set(`Speak to ${krixieKlankbolt.Name.enGB.get()}.`)