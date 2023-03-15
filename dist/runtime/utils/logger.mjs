import { logger as initLogger } from "@nuxt/kit";
const getLevel = () => {
  try {
    return useRuntimeConfig().openidConnect.config.debug ? 4 : 0;
  } catch (error) {
    return 0;
  }
};
const logger = initLogger.create({
  // level: 5,
  defaults: {
    tag: "nuxt-openid-connect"
  },
  level: getLevel()
});
export { logger };
