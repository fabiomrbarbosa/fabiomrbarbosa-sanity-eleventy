const BlocksToMarkdown = require("@sanity/block-content-to-markdown");
const groq = require("groq");
const client = require("../_utils/sanityClient.js");
const serializers = require("../_utils/serializers");

module.exports = async function () {
  function generatePost(post) {
    return {
      ...post,
      body: BlocksToMarkdown(post.body, { serializers, ...client.config() }),
    };
  }

  async function getPosts() {
    const filter = groq`*[_type == "post" && defined(slug) && publishedAt < now()]`;
    const projection = groq`{
      ...,
      author->{
        name,
        slug,
        image {
          ...,
          asset->,
        }
      },
      category->{
        title,
        slug
      },
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
    const order = `| order(publishedAt desc)`;
    const query = [filter, projection, order].join(" ");
    const docs = await client.fetch(query).catch((err) => console.error(err));
    const preparePosts = docs.map(generatePost);
    return preparePosts;
  }

  return await getPosts();
};
