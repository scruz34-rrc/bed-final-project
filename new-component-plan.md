# New Component Plan: Express Rate Limit for Basic Rate Limiting

## 1. Component Selection

**Chosen Component:** `express-rate-limit`

**Why this component?**
This component adds rate limiting to API endpoints to control how many requests a client can make within a specific time window. This helps prevent abuse, DoS attacks, and ensures fair usage of the API.


## 2. Purpose and Value

Rate limiting will protect the Baseball Stats Archive API from:

- Excessive requests from a single client
- Accidental or intentional API abuse
- Server resource exhaustion


## 3. Implementation Plan

The implementation will begin with installing `express-rate-limit` along with its TypeScript type definitions as a development dependency.

Once installed, the package will be imported at the top of `app.ts` and a limiter configuration will be created. The limiter will enforce a 15-minute time window with a maximum of 100 requests per client, and will return a custom error message when the limit is exceeded.

The current limit is just a rough idea and may be updated after more testing and research.

The configured middleware will then be applied to the `/api/v1` path prefix, ensuring all API endpoints are covered under a single rule without needing to configure each route individually.

After wiring up the middleware, the rate limiting behaviour will be verified by running the server and sending a lot of requests. The expectation is that requests beyond the limit return a "too many requests" response. Based on the results of that testing, the window duration and request ceiling may be adjusted to better reflect real usage patterns.


## 4. Resources

- [express-rate-limit Documentation](https://www.npmjs.com/package/express-rate-limit)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)