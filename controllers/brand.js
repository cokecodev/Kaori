const errorMessage = require('../errorMessage.js')
const db = require('../models')
const { Op } = require('sequelize')
const { Brand } = db
const { checkIsRouteValid } = require('../middlewares/utils')

const brandController = {
  getBrandById: async (req, res) => {
    const brandId = Number(req.params.brandId)
    if (!checkIsRouteValid(brandId)) return res.json(errorMessage.routeError)

    try {
      const brandData = await Brand.findByPk(brandId,{
          attributes: { 
            exclude: ['createdAt', 'updatedAt']
          }
        }
      )
      
      if (!brandData) return res.json(errorMessage.internalServerError)

      return res.status(200).json({
        ok: 1,
        message: '資料拿取成功',
        data: brandData
      })
      
    } catch(err){
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getBrandList: async(req, res) => {
    let brandData = null

    try {
      brandData = await Brand.findAll({ 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [
          ['brandName', 'ASC'],
        ],
      })

      if (!brandData) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        data: brandData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  searchBrand: async(req, res) => {
    const { search } = req.body
    let brandData = null

    try {
      brandData = await Brand.findAll({ 
        where: {
          brandName: {
            [Op.substring]: search
          }
        },
        order: [
          ['brandName', 'ASC'],
        ],
      })
      
      if (!brandData ) return res.json(errorMessage.internalServerError)
      if (brandData.length === 0 ) return res.json(errorMessage.dataNotFound)

      return res.status(200).json({
        ok: 1,
        data: brandData,
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }
}

module.exports = brandController
