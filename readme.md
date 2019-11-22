# DevShop!

I had this idea 10 years ago for a game called [DevShop](http://www.secretgeek.net/devshop_i) and decided to implement a minimal, non-viable product of it, in vanilla js, with the no-framework.

It's a kind of 'lemonade stand' game, but instead of buying lemons 🍋 and making lemonade 🍹, you hire developers/testers and business analysts, and complete tasks on a kanban board.

Play it online here:

<https://secretgeek.github.io/devShop/>


## Walkthrough

- click "🌟 start"
- click "🎁 find project ($100)"
- Select on the newly created project in the `Inbox` column of the kanban board.
- Select the "🤔 Founder".  (In the animated version this would cause the Founder to walk to the board, grab the card, take it back to their desk, work on it, create a bunch of story cards, and take them back to the board, putting them in the `backlog` column.)
- Once the story cards are in the `backlog` column, click a card to select it.
- Select the "🤔 Founder" again. This causes the Founder to begin developing the card. (In the animated version, they would walk over, get the card, take it back to their desk, swear a lot, etc.)
- The story card eventually ends up in the `Test` column. Now the card needs to be tested.
- The founder is capable of developing, testing, and acting as a BA. They don't do any of these things *particularly well...*
- Select the card in the `test` column, then select the Founder, so it can be tested.
- If it passes testing it is done... and you make money 💲. (It's possible a bug 🐛 is found during testing... or if the bug is missed by the tester, the customer can find the bug 🐞 once they receive the card.)
- when the project is completed you get a completion bonus 💲.
- And you can begin another project...

Repeat this until you have enough money to buy a dev or a tester or a ba. 

Features include:

- upskilling people 📕 📗
- training people to increase their efficiency
- giving them 'initiative' so they can sometimes grab cards for themselves.
- ☕ coffee and donuts 🍩
- 🐶 dogs and cats 😸
- inflation. (i.e. things will cost more and be higher stakes as the game progresses.)
- (People will get faster as you increase their skills, but jobs will be bigger... thus creating a steady state, a hedonic treadmill, a red queen's race 👑.)




## Tips

Some keystrokes....

	1. Press 1 to select the first available item in the `Inbox` column
	2. Press 2 to select the first available item in the `Backlog` column
	4. Press 4 to select the first available item in the `Test` column

..thanks to [Richard Mason](https://github.com/rikware).

Make sure to buy "⭐initiative⭐" from the store (when it is available) -- once the workers have initiative you are free to manage the work at a higher level.

## lessons

* If work took no time to complete, you would only need 1 worker.
* The earlier in the process a bug is found and fixed, the cheaper it is to rectify.
* Bugs should be removed before they get to the customer.
* Work should flow right to left.
* You need higher proportions of workers for steps that take longer (e.g. development in this game)
* The smaller the stories the better. They are less likely to have bugs, and faster to work with.
* Multi-skilling is helpful at alleviating bottlenecks.
* In a system where bugs and irregular work happen, bottlenecks can appear anywhere.
* Throughput is a more useful measure than idle time.
* Good teams are self-organizing, and this requires *initiative*.
* A newbie thinks "I wish I could hire a manager to assign the tasks automatically" -- a wise person thinks "I wish the workers had enough initiative to select the tasks for themselves."
* The system needs to have some slack in it, or there will be no way to respond to bottlenecks.
* A founder, in the early days, needs to be able to do anything. Later employees can be increasingly specialised.
* Resource levels need to be appropriately balanced.
* Given a choice between doing something well or doing it quickly, it's better to do it well. It saves times soon enough.
* People can only work on one thing at a time. If they worked on more than one thing at a time, it would decrease throughput. Multi-tasking is a waste of time. (But multi-skilling is not!)
* A functioning and growing business can afford to pay a *lot* for good coffee.



## Non-lessons

There are many features of the real world, and of work places, that are not modelled in this game.

> "All models are wrong, some models are useful."



In the real world:

* not all bugs are so easily dealt with: a single bug can do *unlimited* damage. That's a vital feature of real bugs, but isn't modelled in the game.
* workers are not machines. They have good days and bad days, they have real lives. All of this is abstracted away.
* customers don't pay immediately, sometimes they don't pay at all, *even when you've done good work*. Life isn't fair like that.
* you have to pay workers after you hire them. Recurring paychecks aren't modelled in the game because they're not the problem I'm trying to demonstrate. But this isn't a sufficient answer to use in the real world.
* skill levels are not a simple ladder, "dev skill == 7". They would be better modelled as a bifurcating directed acyclic graph, where every node represents a different atom of skill or knowledge. But there's no emoji for that currently.
* before you hire a person, you don't accurately know their skill level. Often you don't know afterward either.
* training takes time and it doesn't have a consistent outcome.
* sometimes workers leave.
* projects never really finish. If they went well there will be ongoing support and changes, indefinitely. If they went badly, the lawsuits can also drag on.
* a situation where "any developer can develop any card" is not achievable. But you can take steps to move in that direction.
* procurement of goods in the enterprise is not as simple as clicking a "buy" button.
* workers spend non-zero amounts of their time in meetings, not shown in this game.
* some related practices I find useful are Daily Standups, Retrospectives, Project Pre-Mortems and Code-reviews. There was no way to integrate these into the game without disturbing the flow.
* context-switching takes time and effort.

Regarding the risk of skilled employees leaving, I love this:

> "What if we train them and they leave? <br />
> What if we don't train them and they stay?"


## Contributions

**Pull requests not actually welcome at this moment.** I may take this commercial, and haven't thought through the implications of accepting PRs on it prior to that. 

The code is in typescript now.
