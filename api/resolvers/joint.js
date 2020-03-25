const Session = require("../../models/session");
const User = require("../../models/user");
const Subject = require("../../models/subject");

const findSessions = (sessionIds) => {
    return Session.find({ _id: { $in: sessionIds } }).then((sessions) => {
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
};

const findUser = (userId) => {
    return User.findById(userId).then((user) => {
        return {
            ...user._doc,
            _id: user.id,
            createdSessions: findSessions.bind(this, user.createdSessions)
        };
    }).catch((error) => {
        throw error;
    });
};

const findSubject = (subjId) => {
    return Subject.findById(subjId).then((subj) => {
        return {
            ...subj._doc,
            _id: subj.id,
            sessions: findSessions.bind(this, subj._doc.sessions)
        };
    }).catch((error) => {
        throw error;
    });
};

exports.findSubject = findSubject;
exports.findSessions = findSessions;
exports.findUser = findUser;