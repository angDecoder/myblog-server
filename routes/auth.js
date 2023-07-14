const router = require('express').Router();
const {
    loginGithub,
    autoLoginGithub,
    registerJwt,
    loginJwt,
    autoLoginJwt,
    logoutJwt
} = require('../controller/authController');


router.get('/login/github', loginGithub );

router.get('/autologin/github',autoLoginGithub );

router.post('/register/jwt',registerJwt );

router.post('/login/jwt', loginJwt );

router.post('/autologin/jwt',autoLoginJwt );

router.get('/logout/jwt',logoutJwt);

module.exports = router;