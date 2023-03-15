const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { User, Comment } = db

const checkIsLogin = async (req, res, next) => {
  const { username } = req.session
  if(!username) return res.json(errorMessage.unauthorized)
  next()
}

const checkIsAuthor = async (req, res, next) => {
  try {
    const { username, userId, role } = req.session
    const { commentId } = req.params
    
    const userData = await User.findByPk(userId,
      {
        attributes:['role']
      }
    )

    if(role == 'admin' && userData.role =='admin') {
      return next()
    }

    const commentData = await Comment.findByPk(commentId,
      {
        include:[
          {
            model:User,
            attributes: ['username','id']
          }
        ],
      }
    )

    if(commentData.userId !== userId || commentData.User.username !== username) return res.json(errorMessage.unauthorized)
    next()

  } catch(err) {
    console.log(err)
    return res.json(errorMessage.internalServerError)
  }
}


module.exports = {
  checkIsLogin,
  checkIsAuthor
}
