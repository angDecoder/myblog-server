import axios from 'axios';

const authorizeGithubToken = (next)=>{
    const url = "https://api.github.com/octocat";

}

const authorizeJwtToken = (next)=>{

}

const authorizeUser = (req,res,next)=>{
    let token = req.headers['Authorization'];
    let {token_type} = req.body;

    if( !token || !token_type )
        return res.status(400).json({
            message : 'token and token_type are required'
        });

    token = token.split(' ')[1];

    if( token_type==='github' )
        authorizeGithubToken(next);
    else
        authorizeJwtToken(next);
        
};


export default authorizeUser;
