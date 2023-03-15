import { fileURLToPath } from 'url';
import { logger as logger$1, defineNuxtModule, createResolver, addPlugin, resolveModule } from '@nuxt/kit';
import { defu } from 'defu';

const name = "nuxt-openid-connect";
const version = "0.5.5";

const getLevel = () => {
  try {
    return useRuntimeConfig().openidConnect.config.debug ? 4 : 0;
  } catch (error) {
    return 0;
  }
};
const logger = logger$1.create({
  // level: 5,
  defaults: {
    tag: "nuxt-openid-connect"
  },
  level: getLevel()
});

const module = defineNuxtModule({
  meta: {
    name,
    version,
    configKey: "openidConnect",
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: "^3.0.0-rc.8"
    }
  },
  defaults: {
    addPlugin: true,
    op: {
      issuer: "",
      clientId: "",
      clientSecret: "",
      callbackUrl: "",
      scope: []
    },
    // express-session configuration
    config: {
      debug: false,
      secret: "oidc._sessionid",
      // process.env.OIDC_SESSION_SECRET
      cookie: {},
      cookiePrefix: "oidc._",
      cookieEncrypt: true,
      cookieEncryptKey: "bfnuxt9c2470cb477d907b1e0917oidc",
      cookieEncryptIV: "ab83667c72eec9e4",
      cookieEncryptALGO: "aes-256-cbc",
      cookieMaxAge: 24 * 60 * 60,
      //  default one day
      response_type: "id_token",
      cookieFlags: {}
    }
  },
  setup(options, nuxt) {
    logger.level = options.config.debug === true ? 5 : 0;
    logger.info("[DEBUG MODE]: ", options.config.debug);
    logger.debug("[WITHOUT ENV VARS] options:", options);
    const { resolve } = createResolver(import.meta.url);
    const resolveRuntimeModule = (path) => resolveModule(path, { paths: resolve("./runtime") });
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.handlers = nitroConfig.handlers || [];
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/status",
        handler: resolveRuntimeModule("./server/routes/oidc/status")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/login",
        handler: resolveRuntimeModule("./server/routes/oidc/login")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/logout",
        handler: resolveRuntimeModule("./server/routes/oidc/logout")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/callback",
        handler: resolveRuntimeModule("./server/routes/oidc/callback")
      });
      nitroConfig.handlers.push({
        method: "post",
        route: "/oidc/callback",
        handler: resolveRuntimeModule("./server/routes/oidc/callback")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/user",
        handler: resolveRuntimeModule("./server/routes/oidc/user")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/cbt",
        handler: resolveRuntimeModule("./server/routes/oidc/cbt")
      });
      nitroConfig.handlers.push({
        method: "post",
        route: "/oidc/cbt",
        handler: resolveRuntimeModule("./server/routes/oidc/cbt")
      });
      nitroConfig.handlers.push({
        method: "get",
        route: "/oidc/error",
        handler: resolveRuntimeModule("./server/routes/oidc/error")
      });
      nitroConfig.externals = defu(typeof nitroConfig.externals === "object" ? nitroConfig.externals : {}, {
        inline: [
          // Inline module runtime in Nitro bundle
          resolve("./runtime")
        ]
      });
    });
    const publicOps = Object.assign({}, options.op);
    const cnfg = Object.assign({}, options.config);
    publicOps.clientSecret = "";
    cnfg.cookieEncryptALGO = "";
    cnfg.cookieEncryptIV = "";
    cnfg.cookieEncryptKey = "";
    nuxt.options.runtimeConfig.public.openidConnect = defu(nuxt.options.runtimeConfig.public.openidConnect, {
      op: publicOps,
      config: cnfg
    });
    nuxt.options.runtimeConfig.openidConnect = {
      ...options
    };
    if (options.addPlugin) {
      const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
      nuxt.options.build.transpile.push(runtimeDir);
      addPlugin(resolve(runtimeDir, "plugin"));
      nuxt.hook("imports:dirs", (dirs) => {
        dirs.push(resolve(runtimeDir, "composables"));
      });
    }
  }
});

export { module as default };
