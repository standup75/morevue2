module.exports = (function() {
  var config, env, key, ref, settings, value;
  config = {
    global: {
      port: process.env.PORT || 3000,
      couchDB: {
        url: 'http://localhost:5984',
        username: 'admin',
        password: 'admin'
      },
      email: {
        from: '"morevue2"<admin@morevue2.com>'
      }
    },
    development: {
      origins: ["http://0.0.0.0:8180"],
      db: "mongodb://localhost/morevue2",
      couchDBBaseName: 'morevue2_dev',
      website: "http://0.0.0.0:8180",
      app: {
        name: "morevue2 dev"
      },
      env: "dev"
    },
    production: {
      origins: ["http://0.0.0.0:8180", "http://morevue2.com", "http://morevue2.standupweb.net"],
      db: process.env.MONGODB_URI,
      couchDBBaseName: 'morevue2_prod',
      website: "http://morevue2.com",
      app: {
        name: "morevue2"
      },
      env: "prod"
    }
  };
  settings = config.global;
  env = process.env.NODE_ENV || "development";
  settings.env = env;
  if (env === "test") {
    env = "production";
  }
  ref = config[env];
  for (key in ref) {
    value = ref[key];
    settings[key] = value;
  }
  return settings;
})();
