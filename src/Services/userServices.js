import { where } from "sequelize";
import db from "../models/index";
import { error } from "selenium-webdriver";

const bcrypt = require('bcrypt');

const axios = require('axios');
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
// const { Builder, By } = require('selenium-webdriver');
const { chromium } = require('playwright');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


let htmlContent='';
let links='';

let SD_Matrix = []
let ED_Matrix = []

let BSD_Matrix = []
let BED_Matrix = []
let PN=[]
async function fetchData(url) {
    if(url){
        try {
                
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://daugiavna.vn/taisankhac/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // Nhập thông tin đăng nhập
                await page.fill('input[type="text"]', 'testvnadaugia@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[type="password"]', '12345678'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhập
                await page.click('button[type="submit"]'); // Thay 'button[type="submit"]' với selector tương ứng

                await page.waitForNavigation();

                await page.goto(url, { waitUntil: 'networkidle',timeout: 60000 });


                // Chờ một chút để trang tải
                // await page.waitForNavigation();

                // Lấy HTML của trang sau khi đăng nhập
                // const html = await page.content();
                // console.log(html); // In HTML ra console hoặc làm gì đó với nó
                htmlContent = await page.content()

                // Lấy nội dung HTML của div theo selector
                // Lấy 2 card
                let $ = cheerio.load(htmlContent);
                htmlContent = await $('.box-detail-Aucation').html();
                // Lấy dữ liệu
                $ = cheerio.load(htmlContent);
                // Lấy div thứ 2 bên trong div có class "box-detail-Aucation"
                // const secondDiv = $('.box-detail-Aucation div').eq(1).text(); // eq(1) lấy phần tử thứ 2 (chỉ số bắt đầu từ 0)

                let code = await $('.box-detail-Aucation div').eq(1).text();
                let register_Deposit_Start = await $('.box-detail-Aucation div').eq(3).text();
                let register_Deposit_End = await $('.box-detail-Aucation div').eq(5).text();
                let starting_price = await $('.box-detail-Aucation div').eq(7).text();
                let step = await $('.box-detail-Aucation div').eq(9).text();
                let fee = await $('.box-detail-Aucation div').eq(11).text();
                let maxStep = await $('.box-detail-Aucation div').eq(13).text();
                let method = await $('.box-detail-Aucation div').eq(15).text();
                let owner = await $('.box-detail-Aucation div').eq(17).text();
                let place = await $('.box-detail-Aucation div').eq(19).text();
                let checkProperty = await $('.box-detail-Aucation div').eq(21).text();
                let start_bidding = await $('.box-detail-Aucation div').eq(23).text();
                let end_bidding = await $('.box-detail-Aucation div').eq(25).text();
                let deposit = await $('.box-detail-Aucation div').eq(27).text();
                let round = await $('.box-detail-Aucation div').eq(33).text();

                // console.log(code,register_Deposit_Start,register_Deposit_End,starting_price,step,fee,maxStep,method)
                // console.log(owner,place,checkProperty,start_bidding,end_bidding,deposit,round)
                // Đóng trình duyệt
                await browser.close();

                return {code,register_Deposit_Start,register_Deposit_End,starting_price,step,fee,maxStep,method,owner,place,checkProperty,start_bidding,end_bidding,deposit,round};

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}
async function fetchDataDgts(data) {
    if(data){
        try {
                
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://dgts.moj.gov.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // Nhập thông tin đăng nhập
                await page.fill('input[id="username"]', 'vnahanoi_tc_hanoi'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[id="password"]', 'vna2020'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[id="btnLogin"]'); // Thay 'button[type="submit"]' với selector tương ứng

                await page.waitForNavigation();

                await page.click('a[class="btn btn-success"]')


                //Tạo thông báo

                //Tên địa chỉ chủ tài sản
                await page.fill('input[id="fullName"]', data.owner)
                await page.fill('input[id="address"]', data.owner_Address)

                //Tg địa điểm tổ chức đg
                await page.fill('input[id="aucTime"]', data.bidding_Start_Fulltime)
                await page.fill('input[id="aucAddr"]', data.aucAddress)
                //Tg đăng ký
                await page.fill('input[id="aucRegTimeStart"]', data.aucRegTimeStart)
                await page.fill('input[id="aucRegTimeEnd"]', data.aucRegTimeEnd)
                //Cách thức đăng ký
                await page.fill('textarea[id="aucCondition"]', data.aucCondition)
                //Tg đặt trước
                await page.fill('input[id="aucTimeDepositStart"]', data.aucRegTimeStart)
                await page.fill('input[id="aucTimeDepositEnd"]', data.aucRegTimeEnd)

                //Nhập thêm thông tin
                await page.click('a[id="advanceOrSimpleLink"]')
                //Tg địa điểm xem ts/ bán HS
                await page.fill('textarea[id="propertyViewLocation"]', data.propertyViewLocation)
                await page.fill('textarea[id="fileSellLocation"]', data.fileSellLocation)
                //Hình thức/phương thức đấu giá
                await page.selectOption('select[id="aucType"]', data.aucType.toString());
                await page.selectOption('select[id="aucMethod"]', data.aucMethod.toString())
                
                //Thêm mới tài sản
                await page.click('button[data-target="#addPropertyInfo"]')
                //Tên, địa điểm xem tài sản
                await page.fill('input[id="propertyName"]', data.propertyName)
                await page.fill('input[id="propertyPlace"]', data.propertyPlace)
                //Giá khởi điểm
                await page.fill('input[id="propertyStartPrice"]', data.propertyStartPrice.replaceAll('.',''))
                //Đon vị đặt cọc
                await page.selectOption('select[id="depositUnit"]', data.depositUnit.toString());
                //Tiền đặt trước
                await page.fill('input[id="deposit"]', data.deposit.replaceAll('.',''))
                //Tiền mua hồ sơ
                await page.fill('input[id="fileCost"]', data.fileCost.replaceAll('.',''))

                //Lưu tài sản
                await page.click('button[id="btnSavePropertyInfo"]')





                // await browser.close();

                return ;

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}
async function fetchDataVnaPartner(data) {
    if(data){
        try {
                 
                // console.log(data)
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://partner.daugiavna.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // Nhập thông tin đăng nhập
                await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng

                await page.waitForNavigation();

                await page.goto('https://partner.daugiavna.vn/product/common');



                if(data.status==='create'){
                    // console.log('Tạo tài sản')
                    // Tạo tài sản
                    await page.click('button[class="mt-1 mb-0 btn btn-success btn-sm mt-sm-0 px-4"]')
                    //class = form-control form-control-text Socials

                    //
                    if(data.isCar){
                        await page.click('input.multiselect-search');
                        await page.type('input.multiselect-search', 'Tài sản Xe ôtô');
                        await page.waitForSelector('.multiselect-option');
                        await page.click('.multiselect-option');
                    }else{
                        await page.click('input.multiselect-search');
                        await page.type('input.multiselect-search', 'Tất cả');
                        await page.waitForSelector('.multiselect-option');
                        await page.click('.multiselect-option');
                    }
                    await page.fill('input[class="form-control form-control-text"]', data.shortPropertyName);
                    await page.fill('div.ql-editor', data.propertyName);

                    await page.click('button[title="Socials"]')

                    await page.fill('input[placeholder="Nhập Nơi xem tài sản"]', data.propertyPlace);
                    await page.fill('input[placeholder="Nhập thời gian xem tài sản"]', data.propertyViewTime);
                    await page.click('button[type="submit"]')
                }

                //Chỉnh sửa tài sản
                await page.click('input[id="stsNháp"]')
                
                // const row = await page.locator('tr', { hasText: data.shortPropertyName});
                const row = page.locator('tr').filter({
                    hasText: data.shortPropertyName,
                  }).filter({
                    hasText: 'Nháp',
                  });
                await row.locator('button[title="Thông tin đấu giá"]').click();
                 
                const regStart = page.locator('div.col-md-6:has(label:has-text("Thời gian mở đăng ký")) input');
                await regStart.fill(data.aucRegTimeStart+':00');
                await regStart.press('Enter');

                const regEnd = page.locator('div.col-md-6:has(label:has-text("Thời gian kết thúc đăng ký")) input');
                await regEnd.fill(data.aucRegTimeEnd+':00');
                await regEnd.press('Enter');

                const depositStart = page.locator('div.col-md-6:has(label:has-text("Thời gian bắt đầu nộp tiền cọc")) input');
                await depositStart.fill(data.aucRegTimeStart+':00');
                await depositStart.press('Enter');

                const depositEnd = page.locator('div.col-md-6:has(label:has-text("Thời gian kết thúc nộp tiền cọc")) input');
                await depositEnd.fill(data.aucRegTimeEnd+':00');
                await depositEnd.press('Enter');

                const biddingStart = page.locator('div.col-md-6:has(label:has-text("Thời gian bắt đầu trả giá")) input');
                await biddingStart.fill(data.bidding_Start_Fulltime+':00');
                await biddingStart.press('Enter');

                const biddingTime = page.locator('div.col-md-4:has(label:has-text("Thời gian đấu giá")) input');
                await biddingTime.fill('30');

                const fileCost = page.locator('div.col-md-6:has(label:has-text("Phí tham gia đấu giá")) input');
                await fileCost.fill(data.fileCost.replaceAll('.',''));
                
                const deposit = page.locator('div.col-md-6:has(label:has-text("Tiền đặt trước")) input');
                await deposit.fill(data.deposit.replaceAll('.',''));

                const propertyStartPrice = page.locator('div.col-md-6:has(label:has-text("Giá khởi điểm")) input');
                await propertyStartPrice.fill(data.propertyStartPrice.replaceAll('.',''));

                const step = page.locator('div.col-md-3:has(label:has-text("Bước giá (*)")) input');
                await step.fill(data.step.replaceAll('.',''));

                


                //Cho phép đấu 1 người
                const onePersonAllowed = page.locator('div.col-md-6:has(label:text("Cho phép đấu giá 1 người"))');

                // Click mở dropdown
                await onePersonAllowed.locator('input.multiselect-search').click();

                // Gõ từ khoá tìm kiếm
                await onePersonAllowed.locator('input.multiselect-search').fill(data.onePersonAllowed);


                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const onePersonAllowedFirstOption = onePersonAllowed.locator('.multiselect-option').first();
                await onePersonAllowedFirstOption.waitFor({ state: 'visible' });

                // Click chọn dòng đầu tiên
                await onePersonAllowedFirstOption.click();




                //Tài khoản nhận tiền
                if(data.bank!=="Tài khoản chính"){
                    const bank = page.locator('div.col-md-6:has(label:text("Tài khoản nhận tiền"))');

                    // Click mở dropdown
                    await bank.locator('input.multiselect-search').click();

                    // Gõ từ khoá tìm kiếm
                    await bank.locator('input.multiselect-search').fill(data.bank.toString());
                    


                    // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                    const bankFirstOption = bank.locator('.multiselect-option').first();
                    await bankFirstOption.waitFor({ state: 'visible' });

                    // Click chọn dòng đầu tiên
                    await bankFirstOption.click();
                }



                //Chủ tài sản
                const ownerContainer = page.locator('div.col-md-3:has(label:text("Chủ tài sản"))');

                // Click mở dropdown
                await ownerContainer.locator('input.multiselect-search').click();

                // Gõ từ khoá tìm kiếm
                await ownerContainer.locator('input.multiselect-search').fill(data.owner);


                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const firstOption = ownerContainer.locator('.multiselect-option').first();
                await firstOption.waitFor({ state: 'visible' });

                // Click chọn dòng đầu tiên
                await firstOption.click();
                

                //Thư ký
                const secretary = page.locator('div.col-md-3:has(label:text("Thư ký"))');

                // Click mở dropdown
                await secretary.locator('input.multiselect-search').click();

                // Gõ từ khoá tìm kiếm
                await secretary.locator('input.multiselect-search').fill(data.secretary);


                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const secretaryFirstOption = secretary.locator('.multiselect-option').first();
                await secretaryFirstOption.waitFor({ state: 'visible' });

                // Click chọn dòng đầu tiên
                await secretaryFirstOption.click();
                



                //Thông tin thêm
                await page.click('button:has-text("Thông tin thêm")');
                const ownerUnit = page.locator('div.col-md-6:has(label:text-is("Đơn vị có tài sản")) input');
                await ownerUnit.fill(data.owner);

                const secretaryName = page.locator('div.col-md-6:has(label:text-is("Người ghi biên bản")) input');
                await secretaryName.fill(data.secretary);

                const writerPosition = page.locator('div.col-md-6:has(label:has-text("Chức vụ người ghi biên bản")) input');
                await writerPosition.fill('Chuyên viên');

                const unitName = page.locator('div.col-md-4:has(label:has-text("Tên đơn vị")) input');
                await unitName.fill(data.owner);

                const HDDV = page.locator('div.col-md-6:has(label:has-text("Số hợp đồng dịch vụ đấu giá")) input');
                await HDDV.fill(data.HDDGDV);

                const guest = page.locator('div.col-md-6:has(label:has-text("Khách mời chứng kiến")) input');
                await guest.fill('Không có');

                //Số quy chế và quy chế
                const rules_num = page.locator('div.col-md-12:has(label:has-text("Quy chế số")) input');
                await rules_num.fill(data.rules_num);

                await page.fill('.ql-editor', data.rulesContent);

                // await browser.close();

                return ;

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}

async function fetchDataSchedule (data) {
    SD_Matrix = []
    ED_Matrix = []

    BSD_Matrix = []
    BED_Matrix = []
    PN=[]
    // Khởi tạo trình duyệt
    const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
    const context = await browser.newContext();
    const page = await context.newPage();

    // Điều hướng đến trang đăng nhập
    await page.goto('https://partner.daugiavna.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

    // Nhập thông tin đăng nhập
    await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
    await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

    // Gửi biểu mẫu đăng nhậps
    await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng

    await page.waitForNavigation();

    await page.goto('https://partner.daugiavna.vn/product/common');
    
    


    //Đếm số lượng cột và tìm cột cụ thể
    await page.waitForSelector('table thead tr th'); // Đợi phần tử xuất hiện
    const headers = page.locator('table thead tr th');
    const headerCount = await headers.count();
    // console.log('headerCount: ',headerCount)

    let timeColumnIndex = -1;
    let codeNameColumnIndex=-1;
    let biddingTimeColumnIndex=-1;
    let propertyNameColumnIndex=-1;
    for (let i = 0; i < headerCount; i++) {
        const text = await headers.nth(i).innerText();
        
        if (text.trim() === 'MÃ TÀI SẢN') {
            codeNameColumnIndex = i;
            // console.log(codeNameColumnIndex)
        }

        if (text.trim() === 'THỜI GIAN ĐĂNG KÝ') {
            timeColumnIndex = i;
            // console.log(timeColumnIndex)
        }

        if (text.trim() === 'THỜI GIAN TRẢ GIÁ') {
            biddingTimeColumnIndex = i;
            // console.log(biddingTimeColumnIndex)
        }
        if (text.trim() === 'TÊN TÀI SẢN / CUỘC ĐẤU GIÁ') {
            propertyNameColumnIndex = i;
            // console.log(biddingTimeColumnIndex)
        }
    }
    if (codeNameColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "MÃ TÀI SẢN');
    }
    if (timeColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "THỜI GIAN ĐĂNG KÝ"');
    }
    if (biddingTimeColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "THỜI GIAN TRẢ GIÁ"');
    }
    if (propertyNameColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "TÊN TÀI SẢN / CUỘC ĐẤU GIÁ"');
    }
    
    
    // Bước 2: Lấy tất cả các dòng trong bảng (bỏ qua dòng tiêu đề) (dùng  waitForSelector để đợi cho hàng xuát hiện)
    await page.waitForSelector('table tbody tr');
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    // console.log('rowCount',rowCount)

    let SD=[],ST=[],ED=[],ET=[],code=[]
    let BSD=[],BST=[],BED=[],BET=[]
    
    for (let i = 0; i < rowCount; i++) {
        const cell = rows.nth(i).locator('td').nth(timeColumnIndex);
        const timeValue = await cell.innerText();
        const lines = timeValue.split('\n')
        const [startDate,startTime] = lines[0].split(' ')
        const [endDate,endTime] = lines[1].split(' ')
        SD.push(startDate)
        ST.push(startTime)
        ED.push(endDate)
        ET.push(endTime)

        const cellCodeName = rows.nth(i).locator('td').nth(codeNameColumnIndex)
        const codeNameValue = await cellCodeName.innerText();
        const codeName = codeNameValue.split('-')
        code.push(codeName[0].replace('VNAHS',''))
        // console.log('code',code)


        const cellBiddingTime = rows.nth(i).locator('td').nth(biddingTimeColumnIndex)
        const biddingTimeValue = await cellBiddingTime.innerText();
        const linesBiddingTime = biddingTimeValue.split('\n')
        const [biddingStartDate,biddingStartTime] = linesBiddingTime[0].split(' ')
        const [biddingEndDate,biddingEndTime] = linesBiddingTime[1].split(' ')
        // console.log(biddingStartDate,biddingStartTime,biddingEndDate,biddingEndTime)
        BSD.push(biddingStartDate)
        BST.push(biddingStartTime)
        BED.push(biddingEndDate)
        BET.push(biddingEndTime)

        const cellPropertyName = rows.nth(i).locator('td').nth(propertyNameColumnIndex)
        const propertyNameValue = await cellPropertyName.innerText();
        // console.log('propertyNameValue: ',propertyNameValue)
        PN.push(codeName[0].replace('VNAHS',''),propertyNameValue)
        
        // console.log('code',code)
        

    }
    // console.log('PN',PN)
    const uniqueValuesSD = [...new Set(SD)]
    const uniqueValuesED = [...new Set(ED)]
    const uniqueValuesBSD = [...new Set(BSD)]
    const uniqueValuesBED = [...new Set(BED)]


    //Ma trận bắt đầu đăng ký và chốt
    // let SD_Matrix = []
    // let ED_Matrix = []
    
    for(let i = 0;i<uniqueValuesSD.length;i++){
        let temp=[]
        temp.push(uniqueValuesSD[i])
        for(let j = 0;j<SD.length;j++){
            if(uniqueValuesSD[i]===SD[j]){
                temp.push(code[j])
            }
        }
        SD_Matrix.push(temp)
    }
    // console.log('SD_Matrix: ',SD_Matrix)

    for(let i = 0;i<uniqueValuesED.length;i++){
        let temp=[]
        temp.push(uniqueValuesED[i])
        for(let j = 0;j<ED.length;j++){
            if(uniqueValuesED[i]===ED[j]){
                temp.push(code[j])
            }
        }
        ED_Matrix.push(temp)
    }
    // console.log('ED_Matrix: ',ED_Matrix)


    //Ma trận bắt đầu và kết thúc đấu giá
    // let BSD_Matrix = []
    // let BED_Matrix = []
    
    for(let i = 0;i<uniqueValuesBSD.length;i++){
        let temp=[]
        temp.push(uniqueValuesBSD[i])
        for(let j = 0;j<BSD.length;j++){
            if(uniqueValuesBSD[i]===BSD[j]){
                temp.push(code[j]+' - '+BST[j])
            }
        }
        BSD_Matrix.push(temp)
    }
    // console.log('BSD_Matrix: ',BSD_Matrix)

    for(let i = 0;i<uniqueValuesBED.length;i++){
        let temp=[]
        temp.push(uniqueValuesBED[i])
        for(let j = 0;j<BED.length;j++){
            if(uniqueValuesBED[i]===BED[j]){
                temp.push(code[j]+' - '+BET[j])
            }
        }
        BED_Matrix.push(temp)
    }
    // console.log('BED_Matrix: ',BED_Matrix)
    await browser.close();
    return ;

}


let getAuctionAnnouncementService = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {    
            let res=''
            if(data.type==='compare'){  
                res = await fetchData(data.url);
            }else if(data.type==='dgts'){
                res = fetchDataDgts(data)
            }else if(data.type==='VnaPartner'){
                res = fetchDataVnaPartner(data)
            }else if(data.type==='schedule'){
                res = await fetchDataSchedule(data)
            }
            resolve({
                errCode:0,
                message:'getAuctionAnnouncementService succeeds !',
                res,
                SD_Matrix,
                ED_Matrix ,
                BSD_Matrix,
                BED_Matrix,
                PN
            })
        } catch (e) {
            reject(e);
        }
    })
}
////////////////////////////Mail/////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Gửi email
let sendMail = (data)=>{
    console.log(data)
    return new Promise(async(resolve, reject)=>{
        try{
            // Tạo transporter (Gmail, Outlook, hoặc SMTP tùy chọn)
            const transporter = nodemailer.createTransport({
                service: "gmail", // hoặc dùng 'hotmail', hoặc cấu hình SMTP thủ công
                auth: {
                user: "dohoangquan1112002@gmail.com", // Email gửi
                pass: "ixlt edis iqpy jllb",    // App password (không dùng mật khẩu tài khoản Google thông thường)
                },
            });
            
            // Cấu hình nội dung email
            const mailOptions = {
                from: data.from,
                to: data.to, // Có thể là nhiều email cách nhau bằng dấu phẩy
                subject: data.subject,
                html: data.text.replace(/\n/g, '<br/>'),
                // text: data.text.replace(/\n/g, '<br/>'), Dùng text để có dạng text hoặc html để lấy dạng html
            };
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error("Gửi email thất bại:", error);
                resolve({
                    errCode:1,
                    message:'Gửi email thất bại...',
                })
            } else {
                // console.log("Email đã được gửi:", info.response);
                resolve({
                    errCode:0,
                    message:'Gửi email thành công!',
                })
            }
            });
        }catch(e){
            reject(e)
        }

    })
}
//Đăng ký
let SignUp = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            // console.log('check data from service: ',data)
            // const password = 'myPassword123';
            const saltRounds = 10;
            const newUser = await db.User.create({
                email: data.email,
                fullName: data.fullName, 
                password:await hashPassword(data.password),
                address:data.address,
                phoneNumber:data.phoneNumber,
                gender:data.gender,
                roleId:data.roleId
            });
            // console.log('hashPassword:',await hashPassword(data.password))
            resolve({
                errCode:0,
                message:'Create user succeeds !',
                newUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
// Mã hóa
async function hashPassword(password) {
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
    //   console.log('Mật khẩu đã mã hóa:', hash);
      return hash  
    //   const isMatch = await bcrypt.compare(password, hash);
    //   console.log('Mật khẩu khớp?', isMatch);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  }
//Đăng nhập
let Login =(data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            // let port = process.env.SECRET_KEY;
            // console.log(port)
            const user = await db.User.findOne({
                where:{
                    email:data.email
                }
            })
            if(!user){
                resolve({
                    errCode:1,
                    message: 'Không tìm thấy người dùng...'
                })
            }else{
                const isMatch = await bcrypt.compare(data.password, user.password);
                // console.log('isMatch',isMatch)ss
                if(isMatch){
                    const token = jwt.sign({ id: user.id, username: user.username, roleId: user.roleId }, process.env.SECRET_KEY, {
                        expiresIn: '1h' // token hết hạn sau 1 giờ
                    });
                    resolve({
                        errCode:0,
                        message: 'Đăng nhập thành công !',
                        user,
                        token
                    })
                }else{
                    resolve({
                        errCode:2,
                        message: 'Sai mật khẩu...'
                    })
                }
            }



        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAuctionAnnouncementService : getAuctionAnnouncementService,
    sendMail : sendMail,
    SignUp : SignUp,
    Login : Login
}