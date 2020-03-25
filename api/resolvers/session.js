const Subject = require("../../models/subject");
const Session = require("../../models/session");
const User = require("../../models/user");
const { findSubject, findUser } = require("./joint");


module.exports = {
    sessions: () => {
        return Session.find().then((sessions) => {
            return sessions.map((session) => {
                return {
                    ...session._doc,
                    _id: session.id,
                    creator: findUser.bind(this, session._doc.creator),
                    subject: findSubject.bind(this, session._doc.subject)
                };
            });
        }).catch((error) => {
            throw error;
        });
    },
    createSession: (args) => {
        const session = new Session({
            type: args.sessionInput.type,
            number: +args.sessionInput.number,
            downloadURL: args.sessionInput.downloadURL,
            creator: args.sessionInput.creator,
            subject: args.sessionInput.subject
        });
        let createdSession;

        return Subject.findById(args.sessionInput.subject).then((subj) => {
            if (!subj) {
                throw new Error('subject not found');
            }
            return session.save().then((result) => {
                createdSession = {
                    ...result._doc,
                    _id: session.id,
                    creator: findUser.bind(this, result._doc.creator)
                };
                return User.findById(args.sessionInput.creator).then((aUser) => {
                    if (!aUser) {
                        throw new Error("user not found.");
                    }
                    aUser.createdSessions.push(session);
                    subj.sessions.push(session);
                    return aUser.save().then(() => {
                        return subj.save().then(() => {
                            return createdSession;
                        });
                    });
                }).catch((error) => {
                    throw error;
                });
            }).catch((error) => {
                throw error;
            });
        }).catch((error) => {
            throw error;
        });

    },
    deleteSession: async (args) => {
        try {
            const session = await Session.findById(args.sessionId);
            const subject = await Subject.findById(session.subject);
            for (let i = 0; i < subject.sessions.length; i++) {
                try {
                    if (subject.sessions[i] == args.sessionId) {
                        subject.sessions.splice(i, 1);
                        console.log(subject.sessions[i]);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            subject.save();
            await Session.deleteOne({ _id: args.sessionId });
            return {
                ...session._doc,
                _id: session.id,
                subject: findSubject.bind(this, session._doc.id)
            };
        } catch (error) {
            throw error;
        }
    }
};