import { logger as initLogger } from "@nuxt/kit"

const getLevel = (): number => { // load
    try {
        return useRuntimeConfig().openidConnect.config.debug ? 4 : 0 // 5: trace, 4: debug, 0: errors
    } catch (error) {
        return 0
    }
}

// Note: tag not working after nuxt ready
const logger = initLogger.create({
    // level: 5,
    defaults: {
        tag: 'nuxt-opentid',
    },
    level: getLevel(),
})

export { logger }