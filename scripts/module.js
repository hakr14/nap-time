Hooks.once('init', async function() {
    game.socket.on(`module.nap-time`, async (data) => {
        if (!game.user.isGM){
            if(data.operation === "shortRest") await game.user.character?.shortRest();
            if(data.operation === "longRest") await game.user.character?.longRest();
        }
    });
})
Hooks.on("getSceneControlButtons", addRestButton); //add the button for this to the menu

function addRestButton(buttons) {
    let tilesButton = buttons.find(b => b.name === "token")
    if (tilesButton) {
        tilesButton.tools.push({
            name: "nap-time",
            title: game.i18n.localize('NAPTIME.Button'),
            icon: "fas fa-bed",
            visible: game.user.isGM,
            onClick: () => restDialog(),
            button: true
        });
    }
}

function restDialog() {
    let d = new Dialog({
        title: game.i18n.localize("NAPTIME.Dialog.Title"),
        content: game.i18n.localize("NAPTIME.Dialog.Content"),
        buttons:{
            short:{
                icon: "<i class='fas fa-hourglass-half'></i>",
                label: game.i18n.localize("DND5E.RestS"),
                callback: () => game.socket.emit("module.nap-time",{
                    operation: "shortRest"
                })
            },
            long:{
                icon: "<i class='fas fa-bed'></i>",
                label: game.i18n.localize("DND5E.RestL"),
                callback: () => game.socket.emit("module.nap-time",{
                    operation: "longRest"
                })
            }
        }
    })
    d.render(true)
}