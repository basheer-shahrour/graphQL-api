const Subject = require("../../models/subject");
const { findSessions } = require("./joint");
const Session = require("../../models/session");
module.exports = {
    subjects: () => {
        return Subject.find().then((subjects) => {
            return subjects.map((subject) => {
                return {
                    ...subject._doc,
                    _id: subject.id,
                    sessions: findSessions.bind(this, subject._doc.sessions)
                };
            });
        }).catch((error) => {
            throw error;
        });
    },
    createSubject: (args) => {
        const subject = new Subject({
            title: args.subjectInput.title,
            year: args.subjectInput.year,
            season: args.subjectInput.season
        });

        return Subject.findOne({ title: args.subjectInput.title }).then((subj) => {
            if (subj) {
                throw new Error("This subject has already been saved");
            } else {
                return subject.save().then((result) => {
                    return {...result._doc, _id: subject.id };
                }).catch((error) => {
                    throw error;
                });
            }
        }).catch((error) => {
            throw error;
        });
    },
    deleteSubject: async(args) => {
        try {
            const subject = await Subject.findById(args.subjectId);
            let aSession = await Session.findById(subject.sessions[0]);

            if (aSession) {
                throw new Error("This subject has some sessions !");
            } else {
                await Subject.deleteOne({ _id: args.subjectId });
                return {
                    ...subject._doc,
                    _id: subject.id
                };
            }
        } catch (error) {
            throw error;
        }
    }
};