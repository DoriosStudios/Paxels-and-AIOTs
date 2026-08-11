import {
    EntityComponentTypes,
    EquipmentSlot,
    ItemComponentTypes,
    world
} from '@minecraft/server'

function applyDurabilityDamage(itemStack) {
    const durability = itemStack?.getComponent(ItemComponentTypes.Durability)
    if (!durability || durability.unbreakable) return false

    const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable)
    const unbreakingLevel = enchantable?.getEnchantment('unbreaking')?.level ?? 0

    if (Math.random() < durability.getDamageChance(unbreakingLevel)) {
        durability.damage = Math.min(durability.maxDurability, durability.damage + 1)
    }

    return durability.damage >= durability.maxDurability
}

function setMainhand(player, itemStack) {
    player
        .getComponent(EntityComponentTypes.Equippable)
        ?.setEquipment(EquipmentSlot.Mainhand, itemStack)
}

function damageUtilityCraftItem(player, itemStack) {
    if (!itemStack?.typeId.startsWith('utilitycraft:')) return
    if (itemStack.typeId.includes('mesh')) return
    if (!itemStack.getComponent(ItemComponentTypes.Durability)) return

    if (applyDurabilityDamage(itemStack)) {
        setMainhand(player, undefined)
        player.playSound('random.break')
    } else {
        setMainhand(player, itemStack)
    }
}

world.afterEvents.playerBreakBlock.subscribe(({ itemStackAfterBreak, player }) => {
    damageUtilityCraftItem(player, itemStackAfterBreak)
})

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
    if (damagingEntity.typeId !== 'minecraft:player') return

    const player = damagingEntity
    const itemStack = player
        .getComponent(EntityComponentTypes.Equippable)
        ?.getEquipment(EquipmentSlot.Mainhand)

    damageUtilityCraftItem(player, itemStack)
})
