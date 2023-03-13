const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { User } = db

// dotenv
require('dotenv').config()

// bcrypt
const bcrypt = require('bcrypt')
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)

const userController = {
  register: async (req, res) => {
    const { username, password, nickname } = req.body
    if(!password || !username || !nickname) return res.json(errorMessage.missingError)

    try {
      let isUsernameOccupied = null
      isUsernameOccupied = await User.findOne({
        where:{
          username
        }
      })

      if(isUsernameOccupied !== null) return res.json(errorMessage.usernameOccupied)
      
      const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS)
      const userData = await User.create({
        username,
        password: hashPassword,
        nickname,
        role:'normal' // 這裡如果不填，直接讓資料庫 default 的話，會拿不到 role ( 會收到 undefined )
      })

      if(!userData) return res.json(errorMessage.internalServerError)
      req.session.username = username
      req.session.userId = userData.id
      req.session.role = userData.role

      const data = {
        username,
        userId: userData.id,
        role: userData.role,
      }

      return res.status(200).json({
        ok: 1,
        message:'註冊成功',
        data
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }

  },
  login: async (req, res) => {
    const { username, password } = req.body
    if(!password || !username) return res.json(errorMessage.missingError)
    
    try {
      const userData = await User.findOne({
        where:{
          username
        }
      })

      if(!userData) return res.json(errorMessage.loginFail)
      const ifPasswordCorrect = await bcrypt.compare(password, userData.password)
      if(!ifPasswordCorrect) return res.json(errorMessage.loginFail)

      req.session.username = username
      req.session.userId = userData.id
      req.session.role = userData.role

      const data = {
        username,
        userId: userData.id,
        role: userData.role,
      }

      return res.status(200).json({
        ok: 1,
        message: '登入成功',
        data
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }

  },
  getMe: async (req, res) => {
    const { username, userId, role } = req.session
    if(!username || !userId || !role) return res.json(errorMessage.unauthorized)
    
    return res.status(200).json({
      ok: 1,
      message: '現為登入狀態!',
      data:{
        username,
        userId,
        role,
      }
    })
  },
  logout: async (req, res) => {
    req.session.destroy(err =>{
      if(err) return res.json(errorMessage.general)
    })
    
    return res.status(200).json({
      ok: 1,
      message: '登出成功',
    })
  }
}

module.exports = userController
