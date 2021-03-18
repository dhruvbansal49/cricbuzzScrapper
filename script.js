require("chromedriver");
let wd = require("selenium-webdriver");
let matchId = 30880;
let innings = 2;
let batsmanKeys = ['Player Name','Out','Runs Scored','Balls Faced','4s','6s','Strike Rate'];
let allBatsmanData=[];
async function temp(){
    let browser = await new wd.Builder().forBrowser('chrome').build();
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    
    await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    let batsmanRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i in batsmanRows){
        let columns = await batsmanRows[i].findElements(wd.By.css("div"));
        if(columns.length!=7){
            break;
        }
        let singleBatsmanData={};
        for(let j in columns){
            if(j!=1){
                let key = batsmanKeys[j];
                let value = await columns[j].getAttribute("innerText");
                singleBatsmanData[key]=value;
            }
        }
        allBatsmanData.push(singleBatsmanData);
    }
    console.log(allBatsmanData);
    browser.close();
}
temp();