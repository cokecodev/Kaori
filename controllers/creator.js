const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { Op } = require('sequelize')
const { Creator } = db
const { checkIsRouteValid } = require('../middlewares/utils')

const creatorController = {
  getCreatorById: async (req, res) => {
    const creatorId = Number(req.params.creatorId)
    if (!checkIsRouteValid(creatorId)) return res.json(errorMessage.routeError)
    let creatorData = null

    try {
      creatorData = await Creator.findByPk(creatorId,{
          attributes: { 
            exclude: ['createdAt', 'updatedAt']
          }
        }
      )
      
      if (!creatorData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message: '資料拿取成功',
        data: creatorData
      })

    } catch(err){
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getCreatorList: async(req, res) => {
    let creatorListData = null

    try {
      creatorListData = await Creator.findAll({ 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [
          ['creatorName', 'ASC'],
        ],
      })

      if (!creatorListData) return res.json(errorMessage.dataNotFound)
      
      return res.status(200).json({
        ok: 1,
        data: creatorListData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  searchCreator: async(req, res) => {
    const { search } = req.body
    let creatorData = null

    try {
      creatorData = await Creator.findAll({ 
        where: {
          creatorName: {
            [Op.substring]: search
          }
        },
        order: [
          ['creatorName', 'ASC'],
        ],
      })
      
      if (!creatorData) return res.json(errorMessage.internalServerError)
      if (creatorData.length === 0) return res.json(errorMessage.dataNotFound)
      
      return res.status(200).json({
        ok: 1,
        data: creatorData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }
}

module.exports = creatorController
