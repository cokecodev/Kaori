const errorMessage = require('../errorMessage.js')
const { checkIsRouteValid } = require('../middlewares/utils')
const db = require('../models')
const { Vote, Perfume } = db

const { QueryTypes,Op } = require('sequelize');
const { sequelize } = require('../models');

// dotenv
require('dotenv').config()

// function
const handleVoteFilter = (vote, element) => {
  const filter = vote.filter(result => result.name == element)
  let num = 0
  for(let i = 0; i < filter.length; i++){
    num += filter[i].vote
  }

  return ({
    name: element,
    totalVote: num,
  })
}


const voteController = {
  vote: async (req, res) => {
    const { spring, summer, fall, winter, day, night, longevity, silage, gender, ingredient } = req.body
    const { userId } = req.session
    const perfumeId = Number(req.params.id)

    
    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)
    if (!userId) return res.json(errorMessage.unauthorized)
    if (!spring || !summer || !fall || !winter || !day || !night || !longevity || !silage || !gender || !ingredient) return res.json(errorMessage.missingError)
    

    // TODO: ingredient 寫入之前要先形式轉換!
    const inputValues = {
      perfumeId,
      userId,
      spring,
      summer,
      fall,
      winter,
      day,
      night,
      longevity,
      silage,
      gender,
      ingredient,
    }

    const queryOperator = {
      [Op.and]:[{perfumeId},{userId}]
    }

    
    try {
      // 避免重複投票
      const isVoteExist = await Vote.findOne({
        where: queryOperator
      }) 

      // 不存在
      if(!isVoteExist) { 
        await Vote.create(inputValues)
      }
      
      // 存在
      await Vote.update(inputValues,{
        where: queryOperator
      })
      
      return res.status(200).json({
        ok: 1,
        message: '投票成功',
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }

  },
  getPerfumeVote: async (req, res) => {
    const perfumeId = Number(req.params.id)
    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)

    try {

      // PART 1
      const springVote = await Vote.count({where:{[Op.and]:[{perfumeId},{spring: true}]}})
      const summerVote = await Vote.count({where:{[Op.and]:[{perfumeId},{summer: true}]}})
      const fallVote = await Vote.count({where:{[Op.and]:[{perfumeId},{fall: true}]}})
      const winterVote = await Vote.count({where:{[Op.and]:[{perfumeId},{winter: true}]}})
      const dayVote = await Vote.count({where:{[Op.and]:[{perfumeId},{day: true}]}})
      const nightVote = await Vote.count({where:{[Op.and]:[{perfumeId},{night: true}]}})

      // PART 2
      const handleSQL = (columnName, perfumeId) => {
        const SQL = `SELECT COUNT(${columnName})As columnNumber,${columnName} AS columnValue FROM Votes WHERE perfumeId = ${perfumeId} GROUP BY ${columnName}`
        return(SQL)
      }

        // 處理SQL字串
      const longSQL = handleSQL('longevity', perfumeId)
      const silageSQL = handleSQL('silage', perfumeId)
      const genderSQL =  handleSQL('gender', perfumeId)

        // 進去 column 裡面看各種值的數量
      const longevityVote = await sequelize.query(longSQL)
      const silageVote =  await sequelize.query(silageSQL)
      const genderVote = await sequelize.query(genderSQL)

      // PART 3 -> ingredients
      const ingredientDataFormPerfume = await Perfume.findByPk(perfumeId,
        {
          attributes:['ingredient'],
          raw: true
        }
      )

      const ingredientVoteData = await Vote.findAll({
        where: { perfumeId },
        attributes: ['ingredient'],
        raw: true
      })      

        // Data 整理成乾淨的形式
        // 先 parse 再拼起來 -> [ [{},{},{}], [{},{},{}], [{},{},{}] ]
      let voteDataArr = []
      for(let i = 0; i < ingredientVoteData.length; i++) {
        voteDataArr[i] = JSON.parse(ingredientVoteData[i].ingredient)
      }

        // 壓平陣列結構 -> [ {},{},{},{},{},{},{},{},{} ]
      voteDataArr = voteDataArr.flat(1)
      let ingredientsArr = JSON.parse(ingredientDataFormPerfume.ingredient)
      
        // 把 ingredientsArr 內容 ( 所有的香水原料 ) 全部一起算完
      let ingredientVoteResult = []
      for(let i = 0; i < ingredientsArr.length; i++) {
        const result = handleVoteFilter(voteDataArr,ingredientsArr[i])
        ingredientVoteResult.push(result)
      }
      

      const voteResults = [{
          spring: springVote
        },{
          summer: summerVote
        },{
          fall: fallVote
        },{
          winter: winterVote
        },{
          day: dayVote
        },{
          night: nightVote
        },{
          longevity: longevityVote[0] 
        },{
          silage: silageVote[0]
        },{
          gender: genderVote[0]
        },{
          ingredient: ingredientVoteResult
        }
      ]

      return res.json({
        ok: 1,
        message: '香水的投票資料拿取成功',
        data: voteResults
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }
}

module.exports = voteController
