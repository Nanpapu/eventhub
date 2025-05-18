import config from "./config";

console.log("===== ENVIRONMENT CONFIG =====");
console.log("NODE_ENV:", config.nodeEnv);
console.log("CLIENT_URL:", config.clientURL);
console.log("EMAIL_SERVICE:", config.emailService);
console.log("EMAIL_HOST:", config.emailHost);
console.log("EMAIL_PORT:", config.emailPort);
console.log("=====");

export default { test: "config" };
