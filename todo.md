# TODO

## Ranked

- [ ] add class 'hint' to find project button at start... and when first project is completed... 
	- consider: hint could add a yellow arrow pointing right (via a "::after")
- [x] Wrong color scrollbar on entire screen in dark mode.
- [x] BUG! In the shop - scroll down but message isn't pinned to bottom.



## Unranked

### From script.ts

// Definitely

 [ ] Place limit on all columns
 [ ] Starting limit should be the value of a new project / 2
 [ ] height of buttons at top must be consistent. Table layout maybe?
 [ ] sorting workers
 [ ] ?? ? requires a notification modal. 😡
   modal: Some projects are time critical. You get a bonus for completing them early. Notice the green bar on their right edge: that's the count down.
   ? also could show a modal near the start "So much rework needed... visit the store to upskill your team members"
 [ ] populate load screen
 [ ] about screen (content)
 [ ] join mailing list functionality joinemail
 [ ] privacy policy content -- mailing list, google analytics
 [ ] How to exit the game, and when/how to save.
  ?  Your high scores?
  ?  Time Challenge
 [ ] add google analytics
 [ ] size on ipad: too wide. why?
 [x] 🐛Words wrap in store
 [ ] 🐛Icons and help icon are not vertically centered in store (other content is not either)
 [ ] Multi-skilled person choosing task to do could be based on:
        total number of points in a column divided by number of people with that skill.
        Worst ratio? Do that next. In case of tie-break, go with right most column.
        No -- if any are worse than the threshold -- do the worst.
        if all are better than the threshold, choose from the right.
 [ ] show (but disabled) buy dev / buy tester button when first starting
 [ ] keybinding -- letters to people
 [ ] keybinding -- multiple presses of a number will cycle through the cards in that column
 [no] Consider: have a slow loop that checks if any one with selfStart who is not selected or busy has a triggerTime that's stale by > 2* maxtriggertime and if so call 'trySelfStart'
 [ ] more technical names for tasks
 [ ] add to store:
  - Games console 🕹
  - Deluxe Games console 🎮
  - Desk A/C ❄
  - pingpong table 🏓
  - cityscape at dusk 🌆

 [ ] front page:
 -> Start
 -> (later: Resume  -- saved games)
 -> About -> link to wiki that describes each item in the store.
 -> Mailing List [________: Join ] __privacy policy__
 -> game itself needs a way to exit then.
 fire people?
 limited people?

 "Overcooked" is a multiplayer time management game originally on the sony playstation network.


 [ ] Microdose lsd in store: shadertoy.com effects -- or other animated bg effects.
 [ ] seasonal mods: 
  [ ] st patricks day whiskey/green beer.
  [ ] halloween products 🎃 🦇.
  [ ] xmas items 🎄 🎅. thanksgiving turkey 🦃
  [ ] valentines 💟;
  [ ] wear it purple
  
 [ ] chaos monkey 🐒

stats button lower right 📈 : each person's skills and description. point per minute described for every minute of the game (excluded minutes with 0 points)
[ ] achievement when a thing is done for the first time?




- [ ] Person emojis -- emoji skin tone modifiers 
	- see https://emojipedia.org/modifiers/ -- i TRIED + ("🤔" + "\u200B" + "🏾") and ("🤔" + "&zwj;" +"🏾"); no luck yet -- and same without the zwj at all... no luck!

- [ ]  Some items can only be purchased if you have the necessary target.
	- // e.g. advanced developer training requires a dedicated developer (not just the founder)

