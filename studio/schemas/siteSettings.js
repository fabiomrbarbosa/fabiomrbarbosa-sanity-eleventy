export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "object",
  fields: [
    {
      title: "Site Title",
      name: "siteTitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Site Description",
      name: "siteDescription",
      type: "string",
    },
    {
      title: "Site Address",
      name: "siteAddress",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Social Media Handle",
      name: "socialHandle",
      type: "string",
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    },
  ],
};
