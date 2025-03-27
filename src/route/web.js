import  express  from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app)=>{
    router.get('/', homeController.getHomePage);
    router.get('/aboutme',homeController.getAboutme)

    router.post('/api/auctionAnnouncement',homeController.getAuctionAnnouncement)
    router.post('/api/create-new-recruitment', homeController.handleCreateNewRecruitment);//tao donn tuyen dung


    //rest api : sử dụng get, post,...
    return app.use("/", router);
}

module.exports = initWebRoutes