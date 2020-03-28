const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: (args) => {
        return User.findOne({ name: args.userInput.name }).then((aUser) => {
            if (aUser) {
                throw new Error("This user has already been saved");
            } else if(args.userInput.authKey === process.env.AUTH_KEY) {
                return bcrypt.hash(args.userInput.password, 12).then((hashedPassword) => {
                    const user = new User({
                        name: args.userInput.name,
                        email: args.userInput.email,
                        password: hashedPassword,
                        uID: args.userInput.uID,
                        year: args.userInput.year
                    });
                    return user.save().then((result) => {
                        const token = jwt.sign({
                            userId: user.id,
                            userName: user.name,
                            myKey: "collAuth"
                        }, 'superkey', {
                            expiresIn: '2h'
                        });
                        return {
                            userId: user.id,
                            token: token,
                            tokenExpiration: 2
                        };
                    }).catch((error) => {
                        throw error;
                    });

                }).catch((error) => {
                    throw error;
                });
            } else {
                throw new Error("Error with auth key ...");
            }
        }).catch((error) => {
            throw error;
        });

    },
    login: async (args) => {
        const user = await User.findOne({ name: args.name });
        if (user) {

            if (await bcrypt.compare(args.password, user.password)) {
                const token = jwt.sign({
                    userId: user.id,
                    userName: user.name,
                    myKey: "collAuth"
                }, 'superkey', {
                        expiresIn: '2h'
                    });
                return {
                    userId: user.id,
                    token: token,
                    tokenExpiration: 2
                };
            }
            throw new Error("Password is incorrect!");
        }
        throw new Error("User name does not exist!");
    }
};