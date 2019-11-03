# DevShop!

I had this idea 10 years ago for a game called [DevShop](http://www.secretgeek.net/devshop_i) and decided to implement a minimal non-viable product of it, in vanilla js, with the no-framework.

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

Not yet implemented:

- upskilling people 📕 📗
- training people to increase their efficiency
- giving them 'automated' skills so they can sometimes grab cards for themselves.
- achievements and goals
- having animated people instead of simple boxes
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


## Contributions

Pull requests welcome!

The code is in typescript now.
