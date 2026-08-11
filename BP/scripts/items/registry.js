import { system } from '@minecraft/server'

const itemComponents = []
let installed = false

export function itemComponent(id, handlers) {
    if (installed) throw new Error('Cannot add item components after installation')
    itemComponents.push({ id, handlers })
}

export function installItemComponents() {
    if (installed) return false
    installed = true

    system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
        for (const { id, handlers } of itemComponents) {
            itemComponentRegistry.registerCustomComponent(id, handlers)
        }
    })

    return true
}
