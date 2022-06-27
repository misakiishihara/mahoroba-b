const router = require("express").Router();
const User = require("../models/User");

//CRUD
//ユーザー情報の更新
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が更新されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("ログイン中のみ情報を更新することができます")
    }
})

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ユーザー情報が削除されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("ログイン中のみ情報を削除することができます")
    }
})


//queryでユーザー情報を取得
router.get("/", async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId 
        ? await User.findById(userId)
        : await User.findOne({ username: username});

        //secret informations 分割代入でotherだけ取得する
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            //フォローしようとしている人のid
            const user = await User.findById(req.params.id);
            //ログイン中の自分のid
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに自分がいなかったらフォローできる仕組み
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                })
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    }
                })
                return res.status(200).json("フォローできました")
            } else {
                return res.status(403).json("フォローしています")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    }  else {
        return res.status(500).json("error")
    }
})

//ユーザーのフォロー解除
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            //フォローしようとしている人のid
            const user = await User.findById(req.params.id);
            //ログイン中の自分のid
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに自分がいたらアンフォローできる仕組み
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    },
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    }
                })
                return res.status(200).json("フォロー解除しました")
            } else {
                return res.status(403).json("フォロー解除できません")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    }  else {
        return res.status(500).json("error")
    }
})


// router.get("/", (req, res) => {
//     res.send("user router");
// })

module.exports = router;