- [ ] BUY button ....
	- [x] hides main "screen"
	- [x] new screen has:
			`<< leave shop`
			
				THings to purchase (potentially scrollable)
				(An array of objects... )
					- courses
					- skills
					- items:
						- coffee machine
						- new chair
						- pot plant
						- monitor upgrade
						- desk fridge
						- software courses
					(Items are only shown if at least one of your people is eligible for that item)
					
				[ ] more are added as level increases. 
				[ ] costs of a thing go up by a percentage each time a thing is purchased
	TRAIN >>
	Printed materials
		Books (many many titles)
		Magazine subscriptions (ever dwindling list!)
	Developer training courses (too many to list)
		Code Reuse
		Writing courses
		Topics in usability
		Scalability
		Secure code
		Literate code
		Defensive coding
		(and thousands more:
		always 'general' topics)
	Tester training (sample)
		Effective repro
		A Lesson in Regression
		Eliminating the irrelevant
		Automation for fun and profit
		Rattle testing: the dying art
		Load testing for one
		Overcoming developer envy
		Usability Testing
		Accesibility Testing
		Performance Testing
		Automating the Impossible
		Agile Testing: Fact or Fiction
	- BA/Project management Traning
		Handling difficult people
		Required reading in reading Requirements
		'What are you really wanting to achieve?'
		'What's it gonna cost if you don't have that feature?'
		An analysis of the cost and benefit of cost benefit analysis
		Business Process Re-engineering from 20,000 feet
  - BLING
		- better seat 💺 
		- a plant 🌳
		- a personal coffee machine ☕️
		- Office decoration s 🎣 
		- a fan 
		- a robot 🤖
		- a printer 🖨
		- a mechanical keyboard ⌨️
		- A games console 🕹
		- a fax machine 📠???
		- Artworks 🌄
		- another games console 🎮


- [ ] PROJECT! BIG PROJECT! PROJECT HERE! Webview 2 based embedded browser app with save/load


[ ] Training button... buy dev training... buy tester training... buy BA training...
		- when you buy a training course, anyone can grab it... potentially
		- able to give new skills to existing workers.
		- able to increase efficiency of existing workers
			SKILL:
				observation. (when completing a task, looks for another task of the same type.)
				pro-active. while idle, independently decides to look for a task they can do.
				courage.

It should say and show what it is they now do...
	SPECIFIC and real technical lessons


Learns to write SQL "SELECT" queries
Learns to write SQL JOINS queries
Learns to write SQL insert and update queries

... The person's SKILL COUNT goes up.


Learns to write CRUD SQL queries - create, read, update, delete.

Learns 


Thomas ideas:

A few ideas

**definitely**

- Change request event, like the current bug event, which pulls a card from its current position, even finished, back to start.
--> difference is, it is an added story, not a recycled story, it takes BA time, it doesn't have a money decrease, but rather an increase.... although it does delay the completion bonus. Has different symbology/description. (How to trigger it, without worrying about a race condition regarding completion bonus?)

- Special abilities which you unlock over time and obtain charges of in some way, purchasing or as rewards, such as Bug Bash to rapidly get through a stack of bugs, or Mercenary which brings in a high-level super contractor for a single sprint.

--> bug bash... like a bonus round
--> 

- Occasional Tenders, which are like boss fights compared to normal projects. You have to put together the tender somehow, perhaps it's like a normal project but instead of rewarding money it rewards a tender application score that determines whether you win the tender. The tender itself is then a bigger more challenging version of a project with better rewards.

--> a tender item pays no money along the way, and only pays money if you win the tender and complete the project, but the project pays a premium (to make up for the tender cost)


** time management ideas **

if it was implemented as a time management system then there would be little modal tasks  that pop up

for example to create cards:

	As a ..... <role>
	I want a ..... <thing >
	So that. <benefit>

where role:=
	User
	Sophisticated user
	Teacher
	
	Adjective-profession or role
	
	People win chess
	Astronauts solve problem 
	Life becomes wonderful


When there's Code to be written 

	—- Tao tap tap -- code gets written
	
Front end to be tested....

		tap each element -- see if a bug emerges...

Bugs to be fixed

	Front end - tap each bug
	Code - tap each bug 


**probably not**

- At the end of each project you choose a go live party option (random multiple activities with different costs), the option you pick determines the morale boost each employee gets in the first sprint of the next project.

- Adding complexity to above: each employee has activities they like (extra boost) and dislike (no boost).


- Traits for employees, so when choosing employees to hire you have to balance their salary, traits and current level. For example devs can have a Cowboy trait that increases dev speed but also bug chance. No stats like Game Dev Story, an employee just has a level and their traits.

