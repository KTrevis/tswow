import { std } from "wow/wotlk"

const name = "Elderforge"

// const categories = [
// 	92, //  General
// 	96, //  Quests
// 	97, //  Exploration
// 	95, //  Player vs. Player
// 	168, //  Dungeons & Raids
// 	169, //  Professions
// 	201, //  Reputation
// 	155, //  World Events
// 	elderforgeAchievements.ID,
// 	81, //  Feats of Strength
// 	// 1, //  Statistics
// ]

export const customQuestsAchievements = std.AchievementCategory.create(92)
	.Name.enGB.set(name)
	.Parent.set(96)
