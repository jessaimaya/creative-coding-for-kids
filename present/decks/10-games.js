// Module 10: Games and the final project. Lesson plan: modules/10-games.md
CC.deck({
  id: '10', num: 10, title: 'Games', color: 'yellow', icon: 'game',
  bigIdea: 'A game is everything you know **working together**: input, movement, rules, score, and a **state**.',
  kidIdea: 'Play it, take it apart, then build your own game.',
  sessions: '2-3 sessions',
  plan: 'modules/10-games.html',
  sketches: ['m10a_catch_game', 'm10b_game_template', 'm10c_pong_starter'],
  slides: [
    { type: 'title' },
    {
      type: 'hook', title: 'Catch the stars!', timer: 5,
      sketch: 'm10a_catch_game',
      text: 'Play in pairs for 5 minutes. **Beat the high score!**',
      sub: 'Click to start. Move with the mouse.',
    },
    {
      type: 'flow', title: 'The map of the game',
      text: 'Every game has **states**: screens it can be on. One variable, `state`, remembers which.',
      nodes: [
        { t: 'Title', d: '`state == 0`', color: 'blue' },
        { arrow: 'click' },
        { t: 'Playing', d: '`state == 1`', color: 'green' },
        { arrow: '`lives == 0`' },
        { t: 'Game over', d: '`state == 2`', color: 'pink' },
      ],
      loop: 'Click on the game-over screen to play again (back to state 1).',
    },
    {
      type: 'code', title: 'Read the game',
      sketch: 'm10a_catch_game',
      spotlight: [
        { find: 'if (state == 0)', note: 'Which screen? `draw()` checks the state first.' },
        { find: 'starY = starY + starSpeed', note: 'The star falls a little each frame.' },
        { find: 'abs(starX - mouseX)', note: 'The **collision**: is the star low enough **and** close to the paddle?' },
        { find: 'starSpeed = starSpeed + 0.1', note: 'Every catch makes the game a bit harder.' },
        { find: 'if (lives == 0)', note: 'Out of lives? Switch to the game-over state.' },
        { from: 'void mousePressed', note: 'A click starts (or restarts) the game and resets the score.' },
      ],
      notes: 'Dissecting (15 min). Draw the state map on the board first.',
    },
    {
      type: 'tasks', title: 'Pick three changes', timer: 30,
      sketch: 'm10a_catch_game',
      rule: 'After each change, **playtest**: is it more fun? Why?',
      items: [
        'Change the paddle width, star speed or lives.',
        'Add a second falling thing that\'s **bad** (lose a life if you catch it).',
        'Make the speed go up with the score.',
        'New art: stars become fruit, the paddle becomes a basket.',
        'Add a high score variable.',
      ],
    },
    {
      type: 'debug', name: 'collision_bug',
      code: `
if (starY > height - 40 && starX - mouseX < paddleW/2) {   // what's missing?
  score++;
}
`,
      text: 'This catch test is **almost** right. When does it go wrong?',
      bugs: [
        { line: 1, fix: 'When the star is to the **left** of the paddle, `starX - mouseX` is negative, so it\'s always "less than". It needs a distance that\'s never negative: `abs(starX - mouseX)`.' },
      ],
      notes: 'Show it: paddle on the left, star on the right, and vice versa.',
    },
    {
      type: 'act', title: 'Design your game in 10 minutes', timer: 10,
      steps: [
        { t: 'Goal', d: 'What does the player try to do?' },
        { t: 'Controls', d: 'Mouse? Arrow keys?' },
        { t: 'Danger', d: 'What makes it hard?' },
        { t: 'Win or lose', d: 'How does it end? **Art:** shapes only is fine!' },
      ],
    },
    {
      type: 'list', kicker: 'The playable-early rule', title: 'Build in small steps',
      points: [
        '**1.** The player moves (30 min).',
        '**2.** One thing the player can touch (30 min).',
        '**3.** Score and a game-over state (30 min).',
        '**4.** Polish: colours, more enemies, text, difficulty.',
        '**Scope is the enemy.** Make it work with a rectangle first!',
      ],
      reveal: true,
    },
    {
      type: 'code', title: 'Your starting point',
      sketch: 'm10b_game_template',
      text: 'The template has numbered **TODO** comments. Do them in order.',
      spotlight: [
        { find: 'TODO 1', note: 'Start here: variables for your player.' },
        { find: 'TODO 5', note: 'Collision: `if (dist(...) < something)` then score or game over.' },
      ],
    },
    {
      type: 'codingtrain', title: 'Pong for two',
      num: 67, url: 'https://thecodingtrain.com/challenges/67-pong', clip: 'the first few minutes',
      text: 'Two players, one keyboard. The left paddle works with **W** and **S**. Click the canvas first so it gets the keys!',
      steps: ['TODO 1: booleans for the arrow keys.', 'TODO 2: move the right paddle.', 'TODO 3: the right paddle\'s collision.', 'TODO 4: first to 5 wins.'],
      sketch: 'm10c_pong_starter',
    },
    {
      type: 'list', kicker: 'Need an idea?', title: 'Games that fit what you know',
      points: ['Dodge the falling rocks', 'Catch the good, avoid the bad', 'A maze with a goal', 'Whack-a-mole clicker', 'Simple Pong', 'Don\'t touch the walls', 'Flappy-style jumper', 'Snake (stretch: arrays)'],
    },
    {
      type: 'share', title: 'Showcase!', timer: 2,
      prompts: ['Show your game. Let someone play for 2 minutes.', 'One thing you\'re **proud** of.', 'One **bug** you beat.'],
    },
    {
      type: 'ican',
      items: ['use a state variable for screens.', 'detect when two things touch.', 'keep score and end the game.', 'playtest and improve my game.'],
    },
  ],
});
