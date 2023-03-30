# KAROI Backend

![](https://img.shields.io/badge/version-0.1.0-blue)
[![](https://img.shields.io/badge/API%20Documentation-Yes-brightgreen)](https://wise-vision-78f.notion.site/Kaori-API-9d7f7e8a6caa447298bc33a8f676b306)

> KAORI，讓香氣陪伴你的每一個重要時刻


## 專案介紹
嗨，歡迎來到 Kaori！我們是一個熱愛香水的互動平台，旨在分享最新的香水消息和知識。希望透過科學化的討論方式，分析每一款香水的組成元素及表現，幫助大家迅速掌握自己喜愛的味道與材料之間的關聯。

同時設有討論區，滿足大家想和同好討論、分享體驗的願望。我們希望能夠提供最完善的香水資訊與討論場域，協助大家找到最適合的香水、展現各自獨特的風格。

前端採用 React 開發，並部署在 Netlify。

後端採用 Express、Sequelize 開發，部署在 heroku，並使用 clearDB 支援 MySQL 資料庫。

## 🏠 Pages
- 👀 [**Demo**](https://kaori-frontend.netlify.app/)
- [**Kaori Frontend repository**](https://github.com/cokecodev/Kaori-frontend)
- [**Kaori Backend repository**](https://github.com/cokecodev/Kaori-backend)
- db structure (coming soon)
- [API Documentation | Notion](https://wise-vision-78f.notion.site/Kaori-API-9d7f7e8a6caa447298bc33a8f676b306)

## 主要功能

- 會員系統
    - 登入、註冊、登出
- 留言系統
    - 會員：新增、編輯、刪除
    - 管理員：可強制隱藏會員的留言
- 投票系統
    - 會員：每款香水皆可多次投票 ( 每人每款只能投一筆，但投票內容不限次數修改 )
- 香水資料系統
    - 香水基本資料 
        - 包含：香材列表、品牌、調性、調香師
    - 眾人投票結果
        - 包含：持香時間、擴散性、性別氛圍、材料的味道突出度及推薦的使用時機
    - 相關評論
- 搜尋系統
    - 可以根據香水名稱、品牌名稱、調香師搜尋香水列表

## 使用技術及第三方套件
- Express → 後端框架
- mysql2 → 資料庫
- Sequelize → 操作 mySQL
- bcrypt  → 雜湊運算
- cors → 處理跨網域問題
- express-session → 設置 session 實作登入機制
- dotenv → 協助管理環境變數

## 如何在本地端執行
1. 本地需要有 git, node, SQL 環境 ( 可用 xampp ) 
2. 將本頁的內容 clone 到本地端
3. 執行 `npm install` 安裝此專案所需之套件
4. 新增 config/config.json，格式為：
    
    ```
    // 請把內容改成自己的
    
    {
      "development": {
        "username": "",
        "password": "",
        "database": "",
        "host": "localhost",
        "dialect": "mysql"
      },
      "test": {
        "username": "",
        "password": "",
        "database": "",
        "host": "localhost",
        "dialect": "mysql"
      },
      "production": {
        "username": "",
        "password": "",
        "database": "",
        "host": "localhost",
        "dialect": "mysql",
      }
    }
    ```
    
5. 修改 .env.example 檔名改成 .env 並填入內容
    
    ```
    // 以下的值需要放在單引號內
    // 例如: SALT_ROUNDS = '0'
    
    SALT_ROUNDS = '' // 填入數字
    SESSION_SECRET = '' // 填入字串
    
    ```
6. 執行 `npx sequelize-cli db:migrate` 建立資料庫
7. 參考 seeder 示範資料 創建 seeder 資料
8. 執行 `npx sequelize-cli db:seed:all` 把資料植入資料庫內
    - 相關操作順序，可參考 [ sequlize-cli 文件關於 seeder 的部分](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed)
9. 執行 `node index.js`  跑起來 
    
    ( 注意：若在本地端執行，要記得打開自己的 DB 伺服器，以 Xampp 為例，需運行 ＭySQL 及 Apache 兩項服務 )

## 資料夾結構

```
📦 folder
 ┣ 📂config
 ┃ ┗ 📜config.json
 ┣ 📂controllers
 ┃ ┣ 📜brand.js
 ┃ ┣ 📜comment.js
 ┃ ┣ 📜creator.js
 ┃ ┣ 📜perfume.js
 ┃ ┣ 📜user.js
 ┃ ┗ 📜vote.js
 ┣ 📂middlewares
 ┃ ┣ 📜authority.js
 ┃ ┗ 📜utils.js
 ┣ 📂migrations
 ┃ ┣ 📜20220906110741-create-user.js
 ┃ ┣ 📜20220906113850-create-comment.js
 ┃ ┣ 📜20220906114240-create-perfume.js
 ┃ ┣ 📜20220906114409-create-brand.js
 ┃ ┣ 📜20220906114619-create-creator.js
 ┃ ┣ 📜20220906153207-add-associations.js
 ┃ ┣ 📜20220922220847-create-vote.js
 ┃ ┗ 📜20220922222859-migration_update-association.js
 ┣ 📂models
 ┃ ┣ 📜brand.js
 ┃ ┣ 📜comment.js
 ┃ ┣ 📜creator.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜perfume.js
 ┃ ┣ 📜user.js
 ┃ ┗ 📜vote.js
 ┣ 📂seeders
 ┣ 📜.gitignore
 ┣ 📜.example.env   # 這邊記得把檔名改成 .env
 ┗ 📜index.js
```
