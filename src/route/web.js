import  express  from "express";
import homeController from "../controllers/homeController";
import sendEmail from "../sendEmail"
import { authenticateToken,authorizeRoles } from "../middleware/auth";
import chatboxController from "../controllers/chatboxController"

let router = express.Router();

let initWebRoutes = (app)=>{
    router.get('/', homeController.getHomePage);

    // router.get('/aboutme',homeController.getAboutme)
    // router.post('/api/create-new-recruitment', homeController.handleCreateNewRecruitment);//tao donn tuyen dsung

    router.post('/api/auctionAnnouncement',
        // authenticateToken,
        // authorizeRoles('Admin'),
        homeController.getAuctionAnnouncement)
    
    router.post('/api/send-mail', homeController.handleSendMail);//handle send mailsss

    //
    router.post('/api/signup', homeController.handleSignUp);//đăng ký
    router.post('/api/login', homeController.handleLogin);//đăng nhập

    //chatbox
    router.post('/api/chatbox/start', chatboxController.chatboxStart);//bắt đầu/tạo chatbox 
    router.get('/api/get-messages-by-chatbox-id', chatboxController.getMessagesByChatboxId)// lấy tin nhắn trong phòng
    router.post('/api/messages/send', chatboxController.sendMessage)// gửi tin nhắn

    router.get('/api/getAllAdminChatbox-by-admin-id', chatboxController.getAllAdminChatboxByAdminId)// gửi tin nhắn
    //rest api : sử dụng get, post,...
    return app.use("/", router);
}

module.exports = initWebRoutes