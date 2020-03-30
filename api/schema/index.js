const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Subject {
            _id: ID!
            title: String!
            year: String!
            season: String!
            sessions: [Session!]!
        }

        type Session {
            _id: ID!
            type: String!,
            number: Int!
            downloadURL: String!
            subject: Subject!
            creator: User!
            createdAt: String!
            updatedAt: String!
        }

        type User {
            _id: ID!
            name: String!
            email: String
            password: String
            uID: String
            year: String!
            createdSessions: [Session!]
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input SubjectInput {
            title: String!
            year: String!
            season: String!
        }

        input SessionInput {
            type: String!
            number: Int!
            downloadURL: String!
            creator: String!
            subject: String!
        }

        input UserInput {
            name: String!
            email: String
            password: String!
            uID: String
            year: String!
            authKey: String!
        }

        input SessionUpdateInput {
            sessionId: ID! 
            type: String!
            number: Int!
            downloadURL: String!
        }

        type RootQuery {
            subjects: [Subject!]!
            sessions: [Session!]!
        }
        type RootMutation {
            createSubject(subjectInput: SubjectInput): Subject
            createSession(sessionInput: SessionInput): Session
            createUser(userInput: UserInput): AuthData
            deleteSession(sessionId: ID!): Session
            deleteSubject(subjectId: ID!): Subject
            login(name: String!, password: String!): AuthData
            updateSession(sessionUpdateInput: SessionUpdateInput): Session
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);