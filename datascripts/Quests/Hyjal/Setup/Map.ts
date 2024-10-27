import { std } from "wow/wotlk"
import { AreasID } from "../../Utils/QuestCreator"

export const HYJAL_MAP = std.WorldMapAreas.create()
.Map.set(1)
.Area.set(AreasID.HYJAL)
.Directory.set("Hyjal")
.Boundary.Top.set(6100)
.Boundary.Bottom.set(4000)
.Boundary.Left.set(-1100)
.Boundary.Right.set(-4300)

const OVERLAY = HYJAL_MAP.Overlays.addGet()
.Areas.addId(AreasID.HYJAL)
.Texture.set("HyjalWorldMap", 1000, 667)