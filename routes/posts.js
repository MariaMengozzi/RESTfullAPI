const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();

const Post = require('../models/Post');

//GET ALL THE POSTS
router.get('/', async (req, res)=>{ //'/posts' can I remove posts  cause I import it
    //res.send("we are on posts");
    try {
        const posts = await Post.find(); //return all posts
        res.json(posts);

    } catch (err) {
        res.json({message: err})
    }
});

//SUBMIT A POST
router.post('/', async (req, res)=>{
    //console.log(req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    const savedPost = await post.save();
    /* post.save()
    .then(data => {
        //console.log(data)
        res.status(200).json(data);
    })
    .catch(err => {
        res.json({message: err})
    }); */
    try{
        res.json(savedPost);
    } catch (err) {
        res.json({message:err})
    }
    
});

//SPECIFIC POST

router.get('/:postId', async (req, res)=>{
    try {
        console.log(req.params.postId)
        const post = await Post.findById(req.params.postId);
        res.status(200).json(post);
    } catch (error) {
        res.json({message:error});
    }
    
});

//DELETE A POST
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.deleteOne({_id:req.params.postId});
        res.status(200).json(removedPost);
    } catch (error) {
        res.json({message:error});
    }
});

//UPDATE A POST
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                title: req.body.title,
                description: req.body.description
            }}
            );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.json({message:error})
    }
});

module.exports = router;