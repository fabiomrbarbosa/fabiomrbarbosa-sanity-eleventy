const imageComp = require("../_includes/components/Image");

module.exports = {
  types: {
    image: props => imageComp ({ image: props.node }),
    author: props => `[${props.node.name}](/authors/${props.node.slug.current})`,
    code: props =>
      '```' + props.node.language + '\n' + props.node.code + '\n```'
  },
}
