# DevShop!

I had this idea 10 years ago for a game called [DevShop](http://www.secretgeek.net/devshop_i) and decided to implement a minimal non-viable product of it, in vanilla js, with the no-framework.

It's a kind of 'lemonade stand' game, but instead of buying lemons and making lemonade, you hire developers/testers and business analysts, and complete tasks on a kanban board.

Play it online here:

<https://secretgeek.github.io/devShop/>


## Walkthrough

- click start
- click "find project ($100)"

- click on the newly created project which is in the "leads" column of the kanban board.
- click on the Founder.  (in the animated version this would cause the founder to walk to the board, grab the card, take it back to their desk, work on it, create a bunch of cards, and take them back to the board, putting them in the "backlog" column.)
- once the cards are in the backlog column, click on one of them to select it.
- click on the founder again. This causes the Founder to do the development on the card. (In the animated version, they would walk over, get the card, take it back to their desk, swear a lot, etc.)
- The card eventually ends up in the test column.
- Click the card then click the founder....
- This causes the founder to test the card. if it passes testing it is done... and you make money 💲. (It's possible a bug 🐛is found during testing... or if the bug is missed by the tester, the customer can find the bug 🐞 .)
- when the project is completed you get a completion bonus 💲.
- then begin another project...

Repeat this until you have enough money to buy a dev or a tester or a ba. 

Not implemented:

- upskilling people
- training people to increase their efficiency
- giving them 'automated' skills so they can sometimes grab cards for themselves.
- achievements and goals
- having animated people instead of simple boxes
- ☕ coffee and donuts 🍩
- inflation. (i.e. things will cost more and be higher stakes as the game progresses.)
- (people will get faster as you increase their skills, but jobs will be bigger... thus creating a steady state, a hedonic treadmill, a red queen's race.)

Pull requests welcome!

The code is messy, i wrote it in a fevered rush