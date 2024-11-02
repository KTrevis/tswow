import { std } from "wow/wotlk"
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs"
import { AreasID } from "../../Utils/QuestCreator"

std.Spells.load(42202).delete() // makes hyjal accessible

export const HYJAL_SPAWN = {map:1,x:5496.201172,y:-3734.774414,z:1597.045044,o:2.593613}
const HYJAL_CRATER = {map:1,x:5418.112305,y:-3145.356445,z:1581.517944,o:0.637969}

std.GMTeleports.create()
.Name.set("spawn")
.Position.set(HYJAL_SPAWN)

std.GMTeleports.create()
.Name.set("crater")
.Position.set(HYJAL_CRATER)

function changeRacesSpawn() {
	Object.keys(ClassIDs).forEach(value => {
		let id = Number(value)
		if (!id) return
		std.Classes.load(id).Races.forEach(value => value.SpawnPosition.set(AreasID.HYJAL, HYJAL_SPAWN))
	})
}

changeRacesSpawn()