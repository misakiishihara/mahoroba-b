const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//投稿を更新する
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            })
            return res.status(200).json("投稿の編集に成功しました")
        } else {
            return res.status(403).json("他の人の投稿は編集できません")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

//投稿を削除
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("投稿の削除に成功しました")
        } else {
            return res.status(403).json("他の人の投稿は削除できません")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

//投稿を取得
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
            return res.status(200).json(post)
    } catch (err) {
        return res.status(403).json(err);
    }
})

//投稿にいいね！を押す
router.put("/:id/like", async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            //まだいいねが押されていないときにいいねできる
            if(!post.likes.includes(req.body.userId)) {
                await post.updateOne({
                    $push: {
                        likes: req.body.userId,
                    },
                })
                return res.status(200).json("いいねしました")
                //投稿にすでにいいねしている場合
            } else {
                //いいねしているIDを消す
                await post.updateOne({$pull: {
                    likes: req.body.userId,
                }})
                return res.status(403).json("いいねを外しました")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    }  
)

//プロフィール画面のタイムライン取得
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id })
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id })
        //フォロワーの投稿内容を取得する
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
})


module.exports = router;