const {connectDB} = require('../db/connect')
const {createCustomError} = require('../errors/customError')
const {asyncWrapper} = require('../middleware/async')

const bcrypt = require('bcrypt')

const createUser = asyncWrapper(async(req, res, next) => {
    const {username, email, password, confirmPassword} = req.body

    //create a user
    connectDB.query('SELECT email FROM users WHERE email = ?',
        [email],
        async (err, result) => {
            if (err) {
                console.error(err)
                return next(createCustomError(err, 400))
            }

            if (result.length > 0) {
                return next(createCustomError('Email already in use', 403))
            }
            if (password !== confirmPassword) {
                return next(createCustomError('Password do not match', 403))
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            // console.log(hashedPassword)

            connectDB.query('INSERT INTO users SET ?',
                {
                    username: username,
                    email: email,
                    password: hashedPassword
                },
                (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        console.log(result)
                        res.status(201).json({msg: "Account created successfully"})
                    }
                }
            )
        }
    )

})

const getUser = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body

    if (email && password) {
        //check if user has an account already
        connectDB.query('SELECT * FROM users WHERE email = ?', 
            [email],
            async(err, result) => {
                if (err) {
                    console.log(err)
                    return next(createCustomError(err, 400))
                }

                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        const match = await bcrypt.compare(password, result[i].password)

                        if (match) {
                            return res.status(200).json({msg: "User logged in"})
                        }

                        return next(createCustomError('Password incorrect', 400))
                    }
                }
                else {
                    return next(createCustomError('User not found', 404))
                }
            }
        )
    }
    else {
        return next(createCustomError('Enter valid email or password', 400))
    }
})

module.exports = {
    createUser,
    getUser
}