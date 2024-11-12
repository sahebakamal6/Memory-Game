var selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    reset: document.getElementById('reset-btn') 
};

var stats = {
    gameStarted: false,
    flippedCard: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

var shuffle = array => {
    var clonedArray = [...array];
    for (var i = clonedArray.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var original = clonedArray[i];
        clonedArray[i] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }
    return clonedArray;
};

var pickRandom = (array, items) => {
    var clonedArray = [...array];
    var randomPick = [];
    for (var i = 0; i < items; i++) {
        var randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPick.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return randomPick;
};

var generateGame = () => {
    var dimension = selectors.board.getAttribute('data-dimension');
    if (dimension % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }
    var emojis = ['🍈', '🍒', '🥑', '🍊', '🥭', '🥝', '🍌', '🍎', '🍍', '🍓'];
    var picks = pickRandom(emojis, (dimension * dimension) / 2);
    var items = shuffle([...picks, ...picks]);

    var cards = `
    <div class="board" style="grid-template-columns: repeat(${dimension}, auto);">
        ${items.map(item => `
            <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>
        `).join('')}
    </div>
    `;

    var parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));

    attachCardEventListeners();
};

var startGame = () => {
    stats.gameStarted = true;
    selectors.start.classList.add('disabled');
    stats.loop = setInterval(() => {
        stats.totalTime++;
        selectors.moves.innerText = `${stats.totalFlips} Moves`;
        selectors.timer.innerText = `Time: ${stats.totalTime} Sec`;
    }, 1000);
};

var flipBackCard = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    stats.flippedCard = 0;
};

var flipCard = card => {
    stats.flippedCard++;
    stats.totalFlips++;

    if (!stats.gameStarted) {
        startGame();
    }

    if (stats.flippedCard <= 2) {
        card.classList.add('flipped');
    }

    if (stats.flippedCard === 2) {
        var flippedCards = document.querySelectorAll('.flipped:not(.matched)');
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            stats.flippedCard = 0;
        } else {
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
                stats.flippedCard = 0; 
            }, 1000);
        }
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    You Won!😍<br/>
                    with <span class="highlight">${stats.totalFlips}</span> moves<br/>
                    under <span class="highlight">${stats.totalTime}</span> seconds
                </span>
            `;
            clearInterval(stats.loop);

            blastconfetti();
        }, 1000);
    }
};

var attachEventListeners = () => {
    document.addEventListener('click', event => {
        var eventTarget = event.target;
        var eventParent = eventTarget.closest('.card');

        if (eventParent && !eventParent.classList.contains('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget === selectors.start && !eventTarget.classList.contains('disabled')) {
            startGame();
        } else if (eventTarget === selectors.reset) {
            resetGame();
        }
    });
};

var attachCardEventListeners = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('flipped')) {
                flipCard(card);
            }
        });
    });
};

var resetGame = () => {
    clearInterval(stats.loop);
    stats = {
        gameStarted: false,
        flippedCard: 0,
        totalFlips: 0,
        totalTime: 0,
        loop: null
    };

    selectors.moves.innerText = '0 Moves';
    selectors.timer.innerText = 'Time: 0 Sec';
    selectors.start.classList.remove('disabled');
    selectors.boardContainer.classList.remove('flipped');
    selectors.win.innerHTML = '';

    generateGame();

    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });

    attachCardEventListeners();
};



generateGame();
attachEventListeners();

function blastconfetti(){
    confetti({
        spread: 360,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
        particleCount: 100,
        scalar: 3,
        shapes: ["image"],
        shapeOptions: {
          image: [{
              src: "https://particles.js.org/images/fruits/apple.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/avocado.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/banana.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/berries.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/cherry.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/grapes.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/lemon.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/orange.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/peach.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/pear.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/pepper.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/plum.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/star.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/strawberry.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/watermelon.png",
              width: 32,
              height: 32,
            },
            {
              src: "https://particles.js.org/images/fruits/watermelon_slice.png",
              width: 32,
              height: 32,
            },
          ],
        },
      });
}