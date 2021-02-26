const BlocksToMarkdown = require("@sanity/block-content-to-markdown");
const groq = require("groq");
const client = require("../_utils/sanityClient.js");
const imageUrl = require("../_utils/imageUrl")
const serializers = require("../_utils/serializers");

module.exports = async function () {
  function generatePage(page) {
    return {
      ...page,
      body: BlocksToMarkdown(page.body, { serializers, ...client.config() }),
    };
  }

  async function getPages() {
    const filter = groq`*[_type == "page" && defined(slug)]`;
    const projection = groq`{
      ...,
      mainImage {
        ...,
        asset->
      },
      body[]{
        ...,
        children[]{
          ...,
        },
        _type == "image" => {
          ...,
          asset->
        }
      }
    }`;
    const order = `| order(_updatedAt desc)`;
    const query = [filter, projection, order].join(" ");
    const docs = await client.fetch(query).catch((err) => console.error(err));
    const preparePages = docs.map(generatePage);
    return preparePages;
  }

  return await getPages();
};
