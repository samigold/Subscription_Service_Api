import arcjet, {shield, detectBot, tokenBucket} from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";
const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ARCJET_KEY,
  characteristics: ["ip.src"], // Default characteristics
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        "POSTMAN", // Specifically allow Postman
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 1, // Refill 1 token per interval (more restrictive for testing)
      interval: 5, // Refill every 5 seconds
      capacity: 10, // Bucket capacity of 3 tokens (easier to hit limit)
    }),
  ],
});

export default aj;