require("chromedriver");
let wd = require("selenium-webdriver");
const fs = require("fs");
let matchId = 30880;
let innings = 1;
let batsmanKeys = ['format','matches','innings','notOuts','runsScored','highestScore','averageScore','ballsFaced','strikeRate','hundreds','twohundreds','fifties','foursHitted','sixesHitted',];
let bowlerKeys = ['format','matches','innings','noOfBalls','runs','wickets','bestBowlingInnings','bestBowlingMatch','economy','average','strikeRate','fiveWicket','tenWicket'];
let allBatsmanUrl=[];
let allBowlersUrl=[];
let batsmanPrpfileLink=[];
let careerType=['battingCareer','bowlingCareer'];
let profiles=[];
async function temp(){
    let browser = await new wd.Builder().forBrowser('chrome').build();
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    
    await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    
    //Fetching Batsmen Data
    let batsmanRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i in batsmanRows){
        let columns = await batsmanRows[i].findElements(wd.By.css("div"));
        if(columns.length!=7){
            break;
        }
        let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
        allBatsmanUrl.push(url);
    }

    // //Fetching Bowlers Data
    let bowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i in bowlerRows){
        let columns = await bowlerRows[i].findElements(wd.By.css("div"));
        let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
        allBowlersUrl.push(url);
    }

    let finalUrl = allBatsmanUrl.concat(allBowlersUrl);
    // console.log(finalUrl);

    for(let i of finalUrl){
        await browser.get(i);
        await browser.wait(wd.until.elementsLocated(wd.By.css(".table.cb-col-100.cb-plyr-thead")));
        let careerTable = await browser.findElements(wd.By.css(".table.cb-col-100.cb-plyr-thead"));
        let name = await (await browser.findElement(wd.By.css(".cb-font-40"))).getAttribute("innerText");
        let singleProfile={}
        singleProfile['playerName'] = name;
        console.log(name);
        for(let j in careerTable){
            let format = await careerTable[j].findElements(wd.By.css("tbody tr"));
            singleProfile[careerType[j]]={};
            for(let k in format){
                let columns = await format[k].findElements(wd.By.css("td"));
                let formatType = await columns[0].getAttribute("innerText");
                singleProfile[careerType[j]][formatType]={};
                for(let l=1;l<columns.length;l++){
                    let val = await columns[l].getAttribute("innerText");
                    if(columns.length==14)
                        singleProfile[careerType[j]][formatType][batsmanKeys[l]]=val;
                    else
                        singleProfile[careerType[j]][formatType][bowlerKeys[l]]=val;

                }
                // console.log(columns);
            }
        }
        profiles.push(singleProfile);
    }
    console.log(profiles);
    fs.writeFileSync("finaldata.json",JSON.stringify(profiles));
    // browser.close();
}
temp();