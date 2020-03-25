const sessionResolver = require("../resolvers/session");
const subjectResolver = require("../resolvers/subject");
const authResolver = require("../resolvers/auth");

const rootResolver = {
    ...sessionResolver,
    ...subjectResolver,
    ...authResolver
};

module.exports = rootResolver;