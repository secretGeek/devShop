// ******************************************************* //
//                  NO PRs PLEASE                          //
// ** Pull requests not actually welcome at this moment ** //
// ******************************************************* //
// As described in the readme, I may take this commercial, and haven't thought through 
// the implications of accepting PRs on it prior to that.
// Ordinarily I'd *love* to welcome PR's but for now, no PR's please.
let testMode = false; //true;
let storeFeatureFlag = true; //testMode;
//let timeBarFeatureFlag = false;
let timePenaltyFeatureFlag = true;
let debugOutput = false;
let game;
// basic test modes and feature flags
testMode = testMode || getParameterByName("testmode") == "true"; //?testmode=true
// testMode -> all items immediately available in store. Opportunity to change all speeds/defaults.
debugOutput = debugOutput || testMode || getParameterByName("debug") == "true"; //?debug=true
let privacy = getParameterByName("privacy") == "true"; //?privacy=true
//timeBarFeatureFlag =
// (timeBarFeatureFlag || getParameterByName('timebarflag') == "true");             //?timebarflag=true
storeFeatureFlag =
    storeFeatureFlag || getParameterByName("storeflag") == "true"; //?storeflag=true
let avgDuration = testMode ? 4 : 600; // factor that all work durations are based on, in milliseconds
let startingMoney = testMode ? 100 : 100;
let defaultCompletionTime = testMode ? 10 : 100; //how long have you got to complete a project, in seconds?
// Use a browser-provided global `names` (names.global.js) so the compiled JS
// does not include CommonJS `require`/`exports` when opened directly in a browser.
//const names: string[] = ["zAaron2", "zAbbie2", "zAbbott2"];
import { names } from "./names.js";
import { catNames, dogNames, catIcons, dogIcons } from "./animals.js";
let hashLocation = window.location.hash.substring(1);
privacy = privacy || hashLocation == "privacy";
if (privacy) {
    visitPrivacy();
}
if (debugOutput) {
    $id("debug").classList.remove("hidden");
    log("debug mode detected");
}
var HireCode;
(function (HireCode) {
    HireCode[HireCode["dev"] = 1] = "dev";
    HireCode[HireCode["test"] = 2] = "test";
    HireCode[HireCode["ba"] = 3] = "ba";
    HireCode[HireCode["sales"] = 4] = "sales";
})(HireCode || (HireCode = {}));
var ItemCode;
(function (ItemCode) {
    ItemCode[ItemCode["cat"] = 1] = "cat";
    ItemCode[ItemCode["dog"] = 2] = "dog";
    ItemCode[ItemCode["upskillTest"] = 3] = "upskillTest";
    ItemCode[ItemCode["upskillDev"] = 4] = "upskillDev";
    ItemCode[ItemCode["upskillBA"] = 5] = "upskillBA";
    ItemCode[ItemCode["initiative"] = 6] = "initiative";
    ItemCode[ItemCode["seat"] = 7] = "seat";
    ItemCode[ItemCode["coffee"] = 8] = "coffee";
    ItemCode[ItemCode["coffeeMachine"] = 9] = "coffeeMachine";
    ItemCode[ItemCode["donutMachine"] = 10] = "donutMachine";
    ItemCode[ItemCode["cupcake"] = 11] = "cupcake";
    ItemCode[ItemCode["donut"] = 12] = "donut";
    ItemCode[ItemCode["pizza"] = 13] = "pizza";
    ItemCode[ItemCode["banana"] = 14] = "banana";
    ItemCode[ItemCode["toast"] = 15] = "toast";
    ItemCode[ItemCode["keyboard"] = 16] = "keyboard";
    ItemCode[ItemCode["x_baForTest"] = 17] = "x_baForTest";
    ItemCode[ItemCode["x_baForDev"] = 18] = "x_baForDev";
    ItemCode[ItemCode["x_testForBA"] = 19] = "x_testForBA";
    ItemCode[ItemCode["x_testForDev"] = 20] = "x_testForDev";
    ItemCode[ItemCode["x_devForBA"] = 21] = "x_devForBA";
    ItemCode[ItemCode["x_devForTest"] = 22] = "x_devForTest";
    ItemCode[ItemCode["poster"] = 23] = "poster";
    ItemCode[ItemCode["crystalBall"] = 24] = "crystalBall";
    ItemCode[ItemCode["statue"] = 25] = "statue";
    ItemCode[ItemCode["statue2"] = 26] = "statue2";
    ItemCode[ItemCode["cookie"] = 27] = "cookie";
    ItemCode[ItemCode["headphones"] = 28] = "headphones";
    ItemCode[ItemCode["deskPlant"] = 29] = "deskPlant";
    ItemCode[ItemCode["cactus"] = 30] = "cactus";
    ItemCode[ItemCode["buyBot"] = 31] = "buyBot";
})(ItemCode || (ItemCode = {}));
function getAllLevelItems() {
    //These are the items that become available in the store at each level.
    // Note that skillNeeded includes the special value "any" which means it can be applied to any person.
    // TODO: ?? There could be a 'must not have skill' property... e.g. Beginning Development (only for non-developers)
    //The 'code' property is used in `function useIt` to decide how the card affects the player.
    let allItems = {
        //Level 2 Items
        l2: [
            {
                id: 5,
                name: "Tasty donut",
                price: 5,
                icon: "🍩",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.donut,
                activeDuration: 30,
                description: "A sugary fix will speed you up... but not for long.",
                enabled: false,
            },
            {
                id: 10,
                name: "Cup of coffee",
                price: 10,
                icon: "☕",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.coffee,
                activeDuration: 60,
                description: "A cup of joe will speed up any worker …if only for a little while.",
                enabled: false,
            },
            //{id:14,name:'Initiative Training', price:5, icon:"🚀", skillNeeded:"any", busy:false, code:ItemCode.initiative, activeDuration:0, description: 'When you\'re idle, go and check the board to see if there is anything you can do. Purchase multiple times to show initiative sooner!', enabled:false},
        ],
        //Level 3 Items
        l3: [
            {
                id: 20,
                name: "Upskill Developer: Efficiency Development Series",
                price: 120,
                icon: "📗",
                skillNeeded: "dev",
                busy: false,
                code: ItemCode.upskillDev,
                activeDuration: 0,
                description: "Already a developer? This advanced training course will reduce the number of bugs you create.",
                enabled: false,
            },
        ],
        l4: [
            {
                id: 50,
                name: "Upskill Tester: Fast and Thorough Book Series",
                price: 80,
                icon: "📘",
                skillNeeded: "test",
                busy: false,
                code: ItemCode.upskillTest,
                activeDuration: 0,
                description: "Already a tester? Be a better tester!",
                enabled: false,
            },
            {
                id: 80,
                name: "Pizza",
                price: 50,
                icon: "🍕",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.pizza,
                activeDuration: 180,
                description: "Food can trap your workers in the office by giving them no reason to leave.",
                enabled: false,
            },
            {
                id: 100,
                name: "⭐ Initiative Training ⭐",
                price: 500,
                icon: "🚀",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.initiative,
                activeDuration: 0,
                description: "When you're idle, go and check the board to see if there is anything you can do. Purchase multiple times to show initiative sooner!",
                enabled: false,
            },
        ],
        l5: [
            {
                id: 105,
                name: "Upskill BA: Powerful communication book series",
                price: 70,
                icon: "📕",
                skillNeeded: "ba",
                busy: false,
                code: ItemCode.upskillBA,
                activeDuration: 0,
                description: "Improves your Business Analysis Skills, for faster better work!",
                enabled: false,
            },
            {
                id: 110,
                name: "Banana",
                price: 25,
                icon: "🍌",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.banana,
                activeDuration: 50,
                description: "This healthy snack gives a short-lived energy boost",
                enabled: false,
            },
            {
                id: 130,
                name: "Cupcake",
                price: 100,
                icon: "🧁",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.cupcake,
                activeDuration: 25,
                description: "A cupcake to enjoy. Increase motivation, but not for long.",
                enabled: false,
            },
            {
                id: 140,
                name: "Mechanical keyboard upgrade",
                price: 300,
                icon: "⌨",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.keyboard,
                activeDuration: 0,
                description: "This mechanical keyboard upgrade will boost your speed at every task.",
                enabled: false,
            },
        ],
        l6: [
            {
                id: 150,
                name: "Seat upgrade",
                price: 400,
                icon: "💺",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.seat,
                activeDuration: 0,
                description: "A comfortable seat upgrade makes any worker more efficient.",
                enabled: false,
            },
            {
                id: 155,
                name: "Headphone upgrade",
                price: 700,
                icon: "🎧",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.headphones,
                activeDuration: 0,
                description: "With better headphones a person's focus is greatly improved!",
                enabled: false,
            },
        ],
        l7: [
            {
                id: 160,
                name: "Office dog",
                price: 6000,
                icon: "🐶",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.dog,
                activeDuration: 200,
                description: "Bring joy and efficiency to the workplace. Care for a dog and double your speed",
                enabled: false,
            },
        ],
        l8: [
            {
                id: 170,
                name: "Piece of Toast",
                price: 10,
                icon: "🍞",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.toast,
                activeDuration: 35,
                description: "It's a piece of toast. How much could it be?",
                enabled: false,
            },
        ],
        l9: [
            {
                id: 175,
                name: "Office cat",
                price: 5000,
                icon: "🐱",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.cat,
                activeDuration: 200,
                description: "This friendly feline will vastly improve the quality of one person's work at a time.",
                enabled: false,
            },
            {
                id: 177,
                name: "Buy-Bot",
                price: 21000,
                icon: "🤖",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.buyBot,
                activeDuration: 0,
                description: "A robot at your desk! The buy-bot buys new projects for you (unless the backlog is over its limit)",
                enabled: false,
            },
        ],
        l10: [
            {
                id: 180,
                name: "Coffee Machine",
                price: 4000,
                icon: "⛽",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.coffeeMachine,
                activeDuration: 0,
                description: "A coffee machine at your desk, your performance will be irreparably improved.",
                enabled: false,
            },
        ],
        l11: [
            {
                id: 200,
                name: "Inspirational poster",
                price: 30000,
                icon: "🌄",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.poster,
                activeDuration: 0,
                description: "Enhance your cubicle and improve your concentration.",
                enabled: false,
            },
        ],
        l12: [
            {
                id: 220,
                name: "Desk plant",
                price: 502,
                icon: "🌳",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.deskPlant,
                activeDuration: 0,
                description: "Beautiful desk plant improves the workplace and decreases your error rate.",
                enabled: false,
            },
        ],
        l13: [
            {
                id: 225,
                name: "Donut Machine",
                price: 31000,
                icon: "🏭",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.donutMachine,
                activeDuration: 0,
                description: "It is possibly unwise to have a donut machine at your desk. Sugar is a hell of a drug.",
                enabled: false,
            },
        ],
        l14: [],
        l15: [
            {
                id: 250,
                name: "Mystical Statue",
                price: 40000,
                icon: "🗿",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.statue2,
                activeDuration: 0,
                description: "Mystical statue improves your workplace.",
                enabled: false,
            },
        ],
        l16: [],
        l17: [
            {
                id: 270,
                name: "Desk cactus",
                price: 2000,
                icon: "🌵",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.cactus,
                activeDuration: 0,
                description: "A desk cactus has been scientifically proven to have no impact on your productivity at all. But it's cool.",
                enabled: false,
            },
        ],
        l18: [
            {
                id: 300,
                name: "Awe inspiring statue",
                price: 80000,
                icon: "🗽",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.statue,
                activeDuration: 0,
                description: "Can this statue fill your workplace with wonder, joy and hard work?",
                enabled: false,
            },
        ],
        l19: [],
        l20: [],
        l21: [
            {
                id: 350,
                name: "Crystal ball",
                price: 1000000,
                icon: "🔮",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.crystalBall,
                activeDuration: 0,
                description: "This crystal ball does not tell the future, but it's a nice desk ornament.",
                enabled: false,
            },
        ],
        l100: [
            {
                id: 900,
                name: "A cookie",
                price: 1,
                icon: "🍪",
                skillNeeded: "any",
                busy: false,
                code: ItemCode.cookie,
                activeDuration: 20,
                description: "It's a cookie",
                enabled: false,
            },
        ],
    };
    return allItems;
}
function getAllPeopleTypes() {
    return {
        dev: { skill: "dev", price: 120, icon: "💻", title: "dev" },
        test: { skill: "test", price: 150, icon: "🔬", title: "tester" },
        ba: { skill: "ba", price: 250, icon: "🗣", title: "business analyst" },
    };
}
// REMINDER....
// *******************************************************
// ** Pull requests not actually welcome at this moment **
// *******************************************************
// as described in the readme (and above), I may take this commercial, and haven't thought through the implications of accepting PRs on it prior to that.
// Ordinarily I'd *love* to welcome PR's but for now, no PR's please.
class Game {
    constructor(startingMoney) {
        this.Money = startingMoney;
        this.HighestMoney = startingMoney;
        this.Inflation = testMode ? 1.3 : 1.3; // 30 %
        this.SmallInflation = testMode ? 1.05 : 1.05; // 5 %
        this.MediumInflation = testMode ? 1.1 : 1.1; // 10 %
        this.HyperInflation = testMode ? 3 : 3; //300%
        this.Level = 1;
        this.XP = 0;
        this.TotalXP = 0;
        this.LevelUpXP = testMode ? 40 : 40; //this grows by game.Inflation % each time (in function LevelUp)
        this.PointPrice = 25;
        this.ProjectSize = 6;
        this.LeadPrice = 100;
        this.NextId = 0;
        this.People = {};
        this.Stories = {};
        this.Projects = {};
        this.AllLevelItems = getAllLevelItems();
        this.StoreItems = {};
        for (let k in this.AllLevelItems) {
            for (let x in this.AllLevelItems[k]) {
                this.StoreItems[this.AllLevelItems[k][x].id] = this.AllLevelItems[k][x];
            }
        }
        //this.StoreItems =  getAllLevelItems().each()
        this.AllPeopleTypes = getAllPeopleTypes();
        this.Items = {};
        this.SelectedDoer = null;
        this.SelectedReceiver = null;
        this.DefaultInitiativeDelay = testMode ? 18000 : 18000; //12 second pause between self-starters polling the board.
        this.AnimalTendingDelay = 3900;
        this.MaxAge = defaultCompletionTime; // give them this many seconds to complete *every* project; (increases slightly each level)
        this.StartTime = new Date();
        this.LifeTimeRevenue = 0;
        this.LifeTimeRevenueMinus1Minute = 0;
        this.LifeTimePoints = 0;
        this.LifeTimePointsMinus1Minute = 0;
        this.PositiveCashFlows = [];
        this.PositivePointEvents = [];
        this.ColumnLimits = { ba: -1, dev: -1, dev0: -1, test: -1 }; //-1 means "there is no limit/do not display a limit"
        this.TimeBarFeatureFlag = false;
        this.TimeBarChance = 0; // % chance of project being Time sensitive (having a max age)
        this.HasInitiativeLevel = 0;
        this.FirstTimeSensitiveProject = false;
        this.toHire = {};
    }
}
class Story {
    constructor(status, skillNeeded, summary, project) {
        //this.init();
        this.id = nextId();
        this.points = game.ProjectSize | 6;
        this.pointPrice = game.PointPrice | 25;
        this.logo = getLogo();
        this.person = null;
        this.busy = false;
        this.icon = null;
        this.hasBug = false;
        this.hasSpecBug = false;
        this.customerFoundBug = null;
        this.projectId = null;
        this.reworkLevel = 0;
        this.startingTime = new Date();
        this.maxAge = -1;
        this.status = status;
        this.skillNeeded = skillNeeded;
        this.summary = summary;
        if (project != null) {
            this.projectId = "r" + project.id;
            this.startingTime = project.startingTime;
            this.maxAge = project.maxAge;
            this.pointPrice = project.pointPrice;
            this.logo = project.logo;
        }
    }
    init() {
        // this.id = nextId();
        // this.points = game.ProjectSize;
        // this.pointPrice = game.PointPrice;
        // this.logo = getLogo();
        // this.person = undefined;
        // this.busy = false;
        // this.icon = null;
        // this.hasBug = false;
        // this.hasSpecBug = false;
        // this.customerFoundBug = null;
        // this.projectId = null;
        // this.reworkLevel = 0;
        // this.startingTime = new Date();
        // this.maxAge = -1;
    }
}
class Project {
    constructor(lead) {
        this.stories = []; //storyId's of the subsequent stories created by the BA (start with 'r')
        this.lead = lead;
        this.stories = [];
    }
}
function initGameState() {
    game = new Game(startingMoney);
    let allSkills = {
        dev: { level: 1 },
        test: { level: 1 },
        ba: { level: 1 },
    };
    let player = {
        id: nextId(),
        skills: allSkills,
        name: "Founder",
        summary: "💤",
        avatar: "🤔",
        XP: 0,
        busy: false,
        initiativeLevel: 0,
        has: {},
        seatLevel: 0,
        keyboardLevel: 0,
        headphoneLevel: 0,
        initiativeDelay: game.DefaultInitiativeDelay,
        triggerTime: null,
        buyBotLevel: 0,
    };
    game.People["p" + player.id] = player;
    incrementXP(0);
    incrementMoney(0);
}
// todo: put this function onto the game object
function nextId() {
    return ++game.NextId;
}
function drawRoom() {
    drawPeople(game.People);
    drawStories(game.Stories);
    drawMoney(game.Money);
    drawButtons();
}
function drawButtons() {
    const getLead = $id("getLead");
    getLead.innerHTML = `🎁 find project (💲${game.LeadPrice})`;
    for (let [key, value] of Object.entries(game.AllPeopleTypes)) {
        const d = $id(`get${value.skill}`);
        if (d != null) {
            d.innerHTML = `<span class='icon'>${value.icon}</span> hire ${value.title} (💲${value.price})`;
            //d.setAttribute("onclick", `getNewPerson("${value.skill}");`);
            d.addEventListener("click", () => getNewPerson(value.skill));
        }
    }
}
function drawMoney(money) {
    const s = $id("money");
    if (money < 0) {
        s.classList.add("negative");
    }
    else {
        s.classList.remove("negative");
    }
    s.innerText = "💲" + money;
}
function drawXP(xp, levelUpXP, level) {
    const s = $id("xp");
    if (xp < 0) {
        s.classList.add("negative");
    }
    else {
        s.classList.remove("negative");
    }
    s.innerText = "" + xp + "/" + levelUpXP + "🥓";
    const s2 = $id("level");
    s2.innerText = "" + level + "🥑";
}
function removeStory(key) {
    var _a, _b, _c;
    const el = $id("kanbanboard");
    const s = el === null || el === void 0 ? void 0 : el.querySelector("#" + key);
    if (!s)
        return;
    const column = (_b = (_a = s.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.id;
    (_c = s.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(s);
    if (column)
        updateColumnCount(column);
}
function drawTimebar(target, key, story) {
    ///stories: { [x: string]: Story; }, top: boolean):void {
    if (!target)
        return;
    let percent = 100 - Math.min(100, getTenthsOfTimeElapsed(story) * 10);
    let bg = "red";
    if (percent >= 40) {
        bg = "green";
    }
    else if (percent > 10) {
        bg = "orange";
    }
    if (percent <= 0 && timePenaltyFeatureFlag) {
        bg = "red"; //The timebar becomes full height red if there will be a time penalty paid.
        percent = 100; //full-height red bad. TODO: fix color blindness issue though.
        //consider: would be good to change another aspect to highlight "overdue"
    }
    target.style.height = "" + percent + "%";
    target.style.minHeight = "" + percent + "%";
    target.style.maxHeight = "" + percent + "%";
    log("percent " + percent);
    target.style.backgroundColor = bg;
}
function drawStory(key, stories, top) {
    const el = $id("kanbanboard");
    let s = el.querySelector("#" + key);
    let avatar = "";
    let busy = "";
    let story = stories[key];
    if (story.icon != undefined) {
        avatar = "<span class='avatar'>" + story.icon + "</span>";
    }
    let logo = `<span class='logo'>${story.logo}</span>`;
    if (debugOutput) {
        logo += `<span class='secrets'>${story.hasBug ? "🐛" : ""}${story.hasSpecBug ? "💥" : ""}</span>`;
    }
    if (story.busy) {
        busy = " busy";
    }
    let selected = "";
    if (game.SelectedReceiver == key) {
        selected = " selected";
    }
    if (isPossible(story)) {
        selected = " possible";
    }
    let points = "<span class='points'>" + story.points + "</span>";
    // if the story is done, don't add a click handler.
    //let handler =
    //  story.skillNeeded == "done" ? "" : `onclick='clickReceiver(\"${key}\");'`;
    let timebar = story.maxAge > 0 ? generateTimebarHtml(story) : "";
    //let shtml = `<span class='story receiver ${story.skillNeeded}${busy}${selected}' id='${key}' ${handler}><span class='story-detail'>${logo} ${story.summary}</span>${avatar}${points}${timebar}</span>`;
    let shtml = `<span class='story receiver ${story.skillNeeded}${busy}${selected}' id='${key}'><span class='story-detail'>${logo} ${story.summary}</span>${avatar}${points}${timebar}</span>`;
    log("game stories: " + Object.keys(game.Stories));
    if (s != null) {
        s.outerHTML = shtml;
        //s.on
        if (story.skillNeeded != "done") {
            log("adding (or re...adding?) click handler to story " + key);
            s.addEventListener("click", () => clickReceiver(key));
        }
    }
    else {
        let column = el.querySelector("td#" + story.skillNeeded + " .inner");
        if (!column)
            return;
        let newstory = htmlToElement(shtml);
        if (story.skillNeeded != "done") {
            log("adding click handler to new story " + key);
            //newstory.addEventListener("click", () => clickReceiver(`"${key}"`));
            newstory.addEventListener("click", () => clickReceiver(key));
        }
        if (top) {
            column.insertBefore(newstory, column.firstChild);
        }
        else {
            column.appendChild(newstory);
        }
    }
    if (game.TimeBarFeatureFlag && story.maxAge != -1) {
        const target = el.querySelector("#" + key + " .time-bars .elapsed");
        if (target) {
            drawTimebar(target, key, story);
        }
    }
    updateColumnCount(story.skillNeeded);
}
// absolute date diff in whole seconds
function dateDiff_s(date1, date2) {
    var diff = (date1.getTime() - date2.getTime()) / 1000;
    return Math.abs(Math.round(diff));
}
//consider: make this a method on story
function projectAge_s(story) {
    return dateDiff_s(story.startingTime, new Date());
}
function getTenthsOfTimeElapsed(story) {
    let age_s = projectAge_s(story);
    //we will draw a total of 5 bars, so tenths are what matters.
    let maxAge_seconds = story.maxAge;
    return Math.floor(age_s / (maxAge_seconds / 10));
}
function generateTimebarHtml(story) {
    return `<div class='time-bars'><span class='elapsed'></span></div>`;
}
function updateColumnCount(column) {
    let target = $("#" + column + " .inner .count");
    let limit = game.ColumnLimits[column];
    if (target && target.length == 1) {
        let points = 0;
        for (let s of $("#" + column + " .inner .story .points")) {
            //s.innerText;
            points += Number(s.innerText);
        }
        const cardCount = $("#" + column + " .inner .story").length;
        if (limit != null && limit != -1) {
            let upButtonId = "btnUpColumn" + column;
            let dnButtonId = "btnDnColumn" + column;
            target[0].innerHTML = `<span id='${upButtonId}' class='up'>➕</span>${points}/${limit}📍<span id='${dnButtonId}' class='dn'>➖</span>`;
            target[0].classList.add("limited");
            target[0].setAttribute("title", `${cardCount} stories worth ${points} points, with a soft limit of ${limit} points.`);
            //onclick='updateColumnLimit("${column}",-1);
            //onclick='updateColumnLimit("${column}",1);
            $id(upButtonId).addEventListener("click", () => updateColumnLimit(column, +1));
            $id(dnButtonId).addEventListener("click", () => updateColumnLimit(column, -1));
        }
        else {
            target[0].innerHTML = `${points}📍`;
            target[0].setAttribute("title", `${cardCount} stories worth ${points} points`);
        }
        target[0].setAttribute("data-count", "" + cardCount);
        // consider: check the number of people who have this skill.
        //If the count > (#people) make the color yellowish;
        //if the count > (#people * 2 + 2) make the color red(ish);
    }
}
function updateColumnLimit(column, delta) {
    let value = game.ColumnLimits[column];
    value += delta;
    if (value >= 0) {
        //even limits have limits
        game.ColumnLimits[column] = value;
        updateColumnCount(column);
    }
}
function drawStories(stories) {
    for (const key in stories) {
        drawStory(key, stories, stories[key].reworkLevel > 0);
    }
}
function drawTimebars(stories) {
    for (const key in stories) {
        // only applies to stories that *have* a max age (-1 means, none)
        if (stories[key].maxAge != -1) {
            const el = $id("kanbanboard");
            const target = el === null || el === void 0 ? void 0 : el.querySelector("#" + key + " .time-bars .elapsed");
            if (target) {
                drawTimebar(target, key, stories[key]);
            }
        }
    }
}
function drawInboxItem(key, item) {
    const el = $id("kanbanboard");
    const s = el.querySelector("#" + key);
    //const shtml = `<span class='storeItem receiver ${item.skillNeeded}' id='${key}' onclick="clickReceiver(\'${key}\');"><span class='storeitem-icon'>${item.icon}</span> ${item.name}</span>`;
    const shtml = `<span class='storeItem receiver ${item.skillNeeded}' id='${key}'><span class='storeitem-icon'>${item.icon}</span> ${item.name}</span>`;
    if (s != null) {
        s.outerHTML = shtml;
        if (item.skillNeeded != "done") {
            log("adding (or re...adding?) click handler to inbox item " + key);
            s.addEventListener("click", () => clickReceiver(key));
        }
    }
    else {
        const column = el.querySelector("td#ba .inner");
        if (!column)
            return;
        const newInboxItem = htmlToElement(shtml);
        // put it at the top of the inbox column (the 'ba' column)
        if (item.skillNeeded != "done") {
            log("adding click handler to inbox item " + key);
            newInboxItem.addEventListener("click", () => clickReceiver(key));
        }
        column.insertBefore(newInboxItem, column.firstChild);
    }
}
function drawPerson(key, people) {
    const el = $id("people");
    const p = el.querySelector("#" + key);
    //if the person is listed in #id already then update it.
    let newPerson = true;
    if (p != null) {
        newPerson = false;
    }
    let busy = "";
    let person = people[key];
    if (person.busy) {
        busy = " busy";
    }
    let skillsDiv = getSkillsDiv(person.skills);
    let itemsHtml = getItemsHtml(person);
    let selected = game.SelectedDoer == "p" + person.id ? " selected" : "";
    let possible = isPossiblePerson(person) ? " possible" : "";
    let phtml = "<span class='person doer" +
        busy +
        selected +
        possible +
        "' id='" +
        key +
        "' ><span class='avatar2'>" +
        person.avatar +
        "</span><div class='name'>" +
        person.name +
        "</div>" +
        skillsDiv +
        " " +
        itemsHtml +
        "<div class='summary'>" +
        person.summary +
        "</div></span>";
    let newPersonElement = htmlToElement(phtml);
    for (let key of Object.keys(person.skills)) {
        newPersonElement.classList.add(key);
    }
    if (newPerson) {
        el.appendChild(newPersonElement);
        newPersonElement.addEventListener("click", () => clickDoer(key));
    }
    else {
        if (p != null) {
            p.outerHTML = newPersonElement.outerHTML;
            log("re-added clickDoer handler to person " + key);
            const p2 = el.querySelector("#" + key);
            p2.addEventListener("click", () => clickDoer(key));
        }
    }
}
function getItemsHtml(person) {
    //was: return = Object.keys(items).map(k => items[k].icon).join(" ");
    let result = "";
    for (const itemKey of Object.keys(person.has)) {
        let item = person.has[itemKey];
        let levelAttribute = "";
        if (item.code == ItemCode.seat)
            levelAttribute = ` data-level='${person.seatLevel > 9 ? "∞" : person.seatLevel}'`;
        if (item.code == ItemCode.initiative)
            levelAttribute = ` data-level='${person.initiativeLevel > 9 ? "∞" : person.initiativeLevel}'`;
        if (item.code == ItemCode.keyboard)
            levelAttribute = ` data-level='${person.keyboardLevel > 9 ? "∞" : person.keyboardLevel}'`;
        if (item.code == ItemCode.headphones)
            levelAttribute = ` data-level='${person.headphoneLevel > 9 ? "∞" : person.headphoneLevel}'`;
        result += `<span class='icon'${levelAttribute}>${item.icon}</span>`;
    }
    if (result === "")
        return result;
    return `<div class='itemList'>${result}</div>`;
}
function getSkillsDiv(skills) {
    let result = "";
    for (let [key, value] of Object.entries(skills)) {
        let s1 = "";
        switch (key) {
            case "dev":
                s1 = `<span class='skill dev dev-${value.level}' data-level='${value.level > 9 ? "∞" : value.level}' title='developer'>💻</span>`;
                break;
            case "test":
                s1 = `<span class='skill test test-${value.level}' data-level='${value.level > 9 ? "∞" : value.level}' title='tester'>🔬</span>`;
                break;
            case "ba":
                s1 = `<span class='skill ba ba-${value.level}' data-level='${value.level > 9 ? "∞" : value.level}' title='business analyst'>🗣</span>`;
                break;
        }
        result += s1;
    }
    return "<div class='skills'>" + result + "</div>";
}
function drawPeople(people) {
    for (const key in people) {
        drawPerson(key, people);
    }
}
function go() {
    initGameState();
    drawRoom();
    const startEl = $id("start");
    startEl.classList.remove("pulse"); //hide 'start' button's pulse effect.
    startEl.classList.add("hidden"); //hide 'start' button
    //removeClass('#office', 'hidden');
    $id("startscreen").classList.add("hidden");
    $id("office").classList.remove("hidden");
    removeClass("#getLead", "hidden"); //show 'purchase sales lead' button
    removeClass(".metrics", "hidden"); // show heads up display.
    if (!game.TimeBarFeatureFlag)
        $id("rate").classList.add("hidden");
    addClass(".getPerson", "hidden"); //hide 'buy dev/test/ba' buttons. (They are re-enabled when total >= 300)
    drawMessage("STEP 1: press '🎁 find project'");
    addClass("#getLead", "hint");
    startMainLoop();
}
function getNewLead() {
    if ($id("getLead").classList.contains("busy")) {
        return;
    }
    removeClass("#getLead", "hint");
    DeSelectDoerAndReceiver();
    let price = game.LeadPrice;
    if (game.Money < 0) {
        drawMessage("Will need to go FURTHER into debt to get this lead. 😫");
    }
    else if (game.Money < price) {
        drawMessage("Will need to go into debt to get this lead. 😢");
    }
    incrementMoney(price * -1);
    incrementXP(5);
    // TODO: story should be created by a constructor on story
    let newLead = new Story("lead", "ba", projectName(), null);
    /*{
        id: nextId(),
        points:game.ProjectSize,
        pointPrice:game.PointPrice,
        status:"lead",
        skillNeeded:"ba",
        summary:projectName(),
        logo: getLogo(),
        person: null,
        busy: false,
        icon: null,
        hasBug: false,
        hasSpecBug: false,
        customerFoundBug: null,
        projectId: null,
        reworkLevel:0,
        startingTime: new Date(),
        maxAge: -1
      };
  */
    if (game.TimeBarFeatureFlag) {
        if (Math.floor(Math.random() * 100) < game.TimeBarChance) {
            if (!game.FirstTimeSensitiveProject) {
                game.FirstTimeSensitiveProject = true;
                //TODO: MAKE it a modal message!
                drawMessage("⏰⏰⏰This project is time sensitive! Get it done quickly! ⏰⏰⏰");
            }
            newLead.maxAge = game.MaxAge;
        }
    }
    if (isEmpty(game.Stories)) {
        // this was the first lead ever! give them a tip...
        drawMessage("STEP 2: Click the project " +
            newLead.logo +
            ", then click the " +
            game.People["p1"].avatar +
            " Founder (or vice-versa)");
        //todo: and make the new Lead button disabled...
        $id("getLead").classList.add("busy");
    }
    game.Stories["r" + newLead.id] = newLead;
    drawStory("r" + newLead.id, game.Stories, false);
    game.LeadPrice = Inflate(game.SmallInflation, game.LeadPrice);
    let roi = (game.ProjectSize * game.PointPrice * 1.5) / game.LeadPrice;
    if (roi < 2 || roi > 4.5) {
        log(`Roi was ${roi}, from: return = ${Math.floor(game.ProjectSize * game.PointPrice * 1.5)}, investment = ${game.LeadPrice}... so it has been adjusted.`);
        game.LeadPrice = Math.floor((game.ProjectSize * game.PointPrice * 1.5) / 2.5);
    }
    else {
        log(`Roi is ${roi}`);
    }
    drawButtons();
}
function DeSelectDoerAndReceiver() {
    deselectDoer();
    deselectReceiver();
}
function getNewPerson(skill) {
    DeSelectDoerAndReceiver();
    let personType = game.AllPeopleTypes[skill];
    if (game.Money < personType.price) {
        drawMessage(`Cannot afford a new ${personType.title}.`);
        return;
    }
    removeClass(".getPerson." + skill, "hint");
    incrementMoney(personType.price * -1);
    incrementXP(10);
    let id = nextId();
    //let skillo = {};
    let skillo = {};
    skillo[skill] = { level: 1 };
    let newEmployee = {
        id: id,
        skills: skillo,
        summary: "💤",
        avatar: getAvatar(),
        name: getName(),
        XP: 0,
        busy: false,
        initiativeLevel: 0,
        has: {},
        seatLevel: 0,
        keyboardLevel: 0,
        headphoneLevel: 0,
        initiativeDelay: game.DefaultInitiativeDelay,
        triggerTime: null,
        buyBotLevel: 0,
    };
    game.People["p" + id] = newEmployee;
    drawPerson("p" + id, game.People);
    // Every time you hire a person the price for that type inflates by a LOT.
    personType.price = Inflate(game.HyperInflation, personType.price);
    drawButtons();
}
function clickFirstAvailableCard(column) {
    let columnCards = $(`#${column} .inner .receiver:not(.busy)`);
    if (columnCards && columnCards.length > 0) {
        clickReceiver(columnCards[0].id);
    }
}
document.onkeypress = function (e) {
    switch (e.key) {
        case "1":
            clickFirstAvailableCard("ba");
            break;
        case "2":
            clickFirstAvailableCard("dev");
            break;
        case "3":
            break;
        case "4":
            clickFirstAvailableCard("test");
            break;
        case "5":
            break;
    }
};
function isPossible(story) {
    if (!game)
        return false;
    if (story.busy)
        return false;
    if (game.SelectedDoer != undefined && game.SelectedDoer != null) {
        if (story.skillNeeded == "any")
            return true;
        console.log("skillNeeded", story.skillNeeded);
        let skills = game.People[game.SelectedDoer].skills;
        console.log(skills);
        if (Object.keys(skills).includes(story.skillNeeded)) {
            return true;
        }
    }
    return false;
}
function isPossiblePerson(person) {
    // As a 'receiver' -- highlight everything that can do this (where not busy)
    if (person.busy)
        return false;
    if (game.SelectedReceiver != undefined && game.SelectedReceiver != null) {
        let receiver = game.Stories[game.SelectedReceiver] || game.Items[game.SelectedReceiver];
        if (receiver.skillNeeded == "any")
            return true;
        if (Object.keys(person.skills).includes(receiver.skillNeeded))
            return true;
    }
    return false;
}
function updatePossible() {
    if (game.SelectedDoer != undefined && game.SelectedDoer != null) {
        //As a 'doer' -- highlight everything I can do.  (where not busy)
        let skills = game.People[game.SelectedDoer].skills;
        //for(const skill of game.People[game.SelectedDoer].skills) {
        for (let key of Object.keys(skills)) {
            addClass("." + key + ".receiver:not(.busy)", "possible");
        }
        addClass(".any.receiver:not(.busy)", "possible");
    }
    // As a 'receiver' -- highlight everything that can do this (where not busy)
    if (game.SelectedReceiver != undefined && game.SelectedReceiver != null) {
        let receiver = game.Stories[game.SelectedReceiver] || game.Items[game.SelectedReceiver];
        if (receiver.skillNeeded == "any") {
            addClass(".doer:not(.busy)", "possible");
        }
        else {
            //alert(receiver.skillNeeded);
            addClass("." + receiver.skillNeeded + ".doer:not(.busy)", "possible");
        }
    }
}
function deselectDoer() {
    if (game.SelectedDoer == undefined || game.SelectedDoer == null)
        return;
    let doer = $id(game.SelectedDoer);
    game.SelectedDoer = null;
    if (doer == undefined)
        return;
    doer.classList.remove("selected");
    removeAllClass("possible");
    updatePossible();
}
function selectDoer() {
    $id(game.SelectedDoer).classList.add("selected");
    updatePossible();
}
function clickDoer(id) {
    // can't select (or deselect) a busy person.
    if (game.People[id].busy) {
        log("can't select (or deselect) a busy item. (" +
            game.People[id].name +
            " " +
            game.People[id].avatar +
            ")");
        return;
    }
    if (game.SelectedDoer == id) {
        deselectDoer();
        return;
    }
    if (game.SelectedDoer != undefined) {
        deselectDoer();
    }
    game.SelectedDoer = id;
    selectDoer();
    if (game.SelectedReceiver != undefined && game.SelectedDoer != undefined) {
        tryDo(game.SelectedDoer, game.SelectedReceiver, true);
    }
}
function deselectReceiver() {
    if (game.SelectedReceiver == undefined || game.SelectedReceiver == null)
        return;
    let receiver = $id(game.SelectedReceiver);
    game.SelectedReceiver = null;
    if (receiver == undefined)
        return;
    receiver.classList.remove("selected");
    removeAllClass("possible");
    updatePossible();
}
function selectReceiver() {
    $id(game.SelectedReceiver).classList.add("selected");
    updatePossible();
}
function clickReceiver(id) {
    console.log("clickReceiver", id);
    log("game stories: " + Object.keys(game.Stories));
    let clickedReceiver = game.Stories[id] || game.Items[id];
    if (clickedReceiver.busy == true) {
        log("can't select (or deselect) a busy item. (" + clickedReceiver.icon + ")");
        return;
    }
    if (game.SelectedReceiver == id) {
        deselectReceiver();
        return;
    }
    if (game.SelectedReceiver != undefined) {
        deselectReceiver();
    }
    game.SelectedReceiver = id;
    selectReceiver();
    if (game.SelectedReceiver != undefined && game.SelectedDoer != undefined) {
        tryDo(game.SelectedDoer, game.SelectedReceiver, false);
    }
}
function tryDo(doId, receiverId, viaDoer) {
    let doer = game.People[doId];
    let receiver = game.Stories[receiverId] || game.Items[receiverId];
    if (receiver.skillNeeded != "any" &&
        !Object.keys(doer.skills).includes(receiver.skillNeeded)) {
        if (viaDoer) {
            deselectReceiver();
        }
        else {
            deselectDoer();
        }
        return;
    }
    if (doer.busy) {
        log("doer is busy");
    }
    if (receiver.busy) {
        log("receiver is busy");
    }
    if (doer.busy || receiver.busy) {
        return;
    }
    //doer will now do the receiver thing.
    $id(game.SelectedReceiver).classList.remove("selected");
    $id(game.SelectedDoer).classList.remove("selected");
    removeAllClass("possible");
    game.SelectedReceiver = null;
    game.SelectedDoer = null;
    doIt(doId, receiverId);
}
function useIt(doId, item) {
    let person = game.People[doId];
    applyItem(person, item);
    drawPerson("p" + person.id, game.People);
    removeStory("i" + item.id);
}
function applyItem(person, item) {
    switch (item.code) {
        case ItemCode.buyBot:
            // this is a very custom item.
            person.buyBotLevel += 1;
            let message = `The buy-bot ${item.icon} will buy projects for you, (if the inbox is below the points limit (set with ➕ and ➖), and you have spare 💲)`;
            game.TimeBarFeatureFlag = true;
            if (game.ColumnLimits["ba"] == -1) {
                game.ColumnLimits["ba"] = 20;
                updateColumnCount("ba");
            }
            if (game.ColumnLimits["dev"] == -1) {
                game.ColumnLimits["dev"] = 20;
                updateColumnCount("dev");
            }
            if (person.initiativeLevel == 0) {
                person.initiativeLevel++;
                game.HasInitiativeLevel++;
                //TODO: grab initiative item from all items collection
                let ss = {
                    id: nextId(),
                    name: "⭐ Initiative Training ⭐",
                    price: 500,
                    icon: "🚀",
                    skillNeeded: "any",
                    busy: false,
                    code: ItemCode.initiative,
                    activeDuration: 0,
                    description: "When you're idle, go and check the board to see if there is anything you can do. Purchase multiple times to show initiative sooner!",
                    enabled: false,
                };
                message += `, and ${person.name} ${person.avatar} has initiative now!`;
                person.has["i" + ss.id] = ss;
            }
            else {
                message += ".";
            }
            person.has["i" + item.id] = item;
            drawMessage(message);
            break;
        case ItemCode.initiative:
            game.HasInitiativeLevel++;
            person.initiativeLevel++;
            if (person.initiativeLevel == 1) {
                person.has["i" + item.id] = item;
                drawMessage(`${person.name} ${person.avatar} has initiative now!`);
            }
            else {
                drawMessage(`${person.name} ${person.avatar} has ⭐more⭐ initiative (level ${person.initiativeLevel}).`);
            }
            if (person.busy == false) {
                personFree(person);
            }
            break;
        case ItemCode.seat:
            person.seatLevel++;
            if (person.seatLevel == 1) {
                person.has["i" + item.id] = item;
            }
            break;
        case ItemCode.keyboard:
            person.keyboardLevel++;
            if (person.keyboardLevel == 1) {
                person.has["i" + item.id] = item;
            }
            break;
        case ItemCode.headphones:
            person.headphoneLevel++;
            if (person.headphoneLevel == 1) {
                person.has["i" + item.id] = item;
            }
            break;
        case ItemCode.upskillTest:
            if (person.skills["test"] != undefined) {
                person.skills["test"].level++;
            }
            else {
                person.skills["test"] = { level: 1 };
            }
            break;
        case ItemCode.upskillDev:
            if (person.skills["dev"] != undefined) {
                person.skills["dev"].level++;
            }
            else {
                person.skills["dev"] = { level: 1 };
            }
            break;
        case ItemCode.upskillBA:
            if (person.skills["ba"] != undefined) {
                person.skills["ba"].level++;
            }
            else {
                person.skills["ba"] = { level: 1 };
            }
            break;
        case ItemCode.dog:
        case ItemCode.cat:
            //dog and cat make you busy for a little while
            //if (item.code == ItemCode.cat) item.icon = randomItem(catIcons);
            //if (item.code == ItemCode.dog) item.icon = randomItem(dogIcons);
            person.busy = true;
            let animal = item.code == ItemCode.dog ? "dog" : "cat";
            person.summary = `Tending to ${item.name} ${item.icon} (the ${animal})`;
            drawMessage(`${person.name} ${person.avatar} has the ${animal} ${item.name} ${item.icon}`);
            setTimeout(function () {
                usingFinishedBusyPhase(person, item);
            }, game.AnimalTendingDelay);
            setTimeout(function () {
                usingFinished(person, item);
            }, item.activeDuration * 500);
            // length of time cat/dog spends with someone increase each time they visit. (Controversial?)
            item.activeDuration *= 1.25;
            person.has["i" + item.id] = item;
            break;
        case ItemCode.banana:
        case ItemCode.toast:
        case ItemCode.coffee:
        case ItemCode.coffeeMachine:
        case ItemCode.cupcake:
        case ItemCode.donut:
        case ItemCode.donutMachine:
        case ItemCode.pizza:
        case ItemCode.crystalBall:
        case ItemCode.poster:
        case ItemCode.statue:
        case ItemCode.statue2:
        case ItemCode.cookie:
        case ItemCode.cactus:
        case ItemCode.deskPlant:
            person.has["i" + item.id] = item;
            if (item.activeDuration > 0) {
                setTimeout(function () {
                    usingFinished(person, item);
                }, item.activeDuration * 1000);
            }
            break;
        default:
            log("Unhandled item type! " + item.icon + " " + item.code + " " + item.name);
    }
}
// Some items (like the dog and the cat) have a short initially 'busy' phase after you grab them.
// Once that finishes,
function usingFinishedBusyPhase(person, item) {
    person.busy = false;
    person.summary = "💤";
    drawPerson("p" + person.id, game.People);
    personFree(person);
}
function personFree(person) {
    log(`${person.name} ${person.avatar} is now free`);
    updatePossible();
    tryInitiate(person);
}
function tryInitiate(person) {
    if (person.initiativeLevel > 0) {
        // the brain instead of the 💤 is because we're a self starter and we're **awake**
        person.summary = "🧠";
        //How many elevenths of an 18 second delay, do we have to wait before polling the board?
        //with self starter level 1, we wait ten/elevenths of 18 seconds... i.e. 16.4 seconds.
        let delay = (person.initiativeDelay / 11) *
            (11 - Math.min(10, person.initiativeLevel));
        // if they have a dog, we wait only half that time!
        if (personHas(person, ItemCode.dog))
            delay = delay / 2;
        log(`Will check board in ${delay}`);
        let triggerTime = new Date();
        person.triggerTime = triggerTime;
        if (game.SelectedDoer == "p" + person.id) {
            //can't self start while selected... try to try again in a little bit...
            setTimeout(function () {
                tryInitiate(person);
            }, 1000);
        }
        else {
            setTimeout(function () {
                initiate(person, triggerTime);
            }, delay);
        }
    }
    else {
        person.summary = "💤";
    }
    drawPerson("p" + person.id, game.People);
}
function columnName(skill) {
    switch (skill) {
        case "ba":
            return "inbox";
        case "dev":
            return "backlog";
        case "dev0":
            return "dev";
        case "test":
            return "test";
        case "done":
            return "done";
        default:
            return "inbox";
    }
}
function initiate(person, triggerTime) {
    //Now I will go and see if there are any cards on the board that I believe are worthy of my attention.
    if (person.triggerTime != triggerTime) {
        log("Stale self-start event.");
        return;
    }
    if (game.SelectedDoer == "p" + person.id) {
        // can't self start while selected... try to try again in a little bit...
        setTimeout(function () {
            tryInitiate(person);
        }, 1000);
        return;
    }
    log("Self starter is awake...");
    log(person.name + " " + person.avatar + " is busy? " + person.busy);
    if (!person.busy) {
        log(`${person.name} ${person.avatar} is checking the board now....`);
        let columns = [];
        if (person.buyBotLevel > 0) {
            // consider sending the bot off to buy a project lead...
            updateColumnCount;
            let baPoints = 0;
            let devPoints = 0;
            for (let s of $("#ba .inner .story .points")) {
                baPoints += Number(s.innerText);
            }
            for (let s of $("#dev .inner .story .points")) {
                //s.innerText;
                devPoints += Number(s.innerText);
            }
            if (baPoints < game.ColumnLimits["ba"] &&
                devPoints < game.ColumnLimits["dev"]) {
                //hmmm, ba column isn't full...
                // and dev column isn't full...
                if (game.Money > game.LeadPrice) {
                    let price = game.LeadPrice;
                    getNewLead();
                    drawMessage("⭐Buybot 🤖 just bought a new project for 💲" + price + "⭐");
                }
            }
        }
        // we prioritize self-starting from the back of the board.
        if (person.skills["test"] && person.skills["test"].level > 0) {
            columns.push("test");
        }
        if (person.skills["dev"] && person.skills["dev"].level > 0) {
            columns.push("dev");
        }
        if (person.skills["ba"] && person.skills["ba"].level > 0) {
            columns.push("ba");
        }
        if (columns.length == 0)
            log(`${person.name} ${person.avatar} has no skills worth a damn, apparently!`);
        // check each column in the order of the array columns.
        for (let column of columns) {
            let nextCards = $(`#${column} .inner .story.receiver:not(.busy)`);
            if (nextCards.length > 0) {
                let nextCardId = nextCards[0].id;
                log(`${person.name} ${person.avatar} is doing ${game.Stories[nextCardId].summary}`);
                doIt("p" + person.id, nextCardId);
                break;
            }
        }
    }
    // If they did not find anything to do in the above scanning of the board, then person.busy will be false and we will
    // schedule another check of the board.
    if (!person.busy) {
        tryInitiate(person);
    }
}
function usingFinished(person, item) {
    //person.has['i'+item.id] = undefined;
    //jalert(person.has);
    delete person.has["i" + item.id];
    //jalert(person.has);
    // the office cat and the office dog return to the in-tray when you are finished with them.
    switch (item.code) {
        case ItemCode.dog:
        case ItemCode.cat:
            drawInboxItem("i" + item.id, item);
            drawMessage(item.name +
                " " +
                item.icon +
                " has left " +
                person.name +
                " " +
                person.avatar +
                " and is back to the inbox");
            break;
    }
    drawPerson("p" + person.id, game.People);
}
function doIt(doId, receiverId) {
    let story = game.Stories[receiverId];
    if (story == undefined) {
        let item = game.Items[receiverId];
        if (item == undefined) {
            log("Cannot work out what the receiver is!");
            return;
        }
        useIt(doId, item);
        return;
    }
    let person = game.People[doId];
    story.busy = true;
    story.icon = person.avatar;
    story.person = doId;
    person.busy = true;
    person.summary = getSummary(story);
    drawMessage(person.name + " is " + person.summary);
    drawPerson(doId, game.People);
    drawStory(receiverId, game.Stories, story.reworkLevel > 0);
    let duration = getDuration(person, story);
    log("Duration: of " +
        story.summary +
        " " +
        story.skillNeeded +
        ": " +
        Math.floor(duration));
    setTimeout(function () {
        done(receiverId);
    }, duration);
}
function getBuginess(person, skill) {
    // see also function canFindBug
    let efficiency = getEfficiency(person, skill);
    // efficiency is from 0.3 to 0.999
    let result = 1 - (0.57 + (efficiency * 3) / 7);
    // efficiency = 0.3 gives buginess of 0.3
    // efficiency = 0.999 gives buginess of 0.005
    return result;
}
function getEfficiency(person, skill) {
    log("skill:" + skill);
    let level = 0;
    if (skill == "dev0")
        skill = "dev";
    if (!person.skills[skill])
        return 0.3; //skill not found? same as level 1
    level = person.skills[skill].level;
    level += person.seatLevel;
    level += person.keyboardLevel;
    level += person.headphoneLevel;
    if (personHas(person, ItemCode.cupcake))
        level++;
    if (personHas(person, ItemCode.donut))
        level++;
    if (personHas(person, ItemCode.donutMachine))
        level++;
    if (personHas(person, ItemCode.pizza))
        level++;
    if (personHas(person, ItemCode.banana))
        level++;
    if (personHas(person, ItemCode.keyboard))
        level++;
    if (personHas(person, ItemCode.deskPlant))
        level++;
    if (personHas(person, ItemCode.cookie))
        level++;
    //coffee gives twice the power!!
    if (personHas(person, ItemCode.coffee) ||
        personHas(person, ItemCode.coffeeMachine))
        level = level + 2;
    switch (level) {
        case 0:
            return 0;
        case 1:
            return 0.3;
        case 2:
            return 0.4;
        case 3:
            return 0.5;
        case 4:
            return 0.6;
        case 5:
            return 0.7;
        case 6:
            return 0.77;
        case 7:
            return 0.83;
        case 8:
            return 0.9;
        case 9:
            return 0.95;
        case 10:
            return 0.96;
        case 11:
            return 0.97;
        case 12:
            return 0.98;
        case 13:
            return 0.98;
        default:
            return 0.999;
    }
}
// how long will this task take this person?
function getDuration(person, story) {
    let duration = story.points *
        avgDuration *
        (1.0 / getEfficiency(person, story.skillNeeded)) *
        getTaskFactor(story.skillNeeded);
    // All rework is faster. This is a little over-simplified, but it will do.
    // rework also has a lower chance of introducing fresh bugs (that is covered elsewhere)
    if (story.reworkLevel > 0 &&
        (story.skillNeeded == "ba" || story.skillNeeded == "dev")) {
        duration = duration / (story.reworkLevel + 1); // Math.pow(2, story.reworkLevel);
    }
    if (personHas(person, ItemCode.dog)) {
        // A person in possession of a dog works twice as fast. No-one understands why.
        log("Faster work when you have that 🐶, " + person.name + "!");
        duration = duration / 2;
    }
    return duration;
}
function personHas(person, code) {
    return (Object.keys(person.has).filter((k) => person.has[k].code == code).length > 0);
}
function getSummary(story) {
    return getTaskVerb(story.skillNeeded) + " '" + story.summary + "'…";
}
// Consider: these verbs could be randomly drawn from list, e.g
function getTaskVerb(skill) {
    switch (skill) {
        case "ba":
            return "analyzing"; //scribing, breaking-down, encarding
        case "dev":
            return "designing"; //envisioning, grasping, comprehending, studying,
        case "dev0":
            return "developing"; //"hacking", "coding", "developing",
        case "test":
            return "testing"; //inspecting
    }
}
// this is the relative time it takes to do each step.
function getTaskFactor(skill) {
    switch (skill) {
        case "ba":
            return 0.5;
        case "dev":
            return 0.25;
        case "dev0":
            return 1.0;
        case "test":
            return 0.5;
    }
}
function done(receiveId) {
    let story = game.Stories[receiveId];
    story.busy = false;
    let person = game.People[story.person];
    person.busy = false;
    person.XP += 1;
    incrementXP(1);
    drawMessage(person.name +
        " finished " +
        person.summary.replace("…", "") +
        " " +
        story.logo +
        ".");
    $id("p" + game.People[story.person].id).classList.remove("busy");
    let skillNeeded = story.skillNeeded;
    switch (skillNeeded) {
        case "ba":
            //okay -- we've done the ba work on it.
            //now we add a bunch of cards to the backlog.
            doneBa(receiveId);
            break;
        case "dev":
            //okay -- we've done the ba work on it.
            //now we add a bunch of cards to the backlog.
            doneDev(receiveId);
            break;
        case "dev0":
            //okay -- we've done the ba work on it.
            //now we add a bunch of cards to the backlog.
            doneDev0(receiveId);
            break;
        case "test":
            doneTest(receiveId);
            break;
        default:
            drawMessage("unrecognised " + skillNeeded);
    }
    //made it to here without being assigned a task? then the person is now free!
    if (!person.busy)
        personFree(person);
}
function doneBa(storyId) {
    //okay -- we've done the ba work on it.
    //now we add a bunch of cards to the backlog.
    let oldStory = game.Stories[storyId];
    let person = game.People[oldStory.person];
    if (oldStory.status == "story") {
        oldStory.person = null;
        oldStory.skillNeeded = "dev"; //it goes into backlog, with bug fixed.
        oldStory.hasSpecBug = false; //if it was a spec bug, it is now fixed.
        oldStory.hasBug = false; //If it was a regular bug, the further development will resolve it.
        oldStory.icon = null; //remove the icon...
        log("Fixed the bug (or spec bug)");
        removeStory(storyId); //remove the story from the Inbox...
        drawStory(storyId, game.Stories, true); //top of the backlog... race it through
        person.busy = false;
        person.summary = "💤";
        drawPerson("p" + person.id, game.People);
        return;
    }
    oldStory.status = "done";
    game.Projects[storyId] = new Project(oldStory);
    let newCards = ElaborateProject(oldStory, person);
    person.busy = false;
    person.summary = "💤";
    drawPerson("p" + person.id, game.People);
    // The original lead is removed from the board.
    removeStory(storyId);
    // The new stories are added (to the bottom of the 'backlog' column)
    for (const cc of newCards) {
        drawStory("r" + cc.id, game.Stories, false);
    }
}
function determineIfAddingSkillBug(person, story, skill) {
    let skillPointBugLikelihood = 100.0 * getBuginess(person, skill);
    if (story.reworkLevel > 0) {
        // an item being reworked is quicker to work on (handled elsewhere), and has MUCH less chance of new bugs being introduced.
        skillPointBugLikelihood =
            skillPointBugLikelihood / Math.pow(2, story.reworkLevel);
    }
    // it is a truth universally told that a person in possession of a cat is half as likely to create a spec bug.
    if (personHas(person, ItemCode.cat)) {
        log("Lower likelihood of " + skill + " bugs when you have that 😸!");
        skillPointBugLikelihood = skillPointBugLikelihood / 2;
    }
    log(`A ${skill} bug is ${Math.floor(skillPointBugLikelihood)}% likely on each point of this ${story.points} point card, rework: ${story.reworkLevel} `);
    for (let i = 0; i < story.points; i++) {
        if (Math.floor(Math.random() * 100) < skillPointBugLikelihood) {
            return true;
        }
    }
    return false;
}
function ElaborateProject(project, person) {
    let numCards = Math.floor(project.points / 3) + 1;
    log("Lead: " +
        project.summary +
        " " +
        project.logo +
        " has been analyzed. " +
        numCards +
        " stories are being created.");
    let remainingPointsToAllocate = project.points;
    let newCards = [];
    // Deal out starting cards worth 1 point each.
    for (let i = 0; i < numCards; i++) {
        let newCard = new Story("story", "dev", getTask(), project);
        newCard.points = 1; // points are corrected in next section.
        game.Stories["r" + newCard.id] = newCard;
        newCards.push(newCard);
        //Add this new card to the list of stories for that project.
        game.Projects["r" + project.id].stories.push("r" + newCard.id);
    }
    //okay we've given a point to each card.
    remainingPointsToAllocate -= numCards;
    //randomly allocate remaining points to card.
    while (remainingPointsToAllocate > 0) {
        let card = randomItem(newCards); //draw a card from the deck
        card.points += 1;
        remainingPointsToAllocate--;
    }
    for (let cardId of game.Projects["r" + project.id].stories) {
        let hasSpecBug = false;
        let card = game.Stories[cardId];
        //chance of adding a bug relates to effectiveness of ba, and size of story. (and whether or not they have... a cat)
        if (determineIfAddingSkillBug(person, card, "ba")) {
            hasSpecBug = true;
            log("Spec bug 💥 added to '" + card.summary + "'");
        }
        card.hasSpecBug = hasSpecBug;
    }
    return newCards;
}
function doneDev(storyId) {
    //okay -- it's done being in the backlog
    //either add it to dev -- or send it back to be clarified (if you find a spec bug)
    let person = game.People[game.Stories[storyId].person];
    let story = game.Stories[storyId];
    // no spec bugs can be found until level 3.
    if (game.Level > 2 && story.hasSpecBug) {
        let percentChanceOfFindingSpecBug = 100.0 * canFindBug(person, "dev");
        log("Story " +
            story.summary +
            " has a spec bug 💥, there is a " +
            Math.floor(percentChanceOfFindingSpecBug) +
            "% chance of the developer finding it.");
        let foundSpecBug = Math.floor(Math.random() * 100) < percentChanceOfFindingSpecBug;
        if (foundSpecBug) {
            person.busy = false;
            person.summary = "💤";
            drawPerson("p" + person.id, game.People);
            drawMessage(person.name +
                " discovered a spec bug 💥 in story '" +
                story.summary +
                "'");
            story.person = null;
            story.hasBug = null;
            story.icon = "💥";
            story.skillNeeded = "ba";
            story.reworkLevel += 1;
            removeStory(storyId);
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    removeStory(storyId);
    story.skillNeeded = "dev0";
    doIt(story.person, storyId);
}
function doneDev0(storyId) {
    //okay -- development is done
    //Add it to test
    let story = game.Stories[storyId];
    let person = game.People[story.person];
    //chance of adding a bug relates to effectiveness of ba, and size of story. (and whether or not they have... a cat)
    if (determineIfAddingSkillBug(person, story, "dev")) {
        story.hasBug = true;
        // Note the bug may or may not be found later. If tester doesn't find it, the customer *will* find it.
        log(`A bug 🐛 was added to ${story.summary}`);
    }
    removeStory(storyId);
    story.skillNeeded = "test";
    story.person = null;
    story.icon = null;
    log("Story: " + story.summary + " is ready for testing.");
    drawStory(storyId, game.Stories, story.reworkLevel > 0);
    person.busy = false;
    person.summary = "💤";
    drawPerson("p" + person.id, game.People);
}
function doneTest(storyId) {
    //okay -- test is done
    removeStory(storyId);
    let story = game.Stories[storyId];
    let person = game.People[story.person];
    person.busy = false;
    person.summary = "💤";
    drawPerson("p" + person.id, game.People);
    let tester = game.People[story.person];
    //no bugs can be found until level 2.
    if (game.Level > 1 && story.hasBug) {
        let percentChanceOfFindingBug = 100.0 * canFindBug(person, "test");
        log("Story " +
            story.summary +
            " has a bug, there is a " +
            Math.floor(percentChanceOfFindingBug) +
            "% chance of finding it while testing.");
        let foundBug = Math.floor(Math.random() * 100) < percentChanceOfFindingBug;
        if (foundBug) {
            drawMessage(tester.name + " found a bug 🐛 in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.hasSpecBug = null;
            story.icon = "🐛";
            story.skillNeeded = "dev";
            story.reworkLevel += 1;
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    // no spec bugs can be found until level 3.
    if (game.Level > 2 && story.hasSpecBug) {
        let percentChanceOfFindingSpecBug = 100.0 * canFindBug(tester, "test");
        log("Story: " +
            story.summary +
            " has a spec bug 💥, there is a " +
            Math.floor(percentChanceOfFindingSpecBug) +
            "% chance of finding it while testing.");
        let foundSpecBug = Math.floor(Math.random() * 100) < percentChanceOfFindingSpecBug;
        if (foundSpecBug) {
            drawMessage(tester.name + " found a spec bug 💥 in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.hasSpecBug = null;
            story.icon = "💥";
            story.skillNeeded = "ba";
            story.reworkLevel += 1;
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    story.person = null;
    story.icon = null;
    log("Story: " + story.summary + " passed testing. Done!");
    story.skillNeeded = "done";
    story.icon = "✔";
    drawStory(storyId, game.Stories, story.reworkLevel > 0);
    //the 'done' card dissappears after a while.
    setTimeout(function () {
        bankStory(storyId);
    }, avgDuration * 5);
}
function canFindBug(person, skill) {
    // see also `function getBuginess`
    // at level 1 -- efficiency is 0.3
    // at level 10 -- efficiency is 0.99
    let efficiency = getEfficiency(person, skill);
    // that's good enough, we'll just use the efficiency directly.
    log("Efficiency of " + person.name + " at " + skill + " is " + efficiency);
    let chanceOfFindingBug = efficiency;
    return chanceOfFindingBug;
}
function bankStory(storyId) {
    let story = game.Stories[storyId];
    // If story has a bug... customer will definitely find it! (it got past testing!)
    //and it will go all the way back to the ba column, even if it wasn't a spec bug!
    // no bugs can be found until level 2, no spec bugs until level 3
    if ((game.Level > 1 && story.hasBug) ||
        (game.Level > 2 && story.hasSpecBug)) {
        //remove from board
        removeStory(storyId);
        drawMessage(`Oops! The customer found a bug 😡 in story '${story.summary}'`);
        story.customerFoundBug = true;
        //HALVE the amount this card is worth! (hope the customer doesn't find ANOTHER bug in this one......)
        story.pointPrice = story.pointPrice / 2;
        story.person = null;
        story.icon = "😡";
        story.skillNeeded = "ba"; //goes all the way back to the BA column.
        story.reworkLevel += 1;
        drawStory(storyId, game.Stories, true); //at the top.
        return;
    }
    let price = Math.floor(story.points * story.pointPrice);
    let message2 = ` for '${story.summary}'`;
    incrementXP(5);
    if (story.customerFoundBug) {
        //(it was halved when it was first found)
        message2 += " (reduced as customer found that bug)";
    }
    let projectId = game.Stories[storyId].projectId;
    //remove the story from the project it belongs to.
    let project = game.Projects[projectId];
    let bonus = 0;
    if (project.stories.includes(storyId)) {
        project.stories.splice(project.stories.indexOf(storyId), 1);
        //if there are no stories remaining then a project completion bonus is paid.
        if (project.stories.length == 0) {
            bonus = Math.ceil((project.lead.points * project.lead.pointPrice) / 2);
            if (!game.TimeBarFeatureFlag || project.lead.maxAge == -1) {
                message2 += ` plus 💲${bonus} for completing ${project.lead.summary} ${project.lead.logo}`;
                incrementXP(10);
            }
            else {
                //timeBarFeatureFlag ...
                let tenths = getTenthsOfTimeElapsed(story);
                if (tenths < 10) {
                    bonus = Math.ceil(bonus * ((17 - tenths) * 0.1));
                    message2 += ` plus 💲${bonus} for early completion of ${project.lead.summary} ${project.lead.logo}❕`;
                    incrementXP(10);
                }
                else if (timePenaltyFeatureFlag && tenths >= 10) {
                    bonus = Math.ceil(bonus * -0.5);
                    message2 += `...MINUS penalty 😭 of 💲${Math.abs(bonus)}❗ for late completion of ${project.lead.summary} ${project.lead.logo}❕`;
                    incrementXP(2);
                }
                else {
                    message2 += ` and you completed ${project.lead.summary} ${project.lead.logo}.`;
                    incrementXP(5);
                }
            }
            for (const s in project.stories) {
                delete game.Stories[s];
            }
            delete game.Projects[projectId];
        }
    }
    incrementPoints(story.points);
    incrementMoney(price + bonus); // + timeBonus);
    drawMoney(game.Money);
    drawMessage(`Earned 💲${price}${message2}`);
    removeStory(storyId);
}
/* utility functions */
function htmlToElement(html) {
    const template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    const first = template.content.firstElementChild;
    if (!first)
        throw new Error("htmlToElement: no element created");
    return first;
}
function $(selector) {
    return Array.from(document.querySelectorAll(selector));
}
function $xid(id) {
    return document.getElementById(id);
}
// Return an element that must exist. Throws if not found to help silence
// widespread non-null assertions where the element is required.
function $id(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Required element #${id} not found`);
    return el;
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
//add the class of className to all elements that match the selector
function addClass(selector, className) {
    for (const example of $(selector)) {
        example.classList.add(className);
    }
}
//remove the class className from all elements that match the selector
function removeClass(selector, className) {
    for (const example of $(selector)) {
        example.classList.remove(className);
    }
}
// remove the class of className from all elements that have a class of className
function removeAllClass(className) {
    for (const example of $("." + className)) {
        example.classList.remove(className);
    }
}
function getParameterByName(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function drawMessage(message) {
    log("m:" + message);
    $id("message").innerText = message;
}
function drawStoreMessage(message) {
    log("m:" + message);
    $id("storeMessage").innerText = message;
}
function drawHireMessage(message) {
    log("m:" + message);
    $id("hireMessage").innerText = message;
}
function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}
function getName() {
    return randomItem(names);
}
let projectPart0 = [
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "project",
    "operation",
    "operation",
    "system",
    "the",
    "strategy",
    "industrial",
    "project",
]; //,'account','group'];
let projectPart1 = [
    "rattling",
    "slate",
    "aegean",
    "amber",
    "angry",
    "arctic",
    "black",
    "bleak",
    "blue",
    "brave",
    "bravo",
    "bronze",
    "chaos",
    "chartreuse",
    "chilled",
    "cold",
    "constant",
    "crimson",
    "crisp",
    "cruel",
    "crystal",
    "cyan",
    "delta",
    "devout",
    "diamond",
    "drab",
    "dry",
    "emerald",
    "fear",
    "frozen",
    "ghostly",
    "gold",
    "green",
    "hot",
    "icy",
    "indigo",
    "magenta",
    "malachite",
    "mauve",
    "moon",
    "nasty",
    "neat",
    "noble",
    "ocean",
    "orange",
    "oscar",
    "peace",
    "plaid",
    "platinum",
    "pure",
    "purple",
    "rasping",
    "red",
    "resolute",
    "robot",
    "sabre",
    "sane",
    "sapphire",
    "seagreen",
    "shocking",
    "shrieking",
    "silver",
    "slippy",
    "sneaky",
    "steam",
    "steel",
    "stoic",
    "stormy",
    "suffering",
    "tasty",
    "teal",
    "tense",
    "terse",
    "tyrano",
    "violet",
    "wild",
    "wise",
    "wonder",
];
let projectPart2 = [
    "viper",
    "alpha",
    "arms",
    "arrow",
    "axe",
    "bacon",
    "banjo",
    "bishop",
    "birch",
    "blaze",
    "calculo",
    "cargo",
    "castle",
    "cats",
    "centurion",
    "chateau",
    "cobra",
    "creek",
    "cup",
    "dagger",
    "dawn",
    "december",
    "disco",
    "dolphin",
    "donkey",
    "dream",
    "duck",
    "ember",
    "flare",
    "fortune",
    "fox",
    "gazelle",
    "gemstone",
    "gimlet",
    "giraffe",
    "gnocchi",
    "goat",
    "hat",
    "hound",
    "husky",
    "island",
    "jacobite",
    "key",
    "knight",
    "lion",
    "marakesh",
    "monkey",
    "narwhal",
    "night",
    "oak",
    "otter",
    "palace",
    "parakeet",
    "pawn",
    "penguin",
    "puzzle",
    "queen",
    "rook",
    "saurus",
    "skull",
    "sloth",
    "spear",
    "spider",
    "teeth",
    "tiger",
    "timber",
    "torch",
    "wallaby",
    "warrior",
    "wave",
    "whisper",
    "window",
    "wolf",
    "zanzibar",
    "zebra",
];
function projectName() {
    return (randomItem(projectPart0) +
        " " +
        randomItem(projectPart1) +
        "-" +
        randomItem(projectPart2));
}
let avatars = [
    "😕",
    "😉",
    "😕",
    "🙄",
    "🤣",
    "😀",
    "🙃",
    "😁",
    "😂",
    "🤣",
    "😃",
    "😄",
    "😅",
    "😆",
    "😗",
    "😘",
    "😍",
    "😎",
    "😋",
    "😊",
    "😉",
    "😙",
    "😚",
    "🙂",
    "🤗",
    "🤔",
    "😜",
    "😛",
    "😌",
    "😴",
    "😫",
    "😪",
    "😯",
    "🤐",
    "😝",
    "🤤",
    "😒",
    "😓",
    "😔",
    "😕",
    "🙃",
    "🤑",
    "😲",
    "🙁",
    "😖",
    "😞",
    "😟",
    "😤",
    "😢",
    "😰",
    "😬",
    "😨",
    "😩",
    "😬",
    "😰",
    "😠",
    "😵",
    "😳",
    "😱",
    "😡",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤧",
    "🤥",
    "🤡",
    "🤠",
    "😇",
    "🤓",
    "😈",
    "👹",
    "👺",
];
function getAvatar() {
    return randomItem(avatars);
}
let logos = [
    "🎈",
    "🎆",
    "🎇",
    "✨",
    "🎉",
    "🎊",
    "🎃",
    "🎄",
    "🎋",
    "🎍",
    "🎎",
    "🎏",
    "🎐",
    "🎑",
    "🎀",
    "🎗",
    "🎟",
    "🎫",
    "🎠",
    "🎡",
    "🎢",
    "🎪",
    "🎭",
    "🖼",
    "🎨",
    "🛒",
    "👓",
    "🕶",
    "🧥",
    "👔",
    "👕",
    "👖",
    "🧣",
    "🧤",
    "🧦",
    "👗",
    "👘",
    "👙",
    "👚",
    "👛",
    "👜",
    "👝",
    "🛍",
    "🎒",
    "👞",
    "👟",
    "👠",
    "👢",
    "👑",
    "🧢",
    "👒",
    "🎩",
    "🎓",
    "💋",
    "💄",
    "💍",
    "💎",
    "⚽",
    "⚾",
    "🏀",
    "🏐",
    "🏈",
    "🏉",
    "🎱",
    "🎳",
    "🥌",
    "⛳",
    "⛸",
    "🎣",
    "🎽",
    "🛶",
    "🎿",
    "🛷",
    "🥅",
    "🏒",
];
function getLogo() {
    return randomItem(logos);
}
// todo: alphabetic ordering
let taskParts = [
    "3D",
    "A/B",
    "accessible",
    "anarcho",
    "async",
    "augmented",
    "auto",
    "automated",
    "batch",
    "big-data",
    "big",
    "bug-free",
    "bulk",
    "business",
    "chat",
    "cloud-based",
    "code-first",
    "code-free",
    "computery",
    "critical",
    "crypto",
    "custom",
    "customer",
    "customer-first",
    "cyber",
    "deep",
    "developer",
    "digital",
    "distributed",
    "embedded",
    "enterprise",
    "ethical",
    "excessive",
    "femto",
    "functional",
    "fusion",
    "graphical",
    "hierarchical",
    "high-res",
    "hybrid",
    "hydrogen",
    "hyper",
    "immutable",
    "indirect",
    "indie",
    "integrated",
    "interactive",
    "irreversible",
    "keyword",
    "linguistic",
    "lock-free",
    "logarithmic",
    "logical",
    "manipulation",
    "meta",
    "micro",
    "mobile",
    "mobile-first",
    "nano",
    "native",
    "neural",
    "no-code",
    "no-sql",
    "non-virtual",
    "nuclear",
    "obfuscated",
    "offline",
    "opinionated",
    "optimal",
    "organic",
    "p2p",
    "person",
    "pico",
    "point-free",
    "pointer",
    "positronic",
    "pro",
    "productivity",
    "progressive",
    "pseudo",
    "pure",
    "pvp",
    "raster",
    "recursive",
    "remote",
    "responsive",
    "reticulated",
    "retina",
    "reverse",
    "robo",
    "robotic",
    "satellite",
    "seamless",
    "secure",
    "self-closing",
    "self-service",
    "semantic",
    "SEO",
    "shadow",
    "social",
    "structural",
    "structural",
    "third-normal",
    "truth",
    "uptime",
    "user-generated",
    "validation",
    "vector",
    "virtual",
    "weaponised",
    "web",
    "wireless",
    "yet another",
];
// todo: alphabetic ordering
// note: should be singular.
let taskParts2 = [
    "2.0",
    "2001",
    "9000",
    "accelerator",
    "addin",
    "algo",
    "analytics",
    "app",
    "architecture",
    "artwork",
    "assets",
    "attribute",
    "automation",
    "avatar",
    "blockchain",
    "blogs",
    "bot",
    "bots",
    "cache",
    "catalog",
    "chatbot",
    "chat",
    "class",
    "client",
    "cluster",
    "coin",
    "collector",
    "column",
    "combinator",
    "compiler",
    "component",
    "container",
    "content",
    "controller",
    "core",
    "CSV",
    "cta",
    "customization",
    "cybernetics",
    "data",
    "datamodel",
    "DB",
    "devoops",
    "devops",
    "diagram",
    "DOM",
    "DRM",
    "drone",
    "DTO",
    "emailer",
    "engine",
    "entity",
    "exploit",
    "extensions",
    "fields",
    "firewall",
    "form",
    "foundation",
    "framework",
    "function",
    "funnel",
    "fusion",
    "GPGPU",
    "graph",
    "graphic",
    "hack",
    "heuristic",
    "hierarchy",
    "host",
    "hub",
    "interface",
    "integrator",
    "IP",
    "job",
    "JSON",
    "laser",
    "layer",
    "list",
    "logging",
    "logic",
    "Macro",
    "manifest",
    "map-reduce",
    "mesh",
    "middle-ware",
    "model",
    "module",
    "multiplexor",
    "namespace",
    "net",
    "network",
    "node",
    "object",
    "pager",
    "paradigm",
    "parser",
    "part",
    "persona",
    "pixels",
    "platform",
    "plugin",
    "property",
    "prototype",
    "proxy",
    "queue",
    "RAM",
    "RDBMS",
    "reactor",
    "registry",
    "reticulator",
    "RIA",
    "robot",
    "robots",
    "sdk",
    "server",
    "services",
    "sheet",
    "solver",
    "SPA",
    "spline",
    "stack",
    "structure",
    "style",
    "switch",
    "system",
    "tests",
    "theory",
    "thread",
    "tracker",
    "tracking",
    "UI",
    "unit tests",
    "up-time",
    "UX",
    "video",
    "vlogs",
    "vision",
    "vm",
    "vpn",
    "ware",
    "wiki",
    "XML",
    "Yaml",
];
function getTask() {
    return randomItem(taskParts) + " " + randomItem(taskParts2);
}
function LevelUp() {
    game.XP -= game.LevelUpXP;
    game.Level += 1;
    drawMessage(`Level Up! ${game.Level}🥑`);
    game.LevelUpXP = Inflate(game.Inflation, game.LevelUpXP);
    game.PointPrice = Inflate(game.Inflation, game.PointPrice);
    game.ProjectSize = Inflate(game.SmallInflation, game.ProjectSize);
    game.MaxAge += 5; //an extra 5 seconds is allowed for completing projects on each level;
    let items = game.AllLevelItems["l" + game.Level];
    if (items != undefined) {
        for (const item of items) {
            game.StoreItems[item.id].enabled = true;
        }
        addClass(".visitStore", "hint");
    }
    if (testMode) {
        for (let key of Object.keys(game.StoreItems)) {
            game.StoreItems[key].enabled = true;
            game.StoreItems[key].price = 5;
        }
    }
    if (game.TimeBarFeatureFlag) {
        //increase the chance of a project being time based.
        game.TimeBarChance = Math.min(100, game.TimeBarChance + 20);
    }
    if (game.TimeBarFeatureFlag == false &&
        game.Level > 7 &&
        game.HasInitiativeLevel > 1) {
        game.TimeBarFeatureFlag = true;
        game.TimeBarChance = 20;
    }
    switch (game.Level) {
        case 0:
            if (testMode && storeFeatureFlag) {
                removeClass(".visitStore", "hidden");
                addClass(".visitStore", "hint");
            }
            break;
        case 2:
            //show 'hire dev/tester/ba' buttons
            removeClass(".getPerson.dev", "hidden");
            addClass(".getPerson.dev", "hint");
            if (storeFeatureFlag) {
                removeClass(".visitStore", "hidden");
                addClass(".visitStore", "hint");
            }
            break;
        case 3:
            removeClass(".getPerson.test", "hidden");
            addClass(".getPerson.test", "hint");
            break;
        case 4:
            removeClass(".getPerson.ba", "hidden");
            addClass(".getPerson.ba", "hint");
            break;
        case 5:
            //TODO: Show modal message about timebars...
            // game.TimeBarFeatureFlag = true;
            break;
    }
}
//TODO: add this to game class
function incrementXP(amount) {
    if (game.Money < 0) {
        //You owe money? Then you don't get to grow your XP.
        // instead, you grow your debt! Mwuahahahaha.
        incrementMoney(amount * -2);
        return;
    }
    game.XP += amount;
    if (game.XP >= game.LevelUpXP) {
        //LEVEL UP!
        LevelUp();
    }
    game.TotalXP += amount;
    drawXP(game.XP, game.LevelUpXP, game.Level);
}
function Inflate(inflation, value) {
    let newValue = Math.floor(inflation * value);
    if (value == newValue)
        newValue++;
    return newValue;
}
function incrementPoints(amount) {
    game.LifeTimePoints += amount;
    game.PositivePointEvents.push({ amount: amount, when: new Date() });
}
// TODO: add this to game class
function incrementMoney(amount) {
    game.Money += amount;
    if (amount > 0) {
        game.LifeTimeRevenue += amount;
        let payment = { amount: amount, when: new Date() };
        game.PositiveCashFlows.push(payment);
    }
    if (game.Money >= game.HighestMoney) {
        game.HighestMoney = game.Money;
    }
    if (game.Money >= game.LeadPrice) {
        // re-enable project buy button
        $id("getLead").classList.remove("busy");
    }
    drawMoney(game.Money);
}
function visitPrivacy() {
    $id("startscreen").classList.add("hidden");
    $id("privacy").classList.remove("hidden");
    $id("message").classList.add("hidden");
    $id("aboutLink").classList.add("hidden");
    $id("helpLink").classList.add("hidden");
}
function leavePrivacy() {
    $id("privacy").classList.add("hidden");
    $id("startscreen").classList.remove("hidden");
    $id("message").classList.remove("hidden");
    $id("aboutLink").classList.remove("hidden");
    $id("helpLink").classList.remove("hidden");
}
function visitHelp() {
    if (game == null) {
        $id("startscreen").classList.add("hidden");
    }
    else {
        $id("store").classList.add("hidden");
        $id("office").classList.add("hidden");
    }
    $id("help").classList.remove("hidden");
    $id("message").classList.add("hidden");
    $id("aboutLink").classList.add("hidden");
    $id("helpLink").classList.add("hidden");
}
function visitAbout() {
    if (game == null) {
        $id("startscreen").classList.add("hidden");
    }
    else {
        $id("store").classList.add("hidden");
        $id("office").classList.add("hidden");
    }
    $id("about").classList.remove("hidden");
    $id("message").classList.add("hidden");
    $id("aboutLink").classList.add("hidden");
    $id("helpLink").classList.add("hidden");
}
function leaveHelp() {
    if (game == null) {
        $id("startscreen").classList.remove("hidden");
    }
    else {
        $id("office").classList.remove("hidden");
    }
    $id("help").classList.add("hidden");
    $id("message").classList.remove("hidden");
    $id("aboutLink").classList.remove("hidden");
    $id("helpLink").classList.remove("hidden");
}
function leaveAbout() {
    if (game == null) {
        $id("startscreen").classList.remove("hidden");
    }
    else {
        $id("office").classList.remove("hidden");
    }
    $id("about").classList.add("hidden");
    $id("message").classList.remove("hidden");
    $id("aboutLink").classList.remove("hidden");
    $id("helpLink").classList.remove("hidden");
}
function visitStore() {
    DeSelectDoerAndReceiver();
    removeClass(".visitStore", "hint");
    $id("aboutLink").classList.add("hidden");
    $id("helpLink").classList.add("hidden");
    //change title to 'DevStore'
    $("h1")[0].innerText = "DevStore";
    drawStore();
    $id("store").classList.remove("hidden");
    $id("storeMessage").classList.remove("hidden");
    $id("office").classList.add("hidden");
    $id("message").classList.add("hidden");
    drawStoreMessage("⭐ Welcome to the DevStore ⭐");
}
function visitHire() {
    DeSelectDoerAndReceiver();
    removeClass(".visitHire", "hint"); // .visitStore
    $id("aboutLink").classList.add("hidden");
    $id("helpLink").classList.add("hidden");
    //change title to 'New Hires' // DevStore'
    $("h1")[0].innerText = "New Hires";
    drawHires(); //drawStore();
    $id("hire").classList.remove("hidden"); // #store
    $id("hireMessage").classList.remove("hidden"); // #storeMessage
    $id("office").classList.add("hidden");
    $id("message").classList.add("hidden");
    //drawStoreMessage("⭐ Welcome to the DevStore ⭐");
    drawStoreMessage("⭐ Welcome to the Joy of Hiring ⭐");
}
function describe(itemId) {
    let item = game.StoreItems[itemId];
    if (!item.enabled) {
        // TODO: Until level X
        if (item.name.indexOf("OUT OF STOCK") != -1) {
            drawStoreMessage(`Sorry, ${item.name} ${item.icon} 😭`);
        }
        else {
            drawStoreMessage(`"${item.name} ${item.icon}" is not available until a higher level`);
        }
        return;
    }
    drawStoreMessage(`"${item.name} ${item.icon}" ${item.description}`);
}
function drawHires() {
    let hireList = $id("hires");
    // clear store items from #items
    hireList.innerText = "";
    // add store items to #items
    for (let key of Object.keys(game.toHire)) {
        let item = game.toHire[key];
        let shtml = getNewHireHtml(item);
        let newItem = htmlToElement(shtml);
        hireList.appendChild(newItem);
    }
}
function drawStore() {
    let itemList = $id("items");
    // clear store items from #items
    itemList.innerText = "";
    // add store items to #items
    for (let key of Object.keys(game.StoreItems)) {
        let item = game.StoreItems[key];
        let shtml = getStoreItemHtml(item);
        let newItem = htmlToElement(shtml);
        itemList.appendChild(newItem);
        let storeItemButton = $id(`store-button-${item.id}`);
        storeItemButton.addEventListener("click", () => purchase(item.id));
        let storeDescribeButton = $id(`describe-store-item-${item.id}`);
        storeDescribeButton.addEventListener("click", () => describe(item.id));
    }
}
function getNewHireHtml(item) {
    return `<div class='storeItem-catalog ${item.enabled ? "item-enabled" : "item-disabled"}' id='storeitem-${item.id}'><div class='button' id='hire-button-${item.id}'>${formatPrice(item.price)}</div><span class='hireIcon'>${item.icon}</span> <span id='describe-store-item-${item.id}' class='describe' title='more information'>❓</span><span class='item-name'>${item.name}</span></div>`;
}
function getStoreItemHtml(item) {
    return `<div class='storeItem-catalog ${item.enabled ? "item-enabled" : "item-disabled"}' id='storeitem-${item.id}'><div class='button' id='store-button-${item.id}'>${formatPrice(item.price)}</div><span class='storeIcon'>${item.icon}</span> <span id='describe-store-item-${item.id}' class='describe' title='more information'>❓</span><span class='item-name'>${item.name}</span></div>`;
}
function formatPrice(price) {
    if (price > 1000000000) {
        return "💲" + (price / 1000000000).toFixed(1) + "B";
    }
    if (price > 1000000) {
        return "💲" + (price / 1000000).toFixed(1) + "M";
    }
    if (price > 1000) {
        return "💲" + (price / 1000).toFixed(1) + "K";
    }
    return "💲" + String(price);
}
function leaveStore() {
    DeSelectDoerAndReceiver();
    $id("store").classList.add("hidden");
    $id("office").classList.remove("hidden");
    $id("storeMessage").classList.add("hidden");
    $id("message").classList.remove("hidden");
    $id("aboutLink").classList.remove("hidden");
    $id("helpLink").classList.remove("hidden");
    // change title back to 'DevShop'
    $("h1")[0].innerText = "DevShop";
}
function purchase(itemId) {
    let item = game.StoreItems[itemId]; //.filter(i => i.id == itemId)[0];
    if (!item.enabled) {
        // TODO: Until level X
        if (item.name.indexOf("OUT OF STOCK") != -1) {
            drawStoreMessage(`Sorry, ${item.name} ${item.icon} 😭`);
        }
        else {
            drawStoreMessage(`"${item.name} ${item.icon}" is not available until a higher level`);
        }
        console.log(item);
        return;
    }
    if (game.Money < item.price) {
        drawStoreMessage(`You cannot afford the ${item.name} ${item.icon} for 💲${item.price}`);
        return;
    }
    incrementMoney(item.price * -1);
    // Add a shallow clone of the item (not the item itself)
    let clone = Object.assign({}, item);
    clone.id = nextId();
    if (clone.code == ItemCode.dog) {
        clone.icon = randomItem(dogIcons);
        clone.name = randomItem(dogNames);
    }
    if (clone.code == ItemCode.cat) {
        clone.icon = randomItem(catIcons);
        clone.name = randomItem(catNames);
    }
    game.Items["i" + clone.id] = clone;
    drawStoreMessage(`You bought ${clone.name} ${clone.icon} for 💲${clone.price}. Nice!`);
    // Every time you purchase an item, the price of that item goes up
    // consider: some specific items should have a different inflation curve.
    item.price = Inflate(game.MediumInflation, item.price);
    // todo: make this a feature of the store, rather than a special case of the buybot.
    if (item.code == ItemCode.buyBot) {
        item.name = item.name + " OUT OF STOCK";
        item.enabled = false;
        //refresh the item
        let html = getStoreItemHtml(item);
        $id(`storeitem-${item.id}`).outerHTML = html;
        let storeItemButton = $id(`store-button-${item.id}`);
        storeItemButton.addEventListener("click", () => purchase(item.id));
        let describeStoreItem = $id(`describe-store-item-${item.id}`);
        describeStoreItem.addEventListener("click", () => describe(item.id));
    }
    drawInboxItem("i" + clone.id, clone);
    //Show the adjusted price
    $id("store-button-" + itemId).innerText = `💲${item.price}`;
}
//never use this ;)
function jalert(obj) {
    alert(JSON.stringify(obj));
}
function log(message) {
    if (debugOutput) {
        let m = htmlToElement(`<div>${message}</div>`);
        $id("debug").appendChild(m);
    }
    console.log(message);
}
let mainIntervalId;
function startMainLoop() {
    mainIntervalId = setInterval(mainLoop, 1000);
}
function stopMainLoop() {
    clearInterval(mainIntervalId);
}
function mainLoop() {
    //detect age of cards.
    //nah -- just update the timebars.
    if (game.TimeBarFeatureFlag) {
        drawTimebars(game.Stories);
        trackIncome();
    }
}
function trackIncome() {
    let now = new Date();
    //how long has the game been going?
    let gameAge_s = Math.floor(Math.abs(game.StartTime.getTime() - now.getTime()) / 1000);
    if (gameAge_s > 60) {
        let OneMinuteAgo = new Date(now.getTime() - 60000);
        let toRemove = [];
        //remove any incomes from start of
        for (let x of game.PositiveCashFlows) {
            if (x.when > OneMinuteAgo)
                break;
            game.LifeTimeRevenueMinus1Minute += x.amount;
            toRemove.push(x);
        }
        game.PositiveCashFlows = game.PositiveCashFlows.filter((item) => !toRemove.includes(item));
        toRemove = [];
        for (let x of game.PositivePointEvents) {
            if (x.when > OneMinuteAgo)
                break;
            game.LifeTimePointsMinus1Minute += x.amount;
            toRemove.push(x);
        }
        game.PositivePointEvents = game.PositivePointEvents.filter((item) => !toRemove.includes(item));
    }
    let sixtySecondIncome = game.LifeTimeRevenue - game.LifeTimeRevenueMinus1Minute;
    let sixtySecondPoints = game.LifeTimePoints - game.LifeTimePointsMinus1Minute;
    $id("rate").innerText = `(${sixtySecondPoints}📍/min)`;
}
/*

// Save
localStorage.setItem('game', JSON.stringify(game));

// Load
game = JSON.parse(localStorage.getItem('game')); drawRoom();

*/
function loadmenu() {
    $id("startscreen").classList.add("hidden");
    $id("loadscreen").classList.remove("hidden");
    drawLoadScreen();
}
function exitloadmenu() {
    $id("loadscreen").classList.add("hidden");
    $id("startscreen").classList.remove("hidden");
}
function drawLoadScreen() {
    let gamesJson = localStorage.getItem("games");
    let games = JSON.parse(gamesJson);
}
function WireupButtons() {
    $id("exitload").addEventListener("click", exitloadmenu);
    $id("start").addEventListener("click", go);
    $id("loadmenu").addEventListener("click", loadmenu);
    $id("privacyLink").addEventListener("click", visitPrivacy);
    $id("closeHelp").addEventListener("click", leaveHelp);
    $id("closeHelp2").addEventListener("click", leaveHelp);
    $id("closeAbout").addEventListener("click", leaveAbout);
    $id("closeAbout2").addEventListener("click", leaveAbout);
    $id("closePrivacy").addEventListener("click", leavePrivacy);
    $id("closePrivacy2").addEventListener("click", leavePrivacy);
    $id("getLead").addEventListener("click", getNewLead);
    $id("getdev").addEventListener("click", () => getNewPerson("dev"));
    $id("gettest").addEventListener("click", () => getNewPerson("test"));
    $id("getba").addEventListener("click", () => getNewPerson("ba"));
    $id("visitStore").addEventListener("click", visitStore);
    $id("closeStore").addEventListener("click", leaveStore);
    $id("aboutLink").addEventListener("click", visitAbout);
    $id("helpLink").addEventListener("click", visitHelp);
}
WireupButtons();