NO: only one dog in the office.
No: only one cat in the office.

No: cat poops
No: dog poops
No: rename to 'tinykanban'



# DEFER


[ ] defer: Once limits are enabled: - detect + and - (plus and minus) keys and use them to alter limits... (this would only work if the limits were only on one columns)
 



show scores and levels in hexadecimal????



store game state in local storage


[ ] graphics version
	- original idea was to build a graphical version with little characters moving around an initially bare office which becomes slowly ever more populated with people and things.
	- the pixel art at 
	
		https://workadventu.re/getting-started
		
	...is certainly very similar to what I'd pictured.
	
	![workadventure](workadventure_gettingstarted.png) -- see https://workadventu.re/getting-started



## Defer/Maybe


[ ] Employee of the day
[ ] More celebration/reward when cards are paid
[ ] More celebrating when projects are finished
[ ] More celebrating when upgrading
[ ] Celebrating could be done via some css animations


[ ] Training should have a time cost (? increases at higher levels of training)

[ ] Cumulative flow diagrams
[ ] ability to re-arrange workers
[done] How to do determine if a job has become too stale? has taken too long to complete? and if determind, how to show it visually?
[done] Self-start... also randomly fire if unallocated for too long.
[done] Dark mode
[done] drawMessage "You gave Alan a developer upgrade" 
[ ] drawMessage "Founder is enjoying that donut"
[ ] StoreItem: Master BA: breaks a project into two smaller projects. (applies if the project size > half of the current points per project level)
     calls them {original name} A and {original name} B.
     can only be given to a person once. (How to do selection/highlighting?)
[no](buy bot instead) Hire a scrum master... once you hire them -- they take over for you, basically... and you can then open a second DevShop...
[ ] how to show attributes/stats sheet of a person? (see stats button)
? limited number of slots for people. cannot hire more than level number... until 
? dual-skill cannot be better than "4/5" at either skill
finesse:
- buy dev button is visible but disabled is < (cost of dev)
- if no activity detected for long time... show tip
- non-prop font for level etc.



## Won't do

