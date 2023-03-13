const errorMessage = require('../errorMessage.js')
const { checkIsRouteValid } = require('../middlewares/utils')
const db = require('../models')
const { Vote, Perfume } = db

const { QueryTypes, Op } = require('sequelize');
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

const getBooleanVote = async (perfumeId) => {
  const springVote = await Vote.count({where:{[Op.and]:[{perfumeId},{spring: true}]}})
  const summerVote = await Vote.count({where:{[Op.and]:[{perfumeId},{summer: true}]}})
  const fallVote = await Vote.count({where:{[Op.and]:[{perfumeId},{fall: true}]}})
  const winterVote = await Vote.count({where:{[Op.and]:[{perfumeId},{winter: true}]}})
  const dayVote = await Vote.count({where:{[Op.and]:[{perfumeId},{day: true}]}})
  const nightVote = await Vote.count({where:{[Op.and]:[{perfumeId},{night: true}]}})

  const result = {
    springVote,
    summerVote,
    fallVote,
    winterVote,
    dayVote,
    nightVote
  }
  
  return result
}

const voteController = {
  vote: async (req, res) => {
    const { spring, summer, fall, winter, day, night, longevity, silage, gender, ingredient } = req.body
    const { userId } = req.session
    const perfumeId = Number(req.params.id)
    
    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)
    if (!userId) return res.json(errorMessage.unauthorized)
    if (spring.length === 0 || summer.length === 0 || fall.length === 0 || winter.length === 0 || day.length === 0 || night.length === 0 || !longevity || !silage || !gender || !ingredient) return res.json(errorMessage.missingError)
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
      const booleanResObj = await getBooleanVote(perfumeId)

      // PART 2
      const handleSQL = (columnName, perfumeId) => {
        const SQL = `SELECT COUNT(${columnName})As totalVote,${columnName} AS name FROM Votes WHERE perfumeId = ${perfumeId} GROUP BY ${columnName}`  // 2022-12-05 配合前端 統一'非布林'的投票資料 key 名稱 ( 因為 sequlize 的欄位限制，應該是沒辦法直接用 { 項目:數值 } 的形式輸出 )
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
      let ingredientsArr = (ingredientDataFormPerfume.ingredient).split(',') // 2022-12-02 配合前端的狀態修改資料型式! ( 從 ["apple","apple1","apple3"] 變成 apple,apple2,apple3 )

        // 把 ingredientsArr 內容 ( 所有的香水原料 ) 全部一起算完
      let ingredientVoteResult = []
      for(let i = 0; i < ingredientsArr.length; i++) {
        const result = handleVoteFilter(voteDataArr,ingredientsArr[i])
        ingredientVoteResult.push(result)
      }

      const voteResults = [{
          spring: booleanResObj.springVote,
          summer: booleanResObj.summerVote,
          fall: booleanResObj.fallVote,
          winter: booleanResObj.winterVote,
          day: booleanResObj.dayVote,
          night: booleanResObj.nightVote,
          longevity: longevityVote[0] ,
          silage: silageVote[0],
          gender: genderVote[0],
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
  },
  getPerfumeBooleanVote: async(req, res) => {
    const perfumeId = Number(req.params.id)
    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)
    
    try {
      const booleanResObj = await getBooleanVote(perfumeId)
      const voteResults = [{
          spring: booleanResObj.springVote,
          summer: booleanResObj.summerVote,
          fall: booleanResObj.fallVote,
          winter: booleanResObj.winterVote,
          day: booleanResObj.dayVote,
          night: booleanResObj.nightVote,
        }
      ]
  
      return res.json({
        ok: 1,
        message: '香水的布林投票資料拿取成功',
        data: voteResults
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  },
  getVoteByUserId: async(req, res) => {
    const { userId } = req.session
    const perfumeId = Number(req.params.id)

    if (!checkIsRouteValid(perfumeId)) return res.json(errorMessage.routeError)
    if (!userId) return res.json(errorMessage.unauthorized)
    
    try {
      const isVoteExist = await Vote.findOne({
        where: {
          [Op.and]:[{perfumeId},{userId}]
        },
        raw: true,
        attributes:{ 
          exclude:[
            'createdAt',
            'updatedAt',
            'perfumeId',
            'userId'
          ]
        }
      }) 

      if(!isVoteExist) {
        return res.json({
          ok: 0,
          message: '還沒投票喔~',
        })
      }
      
      return res.json({
        ok: 1,
        message: '香水的投票資料拿取成功',
        data: isVoteExist
      })

    } catch(err) {
      console.log(err)
      return res.json(errorMessage.internalServerError)
    }
  }
}

module.exports = voteController
