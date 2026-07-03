module.exports = {
  apps: [
    {
      name: "bot-wa-ut",
      script: "./src/app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/app.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
