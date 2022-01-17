require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
module.exports = {
  siteMetadata: {
    siteUrl: `https://spacesta-gram.netlify.app`,
    siteTitle: `Spacestagram`,
  },
  plugins: ["@chakra-ui/gatsby-plugin"],
};
