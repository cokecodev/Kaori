const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { User, Comment } = db
const { Op } = require("sequelize")
const { checkIsRouteValid } =require("../middlewares/utils")

// dotenv
require('dotenv').config()

const commentController = {
  init: async(req, res)=> {
    const perfumeId = Number(req.params.id)
    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)

    try {
      const commentData = await Comment.findAll(
        {
          where:{
            perfumeId,
            isDeleted: false,
          },
          attributes:['id','content','createdAt'],
          include:[{
            model:User,
            attributes:{exclude:['password']}
          }]
        }
      )

      return res.status(200).json({
        ok: 1,
        message: '資料拿取成功',
        data: commentData
      })
    } catch(err){
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }


    

  },
  getOne: async (req, res) => {
    //const { commentId } = req.body // TODO:這邊要再想一下!!!!
    const commentId = Number(req.params.commentId)
    if (!checkIsRouteValid(commentId)) return res.json(errorMessage.routeError)

    try {
      const commentData = await Comment.findByPk(commentId,{
          where:{
            isDeleted: false
          },
          attributes:['id','content']
        }
      )

      return res.status(200).json({
        ok: 1,
        message: '資料拿取成功',
        data: commentData
      })
    } catch(err){
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }

  },
  create: async (req, res) => {
    const { userId } = req.session
    const { content } = req.body
    const perfumeId = Number(req.params.id)
    
    if(!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)
    if(!content) return res.json(errorMessage.missingError)
    
    try {
      const commentData = await Comment.create({
          userId,
          content,
          perfumeId,
          isDeleted: false
        }
      )

      return res.status(200).json({
        ok: 1,
        message: '成功建立留言!',
        commentId: commentData.id
      })
    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  update: async (req, res) => {
    const { content } = req.body
    const commentId = Number(req.params.commentId) // TODO: 這邊要想一下 

    if(!checkIsRouteValid(commentId)) return res.json(errorMessage.routeError)
    if(!content) return res.json(errorMessage.missingError)

    try {
      await Comment.update({
        content
      },{
        where: {
          id: commentId
        }
      })
      
      return res.status(200).json({
        ok: 1,
        message: '留言更新成功'
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }


  },
  delete: async (req,res) => {
    // const { commentId } = req.body
    const { commentId } = req.params //TODO 這邊要想一下 
    if(!checkIsRouteValid(commentId)) return res.json(errorMessage.routeError)

    try {
      await Comment.update({
        isDeleted: true,
      },{
        where:{
          id: commentId
       }
      })

      return res.status(200).json({
        ok: 1,
        message: '留言刪除成功'
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }

  
}

module.exports = commentController
