const sanityClient = require("@sanity/client");

const client = sanityClient({
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  useCdn: true,
});

module.exports = client;
