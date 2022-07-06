enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const ui = SpriteKind.create()
}
/**
 * Today:
 * 
 * - player spawning system in tilemap
 * 
 * - cutscene as a quick thing
 * 
 * - heart system - naturally regen over time?
 * 
 * - so we can take lava damage
 * 
 * Later:
 * 
 * - loot system
 * 
 * - make chests drop loot
 * 
 * - potion system
 * 
 * - quick healing potion
 * 
 * TO DO:
 * 
 * - re-do the mapping system
 * 
 * - Enter-able caves and areas that vary in light
 * 
 * - lighting system
 * 
 * - combat
 * 
 * - item/loot drops
 * 
 * - re-create pause system + draw minimap
 * 
 * DONE:
 * 
 * - draw/log tick rate
 */
/**
 * To Do:
 */
/**
 * Add Lava Damage
 * 
 * Add fighting mecanics
 * 
 * Add ai and texture
 * 
 * Add loot
 */
// Doing:
// 
// - Switching tile-maps when you touch the edge of the screen
function doesTilemapExist (x: number, y: number) {
    if (x < tilemaps.length && x >= 0) {
        if (y < tilemaps[x].length && y >= 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
// This is way too jittery, for what looks like no reason?
function updateMinimapPosition () {
    minimap_sprite.setPosition(scene.cameraProperty(CameraProperty.X) - 40, scene.cameraProperty(CameraProperty.Y) - 30)
}
function setCurrentPlayerAnimationState () {
    if (player_sprite.vx != 0 || player_sprite.vy != 0) {
        if (player_sprite.vx > 0) {
            characterAnimations.setCharacterState(player_sprite, characterAnimations.rule(Predicate.MovingRight))
        } else if (player_sprite.vx < 0) {
            characterAnimations.setCharacterState(player_sprite, characterAnimations.rule(Predicate.MovingLeft))
        } else if (player_sprite.vy > 0) {
            characterAnimations.setCharacterState(player_sprite, characterAnimations.rule(Predicate.MovingDown))
        } else if (player_sprite.vy < 0) {
            characterAnimations.setCharacterState(player_sprite, characterAnimations.rule(Predicate.MovingUp))
        }
    } else {
        characterAnimations.setCharacterState(player_sprite, characterAnimations.rule(Predicate.NotMoving))
    }
}
function debugging () {
    engine_currentSecondTicks += 1
    engine_msSinceLastTick = game.runtime() - engine_previousMsSinceStart
    console.logValue("ms since last tick", engine_msSinceLastTick)
    if (engine_msSinceLastTick >= 1000) {
        engine_currentTPS = engine_currentSecondTicks
        engine_currentSecondTicks = 0
        engine_previousMsSinceStart = game.runtime()
    }
    console.logValue("tps", engine_currentTPS)
}
function checkPlayerMovement_x () {
    if (controller.left.isPressed() || controller.right.isPressed()) {
        player_sprite.fx = 0
        if (controller.right.isPressed()) {
            player_sprite.vx = player_speed
        }
        if (controller.left.isPressed()) {
            player_sprite.vx = 0 - player_speed
        }
    } else {
        player_sprite.fx = 300
    }
}
function setupWorld () {
    tilemaps = [[
    tilemap`level1`,
    tilemap`level5`,
    tilemap`level8`,
    tilemap`level15`
    ], [
    tilemap`level6`,
    tilemap`level5`,
    tilemap`level8`,
    tilemap`level15`
    ], [
    tilemap`level3`,
    tilemap`level5`,
    tilemap`level8`,
    tilemap`level`
    ]]
    currentTileMap_x = 0
    currentTileMap_y = 0
    isInOverworld = 1
    loadTileMap()
}
function createMinimapImage () {
    // Not using this right now
    minimap_sprite = sprites.create(assets.image`arstarst`, SpriteKind.ui)
    minimap_x = -45
    minimap_y = -25
}
function updateMinimapImage () {
    if (is_ui_enabled == 1) {
        updateMinimapPosition()
        minimap2 = minimap.minimap(MinimapScale.Half, 1, 8)
        minimap.includeSprite(minimap2, player_sprite, MinimapSpriteScale.MinimapScale)
        minimap_sprite.setImage(minimap.getImage(minimap2))
    } else {
        minimap_sprite.destroy()
    }
}
function loadTileMap () {
    currentTileMap_column = tilemaps[currentTileMap_x]
    currentTileMap = currentTileMap_column[currentTileMap_y]
    tiles.setCurrentTilemap(currentTileMap)
    tiles.placeOnRandomTile(player_sprite, sprites.dungeon.collectibleInsignia)
}
function checkInputs () {
    if (controller.B.isPressed() && b_button_was_pressed == 0) {
        is_ui_enabled = 1 - is_ui_enabled
        isPaused = 1 - is_ui_enabled
        b_button_was_pressed = 1
    } else if (!(controller.B.isPressed()) && b_button_was_pressed == 1) {
        b_button_was_pressed = 0
    }
}
function setupPlayer () {
    player_sprite = sprites.create(assets.image`arstarstarst`, SpriteKind.Player)
    scene.cameraFollowSprite(player_sprite)
    player_speed = 70
    characterAnimations.loopFrames(
    player_sprite,
    assets.animation`myAnim2`,
    200,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.loopFrames(
    player_sprite,
    assets.animation`myAnim0`,
    200,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    player_sprite,
    assets.animation`myAnim1`,
    200,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    player_sprite,
    assets.animation`myAnim3`,
    200,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    player_sprite,
    assets.animation`myAnim`,
    500,
    characterAnimations.rule(Predicate.NotMoving)
    )
}
function checkPlayerIsEnteringNewTilemap () {
    if (player_sprite.x >= tileUtil.tilemapProperty(currentTileMap, tileUtil.TilemapProperty.PixelWidth) - player_sprite.width / 2) {
        if (doesTilemapExist(currentTileMap_x + 1, currentTileMap_y)) {
            currentTileMap_x += 1
            loadTileMap()
            player_sprite.x = player_sprite.width
        }
    } else if (player_sprite.x <= 0 + player_sprite.width / 2) {
        if (doesTilemapExist(currentTileMap_x - 1, currentTileMap_y)) {
            currentTileMap_x += -1
            loadTileMap()
            player_sprite.x = tileUtil.tilemapProperty(currentTileMap, tileUtil.TilemapProperty.PixelWidth) - player_sprite.width
        }
    } else if (player_sprite.y <= 0 + player_sprite.height / 2) {
        if (doesTilemapExist(currentTileMap_x, currentTileMap_y - 1)) {
            currentTileMap_y += -1
            loadTileMap()
            player_sprite.y = tileUtil.tilemapProperty(currentTileMap, tileUtil.TilemapProperty.PixelHeight) - player_sprite.height
        }
    } else if (player_sprite.y >= tileUtil.tilemapProperty(currentTileMap, tileUtil.TilemapProperty.PixelHeight) - player_sprite.width / 2) {
        if (doesTilemapExist(currentTileMap_x, currentTileMap_y + 1)) {
            currentTileMap_y += 1
            loadTileMap()
            player_sprite.y = 0 + player_sprite.height
        }
    }
}
function checkPlayerMovement_y () {
    if (controller.up.isPressed() || controller.down.isPressed()) {
        player_sprite.fy = 0
        if (controller.up.isPressed()) {
            player_sprite.vy = 0 - player_speed
        }
        if (controller.down.isPressed()) {
            player_sprite.vy = player_speed
        }
    } else {
        player_sprite.fy = 300
    }
}
let b_button_was_pressed = 0
let currentTileMap: tiles.TileMapData = null
let currentTileMap_column: tiles.TileMapData[] = []
let minimap2: minimap.Minimap = null
let minimap_y = 0
let minimap_x = 0
let isInOverworld = 0
let currentTileMap_y = 0
let currentTileMap_x = 0
let player_speed = 0
let engine_currentTPS = 0
let engine_previousMsSinceStart = 0
let engine_msSinceLastTick = 0
let engine_currentSecondTicks = 0
let player_sprite: Sprite = null
let minimap_sprite: Sprite = null
let tilemaps: tiles.TileMapData[][] = []
let engine_sprite_ui_tps: TextSprite = null
let isDebugging = 0
let isPaused = 0
let is_ui_enabled = 0
setupPlayer()
setupWorld()
is_ui_enabled = 0
isPaused = 0
if (isDebugging) {
    // to optimize: when debugging is toggled on, run this code a single time, then destroy the sprite if debugging is disabled again.
    // 
    // At the moment, you have to restart the entire thing to view the tickrate ui icon in-game.-
    engine_sprite_ui_tps = textsprite.create("0", 8, 1)
}
game.onUpdate(function () {
    // This currently:
    // - Checks if the player is pressing a key
    // - so it can "disable player friction"
    // - and then re-enable it when the player stops pressing a key
    // 
    // But, if I want to add enemies or things that "bump" the player around, I'll have to figure out a different way to do this.
    checkPlayerMovement_x()
    checkPlayerMovement_y()
    setCurrentPlayerAnimationState()
    checkInputs()
    if (isInOverworld) {
        checkPlayerIsEnteringNewTilemap()
    }
    if (isDebugging) {
        debugging()
        engine_sprite_ui_tps.setText(convertToText(engine_currentTPS))
        engine_sprite_ui_tps.setPosition(scene.cameraProperty(CameraProperty.X) - 60, scene.cameraProperty(CameraProperty.Y) - 40)
    }
})
