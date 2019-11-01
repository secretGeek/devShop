var avgDuration = 400;
var startingMoney = 100;
var game;
//These are convenience objects which are handy references to game.Stories, game.People and game.Projects.
var stories;
var people;
//var persons: { [id: string] : IPerson; }
var projects;
var Game = /** @class */ (function () {
    function Game(startingMoney) {
        this.Money = startingMoney;
        this.HighestMoney = startingMoney;
        this.Level = 1;
        this.XP = 0;
        this.TotalXP = 0;
        this.NextId = 0;
        this.People = {};
        this.Stories = {};
        this.Projects = {};
    }
    return Game;
}());
var Person = /** @class */ (function () {
    function Person() {
    }
    return Person;
}());
var Story = /** @class */ (function () {
    function Story() {
    }
    return Story;
}());
var Project = /** @class */ (function () {
    function Project(lead) {
        this.stories = []; //the storyid's of the subsequent stories created by the BA
        this.lead = lead;
        this.stories = [];
    }
    return Project;
}());
function initGameState() {
    game = new Game(startingMoney);
    var player = { id: nextId(), skills: ["dev", "test", "ba"], name: "Founder", summary: "idle", icon: "🤔", efficiency: 0.2, XP: 0, busy: false };
    people = game.People;
    people['p' + player.id] = player;
    projects = game.Projects;
    stories = game.Stories;
    game.SelectedDoer = null;
    game.SelectedReceiver = null;
}
function nextId() {
    return ++game.NextId;
}
function drawRoom() {
    drawPeople(people, 'people');
    drawStories(stories, 'kanbanboard');
    drawMoney(game.Money);
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
function drawXP(xp) {
    var s = document.getElementById('xp');
    if (xp < 0) {
        s.classList.add("negative");
    }
    else {
        s.classList.remove("negative");
    }
    s.innerText = "" + xp + "🥓";
}
function removeStory(key, el) {
    var s = el.querySelector('#' + key);
    s.parentNode.removeChild(s);
}
function drawStory(key, stories, el, top) {
    var s = el.querySelector('#' + key);
    var avatar = "";
    var busy = "";
    var story = stories[key];
    if (story.icon != undefined) {
        avatar = "<span class='avatar'>" + story.icon + "</span>";
    }
    var logo = "<span class='logo'>" + story.logo + "</span>";
    if (story.busy) {
        busy = " busy";
    }
    var points = "<span class='points'>" + story.points + "</span>";
    var shtml = "<span class='story receiver " + story.column + busy + "' id='" + key + "' onclick='clickReceiver(\"" + key + "\");'>" + logo + story.summary + avatar + points + "</span>";
    if (s != null) {
        s.outerHTML = shtml;
    }
    else {
        var column = el.querySelector("td#" + story.column + " .inner");
        var newstory = htmlToElement(shtml);
        if (top) {
            column.insertBefore(newstory, column.firstChild);
        }
        else {
            column.appendChild(newstory);
        }
    }
}
function drawStories(stories, id) {
    var el = document.getElementById(id);
    for (var key in stories) {
        drawStory(key, stories, el, false);
    }
}
function drawPerson(key, people, el) {
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
    var skills = getSkillsDiv(person.skills);
    var phtml = "<span class='person doer" + busy + "' id='" + key + "' onclick='clickDoer(\"" + key + "\");'><span class='avatar2'>" + person.icon + "</span><div class='name'>" + person.name + "</div>" + skills + "<div class='summary'>" + person.summary + "</div></span>";
    var newPersonElement = htmlToElement(phtml);
    for (var _i = 0, _a = person.skills; _i < _a.length; _i++) {
        var skill = _a[_i];
        newPersonElement.classList.add(skill);
    }
    if (newPerson) {
        el.appendChild(newPersonElement);
    }
    else {
        p.outerHTML = newPersonElement.outerHTML;
    }
}
function getSkillsDiv(skills) {
    var result = "";
    for (var _i = 0, skills_1 = skills; _i < skills_1.length; _i++) {
        var s = skills_1[_i];
        var s1 = "";
        switch (s) {
            case "dev":
                s1 = "<span class='skill dev' title='developer'>💻</span>";
                break;
            case "test":
                s1 = "<span class='skill test' title='tester'>🔬</span>";
                break;
            case "ba":
                s1 = "<span class='skill ba' title='business analyst'>🗣</span>";
                break;
        }
        result += s1;
    }
    return "<div class='skills'>" + result + "</div>";
}
function drawPeople(people, id) {
    var el = document.getElementById(id);
    for (var key in people) {
        drawPerson(key, people, el);
    }
}
function go() {
    initGameState();
    drawRoom();
    $id('start').classList.add("hidden"); //hide 'start' button
    removeClass('.getLead', 'hidden'); //show 'purchase sales lead' button
    addClass(".getPerson", 'hidden'); //hide 'buy dev/test/ba' buttons. (They are re-enabled when total >= 300)
    drawMessage("STEP 1: press '🎁 find project'");
}
function getNewLead() {
    var price = 100;
    if (game.Money < price) {
        drawMessage("Will need to go into debit to get this lead.");
    }
    incrementMoney(price * -1);
    incrementXP(5);
    var newLead = { id: nextId(), points: 10, value: 1000, status: "lead", column: "ba", summary: projectName(), logo: getLogo(), person: null, busy: false, icon: null, hasBug: false, customerFoundBug: null, projectId: null };
    if (isEmpty(stories)) {
        // this was the first lead ever! give them a tip...
        drawMessage("Click the project " + newLead.logo + ", then click the Founder " + people["p1"].icon + " (or vice-versa)");
    }
    stories['r' + newLead.id] = newLead;
    drawStory('r' + newLead.id, stories, document.getElementById('kanbanboard'), false);
}
function getNewPerson(skill, price) {
    if (game.Money < price) {
        drawMessage("Cannot afford a new person.");
        console.log("Cannot afford a new person.");
        return;
    }
    incrementMoney(price * -1);
    incrementXP(10);
    var id = nextId();
    var newEmployee = { id: id, skills: [skill], summary: "idle", icon: getIcon(), efficiency: 0.15, name: getName(), XP: 0, busy: false };
    people['p' + id] = newEmployee;
    drawPerson('p' + id, people, document.getElementById('people'));
}
/*
//In any action there is a receiver and a doer. The doer can be 'the player' or a dev, tester, or BA.
  // the receiver could be... a card on the board, the phone, the computer, anyone.
  //When you click on someone, if there is no doer selected, they become the doer.
  //When you click on someone, if they are already the doer, they stop being the doer.
  //When you click on someone, if there is a doer selected, they become the doer instead.
  //They doer is highlighted. (The previous doer is no longer highlighted)
  //When someone becomes the doer... if there is already a receiver:
  //    Can the doer do what the receive needs done? then they are assigned to do the needful
  //      They are no longer highlighted as they are no longer the selected doer and receiver.
  //    They are not available to be highlighted until they are done doing the needful.
  //    If they cannot do what needs doing, then a message is displayed to this effect.
  //    The highlighting of receiver and doer is changed to indicate that they cannot fulfill each other (at least one must be changed)
  //When you click a receiver, if there is not receiver selected, it becomes the receiver.
    //When you click a receiver, if the receiver is already selected, it stops being the receiver.
  //When you click a receiver, if a different receiver was already selected, it stops being the receiver and this becomes the reciever.
  */
document.onkeypress = function (e) {
    switch (e.key) {
        case "1":
            var firstStory = Object.keys(stories).map(function (k) { return stories[k]; }).filter(function (s) { return s.column === 'ba' && s.status === 'lead' && !s.person; })[0];
            if (firstStory)
                clickReceiver('r' + firstStory.id);
            break;
        case "2":
            var firstStory = Object.keys(stories).map(function (k) { return stories[k]; }).filter(function (s) { return s.column === 'dev' && s.status === 'story' && !s.person; })[0];
            if (firstStory)
                clickReceiver('r' + firstStory.id);
            break;
        case "3":
            break;
        case "4":
            var firstStory = Object.keys(stories).map(function (k) { return stories[k]; }).filter(function (s) { return s.column === 'test' && s.status === 'story' && !s.person; })[0];
            if (firstStory)
                clickReceiver('r' + firstStory.id);
            break;
        case "5":
            break;
    }
};
function clickDoer(id) {
    if (game.SelectedDoer == id) {
        $id(game.SelectedDoer).classList.remove('selected');
        removeAllClass("possible");
        removeAllClass("badSelection");
        game.SelectedDoer = null;
        return;
    }
    if (game.SelectedDoer != undefined) {
        var doer = $id(game.SelectedDoer);
        if (doer != undefined)
            doer.classList.remove('selected');
        removeAllClass("possible");
        removeAllClass("badSelection");
    }
    game.SelectedDoer = id;
    $id(game.SelectedDoer).classList.add('selected');
    //As a 'doer' -- highlight everything I can do.  (where not busy)
    for (var _i = 0, _a = people[game.SelectedDoer].skills; _i < _a.length; _i++) {
        var skill = _a[_i];
        addClass("." + skill + ".receiver:not(.busy)", 'possible');
    }
    if (game.SelectedReceiver != undefined && game.SelectedDoer != undefined) {
        tryDo(game.SelectedDoer, game.SelectedReceiver);
    }
}
function clickReceiver(id) {
    if (game.SelectedReceiver == id) {
        $id(game.SelectedReceiver).classList.remove('selected');
        removeAllClass("possible");
        removeAllClass("badSelection");
        game.SelectedReceiver = null;
        return;
    }
    if (game.SelectedReceiver != undefined) {
        var receiver = $id(game.SelectedReceiver);
        if (receiver != undefined)
            receiver.classList.remove('selected');
        removeAllClass("possible");
        removeAllClass("badSelection");
    }
    game.SelectedReceiver = id;
    $id(game.SelectedReceiver).classList.add('selected');
    // As a 'receiver' -- highlight everything that can do this (where not busy)
    addClass("." + stories[game.SelectedReceiver].column + ".doer:not(.busy)", 'possible');
    if (game.SelectedReceiver != undefined && game.SelectedDoer != undefined) {
        tryDo(game.SelectedDoer, game.SelectedReceiver);
    }
}
function tryDo(doId, receiveId) {
    var doer = people[doId];
    var receiver = stories[receiveId];
    if (!doer.skills.includes(receiver.column)) {
        $id(doId).classList.add('badSelection');
        $id(receiveId).classList.add('badSelection');
        return;
    }
    if (doer.busy) {
        console.log("doer is busy");
        $id(doId).classList.add('badSelection');
    }
    if (receiver.busy) {
        $id(receiveId).classList.add('badSelection');
        console.log("receiver is busy");
    }
    if (doer.busy || receiver.busy) {
        return;
    }
    //doer will now do the receiver thing.
    $id(game.SelectedReceiver).classList.remove('selected');
    removeAllClass("possible");
    removeAllClass("badSelection");
    $id(game.SelectedDoer).classList.remove('selected');
    removeAllClass("possible");
    removeAllClass("badSelection");
    game.SelectedReceiver = null;
    game.SelectedDoer = null;
    doIt(doId, receiveId);
}
function doIt(doId, receiveId) {
    var story = stories[receiveId];
    var person = people[doId];
    story.busy = true;
    story.icon = person.icon;
    story.person = doId;
    person.busy = true;
    person.summary = getSummary(story);
    drawMessage(person.name + " is " + person.summary);
    drawPerson(doId, people, document.getElementById('people'));
    drawStory(receiveId, stories, document.getElementById('kanbanboard'), false);
    var duration = story.points * avgDuration * (1.0 / person.efficiency) * getTaskFactor(story.column);
    console.log("Duration: " + duration);
    setTimeout(function () { done(receiveId); }, duration);
}
function getSummary(story) {
    return getTaskVerb(story.column) + " '" + story.summary + "'...";
}
function getTaskVerb(column) {
    switch (column) {
        case "ba": return "analyzing";
        case "dev": return "designing";
        case "dev0": return "developing";
        case "test": return "testing";
    }
}
function getTaskFactor(column) {
    switch (column) {
        case "ba": return 0.3;
        case "dev": return 0.3;
        case "dev0": return 1.0;
        case "test": return 0.3;
    }
}
function done(receiveId) {
    var story = stories[receiveId];
    story.busy = false;
    var person = people[story.person];
    person.busy = false;
    person.XP += 1;
    incrementXP(1);
    drawMessage(person.name + " finished " + person.summary.replace('...', '.'));
    $id('p' + people[story.person].id).classList.remove("busy");
    switch (story.column) {
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
            alert('unrecognised ' + story.column);
    }
}
function doneBa(storyId) {
    //okay -- we've done the ba work on it.
    //now we add a bunch of cards to the backlog.
    var oldStory = stories[storyId];
    var person = people[oldStory.person];
    oldStory.status = 'done';
    console.log("Lead: " + storyId + " has been analyzed. A bunch of stories are being created.");
    //var project = 
    //projects[storyId] = new Project();// { lead: oldStory, stories: {[id:string]: Story }};
    //projects[storyId] = { lead: oldStory, stories: []};
    projects[storyId] = new Project(oldStory);
    //{[id:String]: Story; };
    //let project: Project = projects[storyId];
    //projects[storyId].lead = oldStory;
    //projects[storyId].stories = [];
    var newCards = [];
    //TODO: Don't always make same number of cards worth same number of points.
    for (var i = 0; i < 5; i++) {
        nextId();
        var newCard = { id: nextId(), points: 2, value: 200, status: "story", column: "dev", summary: getTask(), logo: oldStory.logo, projectId: storyId, person: null, icon: null, busy: false, hasBug: false, customerFoundBug: null };
        stories['r' + newCard.id] = newCard;
        newCards.push(newCard);
        //Add this new card to the list of stories for that project.
        projects[storyId].stories.push('r' + newCard.id);
    }
    person.busy = false;
    person.summary = "idle";
    drawPerson('p' + person.id, people, document.getElementById('people'));
    var el = document.getElementById('kanbanboard');
    //The original lead is removed from the board.
    removeStory(storyId, el);
    //The new stories are added (to the 'backlog' column)
    for (var _i = 0, newCards_1 = newCards; _i < newCards_1.length; _i++) {
        var cc = newCards_1[_i];
        drawStory('r' + cc.id, stories, el, false);
    }
}
function doneDev(storyId) {
    //okay -- it's done being in the backlog
    //maybe add it to dev -- or send it back to be clarified.
    var person = people[stories[storyId].person];
    //person.busy = null; //it continues straight into the dev0 role... so no need to mark the person idle.
    //person.summary = "idle";
    drawPerson('p' + person.id, people, document.getElementById('people'));
    var el = document.getElementById('kanbanboard');
    console.log("Story: " + storyId + " is being developed.");
    var story = stories[storyId];
    removeStory(storyId, el);
    story.column = "dev0";
    doIt(story.person, storyId);
}
function doneDev0(storyId) {
    //okay -- development is done
    //Add it to test
    var story = stories[storyId];
    var person = people[story.person];
    var bugLikelihood = (story.points / 12.0) * (1.0 - person.efficiency) * 100.0;
    console.log(storyId, story.points, person.efficiency);
    var hasBug = (Math.floor(Math.random() * 100) < bugLikelihood);
    //chance of adding a bug relates to effectiveness of dev, and size of story.
    if (hasBug) {
        story.hasBug = true;
        // Note the bug may or may not be found later. If not found the customer *will* find it.
        console.log("A bug was added to " + storyId + " which was " + Math.floor(bugLikelihood) + "% likely");
    }
    var el = document.getElementById('kanbanboard');
    removeStory(storyId, el);
    story.column = "test";
    story.person = null;
    story.icon = null;
    console.log("Story: " + storyId + " is ready for testing.");
    drawStory(storyId, stories, el, false);
    person.busy = false;
    person.summary = "idle";
    drawPerson('p' + person.id, people, document.getElementById('people'));
}
function doneTest(storyId) {
    //okay -- test is done
    var el = document.getElementById('kanbanboard');
    removeStory(storyId, el);
    var story = stories[storyId];
    //chance of finding bug relates to:
    // 1. is there a bug? If so, 2. how effective is the tester?
    var person = people[story.person];
    person.busy = false;
    person.summary = "idle";
    drawPerson('p' + person.id, people, document.getElementById('people'));
    if (story.hasBug) {
        var tester = people[story.person];
        var chanceOfFindingBug = (50 + tester.efficiency * 50.0);
        console.log("Story: " + storyId + " has a bug, there is a " + Math.floor(chanceOfFindingBug) + "% chance of finding it.");
        var foundBug = (Math.floor(Math.random() * 100) > chanceOfFindingBug);
        if (foundBug) {
            console.log("Found a bug in story: " + storyId);
            drawMessage(tester.name + " found a bug in story '" + story.summary + "'");
            story.person = null;
            story.hasBug = null;
            story.icon = "🐛";
            story.column = "dev";
            drawStory(storyId, stories, el, true);
            return;
        }
    }
    story.person = null;
    story.icon = null;
    console.log("Story: " + storyId + " passed testing. Done!");
    story.column = "done";
    story.icon = "✔";
    drawStory(storyId, stories, el, false);
    setTimeout(function () { bankStory(storyId); }, avgDuration * 5);
}
function bankStory(storyId) {
    var story = stories[storyId];
    var el = document.getElementById('kanbanboard');
    //If story has a bug... customer has now find it! (it got past testing!)
    //and it will go back the dev column!
    if (story.hasBug) {
        //remove from board
        removeStory(storyId, el);
        console.log("Customer found a bug in story: " + storyId);
        drawMessage("Oops! The customer found a bug in story '" + story.summary + "'");
        story.customerFoundBug = true;
        story.person = null;
        story.hasBug = null;
        //todo: much lower money too!
        story.icon = "🐞";
        story.column = "dev";
        drawStory(storyId, stories, el, true);
        return;
    }
    //But if there is no bug .. money will be paid... and if the project is thus completed, a completion payment is made.
    //TODO: set appropriate price
    var price = 50;
    var message2 = " for '" + story.summary + "'";
    incrementXP(5);
    if (story.customerFoundBug) {
        price = 25;
        message2 += " (reduced as customer found that bug)";
        //price is reduced because customer previously found a bug in this!.
    }
    var projectId = stories[storyId].projectId;
    //remove the story from the project it belongs to.
    var project = projects[projectId];
    var bonus = 0;
    if (project.stories.includes(storyId)) {
        project.stories.splice(project.stories.indexOf(storyId), 1);
        //if there are no stories remaining then a bonus is paid.
        console.log("removed this story from the project it belongs to");
        console.log("length", project.stories.length);
        if (project.stories.length == 0) {
            console.log("no stories left in project");
            //TODO: completion bonus;
            bonus = 100;
            message2 += " plus 💲" + bonus + " for completing '" + project.lead.summary + "'!";
            incrementXP(10);
        }
    }
    incrementMoney(price + bonus);
    drawMoney(game.Money);
    drawMessage("Earned 💲" + price + message2);
    removeStory(storyId, el);
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
function drawMessage(message) {
    $id('message').innerText = message;
}
function part(list) {
    return list[Math.floor(Math.random() * list.length)];
}
// names from https://introcs.cs.princeton.edu/java/data/
var names = ['Aaron', 'Abbie', 'Abbott', 'Abbra', 'Abby', 'Abe', 'Abel', 'Abeni', 'Abia', 'Abiba', 'Abie', 'Abigail', 'Abner', 'Abraham', 'Abram', 'Abrianna', 'Abrienda', 'Abril', 'Absolom', 'Abu', 'Acacia', 'Ace', 'Ada', 'Adah', 'Adair', 'Adalia', 'Adam', 'Adamina', 'Adamma', 'Adara', 'Addison', 'Ade', 'Adela', 'Adelaide', 'Adele', 'Adeline', 'Adelio', 'Adelle', 'Adem', 'Aden', 'Aderes', 'Adie', 'Adiel', 'Adila', 'Adina', 'Adita', 'Adlai', 'Adli', 'Adolfo', 'Adolph', 'Adonai', 'Adonia', 'Adora', 'Adrian', 'Adriana', 'Adriano', 'Adrienne', 'Ady', 'Aelan', 'Affrica', 'Afra', 'Afric', 'Africa', 'Afton', 'Agamemnon', 'Agatha', 'Aggie', 'Agnes', 'Ah Cy', 'Ahava', 'Ai', 'Aida', 'Aidan', 'Aiko', 'Aileen', 'Ailis', 'Ailish', 'Aimee', 'Aine', 'Ainsley', 'Aisling', 'Aislinn', 'Aizza', 'Aja', 'Ajani', 'Ajay', 'Akili', 'Akuji', 'Al', 'Alair', 'Alake', 'Alan', 'Alana', 'Alanna', 'Alastair', 'Alaura', 'Alban', 'Albany', 'Albert', 'Alberta', 'Alberto', 'Albin', 'Albina', 'Alda', 'Aldan', 'Alden', 'Aldon', 'Aldona', 'Alec', 'Alejandro', 'Alem', 'Alena', 'Aleta', 'Aletha', 'Alethea', 'Aletta', 'Alex', 'Alexa', 'Alexander', 'Alexandra', 'Alexandria', 'Alexia', 'Alexis', 'Alfonso', 'Alfred', 'Algeron', 'Ali', 'Alia', 'Alice', 'Alicia', 'Alijah', 'Alika', 'Alima', 'Alina', 'Alisha', 'Alison', 'Alissa', 'Alize', 'Alka', 'Allegra', 'Allen', 'Allene', 'Allie', 'Allison', 'Allyson', 'Alma', 'Almeda', 'Alohilani', 'Alphonse', 'Alsatia', 'Althea', 'Alva', 'Alvin', 'Alyn', 'Alyson', 'Alyssa', 'Amadeus', 'Amador', 'Amalia', 'Amalie', 'Aman', 'Amana', 'Amanda', 'Amandla', 'Amara', 'Amaranta', 'Amarante', 'Amaranth', 'Amaris', 'Amaryllis', 'Amaya', 'Amber', 'Ambrose', 'Amelia', 'Amena', 'Ami', 'Amiel', 'Amina', 'Amir', 'Amiri', 'Amity', 'Amma', 'Amorina', 'Amos', 'Amy', 'An', 'Ana', 'Anais', 'Analiese', 'Analise', 'Anana', 'Anando', 'Anastasia', 'Anatola', 'Anatole', 'Ande', 'Andra', 'Andralyn', 'Andre', 'Andrea', 'Andreas', 'Andres', 'Andrew', 'Andy', 'Anemone', 'Anevay', 'Angel', 'Angela', 'Angelica', 'Angelina', 'Angelo', 'Angie', 'Angus', 'Ani', 'Anika', 'Anila', 'Anisa', 'Anita', 'Anitra', 'Anja', 'Anlon', 'Ann', 'Anna', 'Annalise', 'Annamika', 'Anne', 'Anneke', 'Annette', 'Annice', 'Annick', 'Annis', 'Annissa', 'Annora', 'Anthea', 'Anthony', 'Antionette', 'Antoinette', 'Antonia', 'Antonie', 'Antony', 'Anwar', 'Anya', 'Aoko', 'Aolani', 'Aphrodite', 'Apollo', 'Appollo', 'Apria', 'April', 'Arabela', 'Arabella', 'Aram', 'Aran', 'Archibald', 'Archie', 'Aren', 'Aretha', 'Argus', 'Ari', 'Aria', 'Ariana', 'Ariel', 'Ariella', 'Arielle', 'Arien', 'Arissa', 'Arista', 'Ariza', 'Arlen', 'Arlene', 'Arlo', 'Arlynda', 'Armand', 'Armande', 'Armando', 'Armina', 'Arnaud', 'Arne', 'Arnie', 'Arnold', 'Aron', 'Art', 'Artemis', 'Arthur', 'Artie', 'Arty', 'Arvid', 'Arvin', 'Asa', 'Asabi', 'Asalie', 'Asasia', 'Ash', 'Asha', 'Ashby', 'Ashley', 'Ashling', 'Ashlyn', 'Ashton', 'Ashtyn', 'Asis', 'Asli', 'Asnee', 'Asta', 'Asthore', 'Astin', 'Astra', 'Astrid', 'Atalo', 'Athalia', 'Athena', 'Atira', 'Auberta', 'Aubrey', 'Aubrianna', 'Audi', 'Audra', 'Audrey', 'August', 'Augustin', 'Augustus', 'Aulii', 'Aure', 'Aurelia', 'Aurora', 'Aurorette', 'Austin', 'Autumn', 'Ava', 'Avalon', 'Avel', 'Aveline', 'Avery', 'Avi', 'Avis', 'Aviv', 'Aviva', 'Avongara', 'Axel', 'Axelle', 'Aya', 'Ayame', 'Ayanna', 'Ayla', 'Ayoka', 'Aysha', 'Azana', 'Aziza', 'Azize', 'Azra', 'Azriel', 'Azuka', 'Azura', 'Baba', 'Babette', 'Bahari', 'Bailey', 'Baird', 'Bairn', 'Bakula', 'Ballard', 'Balthasar', 'Bambi', 'Banji', 'Barake', 'Barb', 'Barbara', 'Barbie', 'Barclay', 'Barke', 'Barnabas', 'Barnard', 'Barney', 'Barny', 'Barr', 'Barran', 'Barretta', 'Barry', 'Bart', 'Barth', 'Bartholemew', 'Barton', 'Baruch', 'Bary', 'Bash', 'Basil', 'Bast', 'Bastien', 'Baxter', 'Bayard', 'Bayen', 'Baylee', 'Bayo', 'Bea', 'Beata', 'Beate', 'Beatrice', 'Beatriz', 'Beau', 'Beauregard', 'Bebe', 'Bebhin', 'Becca', 'Beck', 'Becka', 'Becky', 'Bel', 'Bela', 'Belay', 'Belden', 'Belinda', 'Belita', 'Bell', 'Bella', 'Belle', 'Bellini', 'Ben', 'Bena', 'Benard', 'Benedict', 'Benen', 'Benita', 'Benjamin', 'Benjy', 'Bennett', 'Benny', 'Benson', 'Berdine', 'Berke', 'Bern', 'Bernadette', 'Bernadine', 'Bernard', 'Berne', 'Bernice', 'Bernie', 'Berny', 'Bert', 'Bertha', 'Bertille', 'Beryl', 'Bess', 'Bessie', 'Beth', 'Bethan', 'Bethany', 'Betsy', 'Bette', 'Betty', 'Beulah', 'Bevan', 'Beverly', 'Bevis', 'Beyla', 'Biana', 'Bianca', 'Bibiane', 'Bidelia', 'Bikita', 'Bilen', 'Bill', 'Billy', 'Bin', 'Bina', 'Bing', 'Bingham', 'Birch', 'Bisbee', 'Bishop', 'Biton', 'Bjorn', 'Blade', 'Blaine', 'Blair', 'Blake', 'Blanche', 'Blaze', 'Blenda', 'Blinda', 'Bliss', 'Blithe', 'Blodwyn', 'Blossom', 'Blum', 'Bluma', 'Blythe', 'Bo', 'Boaz', 'Bob', 'Bona', 'Bonaventure', 'Bond', 'Bonita', 'Bonnie', 'Bono', 'Boone', 'Boris', 'Bowen', 'Bowie', 'Boyd', 'Bracha', 'Brad', 'Braden', 'Bradford', 'Bradley', 'Braeden', 'Braima', 'Bran', 'Brand', 'Brandee', 'Brandie', 'Brandon', 'Brant', 'Braxton', 'Brayden', 'Brazil', 'Breanna', 'Breckin', 'Brede', 'Bree', 'Brein', 'Brend', 'Brenda', 'Brendan', 'Brenna', 'Brennan', 'Brent', 'Brett', 'Brewster', 'Brian', 'Briana', 'Brianna', 'Brianne', 'Briar', 'Brice', 'Brick', 'Bridget', 'Bridgit', 'Brielle', 'Brier', 'Brigham', 'Brighton', 'Brigit', 'Brigitte', 'Brilane', 'Brilliant', 'Brina', 'Brinly', 'Brit', 'Brita', 'Britain', 'Britannia', 'Britany', 'Brittania', 'Brittany', 'Brittnee', 'Brock', 'Brody', 'Brone', 'Bronson', 'Bronwen', 'Brooke', 'Brooklyn', 'Brooks', 'Bruce', 'Bruno', 'Bryan', 'Bryanne', 'Bryant', 'Bryce', 'Brygid', 'Brynn', 'Bryony', 'Bryton', 'Buck', 'Bud', 'Buddy', 'Buffy', 'Bunny', 'Burdette', 'Burke', 'Burt', 'Burton', 'Butterfly', 'Buzz', 'Byrd', 'Byron', 'Cade', 'Cadee', 'Cadence', 'Cady', 'Cael', 'Caelan', 'Caesar', 'Cai', 'Cailean', 'Caimile', 'Cain', 'Caine', 'Cairbre', 'Cairo', 'Cais', 'Caitlin', 'Caitlyn', 'Cal', 'Cala', 'Calais', 'Calandra', 'Calantha', 'Calder', 'Cale', 'Caleb', 'Caley', 'Calhoun', 'Calix', 'Calixte', 'Calla', 'Callia', 'Calliope', 'Callista', 'Callum', 'Calvin', 'Calvine', 'Cam', 'Camdyn', 'Cameron', 'Camilla', 'Camille', 'Camlin', 'Cana', 'Candace', 'Candice', 'Candida', 'Candide', 'Candie', 'Candy', 'Cara', 'Caralee', 'Caresse', 'Carha', 'Carina', 'Carl', 'Carla', 'Carleton', 'Carlisle', 'Carlos', 'Carlota', 'Carlotta', 'Carlton', 'Carly', 'Carmel', 'Carmela', 'Carmelita', 'Carmen', 'Carmine', 'Carol', 'Carolena', 'Caroline', 'Carolyn', 'Caron', 'Carr', 'Carrick', 'Carrie', 'Carrieann', 'Carson', 'Carsyn', 'Carter', 'Carver', 'Cary', 'Casey', 'Cashlin', 'Casimir', 'Casondra', 'Caspar', 'Casper', 'Cassandra', 'Cassia', 'Cassidy', 'Cassius', 'Catherine', 'Cathy', 'Catrin', 'Cayla', 'Ceana', 'Cearo', 'Cece', 'Cecil', 'Cecile', 'Cecilia', 'Cecily', 'Cedric', 'Celeste', 'Celestyn', 'Celia', 'Celina', 'Celine', 'Cerise', 'Cesar', 'Chad', 'Chaela', 'Chaeli', 'Chailyn', 'Chaim', 'Chalsie', 'Chana', 'Chance', 'Chancellor', 'Chandler', 'Chandra', 'Channon', 'Chantal', 'Chantel', 'Charis', 'Charisse', 'Charity', 'Charla', 'Charlee', 'Charleigh', 'Charlene', 'Charles', 'Charlot', 'Charlotte', 'Charmaine', 'Charo', 'Chars', 'Chas', 'Chase', 'Chastity', 'Chauncey', 'Chava', 'Chavi', 'Chaylse', 'Cheche', 'Chelsa', 'Chelsea', 'Chelsi', 'Chelsia', 'Chen', 'Cheney', 'Chenoa', 'Cher', 'Cheri', 'Cherie', 'Cherlin', 'Cherry', 'Cheryl', 'Chesna', 'Chester', 'Chet', 'Cheyenne', 'Cheyne', 'Chezarina', 'Chhaya', 'Chick', 'Chico', 'Chill', 'Chilton', 'Chimelu', 'China', 'Chip', 'Chipo', 'Chloe', 'Chloris', 'Chris', 'Chrissy', 'Christa', 'Christian', 'Christiana', 'Christina', 'Christine', 'Christopher', 'Christy', 'Chuck', 'Chumani', 'Chun', 'Chyna', 'Chynna', 'Cian', 'Cianna', 'Ciara', 'Cicely', 'Cicero', 'Cicily', 'Cid', 'Ciel', 'Cindy', 'Cira', 'Cirila', 'Ciro', 'Cirocco', 'Cissy', 'Claire', 'Clara', 'Claral', 'Clare', 'Clarence', 'Clarissa', 'Clark', 'Clarke', 'Claude', 'Claudia', 'Clay', 'Clayland', 'Clayton', 'Clea', 'Cleantha', 'Cleatus', 'Cleavant', 'Cleave', 'Cleavon', 'Clem', 'Clemens', 'Clement', 'Clementine', 'Cleo', 'Cleta', 'Cleveland', 'Cliff', 'Clifford', 'Clifton', 'Clint', 'Clinton', 'Clio', 'Clitus', 'Clive', 'Clodia', 'Cloris', 'Clove', 'Clover', 'Cocheta', 'Cody', 'Cole', 'Colette', 'Coligny', 'Colin', 'Colista', 'Colleen', 'Collice', 'Collin', 'Colm', 'Colman', 'Colton', 'Columbia', 'Comfort', 'Conan', 'Conlan', 'Conley', 'Conner', 'Connie', 'Connley', 'Connor', 'Conor', 'Conrad', 'Constance', 'Constantine', 'Consuela', 'Consuelo', 'Content', 'Conway', 'Conyers', 'Cooper', 'Cora', 'Coral', 'Coralia', 'Coralie', 'Corbin', 'Corby', 'Cordelia', 'Corentine', 'Corey', 'Corin', 'Corina', 'Corine', 'Corinna', 'Corinne', 'Corliss', 'Cornelia', 'Cornelius', 'Cornell', 'Cort', 'Cory', 'Cosette', 'Cosima', 'Cosmo', 'Coty', 'Courtney', 'Coy', 'Coye', 'Craig', 'Creighton', 'Creola', 'Crescent', 'Crete', 'Crevan', 'Crispin', 'Cristy', 'Crystal', 'Cullen', 'Curry', 'Curt', 'Curtis', 'Cuthbert', 'Cutler', 'Cutter', 'Cy', 'Cybele', 'Cybil', 'Cybill', 'Cyd', 'Cyma', 'Cyndi', 'Cynthia', 'Cyrah', 'Cyril', 'Cyrus', 'D\'lorah', 'Da-xia', 'Dacey', 'Dafydd', 'Dagan', 'Dagmar', 'Dahlia', 'Daisy', 'Dakota', 'Dale', 'Dalia', 'Dalila', 'Dalit', 'Dallas', 'Dallin', 'Dalton', 'Dalva', 'Damian', 'Damita', 'Damon', 'Dan', 'Dana', 'Danae', 'Dane', 'Dani', 'Danica', 'Daniel', 'Daniela', 'Danielle', 'Danika', 'Danil', 'Danniell', 'Danny', 'Dante', 'Danton', 'Danyl', 'Daphne', 'Dara', 'Daray', 'Darby', 'Darcy', 'Dard', 'Daria', 'Darian', 'Darin', 'Dario', 'Darla', 'Darlene', 'Darnell', 'Darrell', 'Darren', 'Darrin', 'Darrion', 'Darrius', 'Darryl', 'Darshan', 'Darwin', 'Daryl', 'Dasan', 'Dasha', 'Davan', 'Dave', 'David', 'Davida', 'Davin', 'Davina', 'Davis', 'Davu', 'Dawn', 'Dayton', 'Dea', 'Dean', 'Deandra', 'Deanna', 'Deanne', 'Debbie', 'Debby', 'Deborah', 'Debra', 'Deidra', 'Deiondre', 'Deirdra', 'Deiter', 'Dejah', 'Deka', 'Del', 'Delaine', 'Delaney', 'Delbert', 'Delfina', 'Delia', 'Delila', 'Delilah', 'Deliz', 'Della', 'Delores', 'Delphine', 'Delta', 'Delu', 'Dembe', 'Demetria', 'Demetrius', 'Demi', 'Demitrius', 'Dempster', 'Den\'e', 'Dena', 'Denali', 'Denis', 'Denise', 'Denna', 'Dennis', 'Denver', 'Deo', 'Deon', 'Derby', 'Derek', 'Derex', 'Derica', 'Dermot', 'Derora', 'Derrick', 'Derron', 'Derry', 'Des', 'Desana', 'Desdemona', 'Desi', 'Desiderio', 'Desiree', 'Desmond', 'Dessa', 'Destiny', 'Deva', 'Devaki', 'Devi', 'Devin', 'Devon', 'Devorah', 'Devorit', 'Dewey', 'Dewitt', 'Dexter', 'Dextra', 'Diallo', 'Diana', 'Diane', 'Dianne', 'Diantha', 'Dianthe', 'Diata', 'Dick', 'Didier', 'Didrika', 'Diego', 'Dillan', 'Dillian', 'Dillon', 'Dina', 'Dinah', 'Dino', 'Dion', 'Dionne', 'Dionysius', 'Dionysus', 'Dior', 'Dirk', 'Dixie', 'Dixon', 'Dmitri', 'Doane', 'Doctor', 'Doda', 'Doi', 'Dolly', 'Dolores', 'Dolph', 'Dom', 'Domani', 'Dominic', 'Dominick', 'Dominique', 'Dominy', 'Don', 'Donagh', 'Donahi', 'Donal', 'Donald', 'Donat', 'Donelle', 'Donna', 'Donnel', 'Donnica', 'Donny', 'Donovan', 'Dora', 'Dorcas', 'Dore', 'Dori', 'Doria', 'Dorian', 'Dorie', 'Dorinda', 'Doris', 'Dorit', 'Dorothea', 'Dorothy', 'Dorset', 'Dorsey', 'Dory', 'Dot', 'Dotty', 'Doug', 'Dougal', 'Douglas', 'Douglass', 'Doyle', 'Doyt', 'Drake', 'Dreama', 'Drew', 'Dru', 'Duane', 'Duc', 'Dudley', 'Duena', 'Duff', 'Dugan', 'Duka', 'Duke', 'Dulce', 'Dulcea', 'Dulcina', 'Dulcinea', 'Dumi', 'Duncan', 'Dunixi', 'Dunja', 'Dunn', 'Dunne', 'Duscha', 'Dustin', 'Dusty', 'Dwayne', 'Dwight', 'Dyan', 'Dyani', 'Dyanne', 'Dylan', 'Dyllis', 'Dyre', 'Dysis', 'Eadoin', 'Eamon', 'Earl', 'Earlene', 'Earnest', 'Easter', 'Eavan', 'Ebony', 'Echo', 'Ed', 'Edalene', 'Edaline', 'Edana', 'Edda', 'Eddie', 'Eddy', 'Edeline', 'Eden', 'Edena', 'Edgar', 'Edie', 'Edison', 'Edita', 'Edith', 'Edmund', 'Edna', 'Edric', 'Edward', 'Edwardo', 'Edwin', 'Edwina', 'Edythe', 'Effie', 'Efrat', 'Efrem', 'Egan', 'Eileen', 'Eilis', 'Eitan', 'Ela', 'Elaine', 'Elan', 'Elana', 'Elani', 'Elata', 'Elda', 'Elden', 'Eldon', 'Eldora', 'Eleanor', 'Electra', 'Elena', 'Elephteria', 'Elgin', 'Eli', 'Elia', 'Elias', 'Elie', 'Elijah', 'Elin', 'Eliora', 'Eliot', 'Elise', 'Elisha', 'Elita', 'Eliza', 'Elizabeth', 'Eljah', 'Elkan', 'Elke', 'Ella', 'Ellard', 'Elle', 'Ellema', 'Ellen', 'Ellery', 'Ellie', 'Elliot', 'Elliott', 'Ellis', 'Elmo', 'Eloise', 'Elsa', 'Elsie', 'Elspeth', 'Elton', 'Elu', 'Elvin', 'Elvina', 'Elvira', 'Elvis', 'Ely', 'Elysia', 'Emanuel', 'Emanuele', 'Emele', 'Emene', 'Emera', 'Emerald', 'Emery', 'Emil', 'Emilia', 'Emilie', 'Emilio', 'Emily', 'Emma', 'Emmanuel', 'Emmet', 'Emmett', 'Emmly', 'Enid', 'Ennis', 'Enos', 'Enrico', 'Eolande', 'Ephraim', 'Epifanio', 'Er', 'Erasmus', 'Eri', 'Eric', 'Erica', 'Erik', 'Erika', 'Erimentha', 'Erin', 'Eris', 'Erland', 'Erma', 'Erme', 'Ermin', 'Erna', 'Ernest', 'Ernie', 'Erno', 'Eron', 'Eros', 'Errin', 'Errol', 'Erv', 'Ervin', 'Erwin', 'Eryk', 'Esben', 'Eshe', 'Esma', 'Esmerelda', 'Esteban', 'Estelle', 'Ester', 'Esther', 'Estralita', 'Etan', 'Etana', 'Eternity', 'Ethan', 'Ethel', 'Ethelda', 'Etta', 'Eudora', 'Eugene', 'Eulalia', 'Eulalie', 'Eupemia', 'Euphemia', 'Euridice', 'Eva', 'Evan', 'Evane', 'Evangeline', 'Evania', 'Eve', 'Evelia', 'Evelien', 'Evelyn', 'Everett', 'Evette', 'Evie', 'Evita', 'Evonne', 'Ewa', 'Eyal', 'Eydie', 'Ezekiel', 'Ezra', 'Fabian', 'Fabienne', 'Fabiola', 'Fabrizio', 'Fabunni', 'Fairfax', 'Fairly', 'Faith', 'Fala', 'Fale', 'Fallon', 'Fanchon', 'Farica', 'Faris', 'Farley', 'Farrah', 'Farrell', 'Fatima', 'Fausta', 'Faustine', 'Favian', 'Fawn', 'Fay', 'Faye', 'Faylinn', 'Fedora', 'Feivel', 'Feleti', 'Felicia', 'Felicity', 'Felimy', 'Felix', 'Fell', 'Felton', 'Fennella', 'Feoras', 'Ferdinand', 'Fergal', 'Fergus', 'Ferguson', 'Fern', 'Fernando', 'Ferris', 'Ferrol', 'Fiachra', 'Fico', 'Fidel', 'Fidelia', 'Fidelio', 'Fidella', 'Field', 'Filbert', 'Filia', 'Filipina', 'Fineen', 'Finley', 'Finn', 'Finna', 'Finola', 'Fiona', 'Fionan', 'Fionn', 'Fionnula', 'Fiorenza', 'Fisk', 'Fisseha', 'Flan', 'Flannery', 'Flavian', 'Fletcher', 'Fleur', 'Flint', 'Flo', 'Flora', 'Floramaria', 'Florence', 'Floria', 'Floriane', 'Florida', 'Florrie', 'Flower', 'Floyd', 'Flynn', 'Fola', 'Fonda', 'Fondea', 'Forbes', 'Ford', 'Fordon', 'Forrest', 'Forrester', 'Forster', 'Fortune', 'Foster', 'Fountain', 'Fox', 'Foy', 'Fraley', 'Fran', 'Frances', 'Francesca', 'Francis', 'Frank', 'Franklin', 'Franz', 'Frasier', 'Frayne', 'Fred', 'Freddy', 'Frederica', 'Frederick', 'Fredrica', 'Freed', 'Freeman', 'Freja', 'Fremont', 'Freya', 'Frieda', 'Fritz', 'Fritzi', 'Fronde', 'Fruma', 'Frye', 'Fulbright', 'Fuller', 'Fynn', 'Gabby', 'Gabe', 'Gabi', 'Gabriel', 'Gabriela', 'Gabriella', 'Gabrielle', 'Gaby', 'Gaetan', 'Gaetane', 'Gafna', 'Gage', 'Gail', 'Gaille', 'Gainell', 'Gaius', 'Gale', 'Galen', 'Galeno', 'Gali', 'Gallagher', 'Gallia', 'Galvin', 'Gamada', 'Gamal', 'Gamaliel', 'Ganit', 'Gannon', 'Ganya', 'Gardner', 'Gareth', 'Garfield', 'Garren', 'Garret', 'Garrett', 'Garrick', 'Garrison', 'Garron', 'Garry', 'Garson', 'Garth', 'Garvey', 'Gary', 'Gates', 'Gaurav', 'Gautier', 'Gavan', 'Gavin', 'Gavivi', 'Gavril', 'Gay', 'Gaye', 'Gayle', 'Gaylord', 'Gaynell', 'Gazali', 'Gazelle', 'Gazit', 'Gella', 'Gelsey', 'Gemma', 'Gene', 'Genet', 'Geneva', 'Genevieve', 'Genna', 'Gent', 'Geoff', 'Geoffrey', 'Geordi', 'George', 'Georgette', 'Georgia', 'Georgina', 'Gerald', 'Geraldene', 'Geraldine', 'Geraldo', 'Gerard', 'Gerda', 'Geri', 'Gerik', 'Germain', 'Germaine', 'Gerodi', 'Gerry', 'Gershom', 'Gertrude', 'Ghita', 'Giacomo', 'Gianna', 'Gibson', 'Gideon', 'Gigi', 'Gil', 'Gilbert', 'Gilda', 'Giles', 'Gili', 'Gillespie', 'Gillian', 'Gin', 'Gina', 'Ginacarlo', 'Ginata', 'Ginger', 'Ginny', 'Gino', 'Giolla', 'Giorgio', 'Giovanni', 'Gisela', 'Giselle', 'Gita', 'Gitano', 'Gitel', 'Gittel', 'Giulio', 'Giuseppe', 'Giva', 'Giza', 'Gladys', 'Glen', 'Glenda', 'Glenn', 'Glenna', 'Glennis', 'Glenys', 'Glora', 'Gloria', 'Glory', 'Glyn', 'Glynis', 'Glynnis', 'Godana', 'Godfrey', 'Golda', 'Goldie', 'Goldy', 'Gomer', 'Gordon', 'Gordy', 'Grace', 'Gracie', 'Grady', 'Graham', 'Gram', 'Grania', 'Grant', 'Granville', 'Gratia', 'Gratiana', 'Grayson', 'Grazia', 'Greer', 'Greg', 'Gregg', 'Gregory', 'Greta', 'Gretchen', 'Gretel', 'Griffin', 'Griselda', 'Grizelda', 'Grover', 'Guadalupe', 'Gualtier', 'Guban', 'Guenevere', 'Guido', 'Guinevere', 'Gunnar', 'Gunther', 'Gur', 'Gure', 'Guri', 'Gustav', 'Guy', 'Gwen', 'Gwendolyn', 'Gwyn', 'Gwyneth', 'Gypsy', 'Haben', 'Habib', 'Hada', 'Hadar', 'Hadassah', 'Hadley', 'Haile', 'Haines', 'Hajari', 'Hal', 'Halen', 'Haley', 'Hali', 'Halona', 'Ham', 'Hamal', 'Hamilton', 'Hamlet', 'Hamlin', 'Hampton', 'Hana', 'Hank', 'Hanley', 'Hanna', 'Hannah', 'Hannelore', 'Hans', 'Hanzila', 'Hao', 'Haracha', 'Harlan', 'Harley', 'Harlow', 'Harmon', 'Harmony', 'Harold', 'Haroun', 'Harper', 'Harriet', 'Harrison', 'Harry', 'Hart', 'Hartwell', 'Haru', 'Haruki', 'Haruko', 'Haruni', 'Harva', 'Harvey', 'Hasad', 'Hasana', 'Hastin', 'Hateya', 'Haven', 'Hawa', 'Hayden', 'Hayley', 'Hayward', 'Hazel', 'Hazelle', 'Hazina', 'Heath', 'Heather', 'Heavynne', 'Hector', 'Hedda', 'Hedia', 'Hedva', 'Hedwig', 'Hedy', 'Hedya', 'Heidi', 'Heinz', 'Helaine', 'Helen', 'Helena', 'Helene', 'Helga', 'Helia', 'Heller', 'Heloise', 'Henri', 'Henrietta', 'Henrik', 'Henry', 'Hera', 'Herb', 'Herbert', 'Herbst', 'Heremon', 'Herman', 'Herschel', 'Hertz', 'Hesper', 'Hester', 'Hestia', 'Hewitt', 'Hidalgo', 'Hidi', 'Hiero', 'Hija', 'Hila', 'Hilaire', 'Hilary', 'Hilda', 'Hilde', 'Hillary', 'Hilzarie', 'Hina', 'Hinda', 'Hiroko', 'Hirsi', 'Holden', 'Holiday', 'Hollace', 'Holli', 'Hollis', 'Holly', 'Hollye', 'Holt', 'Homer', 'Honey', 'Honora', 'Honoria', 'Hope', 'Horace', 'Horus', 'Hosea', 'Hoshi', 'Hoshiko', 'Houston', 'Howard', 'Howe', 'Howell', 'Howie', 'Hubert', 'Hue', 'Huela', 'Huey', 'Hugh', 'Hugo', 'Humphrey', 'Hunter', 'Huso', 'Hussein', 'Hy', 'Hyacinth', 'Hyman', 'Hyroniemus', 'Ian', 'Ianna', 'Ianthe', 'Ida', 'Idalee', 'Idalia', 'Idana', 'Idande', 'Idania', 'Idra', 'Ife', 'Ige', 'Iggi', 'Iggy', 'Ignatius', 'Ike', 'Ilana', 'Ilario', 'Ilit', 'Ilo', 'Ilom', 'Ilori', 'Ilse', 'Ilyssa', 'Imogene', 'Ina', 'Inari', 'Independence', 'India', 'Indira', 'Indra', 'Inez', 'Infinity', 'Inga', 'Inge', 'Ingrid', 'Inoke', 'Iokina', 'Iola', 'Iolani', 'Ion', 'Iona', 'Ipo', 'Ira', 'Iram', 'Irene', 'Iria', 'Irina', 'Iris', 'Irisa', 'Irma', 'Irving', 'Iryl', 'Isaac', 'Isabel', 'Isabis', 'Isadora', 'Isaiah', 'Isha', 'Isi', 'Isis', 'Isleen', 'Ismaela', 'Ismail', 'Ismet', 'Isolde', 'Isra', 'Israel', 'Issay', 'Ita', 'Italia', 'Ivan', 'Ivi', 'Ivie', 'Ivo', 'Ivria', 'Ivrit', 'Ivy', 'Izefia', 'Izellah', 'Ja', 'Jaali', 'Jabari', 'Jabilo', 'Jabir', 'Jabulani', 'Jace', 'Jacinta', 'Jack', 'Jackie', 'Jackson', 'Jaclyn', 'Jacob', 'Jacoba', 'Jacqueline', 'Jacques', 'Jacqui', 'Jada', 'Jade', 'Jaden', 'Jadon', 'Jadyn', 'Jadzia', 'Jael', 'Jafaru', 'Jaime', 'Jaimie', 'Jake', 'Jalen', 'Jalene', 'Jalil', 'James', 'Jamese', 'Jamie', 'Jamila', 'Jan', 'Jana', 'Janae', 'Jane', 'Janel', 'Janelle', 'Janet', 'Janette', 'Jania', 'Janice', 'Janina', 'Janine', 'Japheth', 'Jara', 'Jared', 'Jariath', 'Jarrett', 'Jarvis', 'Jasmine', 'Jason', 'Jasper', 'Javen', 'Jay', 'Jayden', 'Jayme', 'Jazlynn', 'Jean', 'Jeanine', 'Jeanne', 'Jeb', 'Jeff', 'Jefferson', 'Jeffrey', 'Jemima', 'Jengo', 'Jenis', 'Jenna', 'Jennelle', 'Jennessa', 'Jennie', 'Jennifer', 'Jenny', 'Jens', 'Jensen', 'Jered', 'Jeremiah', 'Jeremy', 'Jeri', 'Jerica', 'Jericho', 'Jerod', 'Jeroen', 'Jerold', 'Jerom', 'Jerome', 'Jerommeke', 'Jerrell', 'Jerrick', 'Jerry', 'Jerusha', 'Jess', 'Jesse', 'Jessica', 'Jessie', 'Jesus', 'Jethro', 'Jett', 'Jewel', 'Jewell', 'Jezebel', 'Jianna', 'Jihan', 'Jill', 'Jillian', 'Jim', 'Jimmy', 'Jin', 'Jira', 'Jiro', 'Joan', 'Joann', 'Joanna', 'Joanne', 'Job', 'Jocasta', 'Jocelyn', 'Jock', 'Jodi', 'Jodie', 'Jody', 'Joe', 'Joel', 'Joelle', 'Joey', 'Johanna', 'John', 'Johnny', 'Joie', 'Jola', 'Jolene', 'Jolie', 'Jon', 'Jonah', 'Jonathan', 'Jonny', 'Jordan', 'Joren', 'Jorge', 'Jorn', 'Jorryn', 'Jory', 'Jose', 'Josef', 'Joseph', 'Josephine', 'Josh', 'Joshua', 'Joshwa', 'Josiah', 'Josie', 'Josue', 'Jovan', 'Jovianne', 'Jovita', 'Joy', 'Joyce', 'Joylyn', 'Juan', 'Juana', 'Juandalynn', 'Juanita', 'Jubal', 'Jud', 'Judah', 'Judd', 'Jude', 'Judith', 'Judson', 'Judy', 'Juji', 'Jules', 'Julia', 'Julian', 'Juliana', 'Julianna', 'Julianne', 'Julie', 'Juliet', 'Julio', 'Julisha', 'July', 'Jumoke', 'Jun', 'June', 'Junior', 'Justin', 'Justine', 'Justise', 'Kabibe', 'Kabili', 'Kacela', 'Kachina', 'Kacy', 'Kadeem', 'Kael', 'Kaelin', 'Kaethe', 'Kahlilia', 'Kai', 'Kaikura', 'Kailey', 'Kaitlyn', 'Kalea', 'Kalei', 'Kaleigh', 'Kaley', 'Kali', 'Kalin', 'Kalinda', 'Kalista', 'Kalli', 'Kamal', 'Kamali', 'Kame', 'Kamella', 'Kameryn', 'Kamilia', 'Kande', 'Kane', 'Kara', 'Karan', 'Kare', 'Kareem', 'Karen', 'Karena', 'Kari', 'Karik', 'Karim', 'Karimah', 'Karina', 'Karis', 'Karl', 'Karla', 'Karli', 'Karma', 'Karmina', 'Karna', 'Karston', 'Kaseko', 'Kasi', 'Kasim', 'Kaspar', 'Kassia', 'Kat', 'Kata', 'Kate', 'Katelin', 'Katharine', 'Katherine', 'Kathie', 'Kathleen', 'Kathryn', 'Kathy', 'Katie', 'Katina', 'Kato', 'Katrina', 'Katungi', 'Katy', 'Kaula', 'Kawena', 'Kay', 'Kaya', 'Kaycee', 'Kayla', 'Kaylana', 'Kaylee', 'Kayo', 'Kayonga', 'Kaz', 'Kazi', 'Kazu', 'Keagan', 'Keaira', 'Keb', 'Kedem', 'Kedma', 'Keefe', 'Keefer', 'Keegan', 'Keelan', 'Keelia', 'Keely', 'Keena', 'Keenan', 'Keene', 'Keeya', 'Kefira', 'Kei', 'Keiji', 'Keiki', 'Keir', 'Keira', 'Keiran', 'Keita', 'Keitaro', 'Keith', 'Kelby', 'Kelda', 'Kele', 'Kelii', 'Kelila', 'Kellan', 'Kellee', 'Kellen', 'Kelley', 'Kelli', 'Kellsie', 'Kelly', 'Kelsey', 'Kelton', 'Kelvin', 'Ken', 'Kenda', 'Kendall', 'Kendi', 'Kendis', 'Kendra', 'Kenisha', 'Kenley', 'Kenna', 'Kennan', 'Kennedi', 'Kennedy', 'Kenneth', 'Kenny', 'Kent', 'Kenton', 'Kenyi', 'Kenyon', 'Kenzie', 'Keola', 'Keon', 'Kerda', 'Keren', 'Kermit', 'Kern', 'Kerr', 'Kerri', 'Kerry', 'Kesin', 'Ketara', 'Kevin', 'Kevina', 'Keyanna', 'Khalida', 'Khalil', 'Khalipha', 'Khiry', 'Kia', 'Kiah', 'Kiana', 'Kiandra', 'Kibibe', 'Kiden', 'Kieran', 'Kiersten', 'Kiho', 'Kiki', 'Kiley', 'Killian', 'Kim', 'Kimball', 'Kimberly', 'Kimi', 'Kimmy', 'Kin', 'Kina', 'Kinfe', 'King', 'Kingston', 'Kinipela', 'Kioko', 'Kione', 'Kiora', 'Kipling', 'Kipp', 'Kira', 'Kirabo', 'Kiral', 'Kirby', 'Kiri', 'Kiril', 'Kirk', 'Kiros', 'Kirra', 'Kirsi', 'Kirsten', 'Kisha', 'Kishi', 'Kita', 'Kitoko', 'Kitra', 'Kitty', 'Kiyoshi', 'Kizzy', 'Klaus', 'Klitos', 'Knut', 'Koda', 'Koen', 'Koko', 'Kolton', 'Konane', 'Koren', 'Korene', 'Kori', 'Kory', 'Kostya', 'Koto', 'Kourtney', 'Kozue', 'Kris', 'Krista', 'Kristen', 'Kristin', 'Kristina', 'Kristine', 'Kristopher', 'Krystyn', 'Kuma', 'Kumi', 'Kumiko', 'Kura', 'Kuri', 'Kuron', 'Kurt', 'Kwanita', 'Kyla', 'Kyle', 'Kyleigh', 'Kylene', 'Kyler', 'Kylia', 'Kylie', 'Kyna', 'Kynan', 'Kynthia', 'Kyra', 'Kyrene', 'Kyria', 'L\'pree', 'La Don', 'Lacey', 'Lachlan', 'Lacy', 'Laddie', 'Lael', 'Lahela', 'Laina', 'Laird', 'Lajuan', 'Lajuana', 'Lakin', 'Lale', 'Laleh', 'Lali', 'Lalita', 'Lalo', 'Lamar', 'Lamont', 'Lan', 'Lana', 'Lanai', 'Lanaya', 'Lance', 'Lancelot', 'Landen', 'Landers', 'Landis', 'Landon', 'Landry', 'Lane', 'Lanelle', 'Lang', 'Langer', 'Langston', 'Lani', 'Lankston', 'Lanza', 'Laqueta', 'Lara', 'Laraine', 'Lareina', 'Larissa', 'Lark', 'Larry', 'Lars', 'Larue', 'Larvall', 'Lasca', 'Lassie', 'Laszlo', 'Latanya', 'Latham', 'Lathrop', 'Latika', 'Latimer', 'Latisha', 'Laura', 'Lauren', 'Laurence', 'Laurie', 'Laval', 'Lave', 'Laverne', 'Lavey', 'Lavi', 'Lavonn', 'Lavonne', 'Lawanda', 'Lawrence', 'Lawrencia', 'Layla', 'Layne', 'Lazar', 'Lazarus', 'Lea', 'Leah', 'Leal', 'Leala', 'Leander', 'Leane', 'Leanna', 'Leanne', 'Leavitt', 'Lecea', 'Leda', 'Ledell', 'Lee', 'Leena', 'Leeto', 'Lehana', 'Leia', 'Leif', 'Leigh', 'Leila', 'Leilani', 'Leimomi', 'Lel', 'Lela', 'Leland', 'Lelia', 'Lemuel', 'Lena', 'Lencho', 'Lenka', 'Lenora', 'Lenore', 'Lente', 'Leo', 'Leola', 'Leoma', 'Leon', 'Leona', 'Leonard', 'Leone', 'Leonie', 'Leonora', 'Leonzal', 'Leopold', 'Leora', 'Lerato', 'Leroy', 'Les', 'Lesa', 'Lesley', 'Leslie', 'Lester', 'Letitia', 'Lev', 'Levana', 'Leverett', 'Levi', 'Levia', 'Levon', 'Lewa', 'Lewis', 'Lex', 'Lexi', 'Lexine', 'Lia', 'Liam', 'Lian', 'Liana', 'Libba', 'Libby', 'Liberty', 'Lida', 'Lidia', 'Lien', 'Liko', 'Lila', 'Lilac', 'Lilah', 'Lilia', 'Liliha', 'Lilith', 'Lilli', 'Lillian', 'Lilo', 'Lily', 'Lin', 'Lina', 'Lincoln', 'Linda', 'Lindley', 'Lindsay', 'Lindsey', 'Lindy', 'Linus', 'Liona', 'Lionel', 'Lirit', 'Lisa', 'Lisbet', 'Lisette', 'Lisimba', 'Lisle', 'Liv', 'Livana', 'Livi', 'Livia', 'Livvy', 'Lixue', 'Liz', 'Liza', 'Lizbeth', 'Lizina', 'Llewellyn', 'Lloyd', 'Loba', 'Lobo', 'Locke', 'Logan', 'Lois', 'Lola', 'Lolonyo', 'Lolovivi', 'Lona', 'Lonato', 'London', 'Lonna', 'Lonnie', 'Lonnit', 'Lora', 'Lorelei', 'Lorena', 'Lorenzo', 'Loretta', 'Lori', 'Lorimer', 'Lorin', 'Loring', 'Lorna', 'Lorne', 'Lorraine', 'Lorretta', 'Lotta', 'Lotte', 'Lotus', 'Lou', 'Loughlin', 'Louis', 'Louisa', 'Louise', 'Loura', 'Lourana', 'Lourdes', 'Lourine', 'Love', 'Lovey', 'Lovie', 'Lowell', 'Luam', 'Luana', 'Lucas', 'Luce', 'Lucia', 'Lucian', 'Lucie', 'Lucille', 'Lucinda', 'Lucio', 'Lucius', 'Lucretia', 'Lucus', 'Lucy', 'Ludlow', 'Ludwig', 'Luigi', 'Luis', 'Luke', 'Lula', 'Lulli', 'Lulu', 'Luna', 'Lundy', 'Lunette', 'Lupe', 'Lupita', 'Luthando', 'Luther', 'Lyde', 'Lydia', 'Lyle', 'Lyn', 'Lynch', 'Lynda', 'Lynde', 'Lyndel', 'Lyndon', 'Lyndsey', 'Lynelle', 'Lynette', 'Lynley', 'Lynn', 'Lynna', 'Lynne', 'Lynnea', 'Lynton', 'Lyre', 'Lyris', 'Lysa', 'Lysander', 'Lysandra', 'Maarten', 'Maat', 'Mabel', 'Mac', 'Macayle', 'Macha', 'Mackenzie', 'Macy', 'Maddox', 'Madeleine', 'Madelia', 'Madeline', 'Madge', 'Madison', 'Madonna', 'Madra', 'Madrona', 'Mae', 'Maeko', 'Maemi', 'Maeron', 'Maeryn', 'Maeve', 'Magan', 'Magda', 'Magdalena', 'Magdalene', 'Magee', 'Maggie', 'Magnar', 'Magnolia', 'Maha', 'Mahala', 'Mahalia', 'Mahari', 'Mahdi', 'Maia', 'Maik', 'Maille', 'Maimun', 'Maire', 'Mairi', 'Maisie', 'Maj', 'Major', 'Makaila', 'Makale', 'Makalo', 'Makani', 'Makenna', 'Makya', 'Malachi', 'Malaika', 'Malana', 'Malaya', 'Malcolm', 'Maleah', 'Malia', 'Malina', 'Malissa', 'Malka', 'Mallory', 'Malo', 'Malomo', 'Malone', 'Malory', 'Mana', 'Mandel', 'Mandell', 'Mandy', 'Manica', 'Manning', 'Manon', 'Mansa', 'Manuel', 'Manuela', 'Mara', 'Marc', 'Marcel', 'Marcell', 'Marcella', 'Marcello', 'Marcellus', 'Marcia', 'Marcie', 'Marco', 'Marcus', 'Marcy', 'Mardell', 'Mardi', 'Mare', 'Maree', 'Marek', 'Maren', 'Marenda', 'Margaret', 'Margarita', 'Marge', 'Margo', 'Margot', 'Marguerite', 'Mari', 'Maria', 'Mariah', 'Mariam', 'Marianne', 'Mariatu', 'Maribel', 'Maribeth', 'Marie', 'Mariel', 'Marietta', 'Marigold', 'Marijke', 'Marika', 'Marilu', 'Marilyn', 'Marin', 'Marina', 'Marinel', 'Mario', 'Marion', 'Maris', 'Marisa', 'Marisela', 'Marisol', 'Marissa', 'Marius', 'Marjean', 'Marjorie', 'Mark', 'Marka', 'Marlas', 'Marlene', 'Marli', 'Marlie', 'Marlin', 'Marlo', 'Marlon', 'Marlow', 'Marly', 'Marnie', 'Marnin', 'Marnina', 'Maro', 'Marrim', 'Marsha', 'Marshall', 'Marta', 'Martha', 'Martin', 'Martina', 'Marty', 'Marv', 'Marva', 'Marvel', 'Marvela', 'Marvene', 'Marvin', 'Mary', 'Masada', 'Mashaka', 'Mason', 'Massimo', 'Matana', 'Mateo', 'Mathilda', 'Mathilde', 'Matia', 'Matias', 'Matilda', 'Matilde', 'Matrika', 'Matsu', 'Matt', 'Matteo', 'Matthew', 'Matthias', 'Mattox', 'Matty', 'Maude', 'Mauli', 'Maura', 'Maureen', 'Maurice', 'Maurilio', 'Maurizio', 'Mauro', 'Mauve', 'Maverick', 'Mavis', 'Max', 'Maxim', 'Maxima', 'Maxime', 'Maximilian', 'Maximos', 'Maxine', 'Maxwell', 'May', 'Maya', 'Mayan', 'Mayda', 'Mayes', 'Maylin', 'Maynard', 'Mckale', 'Mckayla', 'Mckenna', 'Mea', 'Mead', 'Meara', 'Meda', 'Medard', 'Medea', 'Meg', 'Megan', 'Meged', 'Mehalia', 'Mei', 'Meir', 'Mekelle', 'Mel', 'Melania', 'Melanie', 'Melantha', 'Melba', 'Melchior', 'Mele', 'Meli', 'Melia', 'Melina', 'Melinda', 'Meliora', 'Melisande', 'Melissa', 'Melita', 'Melody', 'Melora', 'Melosa', 'Melva', 'Melvin', 'Melvina', 'Melvyn', 'Mendel', 'Menora', 'Mercedes', 'Mercer', 'Mercia', 'Mercy', 'Meredith', 'Meria', 'Meris', 'Merle', 'Merlin', 'Merrill', 'Merritt', 'Merry', 'Merton', 'Merv', 'Mervin', 'Mervyn', 'Meryl', 'Meryle', 'Meshal', 'Messina', 'Metea', 'Mettabel', 'Mia', 'Micah', 'Michael', 'Michaela', 'Michal', 'Michel', 'Michele', 'Micheline', 'Michelle', 'Michon', 'Mick', 'Mickey', 'Micol', 'Mieko', 'Miette', 'Migdana', 'Mignon', 'Mika', 'Mikaili', 'Mike', 'Mikhail', 'Miki', 'Mikkel', 'Milan', 'Milandu', 'Mildred', 'Miles', 'Mili', 'Miliani', 'Miller', 'Millicent', 'Millie', 'Mills', 'Milly', 'Milo', 'Milt', 'Milton', 'Mimi', 'Mina', 'Minda', 'Mindy', 'Minerva', 'Miniya', 'Minna', 'Minnie', 'Minor', 'Minty', 'Mio', 'Mira', 'Mirabel', 'Mirabelle', 'Miracle', 'Miranda', 'Mircea', 'Mireille', 'Mirella', 'Miriam', 'Mirit', 'Miroslav', 'Mirra', 'Misae', 'Misha', 'Misty', 'Misu', 'Mitch', 'Mitchel', 'Mitchell', 'Miya', 'Miyanda', 'Miyoko', 'Mizell', 'Moana', 'Moanna', 'Modesta', 'Modesty', 'Mohammed', 'Mohan', 'Moina', 'Moira', 'Moke', 'Molly', 'Mona', 'Monahan', 'Monica', 'Monita', 'Monroe', 'Montague', 'Montana', 'Monte', 'Montego', 'Montgomery', 'Monty', 'Moon', 'Moon-unit', 'Mora', 'Moral', 'Morathi', 'Mordecai', 'More', 'Morela', 'Morey', 'Morgan', 'Morgana', 'Moriah', 'Moriba', 'Morley', 'Morna', 'Morrie', 'Morrigan', 'Morris', 'Morrison', 'Morse', 'Mort', 'Mortimer', 'Morton', 'Morty', 'Morwenna', 'Moses', 'Moshe', 'Moss', 'Mostyn', 'Moya', 'Moyna', 'Mrena', 'Muhammad', 'Muna', 'Mura', 'Muriel', 'Murphy', 'Murray', 'Murron', 'Musoke', 'Mutia', 'Mykel', 'Myles', 'Myra', 'Myrilla', 'Myrladis', 'Myrna', 'Myron', 'Myrtle', 'Naal', 'Nadia', 'Nadie', 'Nadine', 'Nafis', 'Nafuna', 'Naiser', 'Nakima', 'Nalo', 'Namir', 'Nan', 'Nancy', 'Nanette', 'Nani', 'Naolin', 'Naoll', 'Naomi', 'Napoleon', 'Nara', 'Narcisse', 'Nardo', 'Nariah', 'Nascha', 'Nasha', 'Nasia', 'Nasser', 'Nat', 'Natala', 'Natalia', 'Natalie', 'Natalya', 'Natane', 'Natasha', 'Nate', 'Nathalie', 'Nathan', 'Nathaniel', 'Natine', 'Natividad', 'Natori', 'Natsu', 'Nature', 'Navarro', 'Naveen', 'Navid', 'Nawal', 'Nayati', 'Nayeli', 'Nayer', 'Neal', 'Nealon', 'Necia', 'Neda', 'Nedra', 'Neely', 'Neena', 'Neetee', 'Neil', 'Nelia', 'Nellie', 'Nelson', 'Nen', 'Nenet', 'Neola', 'Nerina', 'Nerine', 'Nerissa', 'Nerita', 'Nero', 'Nessa', 'Nessan', 'Nestor', 'Netanya', 'Neva', 'Nevada', 'Nevan', 'Neville', 'Newman', 'Nia', 'Niabi', 'Niall', 'Niamh', 'Nichelle', 'Nicholai', 'Nicholas', 'Nick', 'Nicki', 'Nicodemus', 'Nicola', 'Nicole', 'Nicolette', 'Niel', 'Nigel', 'Nijole', 'Nikhil', 'Nikita', 'Nikki', 'Nikkos', 'Niles', 'Nimeesha', 'Nina', 'Ninon', 'Nira', 'Nissa', 'Nita', 'Nitara', 'Nitesh', 'Nitis', 'Niv', 'Nixie', 'Nizana', 'Noah', 'Noam', 'Nodin', 'Noe', 'Noel', 'Noelani', 'Nokomis', 'Nola', 'Nolan', 'Noland', 'Noma', 'Nomlanga', 'Nona', 'Nonnie', 'Nora', 'Norah', 'Noreen', 'Nori', 'Norina', 'Norm', 'Norma', 'Norman', 'Normandy', 'Norris', 'Norton', 'Norwood', 'Nova', 'Novia', 'Nowles', 'Noxolo', 'Noya', 'Nuncio', 'Nuri', 'Nuru', 'Nyako', 'Nydia', 'Nyeki', 'Nyoka', 'Nysa', 'Nyx', 'Oafe', 'Oakes', 'Oakley', 'Obedience', 'Oberon', 'Obert', 'Oceana', 'Octavia', 'Octavio', 'Octavious', 'Odele', 'Odelia', 'Odell', 'Odessa', 'Odetta', 'Odette', 'Odina', 'Odysseus', 'Ofer', 'Ogden', 'Ogima', 'Ohio', 'Oistin', 'Okal', 'Okalik', 'Okapi', 'Oke', 'Okechuku', 'Okoth', 'Oksana', 'Ola', 'Olaf', 'Olathe', 'Oleg', 'Olesia', 'Olga', 'Olin', 'Olinda', 'Olive', 'Oliver', 'Olivia', 'Ollie', 'Olympia', 'Omar', 'Omega', 'Ona', 'Onan', 'Oneida', 'Oni', 'Onslow', 'Oona', 'Opa', 'Opal', 'Ophelia', 'Ophira', 'Oprah', 'Ora', 'Oral', 'Oralee', 'Oran', 'Orane', 'Orde', 'Oren', 'Orenda', 'Oria', 'Oriana', 'Oriel', 'Orien', 'Oringo', 'Orino', 'Oriole', 'Orion', 'Orla', 'Orlando', 'Orleans', 'Orlee', 'Orli', 'Orly', 'Orma', 'Ormand', 'Orrick', 'Orsen', 'Orsin', 'Orson', 'Orton', 'Orville', 'Osanna', 'Osaze', 'Osborn', 'Osborne', 'Oscar', 'Osgood', 'Osias', 'Oskar', 'Osma', 'Osmond', 'Ossian', 'Ossie', 'Oswald', 'Othello', 'Otis', 'Otto', 'Ouray', 'Ova', 'Overton', 'Ovid', 'Owen', 'Ownah', 'Oz', 'Ozzie', 'Pabla', 'Pablo', 'Packard', 'Paco', 'Paddy', 'Page', 'Paige', 'Palani', 'Palesa', 'Paley', 'Pallas', 'Palma', 'Palmer', 'Paloma', 'Palti', 'Pamela', 'Pamelia', 'Pancho', 'Pandora', 'Panfila', 'Paniga', 'Panya', 'Paola', 'Paolo', 'Papina', 'Paris', 'Parker', 'Parkin', 'Parlan', 'Parley', 'Parrish', 'Parry', 'Parson', 'Pascal', 'Pascale', 'Pascha', 'Pasi', 'Patch', 'Patience', 'Patricia', 'Patrick', 'Patsy', 'Patty', 'Paul', 'Paula', 'Paulette', 'Paulina', 'Pauline', 'Paulo', 'Paulos', 'Paxton', 'Payton', 'Paz', 'Peale', 'Pearl', 'Pearlie', 'Pearly', 'Pebbles', 'Pedro', 'Peggy', 'Pelagia', 'Pelham', 'Pembroke', 'Penelope', 'Penn', 'Penney', 'Pennie', 'Penny', 'Peony', 'Pepper', 'Percival', 'Percy', 'Perdita', 'Perdy', 'Peregrine', 'Peri', 'Perrin', 'Perry', 'Pete', 'Peter', 'Petra', 'Petula', 'Petunia', 'Peyton', 'Phaedra', 'Phemia', 'Phiala', 'Phil', 'Phila', 'Philana', 'Philena', 'Philip', 'Phillip', 'Philomena', 'Philyra', 'Phindiwe', 'Phoebe', 'Phylicia', 'Phyliss', 'Phyllis', 'Phyre', 'Pia', 'Picabo', 'Pier', 'Piera', 'Pierce', 'Pierre', 'Pierrette', 'Pilar', 'Pillan', 'Piper', 'Pirro', 'Piuta', 'Placido', 'Plato', 'Platt', 'Pleasance', 'Plennie', 'Polly', 'Polo', 'Ponce', 'Poppy', 'Poria', 'Porter', 'Posy', 'Powa', 'Prentice', 'Prescott', 'Presencia', 'Preston', 'Price', 'Primo', 'Prince', 'Priscilla', 'Procopia', 'Prudence', 'Prue', 'Prunella', 'Psyche', 'Pyralis', 'Qabil', 'Qamar', 'Qiana', 'Qing-jao', 'Quade', 'Quana', 'Quanda', 'Quang', 'Queenie', 'Quella', 'Quennell', 'Quentin', 'Querida', 'Quiana', 'Quilla', 'Quillan', 'Quimby', 'Quin', 'Quincy', 'Quinlan', 'Quinn', 'Quinta', 'Quintin', 'Quinto', 'Quinton', 'Quirino', 'Quon', 'Qwin', 'Rabia', 'Rach', 'Rachael', 'Rachel', 'Rachelle', 'Radley', 'Radwan', 'Rae', 'Raeanne', 'Raegan', 'Rafael', 'Raffaello', 'Rafi', 'Raimi', 'Raina', 'Raine', 'Raisa', 'Raja', 'Raleigh', 'Ralph', 'Ramiro', 'Ramon', 'Ramona', 'Ramses', 'Ranae', 'Randall', 'Randilyn', 'Randolph', 'Randy', 'Rane', 'Ranee', 'Rania', 'Ranit', 'Raphael', 'Raphaela', 'Raquel', 'Rasha', 'Rashida', 'Rasia', 'Raul', 'Raven', 'Ravi', 'Ray', 'Raymond', 'Rayya', 'Razi', 'Rea', 'Read', 'Reagan', 'Reba', 'Rebecca', 'Rebekah', 'Red', 'Redell', 'Redford', 'Reed', 'Reese', 'Reeves', 'Regan', 'Regina', 'Reginald', 'Reilly', 'Reina', 'Remedy', 'Remi', 'Remington', 'Remy', 'Ren', 'Rena', 'Renata', 'Renate', 'Rene', 'Renee', 'Renny', 'Reth', 'Reuben', 'Revelin', 'Rex', 'Rey', 'Reyna', 'Reynard', 'Reynold', 'Reza', 'Rhea', 'Rhett', 'Rhiannon', 'Rhoda', 'Rhodes', 'Rhona', 'Rhonda', 'Rhoswen', 'Rhys', 'Ria', 'Rianna', 'Rianne', 'Ricardo', 'Rich', 'Richard', 'Ricjunette', 'Rick', 'Rico', 'Rider', 'Rigg', 'Riley', 'Rimca', 'Rimona', 'Rina', 'Ringo', 'Riona', 'Riordan', 'Risa', 'Rita', 'Riva', 'Rivka', 'Rob', 'Robbin', 'Robert', 'Robin', 'Robyn', 'Rocco', 'Rochelle', 'Rocio', 'Rock', 'Rockne', 'Rockwell', 'Rocky', 'Rod', 'Rodd', 'Roddy', 'Roderick', 'Rodney', 'Roger', 'Roland', 'Rolando', 'Rolf', 'Rollo', 'Romaine', 'Roman', 'Romeo', 'Rona', 'Ronald', 'Ronalee', 'Ronan', 'Ronat', 'Ronda', 'Ronia', 'Ronli', 'Ronna', 'Ronnie', 'Ronny', 'Roosevelt', 'Rori', 'Rory', 'Ros', 'Rosalba', 'Rosalia', 'Rosalind', 'Rosalyn', 'Rosamunde', 'Rose', 'Roseanne', 'Roselani', 'Rosemary', 'Roshaun', 'Rosie', 'Rosine', 'Ross', 'Rossa', 'Rothrock', 'Rowan', 'Rowdy', 'Rowena', 'Roxanne', 'Roy', 'Royce', 'Roz', 'Roza', 'Ruby', 'Rudolph', 'Rudra', 'Rudy', 'Rufina', 'Rufus', 'Rumer', 'Runa', 'Rune', 'Rupert', 'Russ', 'Russell', 'Russom', 'Rusti', 'Rusty', 'Ruth', 'Ryan', 'Ryder', 'Rylan', 'Ryland', 'Rylee', 'Rylie', 'Ryo', 'Saba', 'Sabina', 'Sabine', 'Sabra', 'Sabrina', 'Sachi', 'Sadie', 'Sadiki', 'Sadira', 'Safara', 'Saffron', 'Safina', 'Sage', 'Sahara', 'Saidi', 'Saku', 'Sal', 'Salena', 'Salene', 'Sally', 'Salome', 'Salvador', 'Salvatore', 'Sam', 'Samantha', 'Samson', 'Samuel', 'Sandra', 'Sandro', 'Sandy', 'Sanford', 'Sanjay', 'Sanjeet', 'Sanne', 'Santo', 'Santos', 'Sanyu', 'Sapphire', 'Sara', 'Sarah', 'Saraid', 'Sarama', 'Sarda', 'Sargent', 'Sarki', 'Sasha', 'Sasilvia', 'Saskia', 'Satchel', 'Satin', 'Satinka', 'Satu', 'Saul', 'Savannah', 'Sawyer', 'Saxen', 'Saxon', 'Saxton', 'Scarlet', 'Scarlett', 'Schuyler', 'Scot', 'Scott', 'Seamus', 'Sean', 'Seanna', 'Season', 'Sebastian', 'Sebastien', 'Seda', 'Seema', 'Seghen', 'Seiko', 'Selas', 'Selena', 'Selene', 'Selia', 'Selima', 'Selina', 'Selma', 'Sema', 'Semele', 'Semira', 'Senalda', 'September', 'Sera', 'Serafina', 'Serena', 'Serendipity', 'Serenity', 'Serepta', 'Serge', 'Sergio', 'Serwa', 'Seth', 'Seven', 'Severino', 'Sevinc', 'Seymour', 'Shacher', 'Shaina', 'Shakia', 'Shakila', 'Shakir', 'Shakira', 'Shakti', 'Shalaidah', 'Shaman', 'Shamara', 'Shamira', 'Shamus', 'Shana', 'Shandi', 'Shane', 'Shani', 'Shannen', 'Shannon', 'Shanon', 'Shantell', 'Shaquille', 'Sharis', 'Sharlene', 'Sharne', 'Sharon', 'Shasa', 'Shaun', 'Shauna', 'Shaunna', 'Shaw', 'Shawn', 'Shawna', 'Shay', 'Shea', 'Sheba', 'Sheehan', 'Sheena', 'Sheera', 'Sheila', 'Shel', 'Shelby', 'Sheldon', 'Shelley', 'Shelly', 'Sheri', 'Sheridan', 'Sherine', 'Sherise', 'Sherman', 'Sherri', 'Sherrie', 'Sherry', 'Sheryl', 'Shiela', 'Shiloh', 'Shing', 'Shino', 'Shira', 'Shiri', 'Shirley', 'Shirlyn', 'Shlomo', 'Shona', 'Shoshana', 'Shoshanah', 'Shubha', 'Sian', 'Sibyl', 'Sid', 'Sidney', 'Sidonia', 'Sidra', 'Sienna', 'Sierra', 'Signa', 'Sika', 'Silvain', 'Silvana', 'Silver', 'Sima', 'Simon', 'Simone', 'Sinclair', 'Sine', 'Sinead', 'Sinjin', 'Siobhan', 'Sissy', 'Sivney', 'Skip', 'Skipper', 'Skylar', 'Skyler', 'Slade', 'Sloan', 'Sloane', 'Slone', 'Smedley', 'Snow', 'Snowy', 'Sofia', 'Sol', 'Solace', 'Solana', 'Solange', 'Soleil', 'Solomon', 'Sondo', 'Sondra', 'Sonia', 'Sonnagh', 'Sonora', 'Sonya', 'Sophia', 'Sophie', 'Sora', 'Sorcha', 'Soren', 'Sorley', 'Spence', 'Spencer', 'Speranza', 'Spike', 'Stacey', 'Stacia', 'Stacy', 'Stan', 'Stanislaus', 'Stanislav', 'Stanislaw', 'Stanley', 'Star', 'Starr', 'Stavros', 'Stefan', 'Stefanie', 'Steffi', 'Steffie', 'Stella', 'Step', 'Stephan', 'Stephanie', 'Stephen', 'Stephenie', 'Sterling', 'Steve', 'Steven', 'Stevie', 'Stew', 'Stewart', 'Stillman', 'Stockton', 'Stone', 'Storm', 'Stormy', 'Stu', 'Stuart', 'Studs', 'Sue', 'Sugar', 'Sukey', 'Suki', 'Sulis', 'Sully', 'Sumana', 'Summer', 'Sunee', 'Sunny', 'Susan', 'Susane', 'Susanna', 'Susannah', 'Susie', 'Sutton', 'Suzanne', 'Suzette', 'Suzy', 'Svein', 'Sveta', 'Sybil', 'Sydnee', 'Sydney', 'Sylvain', 'Sylvester', 'Sylvia', 'Sylvie', 'Synan', 'Synclair', 'Syshe', 'Ta\'ib', 'Tab', 'Taban', 'Taber', 'Tabitha', 'Tacita', 'Tacy', 'Tad', 'Tadelesh', 'Tadhg', 'Taffy', 'Tai', 'Taifa', 'Tailynn', 'Taima', 'Tait', 'Tala', 'Talen', 'Talia', 'Taliesin', 'Talisa', 'Talisha', 'Talitha', 'Tallis', 'Tallulah', 'Talmai', 'Tam', 'Tama', 'Tamah', 'Tamara', 'Tamasha', 'Tamasine', 'Tamatha', 'Tambre', 'Tamera', 'Tameron', 'Tamika', 'Tammy', 'Tana', 'Tandice', 'Tanesia', 'Tania', 'Tanisha', 'Tanith', 'Tanner', 'Tanya', 'Tao', 'Tara', 'Taran', 'Tarana', 'Tarika', 'Tarin', 'Taru', 'Taryn', 'Tasha', 'Tasida', 'Tasmine', 'Tassos', 'Tate', 'Tatiana', 'Taurean', 'Tave', 'Tavi', 'Tavia', 'Tavita', 'Tawana', 'Taylor', 'Tazara', 'Tea', 'Teagan', 'Teague', 'Teal', 'Tecla', 'Ted', 'Teddy', 'Teenie', 'Tefo', 'Teige', 'Teleza', 'Teli', 'Telly', 'Telma', 'Temima', 'Temira', 'Temple', 'Templeton', 'Tenen', 'Teo', 'Terena', 'Terence', 'Terentia', 'Teresa', 'Termon', 'Terra', 'Terran', 'Terrel', 'Terrence', 'Terris', 'Terry', 'Terryal', 'Tertius', 'Tertullian', 'Terweduwe', 'Teshi', 'Tess', 'Tessa', 'Tex', 'Thad', 'Thaddeus', 'Thadeus', 'Thady', 'Thalassa', 'Thalia', 'Than', 'Thandeka', 'Thane', 'Thanh', 'Thatcher', 'Thayer', 'Thea', 'Thel', 'Thelma', 'Thema', 'Themba', 'Theo', 'Theodora', 'Theodore', 'Theresa', 'Therese', 'Thina', 'Thom', 'Thomas', 'Thor', 'Thora', 'Thornton', 'Thrine', 'Thron', 'Thurman', 'Thyra', 'Tia', 'Tiana', 'Tiaret', 'Tiassale', 'Tierney', 'Tiffany', 'Tilden', 'Tillie', 'Tilly', 'Tim', 'Timothy', 'Tina', 'Tino', 'Tip', 'Tirza', 'Tirzah', 'Tisha', 'Tivona', 'Toan', 'Tobit', 'Toby', 'Tod', 'Todd', 'Toki', 'Tolla', 'Tom', 'Tomas', 'Tommy', 'Tomo', 'Toni', 'Tony', 'Topaz', 'Topaza', 'Topo', 'Topper', 'Tori', 'Torie', 'Torn', 'Torrance', 'Torrin', 'Tory', 'Toshi', 'Totie', 'Tova', 'Tovah', 'Tovi', 'Townsend', 'Toyah', 'Tracey', 'Tracy', 'Traelic-an', 'Trahern', 'Tranquilla', 'Trapper', 'Trava', 'Travis', 'Trella', 'Trent', 'Trevor', 'Trey', 'Tricia', 'Trilby', 'Trina', 'Trini', 'Trinity', 'Trish', 'Trisha', 'Trista', 'Tristan', 'Tristana', 'Tristessa', 'Tristram', 'Trixie', 'Trory', 'Troy', 'Truda', 'Trude', 'Trudy', 'Trula', 'Truly', 'Truman', 'Tryphena', 'Tudor', 'Tuesday', 'Tulla', 'Tully', 'Tumo', 'Tuyen', 'Twila', 'Twyla', 'Ty', 'Tyanne', 'Tybal', 'Tyler', 'Tyme', 'Tyne', 'Tyra', 'Tyree', 'Tyrone', 'Tyson', 'Uang', 'Uba', 'Uday', 'Ugo', 'Ujana', 'Ula', 'Ulan', 'Ulani', 'Ulema', 'Ulf', 'Ull', 'Ulla', 'Ulric', 'Ulysses', 'Uma', 'Umay', 'Umberto', 'Umeko', 'Umi', 'Ummi', 'Una', 'Unity', 'Upendo', 'Urania', 'Urbain', 'Urban', 'Uri', 'Uriah', 'Uriel', 'Urilla', 'Urit', 'Ursa', 'Ursala', 'Ursula', 'Uta', 'Ute', 'Vail', 'Val', 'Valarie', 'Valencia', 'Valentina', 'Valentine', 'Valeria', 'Valerie', 'Valiant', 'Vallerie', 'Valtina', 'Van', 'Vance', 'Vandalin', 'Vanessa', 'Vangie', 'Vanna', 'Varen', 'Vaschel', 'Vatusia', 'Vaughan', 'Vaughn', 'Vea', 'Veasna', 'Vega', 'Velma', 'Venedict', 'Venetia', 'Vera', 'Verda', 'Verdi', 'Vern', 'Verna', 'Verne', 'Vernon', 'Veronica', 'Vesta', 'Vevay', 'Vevina', 'Vi', 'Vic', 'Vicki', 'Vicky', 'Victor', 'Victoria', 'Vida', 'Vidal', 'Vidor', 'Vienna', 'Vila', 'Vince', 'Vincent', 'Vine', 'Vinnie', 'Vinny', 'Vinson', 'Viola', 'Violet', 'Virgil', 'Virginia', 'Visola', 'Vita', 'Vitalis', 'Vito', 'Vittorio', 'Vivek', 'Vivi', 'Vivian', 'Viviana', 'Vivienne', 'Vlad', 'Vladimir', 'Volleny', 'Von', 'Vonda', 'Vondila', 'Vondra', 'Vui', 'Wade', 'Wafa', 'Waggoner', 'Walda', 'Waldo', 'Walker', 'Wallace', 'Walt', 'Walta', 'Walter', 'Wanda', 'Waneta', 'Ward', 'Warner', 'Warren', 'Wasaki', 'Washi', 'Washington', 'Waverly', 'Wayne', 'Webster', 'Welcome', 'Wenda', 'Wendell', 'Wendi', 'Wendy', 'Werner', 'Wes', 'Wesley', 'Weston', 'Wheeler', 'Whitby', 'Whitfield', 'Whitley', 'Whitney', 'Wilbur', 'Wiley', 'Wilford', 'Wilfred', 'Wilhelmina', 'Will', 'Willa', 'Willard', 'Willem', 'William', 'Willis', 'Wilma', 'Wilson', 'Wilton', 'Winda', 'Winfred', 'Winifred', 'Winona', 'Winslow', 'Winston', 'Winta', 'Winthrop', 'Wolfgang', 'Wood', 'Woodrow', 'Woods', 'Woody', 'Worden', 'Wyatt', 'Wyman', 'Wynn', 'Wynne', 'Wynona', 'Wyome', 'Xandy', 'Xanthe', 'Xanthus', 'Xanto', 'Xavier', 'Xaviera', 'Xena', 'Xenia', 'Xenophon', 'Xenos', 'Xerxes', 'Xi-wang', 'Xinavane', 'Xolani', 'Xuxa', 'Xylon', 'Yachi', 'Yadid', 'Yael', 'Yaholo', 'Yahto', 'Yair', 'Yale', 'Yamal', 'Yamin', 'Yana', 'Yancy', 'Yank', 'Yanka', 'Yanni', 'Yannis', 'Yardan', 'Yardley', 'Yaro', 'Yaron', 'Yaser', 'Yasin', 'Yasmin', 'Yasuo', 'Yates', 'Ye', 'Yeardleigh', 'Yehudi', 'Yelena', 'Yen', 'Yenge', 'Yepa', 'Yered', 'Yeriel', 'Yestin', 'Yetty', 'Yeva', 'Yihana', 'Yitro', 'Ymir', 'Yo', 'Yogi', 'Yoko', 'Yoland', 'Yolanda', 'Yonah', 'Yoninah', 'Yorick', 'York', 'Yosef', 'Yosefu', 'Yoshi', 'Yoshino', 'Yuk', 'Yuki', 'Yukio', 'Yul', 'Yule', 'Yuma', 'Yuri', 'Yuval', 'Yves', 'Yvette', 'Yvon', 'Yvonne', 'Zaccheus', 'Zach', 'Zachariah', 'Zachary', 'Zaci', 'Zada', 'Zahur', 'Zaida', 'Zaide', 'Zaila', 'Zaire', 'Zaki', 'Zalman', 'Zan', 'Zane', 'Zanna', 'Zara', 'Zareb', 'Zared', 'Zareh', 'Zarek', 'Zarifa', 'Zarina', 'Zavad', 'Zayn', 'Zaza', 'Zazu', 'Zbigniew', 'Ze\'ev', 'Zea', 'Zeb', 'Zebidy', 'Zebulon', 'Zed', 'Zedekiah', 'Zef', 'Zeheb', 'Zeke', 'Zeki', 'Zelda', 'Zelia', 'Zelig', 'Zena', 'Zenas', 'Zene', 'Zenia', 'Zenobia', 'Zenon', 'Zephan', 'Zesiro', 'Zev', 'Zia', 'Ziazan', 'Zikomo', 'Zili', 'Zilli', 'Zimri', 'Zinna', 'Zinnia', 'Zion', 'Ziraili', 'Zita', 'Ziv', 'Zivan', 'Ziven', 'Ziya', 'Zizi', 'Zo', 'Zoan', 'Zoe', 'Zoey', 'Zofia', 'Zohar', 'Zoie', 'Zola', 'Zoltan', 'Zoltin', 'Zona', 'Zorada', 'Zsa Zsa', 'Zula', 'Zuleika', 'Zulema', 'Zuriel', 'Zwi', 'Zyta'];
function getName() {
    return part(names);
}
var projectPart0 = ['project', 'operation', 'system', 'the', 'strategem'];
var projectPart1 = ['robot', 'red', 'crimson', 'magenta', 'violet', 'shocking', 'hot', 'neat', 'wonder', 'tasty', 'cruel', 'crisp', 'brave', 'rasping', 'ghostly', 'shrieking', 'sneaky', 'slippy', 'steam', 'chaos', 'hot', 'nasty', 'pure', 'cold', 'black', 'orange', 'blue', 'green', 'violet', 'crystal', 'steam', 'ocean', 'plaid', 'sabre', 'icy', 'dry'];
var projectPart2 = ['hat', 'puzzle', 'cobra', 'window', 'monkey', 'donkey', 'blaze', 'jacobite', 'zebra', 'centurion', 'dawn', 'alpha', 'wave', 'banjo', 'cats', 'axe', 'teeth', 'calculo', 'whisper', 'december', 'axe', 'narwhal', 'sloth', 'otter', 'bacon', 'penguin', 'tiger', 'island', 'duck', 'goat', 'disco', 'torch', 'ember', 'cargo', 'flare', 'night', 'creek', 'gnocchi'];
function projectName() {
    return part(projectPart0) + " " + part(projectPart1) + "-" + part(projectPart2);
}
var icons = ['😕', '😉', '😕', '🙄', '🤣', '😀', '🙃', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😗', '😘', '😍', '😎', '😋', '😊', '😉', '😙', '😚', '🙂', '🤗', '🤔', '😜', '😛', '😌', '😴', '😫', '😪', '😯', '🤐', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😰', '😬', '😨', '😩', '😬', '😰', '😠', '😵', '😳', '😱', '😡', '😷', '🤒', '🤕', '🤢', '🤧', '🤥', '🤡', '🤠', '😇', '🤓', '😈', '👿', '👹', '👺'];
function getIcon() {
    return part(icons);
}
var logos = ['🎈', '🎈', '🎆', '🎇', '✨', '🎉', '🎊', '🎃', '🎄', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🎀', '🎗', '🎟', '🎫', '🎠', '🎡', '🎢', '🎪', '🎭', '🖼', '🎨', '🛒', '👓', '🕶', '🧥', '👔', '👕', '👖', '🧣', '🧤', '🧦', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '👞', '👟', '👠', '👢', '👑', '🧢', '👒', '🎩', '🎓', '💋', '💄', '💍', '💎', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎱', '🎳', '🥌', '⛳', '⛸', '🎣', '🎽', '🛶', '🎿', '🛷', '🥅', '🏒'];
function getLogo() {
    return part(logos);
}
var taskParts = ['validation', 'logical', 'virtual', 'structural', 'micro', 'hyper', 'accessible', 'indirect', 'pointer', 'truth', 'business', 'customer', 'person', 'manipulation', 'pure', 'seamless', 'crypto', 'interactive', 'SEO', 'custom', 'web', 'auto', 'digital', 'cyber', 'secure', '3D', 'enterprise', 'pro', 'developer', 'augmented', 'robo', 'productivity', 'neural', 'positronic', 'computery', 'deep', 'immutable', 'functional', 'lock-free', 'meta', 'native', 'non-virtual', 'opinionated', 'recursive', 'p2p', 'yet another', 'distributed', 'reticulated', 'hierarchical', 'obfuscated', 'weaponised', 'graphical', 'cloud-based', 'ethical', 'point-free', 'chat', 'social', 'mobile'];
var taskParts2 = ['logic', 'algo', 'mesh', 'structure', 'form', 'service', 'container', 'data', 'DB', 'UX', 'UI', 'layer', 'component', 'system', 'diagram', 'app', 'client', 'server', 'host', 'classes', 'object', 'functions', 'job', 'parts', 'platform', 'framework', 'foundation', 'emailer', 'pager', 'plugin', 'addin', '2.0', 'automation', 'cybernetics', 'drone', 'graphics', 'artwork', 'architecture', 'collector', 'list', 'heuristic', 'solver', 'network', 'net', '9000', '2001', 'multiplexor', 'switch', 'hub', 'paradigm', 'catalog', 'registry', 'RIA', 'SPA', 'IP', 'JSON', 'XML', 'CSV', 'Yaml', 'Macro', 'analytics', 'cluster', 'node', 'graph', 'avatar', 'reticulator', 'spline', 'hierarchy', 'classes', 'threads', 'logging', 'engine', 'blockchain', 'map-reduce', 'content', 'exploits', 'hacks', 'styles', 'customizations', 'RAM', 'DRM', 'GPGPU', 'wiki'];
function getTask() {
    return part(taskParts) + ' ' + part(taskParts2);
}
//TODO: add this to game class
function incrementXP(amount) {
    game.XP += amount;
    if (game.TotalXP < 100 && game.TotalXP + amount >= 100) {
        removeClass('.getPerson.tester', 'hidden'); //show 'hire dev/tester/ba' buttons
    }
    if (game.TotalXP < 500 && game.TotalXP + amount >= 500) {
        removeClass('.getPerson.ba', 'hidden'); //show 'hire dev/tester/ba' buttons
    }
    game.TotalXP += amount;
    //TODO: Is it time to level up?
    // XP resets, but total xp does not.
    // game.Level increments.
    drawXP(game.XP);
}
//TODO: add this to game class
function incrementMoney(amount) {
    game.Money += amount;
    if (game.Money >= game.HighestMoney) {
        if (game.HighestMoney < 300 && game.Money >= 300) {
            removeClass('.getPerson.dev', 'hidden'); //show 'hire dev/tester/ba' buttons
        }
        game.HighestMoney = game.Money;
    }
    drawMoney(game.Money);
}
