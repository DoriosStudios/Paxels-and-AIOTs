import { itemComponent } from './registry.js'

/**
 * Shovel component synchronized with UtilityCraft AIOTs.
 *
 * Clears snow and converts pathable blocks to dirt paths.
 */
itemComponent('utilitycraft:shovel', {
    onUseOn({ block, source }, { params }) {
        if (!block || !source) return

        const sneakingMode = params?.sneakingMode ?? true
        const isSneaking = source.isSneaking ?? false
        const { x, y, z } = block.location
        const size = params?.size ?? 1

        for (let dx = -size; dx <= size; dx++) {
            for (let dz = -size; dz <= size; dz++) {
                const checkX = x + dx
                const checkZ = z + dz

                for (let dy = 0; dy <= 1; dy++) {
                    const checkY = y + dy
                    block.dimension.runCommand(
                        `execute if block ${checkX} ${checkY} ${checkZ} snow run setblock ${checkX} ${checkY} ${checkZ} air destroy`
                    )
                    block.dimension.runCommand(
                        `execute if block ${checkX} ${checkY} ${checkZ} snow_layer run setblock ${checkX} ${checkY} ${checkZ} air destroy`
                    )
                }
            }
        }

        if (sneakingMode !== isSneaking) return

        const pathableBlocks = [
            'minecraft:dirt',
            'minecraft:grass',
            'minecraft:grass_block',
            'minecraft:podzol',
            'minecraft:mycelium',
            'minecraft:dirt_with_roots'
        ]

        for (const blockId of pathableBlocks) {
            block.dimension.runCommand(
                `fill ${x - size} ${y} ${z - size} ${x + size} ${y} ${z + size} grass_path replace ${blockId}`
            )
        }
    }
})
