const pool = require('../dbconfig');
const { randomUUID } = require('crypto');

const getPostById = async (req, res) => {
    const { id } = req.params;

    if (!id)
        return res.status(400).json({
            message: "id is required"
        });

    try {
        const res1 = await pool.query(`
            SELECT * FROM POST
            WHERE ID = '${id}';
        `);

        const res2 = await pool.query(`
            SELECT * FROM POST_COMMENT
            WHERE POST_ID = '${id}';
        `)

        return res.json({
            message: "POST retrieved successfully",
            post: res1.rows[0],
            comment: res2.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "some error occured",
            error
        })
    }
};

const getPostByEmail = async (req, res) => {
    const { email } = req.body;

    if (!email)
        return res.status(400).json({
            message: "email is required",
        });

    try {
        const result = await pool.query(`
            SELECT * 
            FROM POST 
            WHERE CREATED_BY = '${email}';
        `);

        return res.json({
            message: "post retrieved successfully",
            posts: result.rows,
        })
    } catch (error) {
        return res.status(500).json({
            message: "post not retrieved",
            error
        });
    }
};

const updatePost = async (req, res) => {

    const { id } = req.params;

    let {
        title,
        tags,
        content
    } = req.body;

    tags = tags.map(elem => `"${elem}"`).join();

    if (!title || !tags || !content || !id)
        return res.status(400).json({
            message: 'id, title, tags and content are required'
        });

    try {
        await pool.query(`
            UPDATE POST 
            SET TITLE = '${title}',
            TAGS = '{ ${tags} }',
            CONTENT = '${content}'
            WHERE ID = '${id}';
        `);

        return res.json({
            message: 'post saved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'post not saved',
            error
        });
    }

};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!id)
        return res.status(400).json({
            message: "id is required",
        });

    try {

        const res1 = await pool.query(`
            SELECT CREATED_BY 
            FROM POST
            WHERE ID = '${id}';
        `);

        if (res1.rows[0].created_by !== email)
            return res.status(400).json({
                message: "You don't have access to the post",
            });

        await pool.query(`
            DELETE FROM POST
            WHERE ID = '${id}';
        `);

        return res.json({
            message: "post deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "post not deleted",
            error
        })
    }
};

const commentOnPost = async (req, res) => {
    const { id, email, comment } = req.body;
    if (!id || !email || !comment)
        return res.status(400).json({
            message: "id, email and comment are required"
        });

    try {
        await pool.query(`
            INSERT INTO POST_COMMENT(
                ID,
                POST_ID,
                ACCOUNT_ID,
                COMMENT
            )VALUES(
                '${randomUUID()}',
                '${id}',
                '${email}',
                '${comment}'
            )
        `);

        return res.json({
            message: "comment saved successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "comment not saved",
            error
        })
    }

}

const upvotePost = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!id || !email)
        return res.status(400).json({
            message: "id and email are required",
        });

    try {
        const res1 = await pool.query(`
            SELECT toggle_upvote
            ('${id}','${email}') 
            as upvote;
        `);

        return res.json({
            message: 'Toggle upvote successsfull',
            upvote: res1?.rows[0].upvote,
        })
    } catch (error) {
        return res.status(500).json({
            message: "comment not saved",
            error
        })
    }
}

const bookmarkPost = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!id || !email)
        return res.status(400).json({
            message: "id and email are required",
        });

    try {
        const res1 = await pool.query(`
            select toggle_bookmark
            ( '${id}','${email}' )
            as bookmark;
        `);

        return res.json({
            message: 'toogle bookmark successfull',
            bookmark: res1.rows[0].bookmark,
        })
    } catch (error) {
        return res.status(500).json({
            message: "comment not saved",
            error
        })
    }
}

const getAllPost = async(req,res)=>{

    let { email,offset } = req.query;

    if( !email )
        email = '';

    if( !offset )
        return res.status(400).json({
            message : "offset is required",
        });
    
    try {
        const res1 = await pool.query(`
            SELECT 
            ( U.ACCOUNT_ID IS NOT NULL ) AS UPVOTED_BY_USER,
            ( B.ACCOUNT_ID IS NOT NULL ) AS BOOKMARKED_BY_USER,
            p.*
            FROM POST P
            LEFT JOIN POST_UPVOTE U
            ON P.ID = U.POST_ID 
            AND U.ACCOUNT_ID = '${email}'
            LEFT JOIN POST_BOOKMARK B 
            ON P.ID = B.POST_ID 
            AND B.ACCOUNT_ID = '${email}'
            OFFSET ${offset}
            LIMIT 10;
        `);


        return res.json({
            message : 'posts retrieved successfully',
            posts : res1.rows
        });
    } catch (error) {
        return res.json({
            message : 'some error occured',
            error,
        })
    }
}

const getPostData = async (req, res) => {
    const { id } = req.params;

    if (!id)
        return res.status(400).json({
            message: "id is required"
        });

    try {
        const res1 = await pool.query(`
                SELECT * FROM POST_COMMENT
                WHERE POST_ID = '${id}';
            `)

        return res.json({
            message: "post data retrieved successfully",
            comment: res1.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            message: "some error occured",
            error
        })
    }
}

module.exports = {
    getPostById,
    getPostByEmail,
    updatePost,
    deletePost,
    commentOnPost,
    upvotePost,
    bookmarkPost,
    getPostData,
    getAllPost
}