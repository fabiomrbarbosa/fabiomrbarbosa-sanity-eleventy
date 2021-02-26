require('dotenv').config();
const { DateTime } = require("luxon");
const util = require("util");
const sanityClient = require("./src/_utils/sanityClient");
const sanityImage = require("eleventy-plugin-sanity-image");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const componentsDir = `./src/_includes/components`;
const Image = require(`${componentsDir}/Image.js`);

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/_tmp/main.css");
  eleventyConfig.addPassthroughCopy({"./src/_tmp/main.css": "assets/styles/main.css"});
  eleventyConfig.addPassthroughCopy("./src/assets/images");
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");

  eleventyConfig.addShortcode("Image", Image);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(sanityImage, {
    client: sanityClient,
  });

  eleventyConfig.addFilter("debug", function (value) {
    return util.inspect(value, { compact: false });
  });

  eleventyConfig.addFilter("readableDate", (dateString) => {
    return new Date(dateString).toDateString();
  });

  eleventyConfig.addFilter("readableDate", (dateString, locale="en") => {
    // .toLocaleString returns a natural language phrase instead of just translating the month names etc.
    return DateTime.fromISO(dateString, { zone: "utc" })
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_FULL);
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("sortByNavOrder", (pages) => {
    return pages.sort(function(a, b) {
      return (a.data.navOrder || 0) - (b.data.navOrder || 0);
    });
  });

  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    quotes: "“”‘’",
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  };

  eleventyConfig.setLibrary(
    "md",
    markdownIt(options).use(markdownItAnchor, opts)
  );

  eleventyConfig.addFilter("markdownify", function (value) {
    const md = new markdownIt(options);
    return md.render(value);
  });

  eleventyConfig.setDataDeepMerge(true);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
  };
};
