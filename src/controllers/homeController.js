
// import db from '../models/index'
import userService from "../Services/userServices";
let getHomePage = async (req,res) =>{
    try{
        // let data= await db.User.findAll();
    

        return res.render('homePage.ejs'); 
    }catch(e){
        console.log(e)
    }
}

let getAboutme = (req,res) =>{
    return res.render('test/about.ejs');
}
let getAuctionAnnouncement=(async(req,res)=>{
    try {
        // console.log(req.body)
        let data = await userService.getAuctionAnnouncementService(req.body)
        // console.log('req.header: ',req.header)
        // console.log('Controller run !!!',data)
        
        return res.status(200).json(data);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

})
let handleSendMail=(async(req,res)=>{
    try {
        // console.log('check handle send mail controller: ',req.body)
        let data = await userService.sendMail(req.body)
        return res.status(200).json({
            errCode: 0,
            errMessage: data
        });

    } catch (e) {
        console.log('Handle send mail controller error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

})



let handleCreateNewRecruitment=(async(req,res)=>{
    try {
        console.log('check recruitment controller: ',req.body)
        // let data = await employerService.CreateNewRecruitment(req.body)
        return res.status(200).json(req.body);

    } catch (e) {
        console.log('Handle create new recruitment error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

})

let handleSignUp=(async(req,res)=>{
    try {
        // console.log('check handleSignUp controller: ',req.body)
        let data = await userService.SignUp(req.body)
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle signup error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
})
let handleLogin=(async(req,res)=>{
    try {
        // console.log('check handleLogin controller: ',req.body)
        let data = await userService.Login(req.body)
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handleLogin error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
})





module.exports = {
    getHomePage: getHomePage,
    getAboutme : getAboutme,
    getAuctionAnnouncement : getAuctionAnnouncement,
    handleCreateNewRecruitment : handleCreateNewRecruitment,
    handleSendMail : handleSendMail,
    handleSignUp : handleSignUp,
    handleLogin : handleLogin
    
}