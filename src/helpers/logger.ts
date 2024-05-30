import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "users.log" }),
  ],
  silent: false,
});
