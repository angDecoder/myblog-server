const pool = require('../dbconfig');
const { randomUUID } = require('crypto');


const getDraftById = async(req,res)=>{
    const { id } = req.body;

    if( !id )
        return res.status(400).json({
            message : "id is required"
        });

    try {
        const result = await pool.query(`
            SELECT * FROM DRAFT
            WHERE ID = '${id}';
        `);

        return res.json({
            message : "draft retrieved successfully",
            draft : result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            message : "some error occured",
            error
        })
    }
};

const getDraftByEmail = async(req,res)=>{
    const { email } = req.body;

    if( !email )
        return res.status(400).json({
            message : "email is required",
        });

    try {
        const result = await pool.query(`
            SELECT * 
            FROM DRAFT 
            WHERE CREATED_BY = '${email}';
        `);

        return res.json({
            message : "draft retrieved successfully",
            drafts : result.rows,
        })
    } catch (error) {
        return res.status(500).json({
            message : "draft not retrieved",
            error
        });
    }
}

const createDraft = async(req,res)=>{
    const { title,email } = req.body;
    const id = randomUUID();

    if( !title || !email )
        return res.status(400).json({
            message : 'title and email are required',
        })

    try {
        const result = await pool.query(`
            INSERT INTO DRAFT(
                TITLE,
                CREATED_BY,
                ID
            )
            VALUES(
                '${title}',
                '${email}',
                '${id}'
            );
        `);

        return res.status(201).json({
            message : 'new draft created',
            id,
            title,
            created_by : email
        });
    } catch (error) {
        return res.status(500).json({
            message : 'new post not created',
            error
        })
    }
};

const publishDraft = async(req,res)=>{
    const { id } = req.params;

    try {
        await pool.query(`
            BEGIN;

            INSERT INTO POST(
                TITLE,TAGS,CONTENT,COVER_IMAGE,CREATED_BY,ID
            ) (
                SELECT TITLE,TAGS,CONTENT,COVER_IMAGE,CREATED_BY,ID
                FROM DRAFT 
                WHERE ID = '${id}'
            );
            DELETE FROM DRAFT
            WHERE ID = '${id}';

            COMMIT;
        `);

        return res.json({
            message : "post published successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message : 'post not published',
            error
        })
    }
};

const updateDraft = async(req,res)=>{

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
            UPDATE DRAFT 
            SET TITLE = '${title}',
            TAGS = '{ ${tags} }',
            CONTENT = '${content}'
            WHERE ID = '${id}';
        `);

        return res.json({
            message : 'draft saved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message : 'draft not saved',
            error
        });
    }

};

const deleteDraft = async(req,res)=>{
    const { id } = req.params;

    if( !id )
        return res.status(400).json({
            message : "id is required",
        });

    try {
        await pool.query(`
            DELETE FROM DRAFT
            WHERE ID = '${id}';
        `);

        return res.json({
            message : "draft deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message : "draft not deleted",
            error
        })
    }
};

module.exports = {
    getDraftById,
    createDraft,
    publishDraft,
    updateDraft,
    deleteDraft,
    getDraftByEmail
}