no: Personal robot 🤖: ?? If I had a good use for the robot, then yes. But can't see one. Maybe adds level 1 to all?
no: add a random timer of sick/vacation unavailability for each resource -- although "realistic" this is a model not reality, it's okay to avoid most of reality. I feel it would be painful. I also thought about having them spontaneous quit but avoided it. Same with managing their moods/energy levels. Nah, too detailed.
no: resources gain experience/competence with each task they finish -- too nuanced. not able to be shown visually.
no: A worker sometimes gets distracted. (Often). -- the dog/cat might decrease that.
no: When you add something to the board. If it's the only thing on the board, then select that thing automatiucally.
no: button hover should be light blue
no: do we have an id issue when selecting storeitem's in store versus inbox? clash of id's?
no: test-management suite -- test level up
no: powerful IDE -- dev level up
no: spreadsheet skills -- be a better BA
no: email etiquette course -- be a better BA
no: when you buy a self-starter card (or any card) that should not be enough to kick off the self-starting behaviour. (or should it!?) (yes it should)
no: Add icons to columns to make required skill clearer (tried it, couldn't make it work neatly on small mobile screens)
no: Limit dog/cat numbers
no: chain observations onto each self start. REMOVING observation
no: are observations now chained with self-start? seems too extreme. REMOVING observation



# DONE

1:42 AM Saturday, 3 September 2022

 [x] headphone "LEVEL"
 [x] items worth 1000000 should be written 1M
 [x] refactor selfstart to initiative

 [x] size of +/- on iphone



=== OLDER ===

[x] limit should be placed on the next column not the current column
[x] limit should show points/max points and not show number of cards at all
[x] customer finds bug -- logo should be 👿 - remove angry face with horns from emojis of staff
[x] make expired timebar full RED. 
[x] have time flag turn itself on at about level 7 or 8
      at first it is on for 20% of projects... grows by a further 20% every level
      do we first have to wait for them to add initiative to a player?


* Selecting the buy bot:
  [x] Must be assigned to someone who has initiative. No: I just give the person minimum initiative
  [x] If selected from inbox and no one possible to assign: a display message will explain why no target recipients. No, see above.
[x] Robo-Caller skill: if all columns have less than N*2 + 4 items (where N = # with that skill) *and* cash-on-hand > 2 * proj cost... then buy proj.
      includes... column limits based on # points with + and - buttons on them, shown as [+| 29/3 points|-] ... and have it affect behavior of upstream people
[x] emoji font not used for message areas - 🖼 doesn't look right
[x] show # 📍 -- points in the column labels.
[x] robot 🤖 buy-bot: robo-caller -- A robot at your desk! The buy-bot buys new projects for you (unless the backlog is over its limit) 
[x] only 1 buy bot allowed. 
[x] Buying the buy bot...... 
   [x] it does not refresh the display right away
   [x] it says "out of stock is not available until a higher level"
[x] select skill from inbox, a worker is highlighted. but when their initiative ticks over, they lose their highlight.


[x] all dogs have same icon after first choice (no, there just weren't enough icons for dogs, so i broadened by canine definition)
[x] move initiative up.
[x] have starting initiative be much much slower ??
[x] bugs repeat too much in early levels when you only have 1/2 people. A re-cycled card should have less and less chance of having new bugs. 
[x] start button
[x] load button (Or replace 'load' with 'resume' and have it say "12 🥑 153 🥓" .. and perhaps a time you last opened it??)
[x] exit load screen
[x] about button
[x] exit about
[x] mailing list controls
[x] donut machine 🏭 - similar effects to coffee machine. Doesn't seem advisable though.
[x] cards and projects age. After X minutes, they are worth 0. progress bar along the side.
[x] show 💲/min
[x] things in the done column should always appear faded out like their busy, but basically unselectable
[x] When person returns from completing a self-started task, they should highlight themselves if there is a selected object of consequence
[x] dog: consistent icon (random choice at first)
[x] dog to have a name
[x] cat: consistent icon (random choice at first)
[x] cat to have a name 
[x] Add to store: 
[x] headphones 🎧 
[x] Desk plant 🌳
[x] Desk cactus 🌵
[x] cookie 🍪 ($1, not unlocked until level 100)
[x] for dev/ba/test: If level > 9 -- use infinity symbol not a number
[x] if person is the selected doer then they cannot self-start at that moment.
[x] Dogs, cats and store items shouldn't count towards number of items in column, only stories.
[x] cat nerd doesn't render correctly (on iOS at least)

[x] remove observation skill
[x] rename self-start to initiative
[x] Self-starter -- should be infinite but with a big delay. Delay is smaller at higher levels.
[x] 🐛when in the store: only store messages should be shown
[x] tending to cat/dog takes too long as you progress.
[x] keyboard icon not rendered correctly when added to person 'has' -- add .icon class
[x] level of observation training should be shown....
[x] level of self-starter behaviour should be shown...
[x] indicate # items in a column if more than a minimum
[x] help button doesn't work
[x] slower increase in cost for store items.
[x] ensure chance of CREATING a bug or spec bug is lower for rework
[x] ensure level of skills is visible
[x] icon to indicate has seat after seat upgrade: should show up on the person
[x] seat upgrade should make you more effective
[x] chance of finding a bug or specBug -- need to be same mathematical model as creating bug or spec bug
[x] if > 1, show skill level number top right of skill icon on person card.
[x] consider: the store should show level n+1 items, disabled.
[x] show next level items (disabled) before they are available (buttons in office, and in store)
[x] when new items added to store, show a little icon on the store button
[x] highlight store button to indicate when there are new things added to it. Unhighlight it when it is pressed.
[x] highlight button when enabled -- do this for all buttons that are created during level up. (e.g. buy dev)
[x] ability to see skill level
[x] dog/cat never seem to return!
[x] there is a 0% chance of finding it (spec bug)
[x] starting price of tester and dev should be 200 not 300
[x] add "piece of toast 🍞 $10"
[x] BA retained message after stopping rework on a specbug
[x] ensure Dog and cat are for "any" not just "ba" or "dev"
[x] every time you buy something it triples in price. Better idea! Not triple, but high price.
[x] store... put ICON before name
[x] Add  statue 🗽
[x] Add   statue2 🗿
[x]  mechanical keyboard should be an early level item -- level up anyone
[x] When a .button is clicked at top, deselect doer or receiver and possible 
[x] mech keyboard should be added
[x] Price of staff should double each time. At least. If not 5x. Or 3x 

Memory management:
 When a project is complete:
   [x] Delete each of its stories from game.stories
   [x] Delete it from projects. 
[x] Initial dog cat duration double
[x] And double it every time there after 
[x]If money is negative then XP is not added to XP. Instead it is multiplied by -1 and added to money
[x] And lock in the per point price of the story (lead) when it is purchased then pass it into the children when. They are spawned. 
[x] When the customer finds a bug... the return of the card is immediately halved.



[x] Don't say idle if they are just waiting to self start
[x] Show self start icon 


[x] Shouldn't be able to select items that are in the done column
[x] instead of efficiency... have their skill level map so 1-10 is 0.3  0.4  ,0.5   ,0.6   ,0.77   ,0.83  ,0.90   ,0.95  ,0.99

[x] if have cat... less errors.
[x] if have dog... work faster.
 [x]  is there inflation?
		each time a thing is purchased, that thing becomes x% more expensive. i.e. compounding interest on prices.
	levels:
		each time an action is performed, you receive an experience point.
		? the person also receives an experience point for that skill.

[x] guillotine bug on iOS (table too tall basically)
[x] bugs can exist before level 2 - just can't be found by tester or customer (avoids a way of cheating/missing the point)
[x] rework on a bug should be quicker than original work.
[x] button text smaller, particularly at smaller sizes
[x] vertical-center content in .button
[x] store items should have an info icon that reveals their description.
[x] bugs don't exist until level 2...
[x] store: buy observation skills. 
[x] replace 'var ' with 'let '
[x] bug: shouldn't be able to select a 'busy' receiver or doer.
[x] when something is selected and it's wrong then de-select the previous thing. (be it doer or receiver)
[x] Board height should be limited.
[x] short series of tool tips for showing/hiding "next action"
		- start the game
		- buy a sales lead
		- click the founder, then click the lead (or vice versa).
		- click the founder then click a story

[x] when to show "buy person" button(s) ? When money first reaches minimum...

[x] select names from an array
[x] updating person: update card in place, don't remove.
[x] restore delay time factor. (avgDuration)

[x] when someone is busy, say what they are doing. (could be creative later.)
[x] give people names

[x] if something is delivered that has a bug... the customer finds it and gives it back... to be started over. gets angry customer icon.
[x] when developing, chance of finding a bug should be related to: 1. presence of bug, effectiveness of worker.
[x] when developing, chance of *creating* a bug should be related to: effectiveness of worker, size of card.

[x] each project... should also have a project logo. (random emoji)
	[x] that logo is displayed on its lead and subsequent stories
[x] instead of random time to move things... have it relate to # points / effectiveness of worker.
[x] project names could be generated using an algo. ()-().
[x] show the cash amount.
[x] when person is busy show that they are busy
[x] when person is busy they cannot be selected for task
[x] when task is busy it cannot be selected as receiver
[x] when things are 'done' they are delivered... get cash as a result. (Every time! not only when project is completed)
	[x] dollar is shown next to card... it dissappears off board after a few seconds. at which time money appears on board.
 ?  how do leads arrive? randomly? via advertising?
		[x] you buy them.
[x] top align cards in columns.


Answered/resolved (in a different topic)
? when purchasing a project... cannot go more than $100 * level into the red (?) or 100* #people ??
? When is interest added to the loan!?
   after a certain amount of time.... (is it a turn based game or a time-based game?)
     some things about it are time based... delays for example
   whenever levelling up... whenever a story is finished? whenever an action occurs

