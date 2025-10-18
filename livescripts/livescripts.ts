export function Main(events: TSEvents) {
    events.Player.OnLevelChanged((player, oldLevel) => {
        console.log(`${player.GetName()} is now level ${player.GetLevel()}\n`);
    });
}