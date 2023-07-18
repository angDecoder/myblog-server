const pool = require('../dbconfig');

const getPostById = async(req,res)=>{
    const { id } = req.body;

    if( !id )
        return res.status(400).json({
            message : "id is required"
        });

    try {
        const result = await pool.query(`
            SELECT * FROM POST
            WHERE ID = '${id}';
        `);

        return res.json({
            message : "POST retrieved successfully",
            draft : result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            message : "some error occured",
            error
        })
    }
};

const getPostByEmail = async(req,res)=>{
    const { email } = req.body;

    if( !email )
        return res.status(400).json({
            message : "email is required",
        });

    try {
        const result = await pool.query(`
            SELECT * 
            FROM POST 
            WHERE CREATED_BY = '${email}';
        `);

        return res.json({
            message : "post retrieved successfully",
            drafts : result.rows,
        })
    } catch (error) {
        return res.status(500).json({
            message : "post not retrieved",
            error
        });
    }
};

const updatePost = async(req,res)=>{

    const { id } = req.params;

    let {
        title,
        tags,
        content
    } = req.body;

    tags = tags.map(elem=>`"${elem}"`).join();

    if( !title || !tags || !content || !id )
        return res.status(400).json({
            message : 'id, title, tags and content are required'
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
            message : 'post saved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message : 'post not saved',
            error
        });
    }

};

const deletePost = async(req,res)=>{
    const { id } = req.params;

    if( !id )
        return res.status(400).json({
            message : "id is required",
        });

    try {
        await pool.query(`
            DELETE FROM POST
            WHERE ID = '${id}';
        `);

        return res.json({
            message : "post deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message : "post not deleted",
            error
        })
    }
};

module.exports = {
    getPostById,
    getPostByEmail,
    updatePost,
    deletePost
}