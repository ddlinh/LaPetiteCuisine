const jwt = require('jsonwebtoken');
const userController = require('../controllers/users.controller');
const isAuth = async (req) => {
    console.log('req.cookies', req.cookies)
    const { token } = req.cookies;
    var result
    if (token) {
        await jwt.verify(token, "secret", async function (err, decoded) {
            if (err) {
                result = false
            }
            if (decoded) {
                console.log('decoded', decoded)
                const { username } = decoded;

                result = await userController.getUser(username)
                // console.log('result1', result)
            }
        })
    } else {
        result = false
    }
    console.log('result', result)
    return result
};
module.exports = {
    isAuth
};
