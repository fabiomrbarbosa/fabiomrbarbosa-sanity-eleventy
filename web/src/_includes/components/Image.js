const imageUrl = require("../../_utils/imageUrl");
const markdownIt = require("markdown-it");
const md = new markdownIt();

module.exports = function ({
  lazy = true,
  image = "",
  size = "full",
  className = "",
  mainImage = false,
  figCaption = true,
  link = ""
} = {}) {
  if (image === "") { return ""; }
  
  const loadingType = lazy == true ? "lazy" : "eager";
  const imageAlt = image.alt ? `${image.alt}` : "";
  const imageCaption = image.caption ? `${image.caption}` : "";
  const imageAttribution = image.attribution ? `${image.attribution}` : "";

  const imageSteps = 5;
  const imageSrcsetList = [];
  const extraClass = className ? ` ${className}` : "";

  let imageWidth = image.asset.metadata.dimensions.width;
  let imageHeight = image.asset.metadata.dimensions.height;
  const imageCrop = image.crop;

  if (imageCrop) {
    const y = imageCrop.top + imageCrop.bottom;
    const x = imageCrop.left + imageCrop.right;
    imageHeight = Math.round((1 - y) * imageHeight);
    imageWidth = Math.round((1 - x) * imageWidth);
  }

  const imageSettings = {
    full: {
      fallbackWidth: 960,
      minWidth: 320,
      maxWidth: 1440,
      sizes: "(max-width: 90rem) 90vw, 90rem",
      classes: ["full"],
    },
    wide: {
      fallbackWidth: 480,
      minWidth: 320,
      maxWidth: 920,
      sizes: "(max-width: 56.25rem) 90vw, (max-width: 90rem) 66vw, 57.5rem",
      classes: ["twothirds"],
    },
    onethird: {
      fallbackWidth: 640,
      minWidth: 320,
      maxWidth: 820,
      sizes: "(max-width: 56.25rem) 90vw, (max-width: 90rem) 30vw, 27.75rem",
      classes: ["onethird"],
    },
  };

  for (let i = 0; i < imageSteps; i++) {
    let stepWidth = Math.ceil(
      imageSettings[size].minWidth +
        ((imageSettings[size].maxWidth - imageSettings[size].minWidth) /
          (imageSteps - 1)) *
          i
    );
    imageSrcsetList.push(
      `${imageUrl(image).width(stepWidth).fit("max").auto("format").url()} ${stepWidth}w`
    );
  }

  return /*html*/ `
  ${ link && `<a href="${link}" >`}
  <figure class="image-${imageSettings[size].classes} ${extraClass}">
    <img
      loading="${loadingType}"
      src="${imageUrl(image)
        .width(imageSettings[size].fallbackWidth)
        .fit("max")
        .auto("format")}"
      alt="${imageAlt}"
      srcset="${imageSrcsetList.join(", ")}"
      sizes="${imageSettings[size].sizes}"
      width="${imageWidth}"
      height="${imageHeight}"
      class="mx-auto"
    />
    ${ figCaption ? (imageCaption || imageAttribution) &&
      /*html*/ `<figcaption class="text-gray-500 border-b border-gray-300 py-4 mt-3 ${ mainImage ? `mx-6` : ``}">
      ${
        imageCaption &&
        /*html*/ `<span class="figure__caption">
        ${md.renderInline(imageCaption)}
      </span>`
      }
      ${
        imageAttribution &&
        /*html*/ `<span class="figure__attribution pl-4">
        <span>&#10022;</span> ${md.renderInline(imageAttribution)}
      </span>`
      }
    </figcaption>`
    : ''}
  </figure>
  ${link && `</a>`}`
};
