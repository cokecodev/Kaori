const errorMessage = {
  internalServerError:{
    ok:0,
    message:' 系統出了點錯，請稍後再試或聯絡我們',
  },
  general:{
    ok:0,
    message:'出了點差錯，請稍後再試或聯絡我們!',
  },
  routeError: {
    ok:0,
    message:'路徑錯誤!',
  },
  missingError:{
    ok:0,
    message:'資料不齊全，請完整填寫各項資料',
  },
  usernameOccupied:{
    ok:0,
    message:'帳號已被使用，請換一個帳號',
  },
  loginFail:{
    ok:0,
    message:'帳號或密碼錯誤，請重新登入',
  },
  registerFail:{
    ok:0,
    message:'註冊失敗，請稍後再試',
  },
  unauthorized:{
    ok:0,
    message:'尚未登入或權限不足!',
  },
  dataNotFound: {
    ok:0,
    message:'查無此品項，請重新查詢',
  }
}

module.exports = errorMessage
