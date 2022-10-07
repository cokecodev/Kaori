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
      const isUsernameOccupied = await User.findOne({
        where:{
          username
        }
      })

      
      if(isUsernameOccupied !== null) return res.json(errorMessage.usernameOccupied)
      
      const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS)
      const userData = await User.create({
        username,
        password: hashPassword,
        nickname
      })

      // 註冊完後,直接登入的機制。
      if(!userData) return res.json(errorMessage.internalServerError)
      req.session.username = username
      req.session.userId = userData.id
      req.session.role = userData.role

      return res.status(200).json({
        // TODO: 是否要直接回傳 userId ?
        ok: 1,
        message:'註冊成功',
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

      // session
      req.session.username = username
      req.session.userId = userData.id
      req.session.role = userData.role

      return res.status(200).json({
        // TODO: 是否要直接回傳 userId ?
        ok: 1,
        message: '登入成功',
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }

  }


}

module.exports = userController
