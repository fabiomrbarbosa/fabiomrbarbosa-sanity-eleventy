const BlocksToMarkdown = require("@sanity/block-content-to-markdown");
const groq = require("groq");
const client = require("../_utils/sanityClient.js");
const serializers = require("../_utils/serializers");

module.exports = async function () {
  function generateAuthor(author) {
    return {
      ...author,
      bio: BlocksToMarkdown(author.bio, { serializers, ...client.config() }),
    };
  }

  async function getAuthors() {
    const filter = groq`*[_type == "author"]`;
    const docs = await client.fetch(filter).catch((err) => console.error(err));
    const authors = docs.map(generateAuthor);
    return authors;
  }

  return await getAuthors();
};
