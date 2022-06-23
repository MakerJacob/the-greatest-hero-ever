enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const ui = SpriteKind.create()
}
/**
 * To Do:
 */
/**
 * Doing:
 * 
 * - Switching tile-maps when you touch the edge of the screen
 */
function doesTilemapExist (x: number, y: number) {
    if (x < tilemaps.length && x > 0) {
        if (y < tilemaps[x].length && y > 0) {
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
function hideMinimap () {
	
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
function regenerateTileMap () {
    for (let i_col = 0; i_col <= 15; i_col++) {
        for (let j_row = 0; j_row <= 15; j_row++) {
            tileID = randint(0, 6)
            if (tileID == 0) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tileGrass2)
            } else if (tileID == 1) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tileGrass1)
            } else if (tileID == 2) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tilePath5)
            } else if (tileID == 3) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tilePath1)
            } else if (tileID == 4) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tileGrass3)
            } else if (tileID == 5) {
                tiles.setTileAt(tiles.getTileLocation(i_col, j_row), sprites.castle.tilePath6)
            } else {
            	
            }
        }
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
    tilemap`level15`
    ]]
    currentTileMap_x = 2
    currentTileMap_y = 0
    loadTileMap()
    minimap_sprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.ui)
    minimap_x = -45
    minimap_y = -25
}
function updateMinimapImage () {
    if (is_ui_enabled == 1) {
        updateMinimapPosition()
        minimap2 = minimap.minimap(MinimapScale.Eighth, 1, 8)
        minimap.includeSprite(minimap2, player_sprite, MinimapSpriteScale.Double)
        minimap_sprite.setImage(minimap.getImage(minimap2))
    } else {
        minimap_sprite.setImage(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `)
    }
}
function loadTileMap () {
    currentTileMap_column = tilemaps[currentTileMap_x]
    currentTileMap = currentTileMap_column[currentTileMap_y]
    tiles.setCurrentTilemap(currentTileMap)
}
function checkInputs () {
    if (controller.B.isPressed() && b_button_was_pressed == 0) {
        is_ui_enabled = 1 - is_ui_enabled
        b_button_was_pressed = 1
    } else if (!(controller.B.isPressed()) && b_button_was_pressed == 1) {
        b_button_was_pressed = 0
    }
}
function setupPlayer () {
    player_sprite = sprites.create(img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Player)
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
let currentTileMap_y = 0
let currentTileMap_x = 0
let tileID = 0
let player_speed = 0
let player_sprite: Sprite = null
let minimap_sprite: Sprite = null
let tilemaps: tiles.TileMapData[][] = []
let is_ui_enabled = 0
setupPlayer()
setupWorld()
is_ui_enabled = 0
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
    updateMinimapImage()
    checkPlayerIsEnteringNewTilemap()
})
game.onUpdateInterval(500, function () {
	
})