const express = require('express');
const router = express.Router();
const Post = require('../routes/models/Post');
const { get } = require('mongoose');

// GET HOME

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs,Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments(); // Change this line
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute:'/'

        });
    } catch (error) {
        console.log(error);
        // Handle error response
        res.status(500).send('Internal Server Error');
    }
});



// router.get('', async (req, res) => {
//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple Blog created with NodeJs,Express & MongoDb."


//     }
//     try {
//         const data = await Post.find();
//         res.render('index', { locals,data }); 
//     } catch (error) {
//         console.log(error);

//     }
// }):

// GET
//Post :id
router.get('/post/:id', async (req, res) => {


    try {

        let postId = req.params.id;


        const data = await Post.findById(postId);

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs,Express & MongoDb.",
            currentRoute: `/post/$(postId)`
        }

        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);

    }
});



//   Post
//    Post - searchTerm


router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs,Express & MongoDb.",
        };

        let searchTerm = req.body.searchTerm || ""; // Set default value if searchTerm is not provided
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    }); // Render index.ejs inside the main layout
});






// function insertPostData (){
//     Post.insertMany([
//         {
//         title: "Building a Blog",
//         body: "This is the body text"
//         },

//         {
//             title: "build a real-time,event-driven applications in Node.js",
//             body: "Learn how to use Socket.io to build real-time,event-driven application in Node.js."
//             },


//             {
//                 title: "Discover how to use Express.js",
//                 body: "Discover how to use Express.js,a popular Node.js web framework,to build a web applications"
//                 },



//                 {
//                     title: "Asynchronus Programming with Node.js",
//                     body: "Asynchronus Programming with Node.js,Explore the asynchronus nature of Node.js and how it allows for"
//                     },



//                     {
//                         title: "Learn the basic of Node.js and its architecture",
//                         body: "Learn the basic of Node.js and its architecture,how it works,and why it is popular among developers."
//                         },


//   ])
// }
//  insertPostData();


module.exports = router;
