
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

// let getAuctionAnnouncement = async(req,res) =>{
//     try {
//         console.log(req.body)
//         let data = await userService.getAuctionAnnouncementService(req.body)
//         // console.log('Controller run !!!',data)
        
//         return res.status(200).json(data);
//     } catch (e) {
//         console.log(e)
//         return res.status(200).json({
//             errCode: -1,
//             errMessage: 'Error from server'
//         })
//     }
// }

let getAuctionAnnouncement=(async(req,res)=>{
    try {
        // console.log(req.body)
        let data = await userService.getAuctionAnnouncementService(req.body)
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





module.exports = {
    getHomePage: getHomePage,
    getAboutme : getAboutme,
    getAuctionAnnouncement : getAuctionAnnouncement,
    handleCreateNewRecruitment : handleCreateNewRecruitment
    
}