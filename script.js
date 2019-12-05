// *******************************************************
// ** Pull requests not actually welcome at this moment **
// *******************************************************
// as described in the readme, I may take this commercial, and haven't thought through the implications of accepting PRs on it prior to that. 
// Ordinarily I'd *love* to welcome PR's but for now, no PR's please.
// Definitely
// [ ] headphone "LEVEL"
// [x] refactor selfstart to initiative
// [ ] Microdose lsd in store: shadertoy.com effects -- or other animated bg effects. 
// [ ] seasonal mods: st patricks day whiskey/green beer. halloween products 🎃 🦇. xmas items 🎄 🎅. thanksgiving turkey 🦃 valentines 💟; 
// [ ] chaos monkey 🐒
// [x] size of +/- on iphone
// [ ] place limit on all columns
// [ ] statting limit should be the value of a new project / 2
// [ ] defer: Once limits are enabled: - detect + and - (plus and minus) keys and use them to alter limits... (this would only work if the limits were only on one columns)
// [ ] height of buttons at top must be consistent. Table layout maybe?
// [ ] sorting workers
// [ ] ?? ? requires a notification modal. 😡
//   modal: Some projects are time critical. You get a bonus for completing them early. Notice the green bar on their right edge: that's the count down.
//   ? also could show a modal near the start "So much rework needed... visit the store to upskill your team members"
// [ ] populate load screen
// [ ] about screen (content)
// [ ] join mailing list functionality joinemail
// [ ] privacy policy content -- mailing list, google analytics
// [ ] How to exit the game, and when/how to save.
//  ?  Your high scores?
//  ?  Time Challenge
// [ ] add google analytics
// [ ] size on ipad: too wide. why?
// [x] 🐛Words wrap in store
// [ ] 🐛Icons and help icon are not vertically centered in store (other content is not either)
// [ ] Multi-skilled person choosing task to do could be based on: 
//        total number of points in a column divided by number of people with that skill. 
//        Worst ratio? Do that next. In case of tie-break, go with right most column.
//        No -- if any are worse than the threshold -- do the worst.
//        if all are better than the threshold, choose from the right.
// [ ] show (but disabled) buy dev / buy tester button when first starting
// [ ] keybinding -- letters to people
// [ ] keybinding -- multiple presses of a number will cycle through the cards in that column
// [no] Consider: have a slow loop that checks if any one with selfStart who is not selected or busy has a triggerTime that's stale by > 2* maxtriggertime and if so call 'trySelfStart'
// [ ] more technical names for tasks
// [ ] add to store:
//  - Games console 🕹
//  - Deluxe Games console 🎮
//  - Desk A/C ❄
//  - pingpong table 🏓
//  - cityscape at dusk 🌆
// [ ] front page:
// -> Start
// -> (later: Resume  -- saved games)
// -> About -> link to wiki that describes each item in the store.
// -> Mailing List [________: Join ] __privacy policy__
// -> game itself needs a way to exit then.
// fire people?
// limited people?
// 
var testMode = false; //true;
var storeFeatureFlag = true; //testMode;
//let timeBarFeatureFlag = false;
var timePenaltyFeatureFlag = true;
var debugOutput = false;
var game;
// basic test modes
testMode = (testMode || getParameterByName('testmode') == "true");
var avgDuration = testMode ? 4 : 600; // factor that all work durations are based on, in milliseconds
var startingMoney = testMode ? 100 : 100;
var defaultCompletionTime = testMode ? 10 : 100; //how long have you got to complete a project, in seconds?
debugOutput = (debugOutput || testMode || getParameterByName('debug') == "true");
var privacy = (getParameterByName('privacy') == "true");
var hashLocation = window.location.hash.substr(1);
privacy = privacy || (hashLocation == 'privacy');
if (privacy) {
    visitPrivacy();
}
// basic feature flags  
//timeBarFeatureFlag = (timeBarFeatureFlag || getParameterByName('timebarflag') == "true"); //?timebarflag=true
storeFeatureFlag = (storeFeatureFlag || getParameterByName('storeflag') == "true"); //?storeflag=true
if (debugOutput) {
    $id('debug').classList.remove('hidden');
    log('debug mode detected');
}
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
    ItemCode[ItemCode["coffeemachine"] = 9] = "coffeemachine";
    ItemCode[ItemCode["donutmachine"] = 10] = "donutmachine";
    ItemCode[ItemCode["cupcake"] = 11] = "cupcake";
    ItemCode[ItemCode["donut"] = 12] = "donut";
    ItemCode[ItemCode["pizza"] = 13] = "pizza";
    ItemCode[ItemCode["banana"] = 14] = "banana";
    ItemCode[ItemCode["toast"] = 15] = "toast";
    ItemCode[ItemCode["keyboard"] = 16] = "keyboard";
    ItemCode[ItemCode["x_bafortest"] = 17] = "x_bafortest";
    ItemCode[ItemCode["x_bafordev"] = 18] = "x_bafordev";
    ItemCode[ItemCode["x_testforba"] = 19] = "x_testforba";
    ItemCode[ItemCode["x_testfordev"] = 20] = "x_testfordev";
    ItemCode[ItemCode["x_devforba"] = 21] = "x_devforba";
    ItemCode[ItemCode["x_devfortest"] = 22] = "x_devfortest";
    ItemCode[ItemCode["poster"] = 23] = "poster";
    ItemCode[ItemCode["crystalball"] = 24] = "crystalball";
    ItemCode[ItemCode["statue"] = 25] = "statue";
    ItemCode[ItemCode["statue2"] = 26] = "statue2";
    ItemCode[ItemCode["cookie"] = 27] = "cookie";
    ItemCode[ItemCode["headphones"] = 28] = "headphones";
    ItemCode[ItemCode["deskplant"] = 29] = "deskplant";
    ItemCode[ItemCode["cactus"] = 30] = "cactus";
    ItemCode[ItemCode["buybot"] = 31] = "buybot";
})(ItemCode || (ItemCode = {}));
function getAllLevelItems() {
    //These are the items that become available in the store at each level.
    // Note that skillneeded includes the special value "any" which means it can be applied to any person.
    // TODO: ?? There could be a 'must not have skill' property... e.g. Beginning Development (only for non-developers)
    //The 'code' property is used in `function useIt` to decide how the card affects the player.
    var allItems = { "l2": //Level 2 Items
        [{ id: 5, name: 'Tasty donut', price: 5, icon: "🍩", skillneeded: "any", busy: false, code: ItemCode.donut, activeDuration: 30, description: 'A sugary fix will speed you up... but not for long.', enabled: false },
            { id: 10, name: 'Cup of coffee', price: 10, icon: "☕", skillneeded: "any", busy: false, code: ItemCode.coffee, activeDuration: 60, description: 'A cup of joe will speed up any worker …if only for a little while.', enabled: false },
        ],
        "l3": //Level 3 Items
        [{ id: 20, name: 'Upskill Developer: Efficiency Development Series', price: 120, icon: "📗", skillneeded: "dev", busy: false, code: ItemCode.upskillDev, activeDuration: 0, description: 'Already a developer? This advanced training course will reduce the number of bugs you create.', enabled: false },
        ],
        "l4": [
            { id: 50, name: 'Upskill Tester: Fast and Thorough Book Series', price: 80, icon: "📘", skillneeded: "test", busy: false, code: ItemCode.upskillTest, activeDuration: 0, description: 'Already a tester? Be a better tester!', enabled: false },
            { id: 80, name: 'Pizza', price: 50, icon: "🍕", skillneeded: "any", busy: false, code: ItemCode.pizza, activeDuration: 180, description: 'Food can trap your workers in the office by giving them no reason to leave.', enabled: false },
            { id: 100, name: '⭐ Initiative Training ⭐', price: 500, icon: "🚀", skillneeded: "any", busy: false, code: ItemCode.initiative, activeDuration: 0, description: 'When you\'re idle, go and check the board to see if there is anything you can do. Purchase multiple times to show initiative sooner!', enabled: false },
        ],
        "l5": [
            { id: 105, name: 'Upskill BA: Powerful communication book series', price: 70, icon: "📕", skillneeded: "ba", busy: false, code: ItemCode.upskillBA, activeDuration: 0, description: 'Improves your Business Analysis Skills, for faster better work!', enabled: false },
            { id: 110, name: 'Banana', price: 25, icon: "🍌", skillneeded: "any", busy: false, code: ItemCode.banana, activeDuration: 50, description: 'This healthy snack gives a short-lived energy boost', enabled: false },
            { id: 130, name: 'Cupcake', price: 100, icon: "🧁", skillneeded: "any", busy: false, code: ItemCode.cupcake, activeDuration: 25, description: 'A cupcake to enjoy. Increase motivation, but not for long.', enabled: false },
            { id: 140, name: 'Mechanical keyboard upgrade', price: 300, icon: "⌨", skillneeded: "any", busy: false, code: ItemCode.keyboard, activeDuration: 0, description: 'This mechanical keyboard upgrade will boost your speed at every task.', enabled: false },
        ],
        "l6": [
            { id: 150, name: 'Seat upgrade', price: 400, icon: "💺", skillneeded: "any", busy: false, code: ItemCode.seat, activeDuration: 0, description: 'A comfortable seat upgrade makes any worker more efficient.', enabled: false },
            { id: 155, name: 'Headphone upgrade', price: 700, icon: "🎧", skillneeded: "any", busy: false, code: ItemCode.headphones, activeDuration: 0, description: 'With better headphones a person\'s focus is greatly improved!', enabled: false },
        ],
        "l7": [
            { id: 160, name: 'Office dog', price: 6000, icon: "🐶", skillneeded: "any", busy: false, code: ItemCode.dog, activeDuration: 200, description: 'Bring joy and efficiency to the workplace. Care for a dog and double your speed', enabled: false },
        ],
        "l8": [
            { id: 170, name: 'Piece of Toast', price: 10, icon: "🍞", skillneeded: "any", busy: false, code: ItemCode.toast, activeDuration: 35, description: 'It\'s a piece of toast. How much could it be?', enabled: false },
        ],
        "l9": [
            { id: 175, name: 'Office cat', price: 5000, icon: "🐱", skillneeded: "any", busy: false, code: ItemCode.cat, activeDuration: 200, description: 'This friendly feline will vastly improve the quality of one person\'s work at a time.', enabled: false },
            { id: 177, name: 'Buy-Bot', price: 21000, icon: "🤖", skillneeded: "any", busy: false, code: ItemCode.buybot, activeDuration: 0, description: 'A robot at your desk! The buy-bot buys new projects for you (unless the backlog is over its limit)', enabled: false },
        ],
        "l10": [
            { id: 180, name: 'Coffee Machine', price: 4000, icon: "⛽", skillneeded: "any", busy: false, code: ItemCode.coffeemachine, activeDuration: 0, description: 'A coffee machine at your desk, your performance will be irreparably improved.', enabled: false },
        ],
        "l11": [
            { id: 200, name: 'Inspirational poster', price: 30000, icon: "🌄", skillneeded: "any", busy: false, code: ItemCode.poster, activeDuration: 0, description: 'Enhance your cubicle and improve your concentration.', enabled: false },
        ],
        "l12": [
            { id: 220, name: 'Desk plant', price: 502, icon: "🌳", skillneeded: "any", busy: false, code: ItemCode.deskplant, activeDuration: 0, description: 'Beautiful desk plant improves the workplace and decreases your error rate.', enabled: false },
        ],
        "l13": [
            { id: 225, name: 'Donut Machine', price: 31000, icon: "🏭", skillneeded: "any", busy: false, code: ItemCode.donutmachine, activeDuration: 0, description: 'It is possibly unwise to have a donut machine at your desk. Sugar is a hell of a drug.', enabled: false },
        ],
        "l14": [],
        "l15": [
            { id: 250, name: 'Mystical Statue', price: 40000, icon: "🗿", skillneeded: "any", busy: false, code: ItemCode.statue2, activeDuration: 0, description: 'Mystical statue improves your workplace.', enabled: false },
        ],
        "l16": [],
        "l17": [
            { id: 270, name: 'Desk cactus', price: 2000, icon: "🌵", skillneeded: "any", busy: false, code: ItemCode.cactus, activeDuration: 0, description: 'A desk cactus has been scientifically proven to have no impact on your productivity at all. But it\'s cool.', enabled: false },
        ],
        "l18": [
            { id: 300, name: 'Awe inspiring statue', price: 80000, icon: "🗽", skillneeded: "any", busy: false, code: ItemCode.statue, activeDuration: 0, description: 'Can this statue fill your workplace with wonder, joy and hard work?', enabled: false },
        ],
        "l19": [],
        "l20": [],
        "l21": [
            { id: 350, name: 'Crystal ball', price: 1000000, icon: "🔮", skillneeded: "any", busy: false, code: ItemCode.crystalball, activeDuration: 0, description: 'This crystal ball does not tell the future, but it\'s a nice desk ornament.', enabled: false },
        ],
        "l100": [
            { id: 900, name: 'A cookie', price: 1, icon: "🍪", skillneeded: "any", busy: false, code: ItemCode.cookie, activeDuration: 20, description: 'It\'s a cookie', enabled: false },
        ]
    };
    return allItems;
}
function getAllPeopleTypes() {
    return {
        "dev": { skill: "dev", price: 120, icon: "💻", title: "dev" },
        "test": { skill: "test", price: 150, icon: "🔬", title: "tester" },
        "ba": { skill: "ba", price: 250, icon: "🗣", title: "business analyst" }
    };
}
// REMINDER....
// *******************************************************
// ** Pull requests not actually welcome at this moment **
// *******************************************************
// as described in the readme (and above), I may take this commercial, and haven't thought through the implications of accepting PRs on it prior to that. 
// Ordinarily I'd *love* to welcome PR's but for now, no PR's please.
var Game = /** @class */ (function () {
    function Game(startingMoney) {
        this.Money = startingMoney;
        this.HighestMoney = startingMoney;
        this.Inflation = testMode ? 1.3 : 1.3; // 30 %
        this.SmallInflation = testMode ? 1.05 : 1.05; // 5 %
        this.MediumInflation = testMode ? 1.10 : 1.10; // 10 %
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
        for (var k in this.AllLevelItems) {
            for (var x in this.AllLevelItems[k]) {
                this.StoreItems[this.AllLevelItems[k][x].id] = this.AllLevelItems[k][x];
            }
        }
        //this.StoreItems =  getAllLevelitems().each()
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
        this.ColumnLimits = { "ba": -1, "dev": -1, "dev0": -1, "test": -1 }; //-1 means "there is no limit/do not display a limit"
        this.TimeBarFeatureFlag = false;
        this.TimeBarChance = 0; // % chance of project being Time sensitive (having a max age)
        this.HasInitiativeLevel = 0;
        this.FirstTimeSensitiveProject = false;
    }
    return Game;
}());
var Story = /** @class */ (function () {
    function Story(status, skillneeded, summary, project) {
        this.init();
        this.status = status;
        this.skillneeded = skillneeded;
        this.summary = summary;
        if (project != null) {
            this.projectId = 'r' + project.id;
            this.startingTime = project.startingTime;
            this.maxAge = project.maxAge;
            this.pointPrice = project.pointPrice;
            this.logo = project.logo;
        }
    }
    Story.prototype.init = function () {
        this.id = nextId();
        this.points = game.ProjectSize;
        this.pointPrice = game.PointPrice;
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
    };
    return Story;
}());
var Project = /** @class */ (function () {
    function Project(lead) {
        this.stories = []; //storyid's of the subsequent stories created by the BA (start with 'r')
        this.lead = lead;
        this.stories = [];
    }
    return Project;
}());
function initGameState() {
    game = new Game(startingMoney);
    var allSkills = {
        "dev": { level: 1 },
        "test": { level: 1 },
        "ba": { level: 1 }
    };
    var player = {
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
        buyBotLevel: 0
    };
    game.People['p' + player.id] = player;
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
    var getLead = $id('getLead');
    getLead.innerHTML = "\uD83C\uDF81 find project (\uD83D\uDCB2" + game.LeadPrice + ")";
    for (var _i = 0, _a = Object.entries(game.AllPeopleTypes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var d = $id("get" + value.skill);
        if (d != undefined) {
            d.innerHTML = "<span class='icon'>" + value.icon + "</span> hire " + value.title + " (\uD83D\uDCB2" + value.price + ")";
            d.setAttribute('onclick', "getNewPerson(\"" + value.skill + "\");");
        }
    }
}
function drawMoney(money) {
    var s = document.getElementById('money');
    if (money < 0) {
        s.classList.add("negative");
    }
    else {
        s.classList.remove("negative");
    }
    s.innerText = "💲" + money;
}
function drawXP(xp, levelUpXP, level) {
    var s = document.getElementById('xp');
    if (xp < 0) {
        s.classList.add("negative");
    }
    else {
        s.classList.remove("negative");
    }
    s.innerText = "" + xp + "/" + levelUpXP + "🥓";
    var s2 = document.getElementById('level');
    s2.innerText = "" + level + "🥑";
}
function removeStory(key) {
    var el = document.getElementById('kanbanboard');
    var s = el.querySelector('#' + key);
    var column = s.parentNode.parentNode.id;
    s.parentNode.removeChild(s);
    updateColumnCount(column);
}
function drawTimebar(target, key, story) {
    if (target != null) {
        var percent = 100 - Math.min(100, getTenthsOfTimeElapsed(story) * 10);
        var bg = "red";
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
}
function drawStory(key, stories, top) {
    var el = document.getElementById('kanbanboard');
    var s = el.querySelector('#' + key);
    var avatar = "";
    var busy = "";
    var story = stories[key];
    if (story.icon != undefined) {
        avatar = "<span class='avatar'>" + story.icon + "</span>";
    }
    var logo = "<span class='logo'>" + story.logo + "</span>";
    if (debugOutput) {
        logo += "<span class='secrets'>" + (story.hasBug ? "🐛" : "") + (story.hasSpecBug ? "💥" : "") + "</span>";
    }
    if (story.busy) {
        busy = " busy";
    }
    var selected = "";
    if (game.SelectedReceiver == key) {
        selected = " selected";
    }
    if (isPossible(story)) {
        selected = " possible";
    }
    var points = "<span class='points'>" + story.points + "</span>";
    // if the story is done, don't add a click handler.
    var handler = story.skillneeded == "done" ? "" : "onclick='clickReceiver(\"" + key + "\");'";
    var timebar = story.maxAge > 0 ? generateTimebarHtml(story) : "";
    var shtml = "<span class='story receiver " + story.skillneeded + busy + selected + "' id='" + key + "' " + handler + "><span class='story-detail'>" + logo + " " + story.summary + "</span>" + avatar + points + timebar + "</span>";
    if (s != null) {
        s.outerHTML = shtml;
    }
    else {
        var column = el.querySelector("td#" + story.skillneeded + " .inner");
        var newstory = htmlToElement(shtml);
        if (top) {
            column.insertBefore(newstory, column.firstChild);
        }
        else {
            column.appendChild(newstory);
        }
    }
    if (game.TimeBarFeatureFlag && story.maxAge != -1) {
        var target = el.querySelector('#' + key + " .time-bars .elapsed");
        drawTimebar(target, key, story);
    }
    updateColumnCount(story.skillneeded);
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
    var age_s = projectAge_s(story);
    //we will draw a total of 5 bars, so tenths are what matters.
    var maxAge_seconds = story.maxAge;
    return Math.floor(age_s / (maxAge_seconds / 10));
}
function generateTimebarHtml(story) {
    return "<div class='time-bars'><span class='elapsed'></span></div>";
}
function updateColumnCount(column) {
    var target = $('#' + column + ' .inner .count');
    var limit = game.ColumnLimits[column];
    if (target && target.length == 1) {
        var points = 0;
        for (var _i = 0, _a = $('#' + column + ' .inner .story .points'); _i < _a.length; _i++) {
            var s = _a[_i];
            //s.innerText;
            points += Number(s.innerText);
        }
        var cardCount = $('#' + column + ' .inner .story').length;
        if (limit != null && limit != -1) {
            target[0].innerHTML = "<span class='up' onclick='updateColumnLimit(\"" + column + "\",1);'>\u2795</span>" + points + "/" + limit + "\uD83D\uDCCD<span class='dn' onclick='updateColumnLimit(\"" + column + "\",-1);'>\u2796</span>";
            target[0].classList.add("limited");
            target[0].setAttribute('title', cardCount + " stories worth " + points + " points, with a soft limit of " + limit + " points.");
        }
        else {
            target[0].innerHTML = points + "\uD83D\uDCCD";
            target[0].setAttribute('title', cardCount + " stories worth " + points + " points");
        }
        target[0].setAttribute('data-count', '' + cardCount);
        // consider: check the number of people who have this skill. 
        //If the count > (#people) make the color yellowish;
        //if the count > (#people * 2 + 2) make the color redish;
    }
}
function updateColumnLimit(column, delta) {
    var value = game.ColumnLimits[column];
    value += delta;
    if (value >= 0) { //even limits have limits
        game.ColumnLimits[column] = value;
        updateColumnCount(column);
    }
}
function drawStories(stories) {
    for (var key in stories) {
        drawStory(key, stories, stories[key].reworkLevel > 0);
    }
}
function drawTimebars(stories) {
    var el = document.getElementById('kanbanboard');
    for (var key in stories) {
        // only applies to stories that *have* a max age (-1 means, none)
        if (stories[key].maxAge != -1) {
            var target = el.querySelector('#' + key + " .time-bars .elapsed");
            drawTimebar(target, key, stories[key]);
        }
    }
}
function drawInboxItem(key, item) {
    var el = $id('kanbanboard');
    var s = el.querySelector('#' + key);
    var shtml = "<span class='storeItem receiver " + item.skillneeded + "' id='" + key + "' onclick=\"clickReceiver('" + key + "');\"><span class='storeitem-icon'>" + item.icon + "</span> " + item.name + "</span>";
    if (s != null) {
        s.outerHTML = shtml;
    }
    else {
        var column = el.querySelector("td#ba .inner");
        var newInboxItem = htmlToElement(shtml);
        // put it at the top of the inbox column (the 'ba' column)
        column.insertBefore(newInboxItem, column.firstChild);
    }
}
function drawPerson(key, people) {
    var el = document.getElementById('people');
    var p = el.querySelector('#' + key);
    //if the person is listed in #id already then update it.
    var newPerson = true;
    if (p != null) {
        newPerson = false;
    }
    var busy = "";
    var person = people[key];
    if (person.busy) {
        busy = " busy";
    }
    var skillsDiv = getSkillsDiv(person.skills);
    var itemsHtml = getItemsHtml(person);
    var selected = game.SelectedDoer == ('p' + person.id) ? " selected" : "";
    //TODO: possible?
    var possible = isPossiblePerson(person) ? " possible" : "";
    var phtml = "<span class='person doer" + busy + selected + possible + "' id='" + key + "' onclick='clickDoer(\"" + key + "\");'><span class='avatar2'>" + person.avatar + "</span><div class='name'>" + person.name + "</div>" + skillsDiv + " " + itemsHtml + "<div class='summary'>" + person.summary + "</div></span>";
    var newPersonElement = htmlToElement(phtml);
    for (var _i = 0, _a = Object.keys(person.skills); _i < _a.length; _i++) {
        var key_1 = _a[_i];
        newPersonElement.classList.add(key_1);
    }
    if (newPerson) {
        el.appendChild(newPersonElement);
    }
    else {
        p.outerHTML = newPersonElement.outerHTML;
    }
}
function getItemsHtml(person) {
    //was: return = Object.keys(items).map(k => items[k].icon).join(" ");
    var result = '';
    for (var _i = 0, _a = Object.keys(person.has); _i < _a.length; _i++) {
        var itemKey = _a[_i];
        var item = person.has[itemKey];
        var levelAttribute = '';
        if (item.code == ItemCode.seat)
            levelAttribute = " data-level='" + (person.seatLevel > 9 ? "∞" : person.seatLevel) + "'";
        if (item.code == ItemCode.initiative)
            levelAttribute = " data-level='" + (person.initiativeLevel > 9 ? "∞" : person.initiativeLevel) + "'";
        if (item.code == ItemCode.keyboard)
            levelAttribute = " data-level='" + (person.keyboardLevel > 9 ? "∞" : person.keyboardLevel) + "'";
        result += "<span class='icon'" + levelAttribute + ">" + item.icon + "</span>";
    }
    if (result === '')
        return result;
    return "<div class='itemList'>" + result + "</div>";
}
function getSkillsDiv(skills) {
    var result = "";
    for (var _i = 0, _a = Object.entries(skills); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var s1 = "";
        switch (key) {
            case "dev":
                s1 = "<span class='skill dev dev-" + value.level + "' data-level='" + (value.level > 9 ? "∞" : value.level) + "' title='developer'>\uD83D\uDCBB</span>";
                break;
            case "test":
                s1 = "<span class='skill test test-" + value.level + "' data-level='" + (value.level > 9 ? "∞" : value.level) + "' title='tester'>\uD83D\uDD2C</span>";
                break;
            case "ba":
                s1 = "<span class='skill ba ba-" + value.level + "' data-level='" + (value.level > 9 ? "∞" : value.level) + "' title='business analyst'>\uD83D\uDDE3</span>";
                break;
        }
        result += s1;
    }
    return "<div class='skills'>" + result + "</div>";
}
function drawPeople(people) {
    for (var key in people) {
        drawPerson(key, people);
    }
}
function go() {
    initGameState();
    drawRoom();
    $id('start').classList.remove("pulse"); //hide 'start' button's pulse effect. 
    $id('start').classList.add("hidden"); //hide 'start' button
    //removeClass('#office', 'hidden');
    $id('startscreen').classList.add('hidden');
    $id('office').classList.remove('hidden');
    removeClass('#getLead', 'hidden'); //show 'purchase sales lead' button
    removeClass('.metrics', 'hidden'); // show heads up display.
    if (!game.TimeBarFeatureFlag)
        $id('rate').classList.add('hidden');
    addClass(".getPerson", 'hidden'); //hide 'buy dev/test/ba' buttons. (They are re-enabled when total >= 300)
    drawMessage("STEP 1: press '🎁 find project'");
    startMainLoop();
}
function getNewLead() {
    DeSelectDoerAndReceiver();
    var price = game.LeadPrice;
    if (game.Money < 0) {
        drawMessage("Will need to go FURTHER into debt to get this lead. 😫");
    }
    else if (game.Money < price) {
        drawMessage("Will need to go into debt to get this lead. 😢");
    }
    incrementMoney(price * -1);
    incrementXP(5);
    // TODO: story should be created by a constructor on story
    var newLead = new Story("lead", "ba", projectName(), null);
    /*{
        id: nextId(),
        points:game.ProjectSize,
        pointPrice:game.PointPrice,
        status:"lead",
        skillneeded:"ba",
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
        drawMessage("STEP 2: Click the project " + newLead.logo + ", then click the " + game.People["p1"].avatar + " Founder (or vice-versa)");
    }
    game.Stories['r' + newLead.id] = newLead;
    drawStory('r' + newLead.id, game.Stories, false);
    game.LeadPrice = Inflate(game.SmallInflation, game.LeadPrice);
    var roi = (game.ProjectSize * game.PointPrice * 1.5) / game.LeadPrice;
    if (roi < 2 || roi > 4.5) {
        log("Roi was " + roi + ", from: return = " + Math.floor(game.ProjectSize * game.PointPrice * 1.5) + ", investment = " + game.LeadPrice + "... so it has been adjusted.");
        game.LeadPrice = Math.floor((game.ProjectSize * game.PointPrice * 1.5) / 2.5);
    }
    else {
        log("Roi is " + roi);
    }
    drawButtons();
}
function DeSelectDoerAndReceiver() {
    deselectDoer();
    deselectReceiver();
}
function getNewPerson(skill) {
    DeSelectDoerAndReceiver();
    var personType = game.AllPeopleTypes[skill];
    if (game.Money < personType.price) {
        drawMessage("Cannot afford a new " + personType.title + ".");
        return;
    }
    removeClass('.getPerson.' + skill, 'hint');
    incrementMoney(personType.price * -1);
    incrementXP(10);
    var id = nextId();
    var skillo = {};
    skillo[skill] = { level: 1 };
    var newEmployee = {
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
        buyBotLevel: 0
    };
    game.People['p' + id] = newEmployee;
    drawPerson('p' + id, game.People);
    // Every time you hire a person the price for that type inflates by a LOT.
    personType.price = Inflate(game.HyperInflation, personType.price);
    drawButtons();
}
function clickFirstAvailableCard(column) {
    var columnCards = $("#" + column + " .inner .receiver:not(.busy)");
    if (columnCards && columnCards.length > 0) {
        clickReceiver(columnCards[0].id);
    }
}
document.onkeypress = function (e) {
    switch (e.key) {
        case "1":
            clickFirstAvailableCard('ba');
            break;
        case "2":
            clickFirstAvailableCard('dev');
            break;
        case "3":
            break;
        case "4":
            clickFirstAvailableCard('test');
            break;
        case "5":
            break;
    }
};
function isPossible(story) {
    if (story.busy)
        return false;
    if (game.SelectedDoer != undefined && game.SelectedDoer != null) {
        if (story.skillneeded == "any")
            return true;
        console.log("skillneeded", story.skillneeded);
        var skills = game.People[game.SelectedDoer].skills;
        console.log(skills);
        if (Object.keys(skills).includes(story.skillneeded)) {
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
        var receiver = game.Stories[game.SelectedReceiver] || game.Items[game.SelectedReceiver];
        if (receiver.skillneeded == "any")
            return true;
        if (Object.keys(person.skills).includes(receiver.skillneeded))
            return true;
    }
    return false;
}
function updatePossible() {
    if (game.SelectedDoer != undefined && game.SelectedDoer != null) {
        //As a 'doer' -- highlight everything I can do.  (where not busy)
        var skills = game.People[game.SelectedDoer].skills;
        //for(const skill of game.People[game.SelectedDoer].skills) {
        for (var _i = 0, _a = Object.keys(skills); _i < _a.length; _i++) {
            var key = _a[_i];
            addClass("." + key + ".receiver:not(.busy)", 'possible');
        }
        addClass(".any.receiver:not(.busy)", 'possible');
    }
    // As a 'receiver' -- highlight everything that can do this (where not busy)
    if (game.SelectedReceiver != undefined && game.SelectedReceiver != null) {
        var receiver = game.Stories[game.SelectedReceiver] || game.Items[game.SelectedReceiver];
        if (receiver.skillneeded == "any") {
            addClass(".doer:not(.busy)", 'possible');
        }
        else {
            //alert(receiver.skillneeded);
            addClass("." + receiver.skillneeded + ".doer:not(.busy)", 'possible');
        }
    }
}
function deselectDoer() {
    if (game.SelectedDoer == undefined || game.SelectedDoer == null)
        return;
    var doer = $id(game.SelectedDoer);
    game.SelectedDoer = null;
    if (doer == undefined)
        return;
    doer.classList.remove('selected');
    removeAllClass("possible");
    updatePossible();
}
function selectDoer() {
    $id(game.SelectedDoer).classList.add('selected');
    updatePossible();
}
function clickDoer(id) {
    // can't select (or deselect) a busy person.
    if (game.People[id].busy) {
        log("can't select (or deselect) a busy item. (" + game.People[id].name + " " + game.People[id].avatar + ")");
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
    var receiver = $id(game.SelectedReceiver);
    game.SelectedReceiver = null;
    if (receiver == undefined)
        return;
    receiver.classList.remove('selected');
    removeAllClass("possible");
    updatePossible();
}
function selectReceiver() {
    $id(game.SelectedReceiver).classList.add('selected');
    updatePossible();
}
function clickReceiver(id) {
    var clickedReceiver = game.Stories[id] || game.Items[id];
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
    var doer = game.People[doId];
    var receiver = game.Stories[receiverId] || game.Items[receiverId];
    if (receiver.skillneeded != "any" && !Object.keys(doer.skills).includes(receiver.skillneeded)) {
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
    $id(game.SelectedReceiver).classList.remove('selected');
    $id(game.SelectedDoer).classList.remove('selected');
    removeAllClass("possible");
    game.SelectedReceiver = null;
    game.SelectedDoer = null;
    doIt(doId, receiverId);
}
function useIt(doId, item) {
    var person = game.People[doId];
    applyItem(person, item);
    drawPerson('p' + person.id, game.People);
    removeStory('i' + item.id);
}
function applyItem(person, item) {
    switch (item.code) {
        case ItemCode.buybot:
            // this is a very custom item.
            person.buyBotLevel += 1;
            var message = "The buy-bot " + item.icon + " will buy projects for you, (if the inbox is below the points limit (set with \u2795 and \u2796), and you have spare \uD83D\uDCB2)";
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
                var ss = { id: nextId(), name: '⭐ Initiative Training ⭐', price: 500, icon: "🚀", skillneeded: "any", busy: false, code: ItemCode.initiative, activeDuration: 0, description: 'When you\'re idle, go and check the board to see if there is anything you can do. Purchase multiple times to show initiative sooner!', enabled: false };
                message += ", and " + person.name + " " + person.avatar + " has initiative now!";
                person.has['i' + ss.id] = ss;
            }
            else {
                message += ".";
            }
            person.has['i' + item.id] = item;
            drawMessage(message);
            break;
        case ItemCode.initiative:
            game.HasInitiativeLevel++;
            person.initiativeLevel++;
            if (person.initiativeLevel == 1) {
                person.has['i' + item.id] = item;
                drawMessage(person.name + " " + person.avatar + " has initiative now!");
            }
            else {
                drawMessage(person.name + " " + person.avatar + " has \u2B50more\u2B50 initiative (level " + person.initiativeLevel + ").");
            }
            if (person.busy == false) {
                personFree(person);
            }
            break;
        case ItemCode.seat:
            person.seatLevel++;
            if (person.seatLevel == 1) {
                person.has['i' + item.id] = item;
            }
            break;
        case ItemCode.headphones:
            person.headphoneLevel++;
            if (person.headphoneLevel == 1) {
                person.has['i' + item.id] = item;
            }
            break;
        case ItemCode.keyboard:
            person.keyboardLevel++;
            if (person.keyboardLevel == 1) {
                person.has['i' + item.id] = item;
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
            var animal = item.code == ItemCode.dog ? "dog" : "cat";
            person.summary = "Tending to " + item.name + " " + item.icon + " (the " + animal + ")";
            drawMessage(person.name + " " + person.avatar + " has the " + animal + " " + item.name + " " + item.icon);
            setTimeout(function () { usingFinishedBusyPhase(person, item); }, game.AnimalTendingDelay);
            setTimeout(function () { usingFinished(person, item); }, item.activeDuration * 500);
            // length of time cat/dog spends with someone increase each time they visit. (Controversial?)
            item.activeDuration *= 1.25;
            person.has['i' + item.id] = item;
            break;
        case ItemCode.banana:
        case ItemCode.toast:
        case ItemCode.coffee:
        case ItemCode.coffeemachine:
        case ItemCode.cupcake:
        case ItemCode.donut:
        case ItemCode.donutmachine:
        case ItemCode.pizza:
        case ItemCode.crystalball:
        case ItemCode.poster:
        case ItemCode.statue:
        case ItemCode.statue2:
        case ItemCode.cookie:
        case ItemCode.cactus:
        case ItemCode.deskplant:
            person.has['i' + item.id] = item;
            if (item.activeDuration > 0) {
                setTimeout(function () { usingFinished(person, item); }, item.activeDuration * 1000);
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
    drawPerson('p' + person.id, game.People);
    personFree(person);
}
function personFree(person) {
    log(person.name + " " + person.avatar + " is now free");
    updatePossible();
    tryInitiate(person);
}
function tryInitiate(person) {
    if (person.initiativeLevel > 0) {
        // the brain instead of the 💤 is because we're a self starter and we're **awake**
        person.summary = "🧠";
        //How many elevenths of an 18 second delay, do we have to wait before polling the board?
        //with self starter level 1, we wait ten/elevenths of 18 seconds... i.e. 16.4 seconds.
        var delay = (person.initiativeDelay / 11) * (11 - Math.min(10, person.initiativeLevel));
        // if they have a dog, we wait only half that time!
        if (personHas(person, ItemCode.dog))
            delay = delay / 2;
        log("Will check board in " + delay);
        var triggerTime_1 = new Date();
        person.triggerTime = triggerTime_1;
        if (game.SelectedDoer == ('p' + person.id)) {
            //can't self start while selected... try to try again in a little bit...
            setTimeout(function () { tryInitiate(person); }, 1000);
        }
        else {
            setTimeout(function () { initiate(person, triggerTime_1); }, delay);
        }
    }
    else {
        person.summary = "💤";
    }
    drawPerson('p' + person.id, game.People);
}
function columnName(skill) {
    switch (skill) {
        case "ba": return "inbox";
        case "dev": return "backlog";
        case "dev0": return "dev";
        case "test": return "test";
        case "done": return "done";
    }
}
function initiate(person, triggerTime) {
    //Now I will go and see if there are any cards on the board that I believe are worthy of my attention.
    //TODO:
    if (person.triggerTime != triggerTime) {
        log("Stale self-start event.");
        return;
    }
    if (game.SelectedDoer == ('p' + person.id)) {
        //can't self start while selected... try to try again in a little bit...
        setTimeout(function () { tryInitiate(person); }, 1000);
        return;
    }
    log("Self starter is awake...");
    log(person.name + " " + person.avatar + " is busy? " + person.busy);
    if (!person.busy) {
        log(person.name + " " + person.avatar + " is checking the board now....");
        //TODO: implement this. And log above instead of 'drawmessage'  
        var columns = [];
        if (person.buyBotLevel > 0) {
            //consider sending the bot off to buy a project lead...
            updateColumnCount;
            var baPoints = 0;
            var devPoints = 0;
            for (var _i = 0, _a = $('#ba .inner .story .points'); _i < _a.length; _i++) {
                var s = _a[_i];
                //s.innerText;
                baPoints += Number(s.innerText);
            }
            for (var _b = 0, _c = $('#dev .inner .story .points'); _b < _c.length; _b++) {
                var s = _c[_b];
                //s.innerText;
                devPoints += Number(s.innerText);
            }
            if (baPoints < game.ColumnLimits["ba"]
                && devPoints < game.ColumnLimits["dev"]) {
                //hmmm, ba column isn't full...
                // and dev column isn't full...
                if (game.Money > game.LeadPrice) {
                    var price = game.LeadPrice;
                    getNewLead();
                    drawMessage("⭐Buybot 🤖 just bought a new project for 💲" + price + "⭐");
                }
            }
        }
        // we prioritise self-starting from the back of the board.
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
            log(person.name + " " + person.avatar + " has no skills worth a damn, apparently!");
        // check each column in the order of the array columns.
        for (var _d = 0, columns_1 = columns; _d < columns_1.length; _d++) {
            var column = columns_1[_d];
            var nextCards = $("#" + column + " .inner .story.receiver:not(.busy)");
            if (nextCards.length > 0) {
                var nextCardId = nextCards[0].id;
                log(person.name + " " + person.avatar + " is doing " + game.Stories[nextCardId].summary);
                doIt('p' + person.id, nextCardId);
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
    delete person.has['i' + item.id];
    //jalert(person.has);
    // the office cat and the office dog return to the in-tray when you are finished with them.
    switch (item.code) {
        case ItemCode.dog:
        case ItemCode.cat:
            drawInboxItem('i' + item.id, item);
            drawMessage(item.name + ' ' + item.icon + ' has left ' + person.name + ' ' + person.avatar + ' and is back to the inbox');
            break;
    }
    drawPerson('p' + person.id, game.People);
}
function doIt(doId, receiverId) {
    var story = game.Stories[receiverId];
    if (story == undefined) {
        var item = game.Items[receiverId];
        if (item == undefined) {
            log("Cannot work out what the receiver is!");
            return;
        }
        useIt(doId, item);
        return;
    }
    var person = game.People[doId];
    story.busy = true;
    story.icon = person.avatar;
    story.person = doId;
    person.busy = true;
    person.summary = getSummary(story);
    drawMessage(person.name + " is " + person.summary);
    drawPerson(doId, game.People);
    drawStory(receiverId, game.Stories, story.reworkLevel > 0);
    var duration = getDuration(person, story);
    log("Duration: of " + story.summary + " " + story.skillneeded + ": " + Math.floor(duration));
    setTimeout(function () { done(receiverId); }, duration);
}
function getBuginess(person, skill) {
    // see also function canFindBug
    var efficiency = getEfficiency(person, skill);
    // efficiency is from 0.3 to 0.999
    var result = 1 - (0.57 + (efficiency * 3 / 7));
    // efficiency = 0.3 gives buginess of 0.3
    // efficiency = 0.999 gives buginess of 0.005
    return result;
}
function getEfficiency(person, skill) {
    log("skill:" + skill);
    var level = 0;
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
    if (personHas(person, ItemCode.donutmachine))
        level++;
    if (personHas(person, ItemCode.pizza))
        level++;
    if (personHas(person, ItemCode.banana))
        level++;
    if (personHas(person, ItemCode.keyboard))
        level++;
    if (personHas(person, ItemCode.deskplant))
        level++;
    if (personHas(person, ItemCode.cookie))
        level++;
    //coffee givestwice the power!!
    if (personHas(person, ItemCode.coffee) || personHas(person, ItemCode.coffeemachine))
        level = level + 2;
    switch (level) {
        case 0: return 0;
        case 1: return 0.3;
        case 2: return 0.4;
        case 3: return 0.5;
        case 4: return 0.6;
        case 5: return 0.7;
        case 6: return 0.77;
        case 7: return 0.83;
        case 8: return 0.90;
        case 9: return 0.95;
        case 10: return 0.96;
        case 11: return 0.97;
        case 12: return 0.98;
        case 13: return 0.98;
        default: return 0.999;
    }
}
// how long will this task take this person?
function getDuration(person, story) {
    var duration = story.points * avgDuration * (1.0 / getEfficiency(person, story.skillneeded)) * getTaskFactor(story.skillneeded);
    // All rework is faster. This is a little over-simplified, but it will do.
    // rework also has a lower chance of introducing fresh bugs (that is covered elsewhere)
    if (story.reworkLevel > 0 && (story.skillneeded == "ba" || story.skillneeded == "dev")) {
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
    return Object.keys(person.has).filter(function (k) { return person.has[k].code == code; }).length > 0;
}
function getSummary(story) {
    return getTaskVerb(story.skillneeded) + " '" + story.summary + "'…";
}
// Consider: these verbs could be randomly drawn from list, e.g
function getTaskVerb(skill) {
    switch (skill) {
        case "ba": return "analyzing"; //scribing, breaking-down, encarding
        case "dev": return "designing"; //envisioning, grasping, comprehending, studying, 
        case "dev0": return "developing"; //"hacking", "coding", "developing", 
        case "test": return "testing"; //inspecting
    }
}
// this is the relative time it takes to do each step.
function getTaskFactor(skill) {
    switch (skill) {
        case "ba": return 0.5;
        case "dev": return 0.25;
        case "dev0": return 1.0;
        case "test": return 0.5;
    }
}
function done(receiveId) {
    var story = game.Stories[receiveId];
    story.busy = false;
    var person = game.People[story.person];
    person.busy = false;
    person.XP += 1;
    incrementXP(1);
    drawMessage(person.name + " finished " + person.summary.replace('…', '') + " " + story.logo + ".");
    $id('p' + game.People[story.person].id).classList.remove("busy");
    var skillNeeded = story.skillneeded;
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
            drawMessage('unrecognised ' + skillNeeded);
    }
    //made it to here without being assigned a task? then the person is now free!
    if (!person.busy)
        personFree(person);
}
function doneBa(storyId) {
    //okay -- we've done the ba work on it.
    //now we add a bunch of cards to the backlog.
    var oldStory = game.Stories[storyId];
    var person = game.People[oldStory.person];
    if (oldStory.status == "story") {
        oldStory.person = null;
        oldStory.skillneeded = "dev"; //it goes into backlog, with bug fixed.
        oldStory.hasSpecBug = false; //if it was a spec bug, it is now fixed.
        oldStory.hasBug = false; //If it was a regular bug, the further development will resolve it.
        oldStory.icon = null; //remove the icon... 
        log("Fixed the bug (or spec bug)");
        removeStory(storyId); //remove the story from the Inbox...
        drawStory(storyId, game.Stories, true); //top of the backlog... race it through
        person.busy = false;
        person.summary = "💤";
        drawPerson('p' + person.id, game.People);
        return;
    }
    oldStory.status = 'done';
    game.Projects[storyId] = new Project(oldStory);
    var newCards = ElaborateProject(oldStory, person);
    person.busy = false;
    person.summary = "💤";
    drawPerson('p' + person.id, game.People);
    // The original lead is removed from the board.
    removeStory(storyId);
    // The new stories are added (to the bottom of the 'backlog' column)
    for (var _i = 0, newCards_1 = newCards; _i < newCards_1.length; _i++) {
        var cc = newCards_1[_i];
        drawStory('r' + cc.id, game.Stories, false);
    }
}
function determineIfAddingSkillBug(person, story, skill) {
    var skillPointBugLikelihood = 100.0 * getBuginess(person, skill);
    if (story.reworkLevel > 0) {
        // an item being reworked is quicker to work on (handled elsewhere), and has MUCH less chance of new bugs being introduced.
        skillPointBugLikelihood = skillPointBugLikelihood / Math.pow(2, story.reworkLevel);
    }
    // it is a truth universally told that a person in possession of a cat is half as likely to create a spec bug.
    if (personHas(person, ItemCode.cat)) {
        log("Lower likelihood of " + skill + " bugs when you have that 😸!");
        skillPointBugLikelihood = skillPointBugLikelihood / 2;
    }
    log("A " + skill + " bug is " + Math.floor(skillPointBugLikelihood) + "% likely on each point of this " + story.points + " point card, rework: " + story.reworkLevel + " ");
    for (var i = 0; i < story.points; i++) {
        if (Math.floor(Math.random() * 100) < skillPointBugLikelihood) {
            return true;
        }
    }
    return false;
}
function ElaborateProject(project, person) {
    var numCards = Math.floor(project.points / 3) + 1;
    log("Lead: " + project.summary + " " + project.logo + " has been analyzed. " + numCards + " stories are being created.");
    var remainingPointsToAllocate = project.points;
    var newCards = [];
    // Deal out starting cards worth 1 point each.
    for (var i = 0; i < numCards; i++) {
        var newCard = new Story("story", "dev", getTask(), project);
        newCard.points = 1; // points are corrected in next section.
        game.Stories['r' + newCard.id] = newCard;
        newCards.push(newCard);
        //Add this new card to the list of stories for that project.
        game.Projects['r' + project.id].stories.push('r' + newCard.id);
    }
    //okay we've given a point to each card.
    remainingPointsToAllocate -= numCards;
    //randomly allocate remaining points to card.
    while (remainingPointsToAllocate > 0) {
        var card = randomItem(newCards); //draw a card from the deck
        card.points += 1;
        remainingPointsToAllocate--;
    }
    for (var _i = 0, _a = game.Projects['r' + project.id].stories; _i < _a.length; _i++) {
        var cardId = _a[_i];
        var hasSpecBug = false;
        var card = game.Stories[cardId];
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
    var person = game.People[game.Stories[storyId].person];
    var story = game.Stories[storyId];
    // no spec bugs can be found until level 3.
    if (game.Level > 2 && story.hasSpecBug) {
        var percentChanceOfFindingSpecBug = 100.0 * canFindBug(person, "dev");
        log("Story " + story.summary + " has a spec bug 💥, there is a " + Math.floor(percentChanceOfFindingSpecBug) + "% chance of the developer finding it.");
        var foundSpecBug = (Math.floor(Math.random() * 100) < percentChanceOfFindingSpecBug);
        if (foundSpecBug) {
            person.busy = false;
            person.summary = "💤";
            drawPerson('p' + person.id, game.People);
            drawMessage(person.name + " discovered a spec bug 💥 in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.icon = "💥";
            story.skillneeded = "ba";
            story.reworkLevel += 1;
            removeStory(storyId);
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    removeStory(storyId);
    story.skillneeded = "dev0";
    doIt(story.person, storyId);
}
function doneDev0(storyId) {
    //okay -- development is done
    //Add it to test
    var story = game.Stories[storyId];
    var person = game.People[story.person];
    //chance of adding a bug relates to effectiveness of ba, and size of story. (and whether or not they have... a cat)
    if (determineIfAddingSkillBug(person, story, "dev")) {
        story.hasBug = true;
        // Note the bug may or may not be found later. If tester doesn't find it, the customer *will* find it.
        log("A bug \uD83D\uDC1B was added to " + story.summary);
    }
    removeStory(storyId);
    story.skillneeded = "test";
    story.person = null;
    story.icon = null;
    log("Story: " + story.summary + " is ready for testing.");
    drawStory(storyId, game.Stories, story.reworkLevel > 0);
    person.busy = false;
    person.summary = "💤";
    drawPerson('p' + person.id, game.People);
}
function doneTest(storyId) {
    //okay -- test is done
    removeStory(storyId);
    var story = game.Stories[storyId];
    var person = game.People[story.person];
    person.busy = false;
    person.summary = "💤";
    drawPerson('p' + person.id, game.People);
    var tester = game.People[story.person];
    //no bugs can be found until level 2.
    if (game.Level > 1 && story.hasBug) {
        var percentChanceOfFindingBug = 100.0 * canFindBug(person, "test");
        log("Story " + story.summary + " has a bug, there is a " + Math.floor(percentChanceOfFindingBug) + "% chance of finding it while testing.");
        var foundBug = (Math.floor(Math.random() * 100) < percentChanceOfFindingBug);
        if (foundBug) {
            drawMessage(tester.name + " found a bug 🐛 in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.hasSpecBug = null;
            story.icon = "🐛";
            story.skillneeded = "dev";
            story.reworkLevel += 1;
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    // no spec bugs can be found until level 3.
    if (game.Level > 2 && story.hasSpecBug) {
        var percentChanceOfFindingSpecBug = 100.0 * canFindBug(tester, "test");
        log("Story: " + story.summary + " has a spec bug 💥, there is a " + Math.floor(percentChanceOfFindingSpecBug) + "% chance of finding it while testing.");
        var foundSpecBug = (Math.floor(Math.random() * 100) < percentChanceOfFindingSpecBug);
        if (foundSpecBug) {
            drawMessage(tester.name + " found a spec bug 💥 in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.hasSpecBug = null;
            story.icon = "💥";
            story.skillneeded = "ba";
            story.reworkLevel += 1;
            drawStory(storyId, game.Stories, true);
            return;
        }
    }
    story.person = null;
    story.icon = null;
    log("Story: " + story.summary + " passed testing. Done!");
    story.skillneeded = "done";
    story.icon = "✔";
    drawStory(storyId, game.Stories, story.reworkLevel > 0);
    //the 'done' card dissappears after a while.
    setTimeout(function () { bankStory(storyId); }, avgDuration * 5);
}
function canFindBug(person, skill) {
    // see also `function getBuginess`
    // at level 1 -- efficiency is 0.3
    // at level 10 -- efficiency is 0.99
    var efficiency = getEfficiency(person, skill);
    // that's good enough, we'll just use the efficiency directly.
    log('Efficiency of ' + person.name + ' at ' + skill + ' is ' + efficiency);
    var chanceOfFindingBug = efficiency;
    return chanceOfFindingBug;
}
function bankStory(storyId) {
    var story = game.Stories[storyId];
    // If story has a bug... customer will definitely find it! (it got past testing!)
    //and it will go all the way back to the ba column, even if it wasn't a spec bug!
    // no bugs can be found until level 2, no spec bugs until level 3
    if ((game.Level > 1 && story.hasBug) || (game.Level > 2 && story.hasSpecBug)) {
        //remove from board
        removeStory(storyId);
        drawMessage("Oops! The customer found a bug \uD83D\uDE21 in story '" + story.summary + "'");
        story.customerFoundBug = true;
        //HALVE the amount this card is worth! (hope the customer doesn't find ANOTHER bug in this one......)
        story.pointPrice = story.pointPrice / 2;
        story.person = null;
        story.icon = "😡";
        story.skillneeded = "ba"; //goes all the way back to the BA column.
        story.reworkLevel += 1;
        drawStory(storyId, game.Stories, true); //at the top.
        return;
    }
    var price = Math.floor(story.points * story.pointPrice);
    var message2 = " for '" + story.summary + "'";
    incrementXP(5);
    if (story.customerFoundBug) {
        //(it was halved when it was first found)
        message2 += " (reduced as customer found that bug)";
    }
    var projectId = game.Stories[storyId].projectId;
    //remove the story from the project it belongs to.
    var project = game.Projects[projectId];
    var bonus = 0;
    if (project.stories.includes(storyId)) {
        project.stories.splice(project.stories.indexOf(storyId), 1);
        //if there are no stories remaining then a project completion bonus is paid.
        if (project.stories.length == 0) {
            bonus = Math.ceil(project.lead.points * project.lead.pointPrice / 2);
            if (!game.TimeBarFeatureFlag || project.lead.maxAge == -1) {
                message2 += " plus \uD83D\uDCB2" + bonus + " for completing " + project.lead.summary + " " + project.lead.logo;
                incrementXP(10);
            }
            else {
                //timeBarFeatureFlag ...
                var tenths = getTenthsOfTimeElapsed(story);
                if (tenths < 10) {
                    bonus = Math.ceil(bonus * ((17 - tenths) * 0.1));
                    message2 += " plus \uD83D\uDCB2" + bonus + " for early completion of " + project.lead.summary + " " + project.lead.logo + "\u2755";
                    incrementXP(10);
                }
                else if (timePenaltyFeatureFlag && tenths >= 10) {
                    bonus = Math.ceil(bonus * -0.5);
                    message2 += "...MINUS penalty \uD83D\uDE2D of \uD83D\uDCB2" + Math.abs(bonus) + "\u2757 for late completion of " + project.lead.summary + " " + project.lead.logo + "\u2755";
                    incrementXP(2);
                }
                else {
                    message2 += " and you completed " + project.lead.summary + " " + project.lead.logo + ".";
                    incrementXP(5);
                }
            }
            for (var s in project.stories) {
                delete game.Stories[s];
            }
            delete game.Projects[projectId];
        }
    }
    incrememntPoints(story.points);
    incrementMoney(price + bonus); // + timeBonus);
    drawMoney(game.Money);
    drawMessage("Earned \uD83D\uDCB2" + price + message2);
    removeStory(storyId);
}
/* utility functions */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return (template.content.firstChild);
}
function $(selector) {
    return document.querySelectorAll(selector);
}
function $id(id) {
    return document.getElementById(id);
}
function isEmpty(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
}
//add the class of className to all elements that match the selector
function addClass(selector, className) {
    for (var _i = 0, _a = $(selector); _i < _a.length; _i++) {
        var example = _a[_i];
        example.classList.add(className);
    }
}
//remove the class className from all elements that match the selector
function removeClass(selector, className) {
    for (var _i = 0, _a = $(selector); _i < _a.length; _i++) {
        var example = _a[_i];
        example.classList.remove(className);
    }
}
// remove the class of className from all elements that have a class of className
function removeAllClass(className) {
    for (var _i = 0, _a = $("." + className); _i < _a.length; _i++) {
        var example = _a[_i];
        example.classList.remove(className);
    }
}
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function drawMessage(message) {
    log('m:' + message);
    $id('message').innerText = message;
}
function drawStoreMessage(message) {
    log('m:' + message);
    $id('storeMessage').innerText = message;
}
function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}
// names from https://introcs.cs.princeton.edu/java/data/
var names = ['Aaron', 'Abbie', 'Abbott', 'Abbra', 'Abby', 'Abe', 'Abel', 'Abeni', 'Abia', 'Abiba', 'Abie', 'Abigail', 'Abner', 'Abraham', 'Abram', 'Abrianna', 'Abrienda', 'Abril', 'Absolom', 'Abu', 'Acacia', 'Ace', 'Ada', 'Adah', 'Adair', 'Adalia', 'Adam', 'Adamina', 'Adamma', 'Adara', 'Addison', 'Ade', 'Adela', 'Adelaide', 'Adele', 'Adeline', 'Adelio', 'Adelle', 'Adem', 'Aden', 'Aderes', 'Adie', 'Adiel', 'Adila', 'Adina', 'Adita', 'Adlai', 'Adli', 'Adolfo', 'Adolph', 'Adonai', 'Adonia', 'Adora', 'Adrian', 'Adriana', 'Adriano', 'Adrienne', 'Ady', 'Aelan', 'Affrica', 'Afra', 'Afric', 'Africa', 'Afton', 'Agamemnon', 'Agatha', 'Aggie', 'Agnes', 'Ah Cy', 'Ahava', 'Ai', 'Aida', 'Aidan', 'Aiko', 'Aileen', 'Ailis', 'Ailish', 'Aimee', 'Aine', 'Ainsley', 'Aisling', 'Aislinn', 'Aizza', 'Aja', 'Ajani', 'Ajay', 'Akili', 'Akuji', 'Al', 'Alair', 'Alake', 'Alan', 'Alana', 'Alanna', 'Alastair', 'Alaura', 'Alban', 'Albany', 'Albert', 'Alberta', 'Alberto', 'Albin', 'Albina', 'Alda', 'Aldan', 'Alden', 'Aldon', 'Aldona', 'Alec', 'Alejandro', 'Alem', 'Alena', 'Aleta', 'Aletha', 'Alethea', 'Aletta', 'Alex', 'Alexa', 'Alexander', 'Alexandra', 'Alexandria', 'Alexia', 'Alexis', 'Alfonso', 'Alfred', 'Algeron', 'Ali', 'Alia', 'Alice', 'Alicia', 'Alijah', 'Alika', 'Alima', 'Alina', 'Alisha', 'Alison', 'Alissa', 'Alize', 'Alka', 'Allegra', 'Allen', 'Allene', 'Allie', 'Allison', 'Allyson', 'Alma', 'Almeda', 'Alohilani', 'Alphonse', 'Alsatia', 'Althea', 'Alva', 'Alvin', 'Alyn', 'Alyson', 'Alyssa', 'Amadeus', 'Amador', 'Amalia', 'Amalie', 'Aman', 'Amana', 'Amanda', 'Amandla', 'Amara', 'Amaranta', 'Amarante', 'Amaranth', 'Amaris', 'Amaryllis', 'Amaya', 'Amber', 'Ambrose', 'Amelia', 'Amena', 'Ami', 'Amiel', 'Amina', 'Amir', 'Amiri', 'Amity', 'Amma', 'Amorina', 'Amos', 'Amy', 'An', 'Ana', 'Anais', 'Analiese', 'Analise', 'Anana', 'Anando', 'Anastasia', 'Anatola', 'Anatole', 'Ande', 'Andra', 'Andralyn', 'Andre', 'Andrea', 'Andreas', 'Andres', 'Andrew', 'Andy', 'Anemone', 'Anevay', 'Angel', 'Angela', 'Angelica', 'Angelina', 'Angelo', 'Angie', 'Angus', 'Ani', 'Anika', 'Anila', 'Anisa', 'Anita', 'Anitra', 'Anja', 'Anlon', 'Ann', 'Anna', 'Annalise', 'Annamika', 'Anne', 'Anneke', 'Annette', 'Annice', 'Annick', 'Annis', 'Annissa', 'Annora', 'Anthea', 'Anthony', 'Antionette', 'Antoinette', 'Antonia', 'Antonie', 'Antony', 'Anwar', 'Anya', 'Aoko', 'Aolani', 'Aphrodite', 'Apollo', 'Appollo', 'Apria', 'April', 'Arabela', 'Arabella', 'Aram', 'Aran', 'Archibald', 'Archie', 'Aren', 'Aretha', 'Argus', 'Ari', 'Aria', 'Ariana', 'Ariel', 'Ariella', 'Arielle', 'Arien', 'Arissa', 'Arista', 'Ariza', 'Arlen', 'Arlene', 'Arlo', 'Arlynda', 'Armand', 'Armande', 'Armando', 'Armina', 'Arnaud', 'Arne', 'Arnie', 'Arnold', 'Aron', 'Art', 'Artemis', 'Arthur', 'Artie', 'Arty', 'Arvid', 'Arvin', 'Asa', 'Asabi', 'Asalie', 'Asasia', 'Ash', 'Asha', 'Ashby', 'Ashley', 'Ashling', 'Ashlyn', 'Ashton', 'Ashtyn', 'Asis', 'Asli', 'Asnee', 'Asta', 'Asthore', 'Astin', 'Astra', 'Astrid', 'Atalo', 'Athalia', 'Athena', 'Atira', 'Auberta', 'Aubrey', 'Aubrianna', 'Audi', 'Audra', 'Audrey', 'August', 'Augustin', 'Augustus', 'Aulii', 'Aure', 'Aurelia', 'Aurora', 'Aurorette', 'Austin', 'Autumn', 'Ava', 'Avalon', 'Avel', 'Aveline', 'Avery', 'Avi', 'Avis', 'Aviv', 'Aviva', 'Avongara', 'Axel', 'Axelle', 'Aya', 'Ayame', 'Ayanna', 'Ayla', 'Ayoka', 'Aysha', 'Azana', 'Aziza', 'Azize', 'Azra', 'Azriel', 'Azuka', 'Azura', 'Baba', 'Babette', 'Bahari', 'Bailey', 'Baird', 'Bairn', 'Bakula', 'Ballard', 'Balthasar', 'Bambi', 'Banji', 'Barake', 'Barb', 'Barbara', 'Barbie', 'Barclay', 'Barke', 'Barnabas', 'Barnard', 'Barney', 'Barny', 'Barr', 'Barran', 'Barretta', 'Barry', 'Bart', 'Barth', 'Bartholemew', 'Barton', 'Baruch', 'Bary', 'Bash', 'Basil', 'Bast', 'Bastien', 'Baxter', 'Bayard', 'Bayen', 'Baylee', 'Bayo', 'Bea', 'Beata', 'Beate', 'Beatrice', 'Beatriz', 'Beau', 'Beauregard', 'Bebe', 'Bebhin', 'Becca', 'Beck', 'Becka', 'Becky', 'Bel', 'Bela', 'Belay', 'Belden', 'Belinda', 'Belita', 'Bell', 'Bella', 'Belle', 'Bellini', 'Ben', 'Bena', 'Benard', 'Benedict', 'Benen', 'Benita', 'Benjamin', 'Benjy', 'Bennett', 'Benny', 'Benson', 'Berdine', 'Berke', 'Bern', 'Bernadette', 'Bernadine', 'Bernard', 'Berne', 'Bernice', 'Bernie', 'Berny', 'Bert', 'Bertha', 'Bertille', 'Beryl', 'Bess', 'Bessie', 'Beth', 'Bethan', 'Bethany', 'Betsy', 'Bette', 'Betty', 'Beulah', 'Bevan', 'Beverly', 'Bevis', 'Beyla', 'Biana', 'Bianca', 'Bibiane', 'Bidelia', 'Bikita', 'Bilen', 'Bill', 'Billy', 'Bin', 'Bina', 'Bing', 'Bingham', 'Birch', 'Bisbee', 'Bishop', 'Biton', 'Bjorn', 'Blade', 'Blaine', 'Blair', 'Blake', 'Blanche', 'Blaze', 'Blenda', 'Blinda', 'Bliss', 'Blithe', 'Blodwyn', 'Blossom', 'Blum', 'Bluma', 'Blythe', 'Bo', 'Boaz', 'Bob', 'Bona', 'Bonaventure', 'Bond', 'Bonita', 'Bonnie', 'Bono', 'Boone', 'Boris', 'Bowen', 'Bowie', 'Boyd', 'Bracha', 'Brad', 'Braden', 'Bradford', 'Bradley', 'Braeden', 'Braima', 'Bran', 'Brand', 'Brandee', 'Brandie', 'Brandon', 'Brant', 'Braxton', 'Brayden', 'Brazil', 'Breanna', 'Breckin', 'Brede', 'Bree', 'Brein', 'Brend', 'Brenda', 'Brendan', 'Brenna', 'Brennan', 'Brent', 'Brett', 'Brewster', 'Brian', 'Briana', 'Brianna', 'Brianne', 'Briar', 'Brice', 'Brick', 'Bridget', 'Bridgit', 'Brielle', 'Brier', 'Brigham', 'Brighton', 'Brigit', 'Brigitte', 'Brilane', 'Brilliant', 'Brina', 'Brinly', 'Brit', 'Brita', 'Britain', 'Britannia', 'Britany', 'Brittania', 'Brittany', 'Brittnee', 'Brock', 'Brody', 'Brone', 'Bronson', 'Bronwen', 'Brooke', 'Brooklyn', 'Brooks', 'Bruce', 'Bruno', 'Bryan', 'Bryanne', 'Bryant', 'Bryce', 'Brygid', 'Brynn', 'Bryony', 'Bryton', 'Buck', 'Bud', 'Buddy', 'Buffy', 'Bunny', 'Burdette', 'Burke', 'Burt', 'Burton', 'Butterfly', 'Buzz', 'Byrd', 'Byron', 'Cade', 'Cadee', 'Cadence', 'Cady', 'Cael', 'Caelan', 'Caesar', 'Cai', 'Cailean', 'Caimile', 'Cain', 'Caine', 'Cairbre', 'Cairo', 'Cais', 'Caitlin', 'Caitlyn', 'Cal', 'Cala', 'Calais', 'Calandra', 'Calantha', 'Calder', 'Cale', 'Caleb', 'Caley', 'Calhoun', 'Calix', 'Calixte', 'Calla', 'Callia', 'Calliope', 'Callista', 'Callum', 'Calvin', 'Calvine', 'Cam', 'Camdyn', 'Cameron', 'Camilla', 'Camille', 'Camlin', 'Cana', 'Candace', 'Candice', 'Candida', 'Candide', 'Candie', 'Candy', 'Cara', 'Caralee', 'Caresse', 'Carha', 'Carina', 'Carl', 'Carla', 'Carleton', 'Carlisle', 'Carlos', 'Carlota', 'Carlotta', 'Carlton', 'Carly', 'Carmel', 'Carmela', 'Carmelita', 'Carmen', 'Carmine', 'Carol', 'Carolena', 'Caroline', 'Carolyn', 'Caron', 'Carr', 'Carrick', 'Carrie', 'Carrieann', 'Carson', 'Carsyn', 'Carter', 'Carver', 'Cary', 'Casey', 'Cashlin', 'Casimir', 'Casondra', 'Caspar', 'Casper', 'Cassandra', 'Cassia', 'Cassidy', 'Cassius', 'Catherine', 'Cathy', 'Catrin', 'Cayla', 'Ceana', 'Cearo', 'Cece', 'Cecil', 'Cecile', 'Cecilia', 'Cecily', 'Cedric', 'Celeste', 'Celestyn', 'Celia', 'Celina', 'Celine', 'Cerise', 'Cesar', 'Chad', 'Chaela', 'Chaeli', 'Chailyn', 'Chaim', 'Chalsie', 'Chana', 'Chance', 'Chancellor', 'Chandler', 'Chandra', 'Channon', 'Chantal', 'Chantel', 'Charis', 'Charisse', 'Charity', 'Charla', 'Charlee', 'Charleigh', 'Charlene', 'Charles', 'Charlot', 'Charlotte', 'Charmaine', 'Charo', 'Chars', 'Chas', 'Chase', 'Chastity', 'Chauncey', 'Chava', 'Chavi', 'Chaylse', 'Cheche', 'Chelsa', 'Chelsea', 'Chelsi', 'Chelsia', 'Chen', 'Cheney', 'Chenoa', 'Cher', 'Cheri', 'Cherie', 'Cherlin', 'Cherry', 'Cheryl', 'Chesna', 'Chester', 'Chet', 'Cheyenne', 'Cheyne', 'Chezarina', 'Chhaya', 'Chick', 'Chico', 'Chill', 'Chilton', 'Chimelu', 'China', 'Chip', 'Chipo', 'Chloe', 'Chloris', 'Chris', 'Chrissy', 'Christa', 'Christian', 'Christiana', 'Christina', 'Christine', 'Christopher', 'Christy', 'Chuck', 'Chumani', 'Chun', 'Chyna', 'Chynna', 'Cian', 'Cianna', 'Ciara', 'Cicely', 'Cicero', 'Cicily', 'Cid', 'Ciel', 'Cindy', 'Cira', 'Cirila', 'Ciro', 'Cirocco', 'Cissy', 'Claire', 'Clara', 'Claral', 'Clare', 'Clarence', 'Clarissa', 'Clark', 'Clarke', 'Claude', 'Claudia', 'Clay', 'Clayland', 'Clayton', 'Clea', 'Cleantha', 'Cleatus', 'Cleavant', 'Cleave', 'Cleavon', 'Clem', 'Clemens', 'Clement', 'Clementine', 'Cleo', 'Cleta', 'Cleveland', 'Cliff', 'Clifford', 'Clifton', 'Clint', 'Clinton', 'Clio', 'Clitus', 'Clive', 'Clodia', 'Cloris', 'Clove', 'Clover', 'Cocheta', 'Cody', 'Cole', 'Colette', 'Coligny', 'Colin', 'Colista', 'Colleen', 'Collice', 'Collin', 'Colm', 'Colman', 'Colton', 'Columbia', 'Comfort', 'Conan', 'Conlan', 'Conley', 'Conner', 'Connie', 'Connley', 'Connor', 'Conor', 'Conrad', 'Constance', 'Constantine', 'Consuela', 'Consuelo', 'Content', 'Conway', 'Conyers', 'Cooper', 'Cora', 'Coral', 'Coralia', 'Coralie', 'Corbin', 'Corby', 'Cordelia', 'Corentine', 'Corey', 'Corin', 'Corina', 'Corine', 'Corinna', 'Corinne', 'Corliss', 'Cornelia', 'Cornelius', 'Cornell', 'Cort', 'Cory', 'Cosette', 'Cosima', 'Cosmo', 'Coty', 'Courtney', 'Coy', 'Coye', 'Craig', 'Creighton', 'Creola', 'Crescent', 'Crete', 'Crevan', 'Crispin', 'Cristy', 'Crystal', 'Cullen', 'Curry', 'Curt', 'Curtis', 'Cuthbert', 'Cutler', 'Cutter', 'Cy', 'Cybele', 'Cybil', 'Cybill', 'Cyd', 'Cyma', 'Cyndi', 'Cynthia', 'Cyrah', 'Cyril', 'Cyrus', 'D\'lorah', 'Da-xia', 'Dacey', 'Dafydd', 'Dagan', 'Dagmar', 'Dahlia', 'Daisy', 'Dakota', 'Dale', 'Dalia', 'Dalila', 'Dalit', 'Dallas', 'Dallin', 'Dalton', 'Dalva', 'Damian', 'Damita', 'Damon', 'Dan', 'Dana', 'Danae', 'Dane', 'Dani', 'Danica', 'Daniel', 'Daniela', 'Danielle', 'Danika', 'Danil', 'Danniell', 'Danny', 'Dante', 'Danton', 'Danyl', 'Daphne', 'Dara', 'Daray', 'Darby', 'Darcy', 'Dard', 'Daria', 'Darian', 'Darin', 'Dario', 'Darla', 'Darlene', 'Darnell', 'Darrell', 'Darren', 'Darrin', 'Darrion', 'Darrius', 'Darryl', 'Darshan', 'Darwin', 'Daryl', 'Dasan', 'Dasha', 'Davan', 'Dave', 'David', 'Davida', 'Davin', 'Davina', 'Davis', 'Davu', 'Dawn', 'Dayton', 'Dea', 'Dean', 'Deandra', 'Deanna', 'Deanne', 'Debbie', 'Debby', 'Deborah', 'Debra', 'Deidra', 'Deiondre', 'Deirdra', 'Deiter', 'Dejah', 'Deka', 'Del', 'Delaine', 'Delaney', 'Delbert', 'Delfina', 'Delia', 'Delila', 'Delilah', 'Deliz', 'Della', 'Delores', 'Delphine', 'Delta', 'Delu', 'Dembe', 'Demetria', 'Demetrius', 'Demi', 'Demitrius', 'Dempster', 'Den\'e', 'Dena', 'Denali', 'Denis', 'Denise', 'Denna', 'Dennis', 'Denver', 'Deo', 'Deon', 'Derby', 'Derek', 'Derex', 'Derica', 'Dermot', 'Derora', 'Derrick', 'Derron', 'Derry', 'Des', 'Desana', 'Desdemona', 'Desi', 'Desiderio', 'Desiree', 'Desmond', 'Dessa', 'Destiny', 'Deva', 'Devaki', 'Devi', 'Devin', 'Devon', 'Devorah', 'Devorit', 'Dewey', 'Dewitt', 'Dexter', 'Dextra', 'Diallo', 'Diana', 'Diane', 'Dianne', 'Diantha', 'Dianthe', 'Diata', 'Dick', 'Didier', 'Didrika', 'Diego', 'Dillan', 'Dillian', 'Dillon', 'Dina', 'Dinah', 'Dino', 'Dion', 'Dionne', 'Dionysius', 'Dionysus', 'Dior', 'Dirk', 'Dixie', 'Dixon', 'Dmitri', 'Doane', 'Doctor', 'Doda', 'Doi', 'Dolly', 'Dolores', 'Dolph', 'Dom', 'Domani', 'Dominic', 'Dominick', 'Dominique', 'Dominy', 'Don', 'Donagh', 'Donahi', 'Donal', 'Donald', 'Donat', 'Donelle', 'Donna', 'Donnel', 'Donnica', 'Donny', 'Donovan', 'Dora', 'Dorcas', 'Dore', 'Dori', 'Doria', 'Dorian', 'Dorie', 'Dorinda', 'Doris', 'Dorit', 'Dorothea', 'Dorothy', 'Dorset', 'Dorsey', 'Dory', 'Dot', 'Dotty', 'Doug', 'Dougal', 'Douglas', 'Douglass', 'Doyle', 'Doyt', 'Drake', 'Dreama', 'Drew', 'Dru', 'Duane', 'Duc', 'Dudley', 'Duena', 'Duff', 'Dugan', 'Duka', 'Duke', 'Dulce', 'Dulcea', 'Dulcina', 'Dulcinea', 'Dumi', 'Duncan', 'Dunixi', 'Dunja', 'Dunn', 'Dunne', 'Duscha', 'Dustin', 'Dusty', 'Dwayne', 'Dwight', 'Dyan', 'Dyani', 'Dyanne', 'Dylan', 'Dyllis', 'Dyre', 'Dysis', 'Eadoin', 'Eamon', 'Earl', 'Earlene', 'Earnest', 'Easter', 'Eavan', 'Ebony', 'Echo', 'Ed', 'Edalene', 'Edaline', 'Edana', 'Edda', 'Eddie', 'Eddy', 'Edeline', 'Eden', 'Edena', 'Edgar', 'Edie', 'Edison', 'Edita', 'Edith', 'Edmund', 'Edna', 'Edric', 'Edward', 'Edwardo', 'Edwin', 'Edwina', 'Edythe', 'Effie', 'Efrat', 'Efrem', 'Egan', 'Eileen', 'Eilis', 'Eitan', 'Ela', 'Elaine', 'Elan', 'Elana', 'Elani', 'Elata', 'Elda', 'Elden', 'Eldon', 'Eldora', 'Eleanor', 'Electra', 'Elena', 'Elephteria', 'Elgin', 'Eli', 'Elia', 'Elias', 'Elie', 'Elijah', 'Elin', 'Eliora', 'Eliot', 'Elise', 'Elisha', 'Elita', 'Eliza', 'Elizabeth', 'Eljah', 'Elkan', 'Elke', 'Ella', 'Ellard', 'Elle', 'Ellema', 'Ellen', 'Ellery', 'Ellie', 'Elliot', 'Elliott', 'Ellis', 'Elmo', 'Eloise', 'Elsa', 'Elsie', 'Elspeth', 'Elton', 'Elu', 'Elvin', 'Elvina', 'Elvira', 'Elvis', 'Ely', 'Elysia', 'Emanuel', 'Emanuele', 'Emele', 'Emene', 'Emera', 'Emerald', 'Emery', 'Emil', 'Emilia', 'Emilie', 'Emilio', 'Emily', 'Emma', 'Emmanuel', 'Emmet', 'Emmett', 'Emmly', 'Enid', 'Ennis', 'Enos', 'Enrico', 'Eolande', 'Ephraim', 'Epifanio', 'Er', 'Erasmus', 'Eri', 'Eric', 'Erica', 'Erik', 'Erika', 'Erimentha', 'Erin', 'Eris', 'Erland', 'Erma', 'Erme', 'Ermin', 'Erna', 'Ernest', 'Ernie', 'Erno', 'Eron', 'Eros', 'Errin', 'Errol', 'Erv', 'Ervin', 'Erwin', 'Eryk', 'Esben', 'Eshe', 'Esma', 'Esmerelda', 'Esteban', 'Estelle', 'Ester', 'Esther', 'Estralita', 'Etan', 'Etana', 'Eternity', 'Ethan', 'Ethel', 'Ethelda', 'Etta', 'Eudora', 'Eugene', 'Eulalia', 'Eulalie', 'Eupemia', 'Euphemia', 'Euridice', 'Eva', 'Evan', 'Evane', 'Evangeline', 'Evania', 'Eve', 'Evelia', 'Evelien', 'Evelyn', 'Everett', 'Evette', 'Evie', 'Evita', 'Evonne', 'Ewa', 'Eyal', 'Eydie', 'Ezekiel', 'Ezra', 'Fabian', 'Fabienne', 'Fabiola', 'Fabrizio', 'Fabunni', 'Fairfax', 'Fairly', 'Faith', 'Fala', 'Fale', 'Fallon', 'Fanchon', 'Farica', 'Faris', 'Farley', 'Farrah', 'Farrell', 'Fatima', 'Fausta', 'Faustine', 'Favian', 'Fawn', 'Fay', 'Faye', 'Faylinn', 'Fedora', 'Feivel', 'Feleti', 'Felicia', 'Felicity', 'Felimy', 'Felix', 'Fell', 'Felton', 'Fennella', 'Feoras', 'Ferdinand', 'Fergal', 'Fergus', 'Ferguson', 'Fern', 'Fernando', 'Ferris', 'Ferrol', 'Fiachra', 'Fico', 'Fidel', 'Fidelia', 'Fidelio', 'Fidella', 'Field', 'Filbert', 'Filia', 'Filipina', 'Fineen', 'Finley', 'Finn', 'Finna', 'Finola', 'Fiona', 'Fionan', 'Fionn', 'Fionnula', 'Fiorenza', 'Fisk', 'Fisseha', 'Flan', 'Flannery', 'Flavian', 'Fletcher', 'Fleur', 'Flint', 'Flo', 'Flora', 'Floramaria', 'Florence', 'Floria', 'Floriane', 'Florida', 'Florrie', 'Flower', 'Floyd', 'Flynn', 'Fola', 'Fonda', 'Fondea', 'Forbes', 'Ford', 'Fordon', 'Forrest', 'Forrester', 'Forster', 'Fortune', 'Foster', 'Fountain', 'Fox', 'Foy', 'Fraley', 'Fran', 'Frances', 'Francesca', 'Francis', 'Frank', 'Franklin', 'Franz', 'Frasier', 'Frayne', 'Fred', 'Freddy', 'Frederica', 'Frederick', 'Fredrica', 'Freed', 'Freeman', 'Freja', 'Fremont', 'Freya', 'Frieda', 'Fritz', 'Fritzi', 'Fronde', 'Fruma', 'Frye', 'Fulbright', 'Fuller', 'Fynn', 'Gabby', 'Gabe', 'Gabi', 'Gabriel', 'Gabriela', 'Gabriella', 'Gabrielle', 'Gaby', 'Gaetan', 'Gaetane', 'Gafna', 'Gage', 'Gail', 'Gaille', 'Gainell', 'Gaius', 'Gale', 'Galen', 'Galeno', 'Gali', 'Gallagher', 'Gallia', 'Galvin', 'Gamada', 'Gamal', 'Gamaliel', 'Ganit', 'Gannon', 'Ganya', 'Gardner', 'Gareth', 'Garfield', 'Garren', 'Garret', 'Garrett', 'Garrick', 'Garrison', 'Garron', 'Garry', 'Garson', 'Garth', 'Garvey', 'Gary', 'Gates', 'Gaurav', 'Gautier', 'Gavan', 'Gavin', 'Gavivi', 'Gavril', 'Gay', 'Gaye', 'Gayle', 'Gaylord', 'Gaynell', 'Gazali', 'Gazelle', 'Gazit', 'Gella', 'Gelsey', 'Gemma', 'Gene', 'Genet', 'Geneva', 'Genevieve', 'Genna', 'Gent', 'Geoff', 'Geoffrey', 'Geordi', 'George', 'Georgette', 'Georgia', 'Georgina', 'Gerald', 'Geraldene', 'Geraldine', 'Geraldo', 'Gerard', 'Gerda', 'Geri', 'Gerik', 'Germain', 'Germaine', 'Gerodi', 'Gerry', 'Gershom', 'Gertrude', 'Ghita', 'Giacomo', 'Gianna', 'Gibson', 'Gideon', 'Gigi', 'Gil', 'Gilbert', 'Gilda', 'Giles', 'Gili', 'Gillespie', 'Gillian', 'Gin', 'Gina', 'Ginacarlo', 'Ginata', 'Ginger', 'Ginny', 'Gino', 'Giolla', 'Giorgio', 'Giovanni', 'Gisela', 'Giselle', 'Gita', 'Gitano', 'Gitel', 'Gittel', 'Giulio', 'Giuseppe', 'Giva', 'Giza', 'Gladys', 'Glen', 'Glenda', 'Glenn', 'Glenna', 'Glennis', 'Glenys', 'Glora', 'Gloria', 'Glory', 'Glyn', 'Glynis', 'Glynnis', 'Godana', 'Godfrey', 'Golda', 'Goldie', 'Goldy', 'Gomer', 'Gordon', 'Gordy', 'Grace', 'Gracie', 'Grady', 'Graham', 'Gram', 'Grania', 'Grant', 'Granville', 'Gratia', 'Gratiana', 'Grayson', 'Grazia', 'Greer', 'Greg', 'Gregg', 'Gregory', 'Greta', 'Gretchen', 'Gretel', 'Griffin', 'Griselda', 'Grizelda', 'Grover', 'Guadalupe', 'Gualtier', 'Guban', 'Guenevere', 'Guido', 'Guinevere', 'Gunnar', 'Gunther', 'Gur', 'Gure', 'Guri', 'Gustav', 'Guy', 'Gwen', 'Gwendolyn', 'Gwyn', 'Gwyneth', 'Gypsy', 'Haben', 'Habib', 'Hada', 'Hadar', 'Hadassah', 'Hadley', 'Haile', 'Haines', 'Hajari', 'Hal', 'Halen', 'Haley', 'Hali', 'Halona', 'Ham', 'Hamal', 'Hamilton', 'Hamlet', 'Hamlin', 'Hampton', 'Hana', 'Hank', 'Hanley', 'Hanna', 'Hannah', 'Hannelore', 'Hans', 'Hanzila', 'Hao', 'Haracha', 'Harlan', 'Harley', 'Harlow', 'Harmon', 'Harmony', 'Harold', 'Haroun', 'Harper', 'Harriet', 'Harrison', 'Harry', 'Hart', 'Hartwell', 'Haru', 'Haruki', 'Haruko', 'Haruni', 'Harva', 'Harvey', 'Hasad', 'Hasana', 'Hastin', 'Hateya', 'Haven', 'Hawa', 'Hayden', 'Hayley', 'Hayward', 'Hazel', 'Hazelle', 'Hazina', 'Heath', 'Heather', 'Heavynne', 'Hector', 'Hedda', 'Hedia', 'Hedva', 'Hedwig', 'Hedy', 'Hedya', 'Heidi', 'Heinz', 'Helaine', 'Helen', 'Helena', 'Helene', 'Helga', 'Helia', 'Heller', 'Heloise', 'Henri', 'Henrietta', 'Henrik', 'Henry', 'Hera', 'Herb', 'Herbert', 'Herbst', 'Heremon', 'Herman', 'Herschel', 'Hertz', 'Hesper', 'Hester', 'Hestia', 'Hewitt', 'Hidalgo', 'Hidi', 'Hiero', 'Hija', 'Hila', 'Hilaire', 'Hilary', 'Hilda', 'Hilde', 'Hillary', 'Hilzarie', 'Hina', 'Hinda', 'Hiroko', 'Hirsi', 'Holden', 'Holiday', 'Hollace', 'Holli', 'Hollis', 'Holly', 'Hollye', 'Holt', 'Homer', 'Honey', 'Honora', 'Honoria', 'Hope', 'Horace', 'Horus', 'Hosea', 'Hoshi', 'Hoshiko', 'Houston', 'Howard', 'Howe', 'Howell', 'Howie', 'Hubert', 'Hue', 'Huela', 'Huey', 'Hugh', 'Hugo', 'Humphrey', 'Hunter', 'Huso', 'Hussein', 'Hy', 'Hyacinth', 'Hyman', 'Hyroniemus', 'Ian', 'Ianna', 'Ianthe', 'Ida', 'Idalee', 'Idalia', 'Idana', 'Idande', 'Idania', 'Idra', 'Ife', 'Ige', 'Iggi', 'Iggy', 'Ignatius', 'Ike', 'Ilana', 'Ilario', 'Ilit', 'Ilo', 'Ilom', 'Ilori', 'Ilse', 'Ilyssa', 'Imogene', 'Ina', 'Inari', 'Independence', 'India', 'Indira', 'Indra', 'Inez', 'Infinity', 'Inga', 'Inge', 'Ingrid', 'Inoke', 'Iokina', 'Iola', 'Iolani', 'Ion', 'Iona', 'Ipo', 'Ira', 'Iram', 'Irene', 'Iria', 'Irina', 'Iris', 'Irisa', 'Irma', 'Irving', 'Iryl', 'Isaac', 'Isabel', 'Isabis', 'Isadora', 'Isaiah', 'Isha', 'Isi', 'Isis', 'Isleen', 'Ismaela', 'Ismail', 'Ismet', 'Isolde', 'Isra', 'Israel', 'Issay', 'Ita', 'Italia', 'Ivan', 'Ivi', 'Ivie', 'Ivo', 'Ivria', 'Ivrit', 'Ivy', 'Izefia', 'Izellah', 'Ja', 'Jaali', 'Jabari', 'Jabilo', 'Jabir', 'Jabulani', 'Jace', 'Jacinta', 'Jack', 'Jackie', 'Jackson', 'Jaclyn', 'Jacob', 'Jacoba', 'Jacqueline', 'Jacques', 'Jacqui', 'Jada', 'Jade', 'Jaden', 'Jadon', 'Jadyn', 'Jadzia', 'Jael', 'Jafaru', 'Jaime', 'Jaimie', 'Jake', 'Jalen', 'Jalene', 'Jalil', 'James', 'Jamese', 'Jamie', 'Jamila', 'Jan', 'Jana', 'Janae', 'Jane', 'Janel', 'Janelle', 'Janet', 'Janette', 'Jania', 'Janice', 'Janina', 'Janine', 'Japheth', 'Jara', 'Jared', 'Jariath', 'Jarrett', 'Jarvis', 'Jasmine', 'Jason', 'Jasper', 'Javen', 'Jay', 'Jayden', 'Jayme', 'Jazlynn', 'Jean', 'Jeanine', 'Jeanne', 'Jeb', 'Jeff', 'Jefferson', 'Jeffrey', 'Jemima', 'Jengo', 'Jenis', 'Jenna', 'Jennelle', 'Jennessa', 'Jennie', 'Jennifer', 'Jenny', 'Jens', 'Jensen', 'Jered', 'Jeremiah', 'Jeremy', 'Jeri', 'Jerica', 'Jericho', 'Jerod', 'Jeroen', 'Jerold', 'Jerom', 'Jerome', 'Jerommeke', 'Jerrell', 'Jerrick', 'Jerry', 'Jerusha', 'Jess', 'Jesse', 'Jessica', 'Jessie', 'Jesus', 'Jethro', 'Jett', 'Jewel', 'Jewell', 'Jezebel', 'Jianna', 'Jihan', 'Jill', 'Jillian', 'Jim', 'Jimmy', 'Jin', 'Jira', 'Jiro', 'Joan', 'Joann', 'Joanna', 'Joanne', 'Job', 'Jocasta', 'Jocelyn', 'Jock', 'Jodi', 'Jodie', 'Jody', 'Joe', 'Joel', 'Joelle', 'Joey', 'Johanna', 'John', 'Johnny', 'Joie', 'Jola', 'Jolene', 'Jolie', 'Jon', 'Jonah', 'Jonathan', 'Jonny', 'Jordan', 'Joren', 'Jorge', 'Jorn', 'Jorryn', 'Jory', 'Jose', 'Josef', 'Joseph', 'Josephine', 'Josh', 'Joshua', 'Joshwa', 'Josiah', 'Josie', 'Josue', 'Jovan', 'Jovianne', 'Jovita', 'Joy', 'Joyce', 'Joylyn', 'Juan', 'Juana', 'Juandalynn', 'Juanita', 'Jubal', 'Jud', 'Judah', 'Judd', 'Jude', 'Judith', 'Judson', 'Judy', 'Juji', 'Jules', 'Julia', 'Julian', 'Juliana', 'Julianna', 'Julianne', 'Julie', 'Juliet', 'Julio', 'Julisha', 'July', 'Jumoke', 'Jun', 'June', 'Junior', 'Justin', 'Justine', 'Justise', 'Kabibe', 'Kabili', 'Kacela', 'Kachina', 'Kacy', 'Kadeem', 'Kael', 'Kaelin', 'Kaethe', 'Kahlilia', 'Kai', 'Kaikura', 'Kailey', 'Kaitlyn', 'Kalea', 'Kalei', 'Kaleigh', 'Kaley', 'Kali', 'Kalin', 'Kalinda', 'Kalista', 'Kalli', 'Kamal', 'Kamali', 'Kame', 'Kamella', 'Kameryn', 'Kamilia', 'Kande', 'Kane', 'Kara', 'Karan', 'Kare', 'Kareem', 'Karen', 'Karena', 'Kari', 'Karik', 'Karim', 'Karimah', 'Karina', 'Karis', 'Karl', 'Karla', 'Karli', 'Karma', 'Karmina', 'Karna', 'Karston', 'Kaseko', 'Kasi', 'Kasim', 'Kaspar', 'Kassia', 'Kat', 'Kata', 'Kate', 'Katelin', 'Katharine', 'Katherine', 'Kathie', 'Kathleen', 'Kathryn', 'Kathy', 'Katie', 'Katina', 'Kato', 'Katrina', 'Katungi', 'Katy', 'Kaula', 'Kawena', 'Kay', 'Kaya', 'Kaycee', 'Kayla', 'Kaylana', 'Kaylee', 'Kayo', 'Kayonga', 'Kaz', 'Kazi', 'Kazu', 'Keagan', 'Keaira', 'Keb', 'Kedem', 'Kedma', 'Keefe', 'Keefer', 'Keegan', 'Keelan', 'Keelia', 'Keely', 'Keena', 'Keenan', 'Keene', 'Keeya', 'Kefira', 'Kei', 'Keiji', 'Keiki', 'Keir', 'Keira', 'Keiran', 'Keita', 'Keitaro', 'Keith', 'Kelby', 'Kelda', 'Kele', 'Kelii', 'Kelila', 'Kellan', 'Kellee', 'Kellen', 'Kelley', 'Kelli', 'Kellsie', 'Kelly', 'Kelsey', 'Kelton', 'Kelvin', 'Ken', 'Kenda', 'Kendall', 'Kendi', 'Kendis', 'Kendra', 'Kenisha', 'Kenley', 'Kenna', 'Kennan', 'Kennedi', 'Kennedy', 'Kenneth', 'Kenny', 'Kent', 'Kenton', 'Kenyi', 'Kenyon', 'Kenzie', 'Keola', 'Keon', 'Kerda', 'Keren', 'Kermit', 'Kern', 'Kerr', 'Kerri', 'Kerry', 'Kesin', 'Ketara', 'Kevin', 'Kevina', 'Keyanna', 'Khalida', 'Khalil', 'Khalipha', 'Khiry', 'Kia', 'Kiah', 'Kiana', 'Kiandra', 'Kibibe', 'Kiden', 'Kieran', 'Kiersten', 'Kiho', 'Kiki', 'Kiley', 'Killian', 'Kim', 'Kimball', 'Kimberly', 'Kimi', 'Kimmy', 'Kin', 'Kina', 'Kinfe', 'King', 'Kingston', 'Kinipela', 'Kioko', 'Kione', 'Kiora', 'Kipling', 'Kipp', 'Kira', 'Kirabo', 'Kiral', 'Kirby', 'Kiri', 'Kiril', 'Kirk', 'Kiros', 'Kirra', 'Kirsi', 'Kirsten', 'Kisha', 'Kishi', 'Kita', 'Kitoko', 'Kitra', 'Kitty', 'Kiyoshi', 'Kizzy', 'Klaus', 'Klitos', 'Knut', 'Koda', 'Koen', 'Koko', 'Kolton', 'Konane', 'Koren', 'Korene', 'Kori', 'Kory', 'Kostya', 'Koto', 'Kourtney', 'Kozue', 'Kris', 'Krista', 'Kristen', 'Kristin', 'Kristina', 'Kristine', 'Kristopher', 'Krystyn', 'Kuma', 'Kumi', 'Kumiko', 'Kura', 'Kuri', 'Kuron', 'Kurt', 'Kwanita', 'Kyla', 'Kyle', 'Kyleigh', 'Kylene', 'Kyler', 'Kylia', 'Kylie', 'Kyna', 'Kynan', 'Kynthia', 'Kyra', 'Kyrene', 'Kyria', 'L\'pree', 'La Don', 'Lacey', 'Lachlan', 'Lacy', 'Laddie', 'Lael', 'Lahela', 'Laina', 'Laird', 'Lajuan', 'Lajuana', 'Lakin', 'Lale', 'Laleh', 'Lali', 'Lalita', 'Lalo', 'Lamar', 'Lamont', 'Lan', 'Lana', 'Lanai', 'Lanaya', 'Lance', 'Lancelot', 'Landen', 'Landers', 'Landis', 'Landon', 'Landry', 'Lane', 'Lanelle', 'Lang', 'Langer', 'Langston', 'Lani', 'Lankston', 'Lanza', 'Laqueta', 'Lara', 'Laraine', 'Lareina', 'Larissa', 'Lark', 'Larry', 'Lars', 'Larue', 'Larvall', 'Lasca', 'Lassie', 'Laszlo', 'Latanya', 'Latham', 'Lathrop', 'Latika', 'Latimer', 'Latisha', 'Laura', 'Lauren', 'Laurence', 'Laurie', 'Laval', 'Lave', 'Laverne', 'Lavey', 'Lavi', 'Lavonn', 'Lavonne', 'Lawanda', 'Lawrence', 'Lawrencia', 'Layla', 'Layne', 'Lazar', 'Lazarus', 'Lea', 'Leah', 'Leal', 'Leala', 'Leander', 'Leane', 'Leanna', 'Leanne', 'Leavitt', 'Lecea', 'Leda', 'Ledell', 'Lee', 'Leena', 'Leeto', 'Lehana', 'Leia', 'Leif', 'Leigh', 'Leila', 'Leilani', 'Leimomi', 'Lel', 'Lela', 'Leland', 'Lelia', 'Lemuel', 'Lena', 'Lencho', 'Lenka', 'Lenora', 'Lenore', 'Lente', 'Leo', 'Leola', 'Leoma', 'Leon', 'Leona', 'Leonard', 'Leone', 'Leonie', 'Leonora', 'Leonzal', 'Leopold', 'Leora', 'Lerato', 'Leroy', 'Les', 'Lesa', 'Lesley', 'Leslie', 'Lester', 'Letitia', 'Lev', 'Levana', 'Leverett', 'Levi', 'Levia', 'Levon', 'Lewa', 'Lewis', 'Lex', 'Lexi', 'Lexine', 'Lia', 'Liam', 'Lian', 'Liana', 'Libba', 'Libby', 'Liberty', 'Lida', 'Lidia', 'Lien', 'Liko', 'Lila', 'Lilac', 'Lilah', 'Lilia', 'Liliha', 'Lilith', 'Lilli', 'Lillian', 'Lilo', 'Lily', 'Lin', 'Lina', 'Lincoln', 'Linda', 'Lindley', 'Lindsay', 'Lindsey', 'Lindy', 'Linus', 'Liona', 'Lionel', 'Lirit', 'Lisa', 'Lisbet', 'Lisette', 'Lisimba', 'Lisle', 'Liv', 'Livana', 'Livi', 'Livia', 'Livvy', 'Lixue', 'Liz', 'Liza', 'Lizbeth', 'Lizina', 'Llewellyn', 'Lloyd', 'Loba', 'Lobo', 'Locke', 'Logan', 'Lois', 'Lola', 'Lolonyo', 'Lolovivi', 'Lona', 'Lonato', 'London', 'Lonna', 'Lonnie', 'Lonnit', 'Lora', 'Lorelei', 'Lorena', 'Lorenzo', 'Loretta', 'Lori', 'Lorimer', 'Lorin', 'Loring', 'Lorna', 'Lorne', 'Lorraine', 'Lorretta', 'Lotta', 'Lotte', 'Lotus', 'Lou', 'Loughlin', 'Louis', 'Louisa', 'Louise', 'Loura', 'Lourana', 'Lourdes', 'Lourine', 'Love', 'Lovey', 'Lovie', 'Lowell', 'Luam', 'Luana', 'Lucas', 'Luce', 'Lucia', 'Lucian', 'Lucie', 'Lucille', 'Lucinda', 'Lucio', 'Lucius', 'Lucretia', 'Lucus', 'Lucy', 'Ludlow', 'Ludwig', 'Luigi', 'Luis', 'Luke', 'Lula', 'Lulli', 'Lulu', 'Luna', 'Lundy', 'Lunette', 'Lupe', 'Lupita', 'Luthando', 'Luther', 'Lyde', 'Lydia', 'Lyle', 'Lyn', 'Lynch', 'Lynda', 'Lynde', 'Lyndel', 'Lyndon', 'Lyndsey', 'Lynelle', 'Lynette', 'Lynley', 'Lynn', 'Lynna', 'Lynne', 'Lynnea', 'Lynton', 'Lyre', 'Lyris', 'Lysa', 'Lysander', 'Lysandra', 'Maarten', 'Maat', 'Mabel', 'Mac', 'Macayle', 'Macha', 'Mackenzie', 'Macy', 'Maddox', 'Madeleine', 'Madelia', 'Madeline', 'Madge', 'Madison', 'Madonna', 'Madra', 'Madrona', 'Mae', 'Maeko', 'Maemi', 'Maeron', 'Maeryn', 'Maeve', 'Magan', 'Magda', 'Magdalena', 'Magdalene', 'Magee', 'Maggie', 'Magnar', 'Magnolia', 'Maha', 'Mahala', 'Mahalia', 'Mahari', 'Mahdi', 'Maia', 'Maik', 'Maille', 'Maimun', 'Maire', 'Mairi', 'Maisie', 'Maj', 'Major', 'Makaila', 'Makale', 'Makalo', 'Makani', 'Makenna', 'Makya', 'Malachi', 'Malaika', 'Malana', 'Malaya', 'Malcolm', 'Maleah', 'Malia', 'Malina', 'Malissa', 'Malka', 'Mallory', 'Malo', 'Malomo', 'Malone', 'Malory', 'Mana', 'Mandel', 'Mandell', 'Mandy', 'Manica', 'Manning', 'Manon', 'Mansa', 'Manuel', 'Manuela', 'Mara', 'Marc', 'Marcel', 'Marcell', 'Marcella', 'Marcello', 'Marcellus', 'Marcia', 'Marcie', 'Marco', 'Marcus', 'Marcy', 'Mardell', 'Mardi', 'Mare', 'Maree', 'Marek', 'Maren', 'Marenda', 'Margaret', 'Margarita', 'Marge', 'Margo', 'Margot', 'Marguerite', 'Mari', 'Maria', 'Mariah', 'Mariam', 'Marianne', 'Mariatu', 'Maribel', 'Maribeth', 'Marie', 'Mariel', 'Marietta', 'Marigold', 'Marijke', 'Marika', 'Marilu', 'Marilyn', 'Marin', 'Marina', 'Marinel', 'Mario', 'Marion', 'Maris', 'Marisa', 'Marisela', 'Marisol', 'Marissa', 'Marius', 'Marjean', 'Marjorie', 'Mark', 'Marka', 'Marlas', 'Marlene', 'Marli', 'Marlie', 'Marlin', 'Marlo', 'Marlon', 'Marlow', 'Marly', 'Marnie', 'Marnin', 'Marnina', 'Maro', 'Marrim', 'Marsha', 'Marshall', 'Marta', 'Martha', 'Martin', 'Martina', 'Marty', 'Marv', 'Marva', 'Marvel', 'Marvela', 'Marvene', 'Marvin', 'Mary', 'Masada', 'Mashaka', 'Mason', 'Massimo', 'Matana', 'Mateo', 'Mathilda', 'Mathilde', 'Matia', 'Matias', 'Matilda', 'Matilde', 'Matrika', 'Matsu', 'Matt', 'Matteo', 'Matthew', 'Matthias', 'Mattox', 'Matty', 'Maude', 'Mauli', 'Maura', 'Maureen', 'Maurice', 'Maurilio', 'Maurizio', 'Mauro', 'Mauve', 'Maverick', 'Mavis', 'Max', 'Maxim', 'Maxima', 'Maxime', 'Maximilian', 'Maximos', 'Maxine', 'Maxwell', 'May', 'Maya', 'Mayan', 'Mayda', 'Mayes', 'Maylin', 'Maynard', 'Mckale', 'Mckayla', 'Mckenna', 'Mea', 'Mead', 'Meara', 'Meda', 'Medard', 'Medea', 'Meg', 'Megan', 'Meged', 'Mehalia', 'Mei', 'Meir', 'Mekelle', 'Mel', 'Melania', 'Melanie', 'Melantha', 'Melba', 'Melchior', 'Mele', 'Meli', 'Melia', 'Melina', 'Melinda', 'Meliora', 'Melisande', 'Melissa', 'Melita', 'Melody', 'Melora', 'Melosa', 'Melva', 'Melvin', 'Melvina', 'Melvyn', 'Mendel', 'Menora', 'Mercedes', 'Mercer', 'Mercia', 'Mercy', 'Meredith', 'Meria', 'Meris', 'Merle', 'Merlin', 'Merrill', 'Merritt', 'Merry', 'Merton', 'Merv', 'Mervin', 'Mervyn', 'Meryl', 'Meryle', 'Meshal', 'Messina', 'Metea', 'Mettabel', 'Mia', 'Micah', 'Michael', 'Michaela', 'Michal', 'Michel', 'Michele', 'Micheline', 'Michelle', 'Michon', 'Mick', 'Mickey', 'Micol', 'Mieko', 'Miette', 'Migdana', 'Mignon', 'Mika', 'Mikaili', 'Mike', 'Mikhail', 'Miki', 'Mikkel', 'Milan', 'Milandu', 'Mildred', 'Miles', 'Mili', 'Miliani', 'Miller', 'Millicent', 'Millie', 'Mills', 'Milly', 'Milo', 'Milt', 'Milton', 'Mimi', 'Mina', 'Minda', 'Mindy', 'Minerva', 'Miniya', 'Minna', 'Minnie', 'Minor', 'Minty', 'Mio', 'Mira', 'Mirabel', 'Mirabelle', 'Miracle', 'Miranda', 'Mircea', 'Mireille', 'Mirella', 'Miriam', 'Mirit', 'Miroslav', 'Mirra', 'Misae', 'Misha', 'Misty', 'Misu', 'Mitch', 'Mitchel', 'Mitchell', 'Miya', 'Miyanda', 'Miyoko', 'Mizell', 'Moana', 'Moanna', 'Modesta', 'Modesty', 'Mohammed', 'Mohan', 'Moina', 'Moira', 'Moke', 'Molly', 'Mona', 'Monahan', 'Monica', 'Monita', 'Monroe', 'Montague', 'Montana', 'Monte', 'Montego', 'Montgomery', 'Monty', 'Moon', 'Moon-unit', 'Mora', 'Moral', 'Morathi', 'Mordecai', 'More', 'Morela', 'Morey', 'Morgan', 'Morgana', 'Moriah', 'Moriba', 'Morley', 'Morna', 'Morrie', 'Morrigan', 'Morris', 'Morrison', 'Morse', 'Mort', 'Mortimer', 'Morton', 'Morty', 'Morwenna', 'Moses', 'Moshe', 'Moss', 'Mostyn', 'Moya', 'Moyna', 'Mrena', 'Muhammad', 'Muna', 'Mura', 'Muriel', 'Murphy', 'Murray', 'Murron', 'Musoke', 'Mutia', 'Mykel', 'Myles', 'Myra', 'Myrilla', 'Myrladis', 'Myrna', 'Myron', 'Myrtle', 'Naal', 'Nadia', 'Nadie', 'Nadine', 'Nafis', 'Nafuna', 'Naiser', 'Nakima', 'Nalo', 'Namir', 'Nan', 'Nancy', 'Nanette', 'Nani', 'Naolin', 'Naoll', 'Naomi', 'Napoleon', 'Nara', 'Narcisse', 'Nardo', 'Nariah', 'Nascha', 'Nasha', 'Nasia', 'Nasser', 'Nat', 'Natala', 'Natalia', 'Natalie', 'Natalya', 'Natane', 'Natasha', 'Nate', 'Nathalie', 'Nathan', 'Nathaniel', 'Natine', 'Natividad', 'Natori', 'Natsu', 'Nature', 'Navarro', 'Naveen', 'Navid', 'Nawal', 'Nayati', 'Nayeli', 'Nayer', 'Neal', 'Nealon', 'Necia', 'Neda', 'Nedra', 'Neely', 'Neena', 'Neetee', 'Neil', 'Nelia', 'Nellie', 'Nelson', 'Nen', 'Nenet', 'Neola', 'Nerina', 'Nerine', 'Nerissa', 'Nerita', 'Nero', 'Nessa', 'Nessan', 'Nestor', 'Netanya', 'Neva', 'Nevada', 'Nevan', 'Neville', 'Newman', 'Nia', 'Niabi', 'Niall', 'Niamh', 'Nichelle', 'Nicholai', 'Nicholas', 'Nick', 'Nicki', 'Nicodemus', 'Nicola', 'Nicole', 'Nicolette', 'Niel', 'Nigel', 'Nijole', 'Nikhil', 'Nikita', 'Nikki', 'Nikkos', 'Niles', 'Nimeesha', 'Nina', 'Ninon', 'Nira', 'Nissa', 'Nita', 'Nitara', 'Nitesh', 'Nitis', 'Niv', 'Nixie', 'Nizana', 'Noah', 'Noam', 'Nodin', 'Noe', 'Noel', 'Noelani', 'Nokomis', 'Nola', 'Nolan', 'Noland', 'Noma', 'Nomlanga', 'Nona', 'Nonnie', 'Nora', 'Norah', 'Noreen', 'Nori', 'Norina', 'Norm', 'Norma', 'Norman', 'Normandy', 'Norris', 'Norton', 'Norwood', 'Nova', 'Novia', 'Nowles', 'Noxolo', 'Noya', 'Nuncio', 'Nuri', 'Nuru', 'Nyako', 'Nydia', 'Nyeki', 'Nyoka', 'Nysa', 'Nyx', 'Oafe', 'Oakes', 'Oakley', 'Obedience', 'Oberon', 'Obert', 'Oceana', 'Octavia', 'Octavio', 'Octavious', 'Odele', 'Odelia', 'Odell', 'Odessa', 'Odetta', 'Odette', 'Odina', 'Odysseus', 'Ofer', 'Ogden', 'Ogima', 'Ohio', 'Oistin', 'Okal', 'Okalik', 'Okapi', 'Oke', 'Okechuku', 'Okoth', 'Oksana', 'Ola', 'Olaf', 'Olathe', 'Oleg', 'Olesia', 'Olga', 'Olin', 'Olinda', 'Olive', 'Oliver', 'Olivia', 'Ollie', 'Olympia', 'Omar', 'Omega', 'Ona', 'Onan', 'Oneida', 'Oni', 'Onslow', 'Oona', 'Opa', 'Opal', 'Ophelia', 'Ophira', 'Oprah', 'Ora', 'Oral', 'Oralee', 'Oran', 'Orane', 'Orde', 'Oren', 'Orenda', 'Oria', 'Oriana', 'Oriel', 'Orien', 'Oringo', 'Orino', 'Oriole', 'Orion', 'Orla', 'Orlando', 'Orleans', 'Orlee', 'Orli', 'Orly', 'Orma', 'Ormand', 'Orrick', 'Orsen', 'Orsin', 'Orson', 'Orton', 'Orville', 'Osanna', 'Osaze', 'Osborn', 'Osborne', 'Oscar', 'Osgood', 'Osias', 'Oskar', 'Osma', 'Osmond', 'Ossian', 'Ossie', 'Oswald', 'Othello', 'Otis', 'Otto', 'Ouray', 'Ova', 'Overton', 'Ovid', 'Owen', 'Ownah', 'Oz', 'Ozzie', 'Pabla', 'Pablo', 'Packard', 'Paco', 'Paddy', 'Page', 'Paige', 'Palani', 'Palesa', 'Paley', 'Pallas', 'Palma', 'Palmer', 'Paloma', 'Palti', 'Pamela', 'Pamelia', 'Pancho', 'Pandora', 'Panfila', 'Paniga', 'Panya', 'Paola', 'Paolo', 'Papina', 'Paris', 'Parker', 'Parkin', 'Parlan', 'Parley', 'Parrish', 'Parry', 'Parson', 'Pascal', 'Pascale', 'Pascha', 'Pasi', 'Patch', 'Patience', 'Patricia', 'Patrick', 'Patsy', 'Patty', 'Paul', 'Paula', 'Paulette', 'Paulina', 'Pauline', 'Paulo', 'Paulos', 'Paxton', 'Payton', 'Paz', 'Peale', 'Pearl', 'Pearlie', 'Pearly', 'Pebbles', 'Pedro', 'Peggy', 'Pelagia', 'Pelham', 'Pembroke', 'Penelope', 'Penn', 'Penney', 'Pennie', 'Penny', 'Peony', 'Pepper', 'Percival', 'Percy', 'Perdita', 'Perdy', 'Peregrine', 'Peri', 'Perrin', 'Perry', 'Pete', 'Peter', 'Petra', 'Petula', 'Petunia', 'Peyton', 'Phaedra', 'Phemia', 'Phiala', 'Phil', 'Phila', 'Philana', 'Philena', 'Philip', 'Phillip', 'Philomena', 'Philyra', 'Phindiwe', 'Phoebe', 'Phylicia', 'Phyliss', 'Phyllis', 'Phyre', 'Pia', 'Picabo', 'Pier', 'Piera', 'Pierce', 'Pierre', 'Pierrette', 'Pilar', 'Pillan', 'Piper', 'Pirro', 'Piuta', 'Placido', 'Plato', 'Platt', 'Pleasance', 'Plennie', 'Polly', 'Polo', 'Ponce', 'Poppy', 'Poria', 'Porter', 'Posy', 'Powa', 'Prentice', 'Prescott', 'Presencia', 'Preston', 'Price', 'Primo', 'Prince', 'Priscilla', 'Procopia', 'Prudence', 'Prue', 'Prunella', 'Psyche', 'Pyralis', 'Qabil', 'Qamar', 'Qiana', 'Qing-jao', 'Quade', 'Quana', 'Quanda', 'Quang', 'Queenie', 'Quella', 'Quennell', 'Quentin', 'Querida', 'Quiana', 'Quilla', 'Quillan', 'Quimby', 'Quin', 'Quincy', 'Quinlan', 'Quinn', 'Quinta', 'Quintin', 'Quinto', 'Quinton', 'Quirino', 'Quon', 'Qwin', 'Rabia', 'Rach', 'Rachael', 'Rachel', 'Rachelle', 'Radley', 'Radwan', 'Rae', 'Raeanne', 'Raegan', 'Rafael', 'Raffaello', 'Rafi', 'Raimi', 'Raina', 'Raine', 'Raisa', 'Raja', 'Raleigh', 'Ralph', 'Ramiro', 'Ramon', 'Ramona', 'Ramses', 'Ranae', 'Randall', 'Randilyn', 'Randolph', 'Randy', 'Rane', 'Ranee', 'Rania', 'Ranit', 'Raphael', 'Raphaela', 'Raquel', 'Rasha', 'Rashida', 'Rasia', 'Raul', 'Raven', 'Ravi', 'Ray', 'Raymond', 'Rayya', 'Razi', 'Rea', 'Read', 'Reagan', 'Reba', 'Rebecca', 'Rebekah', 'Red', 'Redell', 'Redford', 'Reed', 'Reese', 'Reeves', 'Regan', 'Regina', 'Reginald', 'Reilly', 'Reina', 'Remedy', 'Remi', 'Remington', 'Remy', 'Ren', 'Rena', 'Renata', 'Renate', 'Rene', 'Renee', 'Renny', 'Reth', 'Reuben', 'Revelin', 'Rex', 'Rey', 'Reyna', 'Reynard', 'Reynold', 'Reza', 'Rhea', 'Rhett', 'Rhiannon', 'Rhoda', 'Rhodes', 'Rhona', 'Rhonda', 'Rhoswen', 'Rhys', 'Ria', 'Rianna', 'Rianne', 'Ricardo', 'Rich', 'Richard', 'Ricjunette', 'Rick', 'Rico', 'Rider', 'Rigg', 'Riley', 'Rimca', 'Rimona', 'Rina', 'Ringo', 'Riona', 'Riordan', 'Risa', 'Rita', 'Riva', 'Rivka', 'Rob', 'Robbin', 'Robert', 'Robin', 'Robyn', 'Rocco', 'Rochelle', 'Rocio', 'Rock', 'Rockne', 'Rockwell', 'Rocky', 'Rod', 'Rodd', 'Roddy', 'Roderick', 'Rodney', 'Roger', 'Roland', 'Rolando', 'Rolf', 'Rollo', 'Romaine', 'Roman', 'Romeo', 'Rona', 'Ronald', 'Ronalee', 'Ronan', 'Ronat', 'Ronda', 'Ronia', 'Ronli', 'Ronna', 'Ronnie', 'Ronny', 'Roosevelt', 'Rori', 'Rory', 'Ros', 'Rosalba', 'Rosalia', 'Rosalind', 'Rosalyn', 'Rosamunde', 'Rose', 'Roseanne', 'Roselani', 'Rosemary', 'Roshaun', 'Rosie', 'Rosine', 'Ross', 'Rossa', 'Rothrock', 'Rowan', 'Rowdy', 'Rowena', 'Roxanne', 'Roy', 'Royce', 'Roz', 'Roza', 'Ruby', 'Rudolph', 'Rudra', 'Rudy', 'Rufina', 'Rufus', 'Rumer', 'Runa', 'Rune', 'Rupert', 'Russ', 'Russell', 'Russom', 'Rusti', 'Rusty', 'Ruth', 'Ryan', 'Ryder', 'Rylan', 'Ryland', 'Rylee', 'Rylie', 'Ryo', 'Saba', 'Sabina', 'Sabine', 'Sabra', 'Sabrina', 'Sachi', 'Sadie', 'Sadiki', 'Sadira', 'Safara', 'Saffron', 'Safina', 'Sage', 'Sahara', 'Saidi', 'Saku', 'Sal', 'Salena', 'Salene', 'Sally', 'Salome', 'Salvador', 'Salvatore', 'Sam', 'Samantha', 'Samson', 'Samuel', 'Sandra', 'Sandro', 'Sandy', 'Sanford', 'Sanjay', 'Sanjeet', 'Sanne', 'Santo', 'Santos', 'Sanyu', 'Sapphire', 'Sara', 'Sarah', 'Saraid', 'Sarama', 'Sarda', 'Sargent', 'Sarki', 'Sasha', 'Sasilvia', 'Saskia', 'Satchel', 'Satin', 'Satinka', 'Satu', 'Saul', 'Savannah', 'Sawyer', 'Saxen', 'Saxon', 'Saxton', 'Scarlet', 'Scarlett', 'Schuyler', 'Scot', 'Scott', 'Seamus', 'Sean', 'Seanna', 'Season', 'Sebastian', 'Sebastien', 'Seda', 'Seema', 'Seghen', 'Seiko', 'Selas', 'Selena', 'Selene', 'Selia', 'Selima', 'Selina', 'Selma', 'Sema', 'Semele', 'Semira', 'Senalda', 'September', 'Sera', 'Serafina', 'Serena', 'Serendipity', 'Serenity', 'Serepta', 'Serge', 'Sergio', 'Serwa', 'Seth', 'Seven', 'Severino', 'Sevinc', 'Seymour', 'Shacher', 'Shaina', 'Shakia', 'Shakila', 'Shakir', 'Shakira', 'Shakti', 'Shalaidah', 'Shaman', 'Shamara', 'Shamira', 'Shamus', 'Shana', 'Shandi', 'Shane', 'Shani', 'Shannen', 'Shannon', 'Shanon', 'Shantell', 'Shaquille', 'Sharis', 'Sharlene', 'Sharne', 'Sharon', 'Shasa', 'Shaun', 'Shauna', 'Shaunna', 'Shaw', 'Shawn', 'Shawna', 'Shay', 'Shea', 'Sheba', 'Sheehan', 'Sheena', 'Sheera', 'Sheila', 'Shel', 'Shelby', 'Sheldon', 'Shelley', 'Shelly', 'Sheri', 'Sheridan', 'Sherine', 'Sherise', 'Sherman', 'Sherri', 'Sherrie', 'Sherry', 'Sheryl', 'Shiela', 'Shiloh', 'Shing', 'Shino', 'Shira', 'Shiri', 'Shirley', 'Shirlyn', 'Shlomo', 'Shona', 'Shoshana', 'Shoshanah', 'Shubha', 'Sian', 'Sibyl', 'Sid', 'Sidney', 'Sidonia', 'Sidra', 'Sienna', 'Sierra', 'Signa', 'Sika', 'Silvain', 'Silvana', 'Silver', 'Sima', 'Simon', 'Simone', 'Sinclair', 'Sine', 'Sinead', 'Sinjin', 'Siobhan', 'Sissy', 'Sivney', 'Skip', 'Skipper', 'Skylar', 'Skyler', 'Slade', 'Sloan', 'Sloane', 'Slone', 'Smedley', 'Snow', 'Snowy', 'Sofia', 'Sol', 'Solace', 'Solana', 'Solange', 'Soleil', 'Solomon', 'Sondo', 'Sondra', 'Sonia', 'Sonnagh', 'Sonora', 'Sonya', 'Sophia', 'Sophie', 'Sora', 'Sorcha', 'Soren', 'Sorley', 'Spence', 'Spencer', 'Speranza', 'Spike', 'Stacey', 'Stacia', 'Stacy', 'Stan', 'Stanislaus', 'Stanislav', 'Stanislaw', 'Stanley', 'Star', 'Starr', 'Stavros', 'Stefan', 'Stefanie', 'Steffi', 'Steffie', 'Stella', 'Step', 'Stephan', 'Stephanie', 'Stephen', 'Stephenie', 'Sterling', 'Steve', 'Steven', 'Stevie', 'Stew', 'Stewart', 'Stillman', 'Stockton', 'Stone', 'Storm', 'Stormy', 'Stu', 'Stuart', 'Studs', 'Sue', 'Sugar', 'Sukey', 'Suki', 'Sulis', 'Sully', 'Sumana', 'Summer', 'Sunee', 'Sunny', 'Susan', 'Susane', 'Susanna', 'Susannah', 'Susie', 'Sutton', 'Suzanne', 'Suzette', 'Suzy', 'Svein', 'Sveta', 'Sybil', 'Sydnee', 'Sydney', 'Sylvain', 'Sylvester', 'Sylvia', 'Sylvie', 'Synan', 'Synclair', 'Syshe', 'Ta\'ib', 'Tab', 'Taban', 'Taber', 'Tabitha', 'Tacita', 'Tacy', 'Tad', 'Tadelesh', 'Tadhg', 'Taffy', 'Tai', 'Taifa', 'Tailynn', 'Taima', 'Tait', 'Tala', 'Talen', 'Talia', 'Taliesin', 'Talisa', 'Talisha', 'Talitha', 'Tallis', 'Tallulah', 'Talmai', 'Tam', 'Tama', 'Tamah', 'Tamara', 'Tamasha', 'Tamasine', 'Tamatha', 'Tambre', 'Tamera', 'Tameron', 'Tamika', 'Tammy', 'Tana', 'Tandice', 'Tanesia', 'Tania', 'Tanisha', 'Tanith', 'Tanner', 'Tanya', 'Tao', 'Tara', 'Taran', 'Tarana', 'Tarika', 'Tarin', 'Taru', 'Taryn', 'Tasha', 'Tasida', 'Tasmine', 'Tassos', 'Tate', 'Tatiana', 'Taurean', 'Tave', 'Tavi', 'Tavia', 'Tavita', 'Tawana', 'Taylor', 'Tazara', 'Tea', 'Teagan', 'Teague', 'Teal', 'Tecla', 'Ted', 'Teddy', 'Teenie', 'Tefo', 'Teige', 'Teleza', 'Teli', 'Telly', 'Telma', 'Temima', 'Temira', 'Temple', 'Templeton', 'Tenen', 'Teo', 'Terena', 'Terence', 'Terentia', 'Teresa', 'Termon', 'Terra', 'Terran', 'Terrel', 'Terrence', 'Terris', 'Terry', 'Terryal', 'Tertius', 'Tertullian', 'Terweduwe', 'Teshi', 'Tess', 'Tessa', 'Tex', 'Thad', 'Thaddeus', 'Thadeus', 'Thady', 'Thalassa', 'Thalia', 'Than', 'Thandeka', 'Thane', 'Thanh', 'Thatcher', 'Thayer', 'Thea', 'Thel', 'Thelma', 'Thema', 'Themba', 'Theo', 'Theodora', 'Theodore', 'Theresa', 'Therese', 'Thina', 'Thom', 'Thomas', 'Thor', 'Thora', 'Thornton', 'Thrine', 'Thron', 'Thurman', 'Thyra', 'Tia', 'Tiana', 'Tiaret', 'Tiassale', 'Tierney', 'Tiffany', 'Tilden', 'Tillie', 'Tilly', 'Tim', 'Timothy', 'Tina', 'Tino', 'Tip', 'Tirza', 'Tirzah', 'Tisha', 'Tivona', 'Toan', 'Tobit', 'Toby', 'Tod', 'Todd', 'Toki', 'Tolla', 'Tom', 'Tomas', 'Tommy', 'Tomo', 'Toni', 'Tony', 'Topaz', 'Topaza', 'Topo', 'Topper', 'Tori', 'Torie', 'Torn', 'Torrance', 'Torrin', 'Tory', 'Toshi', 'Totie', 'Tova', 'Tovah', 'Tovi', 'Townsend', 'Toyah', 'Tracey', 'Tracy', 'Traelic-an', 'Trahern', 'Tranquilla', 'Trapper', 'Trava', 'Travis', 'Trella', 'Trent', 'Trevor', 'Trey', 'Tricia', 'Trilby', 'Trina', 'Trini', 'Trinity', 'Trish', 'Trisha', 'Trista', 'Tristan', 'Tristana', 'Tristessa', 'Tristram', 'Trixie', 'Trory', 'Troy', 'Truda', 'Trude', 'Trudy', 'Trula', 'Truly', 'Truman', 'Tryphena', 'Tudor', 'Tuesday', 'Tulla', 'Tully', 'Tumo', 'Tuyen', 'Twila', 'Twyla', 'Ty', 'Tyanne', 'Tybal', 'Tyler', 'Tyme', 'Tyne', 'Tyra', 'Tyree', 'Tyrone', 'Tyson', 'Uang', 'Uba', 'Uday', 'Ugo', 'Ujana', 'Ula', 'Ulan', 'Ulani', 'Ulema', 'Ulf', 'Ull', 'Ulla', 'Ulric', 'Ulysses', 'Uma', 'Umay', 'Umberto', 'Umeko', 'Umi', 'Ummi', 'Una', 'Unity', 'Upendo', 'Urania', 'Urbain', 'Urban', 'Uri', 'Uriah', 'Uriel', 'Urilla', 'Urit', 'Ursa', 'Ursala', 'Ursula', 'Uta', 'Ute', 'Vail', 'Val', 'Valarie', 'Valencia', 'Valentina', 'Valentine', 'Valeria', 'Valerie', 'Valiant', 'Vallerie', 'Valtina', 'Van', 'Vance', 'Vandalin', 'Vanessa', 'Vangie', 'Vanna', 'Varen', 'Vaschel', 'Vatusia', 'Vaughan', 'Vaughn', 'Vea', 'Veasna', 'Vega', 'Velma', 'Venedict', 'Venetia', 'Vera', 'Verda', 'Verdi', 'Vern', 'Verna', 'Verne', 'Vernon', 'Veronica', 'Vesta', 'Vevay', 'Vevina', 'Vi', 'Vic', 'Vicki', 'Vicky', 'Victor', 'Victoria', 'Vida', 'Vidal', 'Vidor', 'Vienna', 'Vila', 'Vince', 'Vincent', 'Vine', 'Vinnie', 'Vinny', 'Vinson', 'Viola', 'Violet', 'Virgil', 'Virginia', 'Visola', 'Vita', 'Vitalis', 'Vito', 'Vittorio', 'Vivek', 'Vivi', 'Vivian', 'Viviana', 'Vivienne', 'Vlad', 'Vladimir', 'Volleny', 'Von', 'Vonda', 'Vondila', 'Vondra', 'Vui', 'Wade', 'Wafa', 'Waggoner', 'Walda', 'Waldo', 'Walker', 'Wallace', 'Walt', 'Walta', 'Walter', 'Wanda', 'Waneta', 'Ward', 'Warner', 'Warren', 'Wasaki', 'Washi', 'Washington', 'Waverly', 'Wayne', 'Webster', 'Welcome', 'Wenda', 'Wendell', 'Wendi', 'Wendy', 'Werner', 'Wes', 'Wesley', 'Weston', 'Wheeler', 'Whitby', 'Whitfield', 'Whitley', 'Whitney', 'Wilbur', 'Wiley', 'Wilford', 'Wilfred', 'Wilhelmina', 'Will', 'Willa', 'Willard', 'Willem', 'William', 'Willis', 'Wilma', 'Wilson', 'Wilton', 'Winda', 'Winfred', 'Winifred', 'Winona', 'Winslow', 'Winston', 'Winta', 'Winthrop', 'Wolfgang', 'Wood', 'Woodrow', 'Woods', 'Woody', 'Worden', 'Wyatt', 'Wyman', 'Wynn', 'Wynne', 'Wynona', 'Wyome', 'Xandy', 'Xanthe', 'Xanthus', 'Xanto', 'Xavier', 'Xaviera', 'Xena', 'Xenia', 'Xenophon', 'Xenos', 'Xerxes', 'Xi-wang', 'Xinavane', 'Xolani', 'Xuxa', 'Xylon', 'Yachi', 'Yadid', 'Yael', 'Yaholo', 'Yahto', 'Yair', 'Yale', 'Yamal', 'Yamin', 'Yana', 'Yancy', 'Yank', 'Yanka', 'Yanni', 'Yannis', 'Yardan', 'Yardley', 'Yaro', 'Yaron', 'Yaser', 'Yasin', 'Yasmin', 'Yasuo', 'Yates', 'Ye', 'Yeardleigh', 'Yehudi', 'Yelena', 'Yen', 'Yenge', 'Yepa', 'Yered', 'Yeriel', 'Yestin', 'Yetty', 'Yeva', 'Yihana', 'Yitro', 'Ymir', 'Yo', 'Yogi', 'Yoko', 'Yoland', 'Yolanda', 'Yonah', 'Yoninah', 'Yorick', 'York', 'Yosef', 'Yosefu', 'Yoshi', 'Yoshino', 'Yuk', 'Yuki', 'Yukio', 'Yul', 'Yule', 'Yuma', 'Yuri', 'Yuval', 'Yves', 'Yvette', 'Yvon', 'Yvonne', 'Zaccheus', 'Zach', 'Zachariah', 'Zachary', 'Zaci', 'Zada', 'Zahur', 'Zaida', 'Zaide', 'Zaila', 'Zaire', 'Zaki', 'Zalman', 'Zan', 'Zane', 'Zanna', 'Zara', 'Zareb', 'Zared', 'Zareh', 'Zarek', 'Zarifa', 'Zarina', 'Zavad', 'Zayn', 'Zaza', 'Zazu', 'Zbigniew', 'Ze\'ev', 'Zea', 'Zeb', 'Zebidy', 'Zebulon', 'Zed', 'Zedekiah', 'Zef', 'Zeheb', 'Zeke', 'Zeki', 'Zelda', 'Zelia', 'Zelig', 'Zena', 'Zenas', 'Zene', 'Zenia', 'Zenobia', 'Zenon', 'Zephan', 'Zesiro', 'Zev', 'Zia', 'Ziazan', 'Zikomo', 'Zili', 'Zilli', 'Zimri', 'Zinna', 'Zinnia', 'Zion', 'Ziraili', 'Zita', 'Ziv', 'Zivan', 'Ziven', 'Ziya', 'Zizi', 'Zo', 'Zoan', 'Zoe', 'Zoey', 'Zofia', 'Zohar', 'Zoie', 'Zola', 'Zoltan', 'Zoltin', 'Zona', 'Zorada', 'Zsa Zsa', 'Zula', 'Zuleika', 'Zulema', 'Zuriel', 'Zwi', 'Zyta'];
function getName() {
    return randomItem(names);
}
var catIcons = ['🐈', '😸', '😼', '😽', '😾', '😿', '🙀', '🐱‍👤', '🐱‍🐉', '🐱‍👓', '🐱‍🚀', '🐱‍🏍', '😹', '😻'];
var dogIcons = ['🐕', '🐶', '🐩', '🐺', '🐕', '🐶', '🐩', '🐺', '🐻', '🐨', '🌭'];
var catNames = ['Lackets', 'Ace', 'Alfie', 'Alonzo', 'Amberjack', 'Angel', 'Angus', 'Ashes', 'Astro', 'Baby', 'Bagel', 'Baguette', 'Barb', 'Barley', 'Basil', 'Batfish', 'Bella', 'Bill', 'Birdie', 'Bitty', 'Blackie', 'Bobo', 'Bombalurina', 'Buddy', 'Buffy', 'Bugsy', 'Bustopher Jones', 'Butter', 'Buttercup', 'Butterscotch', 'Buzz', 'Cabbage', 'Captain', 'Carbucketty', 'Carrot', 'Cashew', 'Casper', 'Catalufa', 'Chai', 'Chairman Meow', 'Charlie', 'Cheddar', 'Cheerio', 'Cherubfish', 'Chesnut', 'Chickpea', 'Chloe', 'Churro', 'Cinnamon', 'Clementine', 'Cleo', 'Coco', 'Coffee', 'Comet', 'Cranberry', 'Croaker', 'Croissant', 'Crouton', 'Crumbs', 'Crêpe', 'Cubby', 'Curry', 'Cutthroat', 'Daggertooth', 'Daisy', 'Demeter', 'Dewey', 'Diesel', 'Doodle', 'Dory', 'Dottie', 'Dragonfish', 'Ducky', 'Dude', 'Dumpling', 'Dwight', 'Edward', 'Etcetera', 'Fangtooth', 'Felix', 'Fergus', 'Fig', 'Flapjack', 'Fluffy', 'Fondue', 'Fraidy', 'Fritter', 'Frodo', 'Fudge', 'Gibberfish', 'Ginger', 'Granola', 'Gravy', 'Grits', 'Grizabella', 'Guacamole', 'Gumbo', 'Gyro', 'Hades', 'Hamlet', 'Hash Brown', 'Hector', 'Hoagie', 'Jack', 'Jalapeño', 'Jambalaya', 'Jasper', 'Jellicle', 'Jellylorum', 'Jemima', 'Jennyanydots', 'Jet', 'Jimmy', 'Jules', 'Kabob', 'Kimchi', 'Kingfish', 'Kitty', 'Knifejaw', 'Kumquat', 'Lackets', 'Lala', 'Latke', 'Lemonshark', 'Lentil', 'Licorice', 'Linguini', 'Lucky', 'Lucy', 'Macaron', 'Macavity', 'Maggie', 'Manny', 'Marshmallow', 'Max', 'Meatball', 'Milkshake', 'Millie', 'Milo', 'Missy', 'Misty', 'Molly', 'Mooneye', 'Morty', 'Moses', 'Mousse', 'Mr. Mistoffelees', 'Muffin', 'Mungojerrie', 'Munkustrap', 'Mushroom', 'Mushu', 'Mustard', 'Nimbus', 'Noodlefish', 'Nugget', 'Nutella', 'Old Deuteronomy', 'Oliver', 'Opah', 'Oreo', 'Oscar', 'Otto', 'Parsnip', 'Patch', 'Patches', 'Peaches', 'Peanut', 'Pecan', 'Perogi', 'Phil', 'Pickles', 'Pistachio', 'Ponyfish', 'Popcorn', 'Poppy', 'Porkchop', 'Porky', 'Pouncival', 'Princess', 'Pudding', 'Puss', 'Radish', 'Raisin', 'Rambo', 'Ramen', 'Reuben', 'Rooster', 'Rum Tum', 'Rumpleteazer', 'Rumpus Cat', 'Sacha', 'Sam', 'Samantha', 'Sammy', 'Sausage', 'Scampi', 'Scaredy', 'Sea raven', 'Shadow', 'Shortcake', 'Simba', 'Simon', 'Skimbleshanks', 'Smokey', 'Smudge', 'Sneaky', 'Snook', 'Snooty', 'Snots', 'Sooty', 'Sophie', 'Sorbet', 'Spaghetti', 'Sparkles', 'Sparky', 'Splashes', 'Sploosh', 'Squash', 'Sriracha', 'Stan', 'Stickers', 'String Bean', 'Sweet Pea', 'Sylvester', 'Synonym', 'Taffy', 'Tallulah', 'Tapetail', 'Tesla', 'Thumper', 'Thunder', 'Thyme', 'Tiger', 'Tigger', 'Timmy', 'Tink', 'Tinks', 'Tinky', 'Tippy', 'Toast', 'Tofu', 'Tom', 'Toothless', 'Tootsie', 'Treefish', 'Truffle', 'Turbo', 'Turkeyfish', 'Turnip', 'Turtle', 'Twinkie', 'Velvetfish', 'Victoria the White Cat', 'Vimba', 'Wahoo', 'Walleye', 'Warmouth', 'Weasel shark', 'Whiskers', 'Whiskey', 'Wolf-eel', 'Wonton', 'Wrymouth', 'Yam', 'Yellow-eye mullet', 'Yogi', 'Zingle', 'Ziti', 'Ziggy'];
var dogNames = ['Brackets', 'Stickers', 'Abbie', 'Abby', 'Abigail', 'Ace', 'Achilles', 'Addie', 'Ajax', 'Ali', 'Alice', 'Allie', 'Amber', 'Angel', 'Angus', 'Annie', 'Apollo', 'Archie', 'Arlo', 'Aspen', 'Athena', 'Atlas', 'Aurora', 'Axel', 'Babe', 'Baby', 'Baby Girl', 'Bailey', 'Bandit', 'Banjo', 'Barley', 'Baxter', 'Bear', 'Beau', 'Bella', 'Belle', 'Ben', 'Benny', 'Bentley', 'Bernie', 'Blaze', 'Blue', 'Bo', 'Bob', 'Bobby', 'Bodhi', 'Bolt', 'Boo', 'Boomer', 'Boots', 'Bowser', 'Brandy', 'Bristol', 'Brodie', 'Brody', 'Bruce', 'Bruno', 'Brutus', 'Bubba', 'Buddy', 'Buster', 'Caesar', 'Cali', 'Callie', 'Casey', 'Cash', 'Cassie', 'Chai', 'Chance', 'Charley', 'Charlie', 'Charlotte', 'Chase', 'Chena', 'Chevy', 'Chewy', 'Chica', 'Chico', 'Chief', 'Chinook', 'Chip', 'Chloe', 'Cinder', 'Cinnamon', 'Coal', 'Coco', 'Cocoa', 'Cody', 'Comet', 'Cookie', 'Cooper', 'Copper', 'Cosmo', 'Cricket', 'Daisy', 'Daisy Mae', 'Dakota', 'Dallas', 'Daphne', 'Dash', 'Dawson', 'Dax', 'Delilah', 'Denali', 'Deshka', 'Dexter', 'Diamond', 'Diego', 'Diesel', 'Dixie', 'Dobby', 'Doc', 'Dozer', 'Drake', 'Dude', 'Duke', 'Dusty', 'Dutch', 'Eddie', 'Ella', 'Ellie', 'Elsa', 'Elvis', 'Ember', 'Emma', 'Eva', 'Fancy', 'Finley', 'Finn', 'Fiona', 'Foxy', 'Frank', 'Frankie', 'Freya', 'Fritz', 'Frodo', 'George', 'Gertie', 'Gigi', 'Ginger', 'Gizmo', 'Goldie', 'Goose', 'Grace', 'Gracie', 'Grizzly', 'Gunner', 'Gus', 'Gypsy', 'Hank', 'Hannah', 'Harley', 'Hatcher', 'Hazel', 'Heidi', 'Henry', 'Hercules', 'Holly', 'Homer', 'Honey', 'Hope', 'Hunter', 'Indy', 'Isabella', 'Isis', 'Ivy', 'Izzy', 'Jack', 'Jackson', 'Jade', 'Jager', 'Jake', 'Jasmine', 'Jasper', 'Jax', 'Jaxx', 'Jazz', 'Jenny', 'Jesse', 'Jethro', 'Joe', 'Joey', 'Josie', 'Joy', 'Juno', 'Kai', 'Kaiser', 'Kane', 'Karma', 'Katie', 'Kaya', 'Kenai', 'Keta', 'Kiki', 'Kimber', 'King', 'Kinley', 'Kira', 'Kiska', 'Kita', 'Koa', 'Kobe', 'Kobuk', 'Koda', 'Kodiak', 'Koko', 'Kona', 'Lady', 'Layla', 'Leia', 'Lenny', 'Leo', 'Lexi', 'Lila', 'Lilly', 'Lily', 'Lincoln', 'Logan', 'Loki', 'Lola', 'Louie', 'Lucky', 'Lucy', 'Luka', 'Luke', 'Lulu', 'Luna', 'Mabel', 'Macy', 'Maddie', 'Maddy', 'Madison', 'Maggie', 'Major', 'Marley', 'Mason', 'Matilda', 'Mattie', 'Maui', 'Maverick', 'Max', 'Maximus', 'Maya', 'Mckinley', 'Mia', 'Mickey', 'Midnight', 'Mila', 'Miley', 'Millie', 'Milo', 'Mimi', 'Minnie', 'Mishka', 'Miska', 'Missy', 'Misty', 'Mocha', 'Mojo', 'Moki', 'Molly', 'Moose', 'Morgan', 'Murphy', 'Nala', 'Nanook', 'Nellie', 'Nikki', 'Nina', 'Nova', 'Nugget', 'Nukka', 'Oakley', 'Obi', 'Odie', 'Odin', 'Olive', 'Oliver', 'Ollie', 'Onyx', 'Oreo', 'Oscar', 'Otis', 'Otto', 'Ozzy', 'Panda', 'Papi', 'Parker', 'Patch', 'Peaches', 'Peanut', 'Pearl', 'Penelope', 'Penny', 'Pepper', 'Percy', 'Phoebe', 'Piper', 'Pixie', 'Poppy', 'Porter', 'Prince', 'Princess', 'Quinn', 'Radar', 'Raider', 'Ranger', 'Rascal', 'Raven', 'Rebel', 'Red', 'Reggie', 'Remi', 'Remington', 'Remy', 'Rex', 'Rico', 'Riley', 'Rio', 'Ripley', 'River', 'Rocco', 'Rocket', 'Rocky', 'Roger', 'Romeo', 'Roo', 'Roscoe', 'Rose', 'Rosie', 'Rowdy', 'Roxie', 'Roxy', 'Ruby', 'Rudy', 'Rufus', 'Ruger', 'Rusty', 'Ryder', 'Sadie', 'Sally', 'Sam', 'Samantha', 'Sammy', 'Sampson', 'Sandy', 'Sara', 'Sarge', 'Sasha', 'Sassy', 'Scooby', 'Scooter', 'Scout', 'Scrappy', 'Shadow', 'Sheba', 'Shelby', 'Sherman', 'Shiloh', 'Sierra', 'Simba', 'Simon', 'Sitka', 'Skippy', 'Skye', 'Smokey', 'Snickers', 'Sophia', 'Sophie', 'Sparky', 'Spike', 'Stanley', 'Star', 'Stella', 'Stormy', 'Sugar', 'Summer', 'Sunny', 'Sweet Pea', 'Sweetie', 'Sydney', 'Tallulah', 'Tank', 'Taz', 'Teddy', 'Thor', 'Thunder', 'Tiger', 'Tilly', 'Timber', 'Tinkerbell', 'Titan', 'Titus', 'Toby', 'Tonka', 'Tori', 'Trapper', 'Trigger', 'Trinity', 'Trixie', 'Trooper', 'Tucker', 'Tuffy', 'Tundra', 'Turbo', 'Tyson', 'Violet', 'Watson', 'Whiskey', 'Willow', 'Winnie', 'Winston', 'Wrigley', 'Xena', 'Yoda', 'Yuki', 'Yukon', 'Zeke', 'Zelda', 'Zeus', 'Ziggy', 'Ziva', 'Zoe', 'Zoey'];
var projectPart0 = ['project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'project', 'operation', 'operation', 'system', 'the', 'strategy', 'industrial', 'project']; //,'account','group'];
var projectPart1 = ['rattling', 'slate', 'aegean', 'amber', 'angry', 'arctic', 'black', 'bleak', 'blue', 'brave', 'bravo', 'bronze', 'chaos', 'chartreuse', 'chilled', 'cold', 'constant', 'crimson', 'crisp', 'cruel', 'crystal', 'cyan', 'delta', 'devout', 'diamond', 'drab', 'dry', 'emerald', 'fear', 'frozen', 'ghostly', 'gold', 'green', 'hot', 'icy', 'indigo', 'magenta', 'malachite', 'mauve', 'moon', 'nasty', 'neat', 'noble', 'ocean', 'orange', 'oscar', 'peace', 'plaid', 'platinum', 'pure', 'purple', 'rasping', 'red', 'resolute', 'robot', 'sabre', 'sane', 'sapphire', 'seagreen', 'shocking', 'shrieking', 'silver', 'slippy', 'sneaky', 'steam', 'steel', 'stoic', 'stormy', 'suffering', 'tasty', 'teal', 'tense', 'terse', 'tyrano', 'violet', 'wild', 'wise', 'wonder'];
var projectPart2 = ['viper', 'alpha', 'arms', 'arrow', 'axe', 'bacon', 'banjo', 'bishop', 'birch', 'blaze', 'calculo', 'cargo', 'castle', 'cats', 'centurion', 'chateau', 'cobra', 'creek', 'cup', 'dagger', 'dawn', 'december', 'disco', 'dolphin', 'donkey', 'dream', 'duck', 'ember', 'flare', 'fortune', 'fox', 'gazelle', 'gemstone', 'gimlet', 'giraffe', 'gnocchi', 'goat', 'hat', 'hound', 'husky', 'island', 'jacobite', 'key', 'knight', 'lion', 'marakesh', 'monkey', 'narwhal', 'night', 'oak', 'otter', 'palace', 'parakeet', 'pawn', 'penguin', 'puzzle', 'queen', 'rook', 'saurus', 'skull', 'sloth', 'spear', 'spider', 'teeth', 'tiger', 'timber', 'torch', 'wallaby', 'warrior', 'wave', 'whisper', 'window', 'wolf', 'zanzibar', 'zebra'];
function projectName() {
    return randomItem(projectPart0) + " " + randomItem(projectPart1) + "-" + randomItem(projectPart2);
}
var avatars = ['😕', '😉', '😕', '🙄', '🤣', '😀', '🙃', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😗', '😘', '😍', '😎', '😋', '😊', '😉', '😙', '😚', '🙂', '🤗', '🤔', '😜', '😛', '😌', '😴', '😫', '😪', '😯', '🤐', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😰', '😬', '😨', '😩', '😬', '😰', '😠', '😵', '😳', '😱', '😡', '😷', '🤒', '🤕', '🤢', '🤧', '🤥', '🤡', '🤠', '😇', '🤓', '😈', '👹', '👺'];
function getAvatar() {
    return randomItem(avatars);
}
var logos = ['🎈', '🎆', '🎇', '✨', '🎉', '🎊', '🎃', '🎄', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🎀', '🎗', '🎟', '🎫', '🎠', '🎡', '🎢', '🎪', '🎭', '🖼', '🎨', '🛒', '👓', '🕶', '🧥', '👔', '👕', '👖', '🧣', '🧤', '🧦', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '👞', '👟', '👠', '👢', '👑', '🧢', '👒', '🎩', '🎓', '💋', '💄', '💍', '💎', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎱', '🎳', '🥌', '⛳', '⛸', '🎣', '🎽', '🛶', '🎿', '🛷', '🥅', '🏒'];
function getLogo() {
    return randomItem(logos);
}
// todo: alphabetic ordering
var taskParts = ['validation', 'logical', 'virtual', 'structural', 'micro', 'hyper', 'accessible', 'indirect', 'pointer', 'truth', 'business', 'customer', 'person', 'manipulation', 'pure', 'seamless', 'crypto', 'interactive', 'SEO', 'custom', 'web', 'auto', 'digital', 'cyber', 'secure', '3D', 'enterprise', 'pro', 'developer', 'augmented', 'robo', 'productivity', 'neural', 'positronic', 'computery', 'deep', 'immutable', 'functional', 'lock-free', 'meta', 'native', 'non-virtual', 'opinionated', 'recursive', 'p2p', 'yet another', 'distributed', 'reticulated', 'hierarchical', 'obfuscated', 'weaponised', 'graphical', 'cloud-based', 'ethical', 'point-free', 'chat', 'social', 'mobile', 'embedded', 'critical', 'organic', 'user-generated', 'self-service', 'nano', 'pico', 'femto', 'keyword', 'A/B', 'optimal', 'high-res', 'retina', 'vector', 'raster', 'semantic', 'structural', 'self-closing', 'reverse', 'responsive', 'progressive', 'hybrid', 'pseudo', 'shadow', 'no-sql', 'big-data', 'uptime', 'offline', 'satellite', 'nuclear', 'hydrogen', 'batch', 'bulk', 'excessive', 'third-normal', 'logarithmic', 'linguistic'];
// todo: alphabetic ordering
// note: should be singular.
var taskParts2 = ['manifest', 'logic', 'algo', 'mesh', 'structure', 'form', 'service', 'container', 'data', 'DB', 'UX', 'UI', 'layer', 'component', 'system', 'diagram', 'app', 'client', 'server', 'host', 'class', 'object', 'function', 'job', 'part', 'platform', 'framework', 'foundation', 'emailer', 'pager', 'plugin', 'addin', '2.0', 'automation', 'cybernetics', 'drone', 'graphic', 'artwork', 'architecture', 'collector', 'list', 'heuristic', 'solver', 'network', 'net', '9000', '2001', 'multiplexor', 'switch', 'hub', 'paradigm', 'catalog', 'registry', 'RIA', 'SPA', 'IP', 'JSON', 'XML', 'CSV', 'Yaml', 'Macro', 'analytics', 'cluster', 'node', 'graph', 'avatar', 'reticulator', 'spline', 'hierarchy', 'thread', 'logging', 'engine', 'blockchain', 'map-reduce', 'content', 'exploit', 'hack', 'style', 'customization', 'RAM', 'DRM', 'GPGPU', 'wiki', 'devops', 'devoops', 'cta', 'funnel', 'theory', 'pixels', 'persona', 'parser', 'combinator', 'property', 'fields', 'attribute', 'column', 'sheet', 'datamodel', 'controller', 'sdk', 'DOM', 'RDBMS', 'vpn', 'vm', 'firewall', 'proxy', 'cache', 'laser', 'reactor', 'core', 'accelerator'];
function getTask() {
    return randomItem(taskParts) + ' ' + randomItem(taskParts2);
}
function LevelUp() {
    game.XP -= game.LevelUpXP;
    game.Level += 1;
    drawMessage("Level Up! " + game.Level + "\uD83E\uDD51");
    game.LevelUpXP = Inflate(game.Inflation, game.LevelUpXP);
    game.PointPrice = Inflate(game.Inflation, game.PointPrice);
    game.ProjectSize = Inflate(game.SmallInflation, game.ProjectSize);
    game.MaxAge += 5; //an extra 5 seconds is allowed for completing projects on each level;
    var items = game.AllLevelItems["l" + game.Level];
    if (items != undefined) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            game.StoreItems[item.id].enabled = true;
        }
        addClass(".visitStore", 'hint');
    }
    if (testMode) {
        for (var _a = 0, _b = Object.keys(game.StoreItems); _a < _b.length; _a++) {
            var key = _b[_a];
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
        case 2:
            //show 'hire dev/tester/ba' buttons
            removeClass('.getPerson.dev', 'hidden');
            addClass(".getPerson.dev", 'hint');
            if (storeFeatureFlag) {
                removeClass('.visitStore', 'hidden');
                addClass(".visitStore", 'hint');
            }
            break;
        case 3:
            removeClass('.getPerson.test', 'hidden');
            addClass('.getPerson.test', 'hint');
            break;
        case 4:
            removeClass('.getPerson.ba', 'hidden');
            addClass('.getPerson.ba', 'hint');
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
    var newValue = Math.floor(inflation * value);
    if (value == newValue)
        newValue++;
    return newValue;
}
function incrememntPoints(amount) {
    game.LifeTimePoints += amount;
    game.PositivePointEvents.push({ amount: amount, when: new Date() });
}
// TODO: add this to game class
function incrementMoney(amount) {
    game.Money += amount;
    if (amount > 0) {
        game.LifeTimeRevenue += amount;
        var payment = { amount: amount, when: new Date() };
        game.PositiveCashFlows.push(payment);
    }
    if (game.Money >= game.HighestMoney) {
        game.HighestMoney = game.Money;
    }
    drawMoney(game.Money);
}
function visitPrivacy() {
    $id('startscreen').classList.add('hidden');
    $id('privacy').classList.remove('hidden');
    $id('message').classList.add('hidden');
    $id('aboutLink').classList.add('hidden');
    $id('helpLink').classList.add('hidden');
}
function leavePrivacy() {
    $id('privacy').classList.add('hidden');
    $id('startscreen').classList.remove('hidden');
    $id('message').classList.remove('hidden');
    $id('aboutLink').classList.remove('hidden');
    $id('helpLink').classList.remove('hidden');
}
function visitStore() {
    DeSelectDoerAndReceiver();
    removeClass('.visitStore', 'hint');
    //change title to 'DevStore'
    $('h1')[0].innerText = "DevStore";
    drawStore();
    $id('store').classList.remove('hidden');
    $id('storeMessage').classList.remove('hidden');
    $id('office').classList.add('hidden');
    $id('message').classList.add('hidden');
    drawStoreMessage("⭐ Welcome to the DevStore ⭐");
}
function describe(itemId) {
    var item = game.StoreItems[itemId];
    if (!item.enabled) {
        // TODO: Until level X
        if (item.name.indexOf("OUT OF STOCK") != -1) {
            drawStoreMessage("Sorry, " + item.name + " " + item.icon + " \uD83D\uDE2D");
        }
        else {
            drawStoreMessage("\"" + item.name + " " + item.icon + "\" is not available until a higher level");
        }
        return;
    }
    drawStoreMessage("\"" + item.name + " " + item.icon + "\" " + item.description);
}
function drawStore() {
    var itemList = $id('items');
    // clear store items from #items
    itemList.innerText = "";
    // add store items to #items  
    for (var _i = 0, _a = Object.keys(game.StoreItems); _i < _a.length; _i++) {
        var key = _a[_i];
        var item = game.StoreItems[key];
        var shtml = getStoreItemHtml(item);
        var newItem = htmlToElement(shtml);
        itemList.appendChild(newItem);
    }
}
function getStoreItemHtml(item) {
    return "<div class='storeItem-catalog " + (item.enabled ? 'item-enabled' : 'item-disabled') + "' id='storeitem-" + item.id + "'><div onclick='purchase(" + item.id + ");' class='button' id='store-button-" + item.id + "'>\uD83D\uDCB2" + item.price + "</div><span class='storeIcon'>" + item.icon + "</span> <span class='describe' onclick='describe(" + item.id + ");' title='more information'>\u2753</span><span class='item-name'>" + item.name + "</span></div>";
}
function leaveStore() {
    DeSelectDoerAndReceiver();
    $id('store').classList.add('hidden');
    $id('office').classList.remove('hidden');
    $id('storeMessage').classList.add('hidden');
    $id('message').classList.remove('hidden');
    // change title back to 'DevShop'
    $('h1')[0].innerText = "DevShop";
}
function purchase(itemId) {
    var item = game.StoreItems[itemId]; //.filter(i => i.id == itemId)[0];
    if (!item.enabled) {
        // TODO: Until level X
        if (item.name.indexOf("OUT OF STOCK") != -1) {
            drawStoreMessage("Sorry, " + item.name + " " + item.icon + " \uD83D\uDE2D");
        }
        else {
            drawStoreMessage("\"" + item.name + " " + item.icon + "\" is not available until a higher level");
        }
        console.log(item);
        return;
    }
    if (game.Money < item.price) {
        drawStoreMessage("You cannot afford the " + item.name + " " + item.icon + " for \uD83D\uDCB2" + item.price);
        return;
    }
    incrementMoney(item.price * -1);
    // Add a shallow clone of the item (not the item itself)
    var clone = Object.assign({}, item);
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
    drawStoreMessage("You bought " + clone.name + " " + clone.icon + " for \uD83D\uDCB2" + clone.price + ". Nice!");
    // Every time you purchase an item, the price of that item goes up
    // consider: some specific items should have a different inflation curve. 
    item.price = Inflate(game.MediumInflation, item.price);
    // todo: make this a feature of the store, rather than a special case of the buybot.
    if (item.code == ItemCode.buybot) {
        item.name = item.name + " OUT OF STOCK";
        item.enabled = false;
        //refresh the item
        var html = getStoreItemHtml(item);
        $id("storeitem-" + item.id).outerHTML = html;
    }
    drawInboxItem("i" + clone.id, clone);
    $id("store-button-" + itemId).innerText = "\uD83D\uDCB2" + item.price;
}
//never use this ;)
function jalert(obj) {
    alert(JSON.stringify(obj));
}
function log(message) {
    if (debugOutput) {
        var m = htmlToElement("<div>" + message + "</div>");
        $id('debug').appendChild(m);
    }
    console.log(message);
}
var mainIntervalId;
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
    var now = new Date();
    //how long has the game been going?
    var gameAge_s = Math.floor(Math.abs(game.StartTime.getTime() - now.getTime()) / 1000);
    if (gameAge_s > 60) {
        var OneMinuteAgo = new Date(now.getTime() - 60000);
        var toRemove_1 = [];
        //remove any incomes from start of 
        for (var _i = 0, _a = game.PositiveCashFlows; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.when > OneMinuteAgo)
                break;
            game.LifeTimeRevenueMinus1Minute += x.amount;
            toRemove_1.push(x);
        }
        game.PositiveCashFlows = game.PositiveCashFlows.filter(function (item) { return !toRemove_1.includes(item); });
        toRemove_1 = [];
        for (var _b = 0, _c = game.PositivePointEvents; _b < _c.length; _b++) {
            var x = _c[_b];
            if (x.when > OneMinuteAgo)
                break;
            game.LifeTimePointsMinus1Minute += x.amount;
            toRemove_1.push(x);
        }
        game.PositivePointEvents = game.PositivePointEvents.filter(function (item) { return !toRemove_1.includes(item); });
    }
    var sixtySecondIncome = game.LifeTimeRevenue - game.LifeTimeRevenueMinus1Minute;
    var sixtySecondPoints = game.LifeTimePoints - game.LifeTimePointsMinus1Minute;
    //<span id='rate' title='revenue rate'>💲0/min</span>
    //removed: 💲${sixtySecondIncome}/min,
    $id('rate').innerText = "(" + sixtySecondPoints + "\uD83D\uDCCD/min)";
}
/*

// Save
localStorage.setItem('game', JSON.stringify(game));

// Load
game = JSON.parse(localStorage.getItem('game')); drawRoom();

*/
function loadmenu() {
    $id('startscreen').classList.add('hidden');
    $id('loadscreen').classList.remove('hidden');
    drawLoadScreen();
}
function exitloadmenu() {
    $id('loadscreen').classList.add('hidden');
    $id('startscreen').classList.remove('hidden');
}
function drawLoadScreen() {
    var gamesJson = localStorage.getItem('games');
    var games = JSON.parse(gamesJson);
}
function about() {
    //todo: show about screen
    $id('startscreen').classList.add('hidden');
    $id('aboutscreen').classList.remove('hidden');
}
function exitabout() {
    //todo: show about screen
    $id('aboutscreen').classList.add('hidden');
    $id('startscreen').classList.remove('hidden');
}
function joinemail() {
    //todo: join mailing list function joinemail
}
