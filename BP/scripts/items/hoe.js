import { itemComponent } from './registry.js'

/**
 * Hoe component synchronized with UtilityCraft AIOTs.
 *
 * Converts tillable blocks to farmland and optionally harvests a 3x3 area.
 */
itemComponent('utilitycraft:hoe', {
    onUseOn({ block, source }, { params }) {
        if (!block || !source) return

        const sneakingMode = params?.sneakingMode ?? false
        const isSneaking = source.isSneaking ?? false
        if (sneakingMode !== isSneaking) return

        const { x, y, z } = block.location
        const size = params?.size ?? 1
        const runAreaHarvest = params?.runAreaHarvest ?? false

        const tillableBlocks = [
            'minecraft:dirt',
            'minecraft:grass',
            'minecraft:grass_block',
            'minecraft:podzol',
            'minecraft:mycelium',
            'minecraft:dirt_with_roots'
        ]

        for (const blockId of tillableBlocks) {
            block.dimension.runCommand(
                `fill ${x - size} ${y} ${z - size} ${x + size} ${y} ${z + size} farmland replace ${blockId}`
            )
        }

        if (runAreaHarvest) {
            block.dimension.runCommand(
                `execute positioned ${x} ${y} ${z} run function area_harvest`
            )
        }
    }
})
