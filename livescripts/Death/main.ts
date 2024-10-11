import Query from "mysql2/typings/mysql/lib/protocol/sequences/Query"
import {std} from "wow/wotlk"

function hardcore(player: TSPlayer) {
    QueryCharacters(`INSERT INTO character_banned VALUES(${player.GetGUID().GetCounter()}, 0, 0, '', '', 1)`)
    player.KickPlayer()
}

export default function onDeath(events: TSEvents) {
    events.Player.OnPlayerRepop(hardcore)
}