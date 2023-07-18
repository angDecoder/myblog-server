const router = require('express').Router();
const pool = require('../dbconfig');
const { randomUUID } = require('crypto');
const Authorize = require('../middleware/Authorize');


router.get(':id',async(req,res)=>{

});

router.use(Authorize);

router.put("/:id",async(req,res)=>{
    const { id } = req.params;
    let {
        title,
        tags,
        cover_image,
        content
    } = req.body;

    tags = tags.map(elem=>`"${elem}"`).join();

    if( !id )
        return res.status(400).json({
            message : 'post id not provided'
        });

    try {
        await pool.query(`
            UPDATE POST SET
            TITLE = '${title}',
            TAGS = '{ ${tags} }',
            COVER_IMAGE = '${cover_image}',
            CONTENT = '${content}'
            WHERE ID = '${id}';
            
        `)
    } catch (error) {
        
    }
});


router.delete(':id',async(req,res)=>{

});

module.exports = router;