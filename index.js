const express = require('express')

// 整體環境設置
const app = express()
const port = process.env.PORT|| 5001
const userController = require('./controllers/user')
const perfumeController = require('./controllers/perfume')
const brandController = require('./controllers/brand')
const creatorController = require('./controllers/creator')
const commentController = require('./controllers/comment')
const voteController = require('./controllers/vote')

// middlewares
const auth = require('./middlewares/authority')

// dotenv
require('dotenv').config()

// cors
const cors = require('cors');
app.use(cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
    sameSite: 'none',
  })
)

// session
const session = require('express-session');
const SECRET = process.env.SESSION_SECRET
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
}))

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))  // create application/x-www-form-urlencoded parser
app.use(bodyParser.json())    // create application/json parser

// flash
const flash = require('connect-flash')
app.use(flash())

// req.locals
app.use((req, res, next) => {
  res.locals.username = req.session.username
  res.locals.userId = req.session.userId
  res.locals.role = req.session.role
  next()
})


// router
// --- perfume ---
app.get('/latest_five_perfume', perfumeController.getLatestFive)
app.get('/perfume/:id', perfumeController.getByPerfumeId)
app.get('/creator/:creatorId/perfume_list', perfumeController.getByCreatorId)
app.get('/brand/:brandId/perfume_list', perfumeController.getByBrandId)
app.get('/perfume_list', perfumeController.getPerfumeList)

// --- user ---
app.post('/login', userController.login)
app.post('/register', userController.register)
app.get('/me', userController.getMe)
app.get('/logout', userController.logout)

// --- vote ---
app.post('/perfume/:id/vote', voteController.vote)
app.get('/perfume/:id/get_vote', voteController.getPerfumeVote)
app.get('/perfume/:id/get_vote_boolean', voteController.getPerfumeBooleanVote)
app.get('/perfume/:id/get_vote_by_user', voteController.getVoteByUserId)

// --- comment ---
app.get('/perfume/:id/comment', commentController.getAll)
app.post('/perfume/:id/comment', auth.checkIsLogin, commentController.create)
app.get('/perfume/:id/comment/:commentId', auth.checkIsLogin, auth.checkIsAuthor, commentController.getOne)
app.patch('/perfume/:id/comment/:commentId', auth.checkIsLogin, auth.checkIsAuthor, commentController.update)
app.delete('/perfume/:id/comment/:commentId', auth.checkIsLogin, auth.checkIsAuthor, commentController.delete)

// --- brand ---
app.get('/brand/:brandId', brandController.getBrandById)
app.get('/brand_list', brandController.getBrandList)

// --- search ---
app.post('/search/brand', brandController.searchBrand)
app.post('/search/perfume', perfumeController.searchPerfume)
app.post('/search/creator', creatorController.searchCreator)

// --- creator ---
app.get('/creator/:creatorId', creatorController.getCreatorById)
app.get('/creator_list', creatorController.getCreatorList)



app.listen(port,( ) =>{
  console.log(`perfume app listing on port ${port}`)
})
