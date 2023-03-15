const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { Perfume, Brand, Creator } = db
const { Op } = require('sequelize')
const { checkIsRouteValid } = require('../middlewares/utils')

const perfumeController = {
  getLatestFive: async (req, res) => {
    let perfumeData = null

    try {
      perfumeData = await Perfume.findAll({ 
        limit: 5,
        order: [
          ['createdAt', 'DESC']
        ],
      })

      if (!perfumeData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message:'資料拿取成功',
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getByPerfumeId: async (req, res) => {
    const id = Number(req.params.id)
    if (!checkIsRouteValid(id)) return res.json(errorMessage.routeError)
    let perfumeData = null
    
    try {
      perfumeData = await Perfume.findOne({ 
        where: {
          id
        },
        include:[Brand, Creator],
      })

      if (!perfumeData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message:'資料拿取成功',
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getPerfumeList: async (req, res) => {
    let perfumeData = null
    
    try {
      perfumeData = await Perfume.findAll({ 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [
          ['perfumeName', 'ASC'],
        ],
      })

      if (!perfumeData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message:'資料拿取成功',
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getByBrandId: async (req, res) => {
    const brandId = Number(req.params.brandId)
    if (!checkIsRouteValid(brandId)) return res.json(errorMessage.routeError)
    let perfumeData = null
    
    try {
      perfumeData = await Perfume.findAll({ 
        where: {
          brandId
        },
        order: [
          ['perfumeName', 'ASC'],
        ],
      })

      if (!perfumeData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message:'資料拿取成功',
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getByCreatorId: async (req, res) => {
    const creatorId = Number(req.params.creatorId)
    if (!checkIsRouteValid(creatorId)) return res.json(errorMessage.routeError)
    let perfumeData = null

    try {
      perfumeData = await Perfume.findAll({ 
        where: {
          creatorId
        },
        order: [
          ['perfumeName', 'ASC'],
        ],
      })

      if (!perfumeData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        message:'資料拿取成功',
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  searchPerfume: async(req, res) => {
    const { search } = req.body
    let perfumeData = null
    
    try {
      perfumeData = await Perfume.findAll({ 
        where: {
          perfumeName: {
            [Op.substring]: search
          }
        },
        order: [
          ['perfumeName', 'ASC'],
        ],
      })

      if (!perfumeData) return res.json(errorMessage.internalServerError)
      if (perfumeData.length === 0) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        data: perfumeData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }
}

module.exports = perfumeController
