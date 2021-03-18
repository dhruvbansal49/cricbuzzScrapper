require("chromedriver");
let wd = require("selenium-webdriver");
let matchId = 30880;
let innings = 2;
let batsmanKeys = ['playerName','Out','runsScored','ballsFaced','foursHitted','sixesHitted','strikeRate'];
let bowlerKeys = ['playerName','totalOver','maidenOver','runs','wicket','noBall','wide','economy'];
let allBatsmanData=[];
let allBowlersData=[];
async function temp(){
    let browser = await new wd.Builder().forBrowser('chrome').build();
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    
    await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    
    console.log(`<----- Innings ${innings} Batsmen ----->`);
    //Fetching Batsmen Data
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

    console.log(`<----- Innings ${innings} Bowler ----->`);
    //Fetching Bowlers Data
    let bowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i in bowlerRows){
        let columns = await bowlerRows[i].findElements(wd.By.css("div"));
        let singleBowlerData={};
        for(let j in columns){
            let key = bowlerKeys[j];
            let value = await columns[j].getAttribute("innerText");
            singleBowlerData[key]=value;
        }
        allBowlersData.push(singleBowlerData);
    }
    console.log(allBowlersData);
    browser.close();
}
temp();