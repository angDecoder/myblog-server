const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();
const pool = require('../dbconfig');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;


const connectToGithub = async (code) => {
    const result = await axios.post(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=` + code);

    let resObj = {};
    result.data.split('&').forEach(elem => {
        let temp = elem.split('=');
        resObj = { ...resObj, [temp[0]]: temp[1] };
    });

    let res2 = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${resObj.access_token}`
        }
    });

    res2 = res2.data;

    resObj = {
        ...resObj,
        message: 'Github Login Successful',
        username: res2.login,
        avatar: res2.avatar_url,
        email: res2.email,
    }

    return resObj;
}

router.get('/login/github', async (req, res) => {
    try {

        let {
            email,
            username,
            access_token,
            refresh_token,
            avatar,
        } = await connectToGithub(req.headers.code);

        console.log(email,
            username,
            access_token,
            avatar,
            refresh_token
        );


        let res2 = await pool.query(
            `INSERT INTO ACCOUNT(
                EMAIL,
                USERNAME,
                REFRESH_TOKEN,
                AVATAR,
                ACCOUNT_TYPE
            ) VALUES(
                '${email}',
                '${username}',
                '${refresh_token}',
                '${avatar}',
                'github'
            ) 
            ON CONFLICT DO NOTHING;
            `,
            []
        );

        return res.status(200).json({
            email,
            username,
            access_token,
            avatar,
            refresh_token
        });

    } catch (error) {
        return res.status(501).json({
            message: 'some error occured',
            error
        })
    }
});

router.post('/autologin/github', async (req, res) => {
    console.log('here');
    let { refresh_token } = req.body;
    if (!refresh_token)
        return res.status(401).json({ message: "refresh token not found" });

    console.log(refresh_token);
    const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=` + refresh_token;
    console.log(url);


    try {
        const pr = await axios.post(url);
        let resobj = {};
        pr.data.split('&').forEach(elem=>{
            let temp = elem.split('=');
            resobj = {...resobj,[temp[0]] : temp[1]};
        })

        return res.json(resobj);
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
});

module.exports = router;