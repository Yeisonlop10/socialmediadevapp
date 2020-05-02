// Bring express
const express = require('express');
// Bring express router
const router = express.Router();
// Bring check
const { check, validationResult } = require('express-validator');
// Bring auth
const auth = require('../../middleware/auth');
// Bring the users
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// Route info:   GET api/posts
// Description:  Test route. The call back is a req,res arrow function
// Access value: Private
//router.get('/', (req, res) => res.send('Posts Route'));

// Route info:   POST api/posts
// Description:  Create a post. The call back is a req,res arrow function
// Access value: Private
router.post('/', 
[auth,
    [
    check('text', 'Text is required')
    .not()
    .isEmpty()
    ]
],
async (req, res) => {
    // Handle error first
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    try {

    // The user is logged so find it
    const user = await  User.findById(req.user.id).select('-password');

    // Create the new post
    const newPost = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    // Add the new post
    const post = await newPost.save();

    // Send back the new post
    res.json(post);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// Route info:   GET api/posts
// Description:  Get all posts
// Access value: Private
router.get('/', auth, async (req, res) => {
    try {
        // Make a variable called posts
        // use await and the post model
        // use find and sort by date
        // the -1 orders by the most recent
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route info:   GET api/posts/:id
// Description:  Get post by Id
// Access value: Private
router.get('/:id', auth, async (req, res) => {
    try {
        // Make a variable called post
        // use await and the post model
        // use findById passing in the id
        const post = await Post.findById(req.params.id);

        // check if there is no post with the passed id
        if(!post){
            return res.status(404).json({ msg: 'Post not found' });
        }

        // If we found the post
        res.json(post);
    } catch (err) {
        console.error(err.message);
        // check if there is not a valid object id
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Route info:   DELETE api/posts/:ID
// Description:  DELETE a post
// Access value: Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Make a variable called posts
        // use await and the post model
        // use findById passing in the id 
        const post = await Post.findById(req.params.id);

        // Check if the post exists
        // check if there is not a valid object id
        if(!post){
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check the user
        // post.user is an object and req.user.id is a string
        // To match them we use the toString method for post.user
        // Otherwise they don't match
        if(post.user.toString() != req.user.id){
            //
            return res.status(401).json({ msg: 'User not authorized' });
        }
        // The user matches, then remove the post
        await post.remove();
        // Send message back
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        // check if there is not a valid object id
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Route info:   PUT api/posts/like/:ID
// Description:  Like a post. It is a put request because we are updating a post
//              We have an array and we are adding the like
// Access value: Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        // fetch the post
        const post = await Post.findById(req.params.id);
        // check if the post has already being liked by this user
        // So we use a higher order function called filter
        // it takes a like as the input parameter and compares the
        // current user to the one that is currently logged in
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            // If the user matches. .length > 0 means that the post has been liked
            return res.status(400).json({ msg: 'Post already liked' });

        }
        // If the user hasn't liked the post yet
        // add the like to the front with unshift
        post.likes.unshift({ user: req.user.id });

        // save it
        await post.save();

        // return the post likes for the front end
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route info:   PUT api/posts/unlike/:ID
// Description:  Unlike a post. It is a put request because we are updating a post
//              We have an array and we are adding the like
// Access value: Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        // fetch the post
        const post = await Post.findById(req.params.id);
        // check if the post has already being liked by this user
        // So we use a higher order function called filter
        // it takes a like as the input parameter and compares the
        // current user to the one that is currently logged in
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            // If the user matches. .length = 0 means that the post hasn't been liked yet
            return res.status(400).json({ msg: 'Post has not yet been liked' });

        }
        // If the post has been liked
        // Use map to find it and return the user
        // get the indexOf of the user, to get the correct like to remove
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        // splice it out of the array, 1 means we remove 1 of that
        post.likes.splice(removeIndex, 1);
        // save it
        await post.save();

        // return the post likes for the front end
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route info:   POST api/posts/comment/:id
// Description:  Comment on a post. The call back is a req,res arrow function
// Access value: Private
router.post('/comment/:id', 
[auth,
    [
    check('text', 'Text is required')
    .not()
    .isEmpty()
    ]
],
async (req, res) => {
    // Handle error first
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    try {

    // The user is logged so find it
    const user = await User.findById(req.user.id).select('-password');
    //  Find the post
    const post = await Post.findById(req.params.id)
    // Create the new post
    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    };

    // Add the new comment
    post.comments.unshift(newComment)

    // save the new comment
    await post.save();

    // Send back the new post
    res.json(post.comments);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// Route info:   DELETE api/posts/comment/:id/:comment_id
// Description:  Delete a comment on a post. 
// Access value: Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        // get the post
        const post = await Post.findById(req.params.id);

        // get the comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Check if the comment exists
        if(!comment){
            return res.status(404).json({ msg:'Comment does not exist'});
        }

        // Check if the user is the same that made the comment
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorized'});
        }

        // If the validations passed 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        // splice it out of the array, 1 means we remove 1 of that
        post.comments.splice(removeIndex, 1);
        // save it
        await post.save();

        // return the post likes for the front end
        res.json(post.comments);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// export the route
module.exports = router;
