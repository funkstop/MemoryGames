// game.js
const game = {
    canvas: null,
    ctx: null,
    cards: [],
    cardWidth: 200,
    cardHeight: 300,
    numCards: 12,
    matches: 0,
    flippedCards: [],
    isMobile: false  // Add this line
};

class Card {
    constructor(id, imageSrc, name, personalConnection) {
        this.id = id;
        this.imageSrc = imageSrc;
        this.isFlipped = false;
        this.name = name; // Add the name property
        this.personalConnection = personalConnection;
    }
}

game.initCanvas = function() {
    game.canvas = document.getElementById("gameCanvas");
    game.ctx = game.canvas.getContext("2d");
    
    // Determine if on mobile device
    game.isMobile = window.innerWidth <= 800;
    
    if (game.isMobile) {
        game.cardWidth = 210;
        game.cardHeight = 140;
        game.canvas.width = 460; // Fits 2 cards side by side with some margin
        game.canvas.height = Math.ceil(game.numCards / 2) * (game.cardHeight + 20) + 50;
    } else {
        game.cardWidth = 300;
        game.cardHeight = 200;
        game.canvas.width = 1300; // Fits 4 cards side by side with some margin
        game.canvas.height = Math.ceil(game.numCards / 4) * (game.cardHeight + 20) + 50;
    }

    game.canvas.addEventListener('click', function(event) {
        const rect = game.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        const cardsPerRow = game.isMobile ? 2 : 4;
        for (let i = 0; i < game.cards.length; i++) {
            const cardLeft = (i % cardsPerRow) * (game.cardWidth + 20) + 10;
            const cardTop = Math.floor(i / cardsPerRow) * (game.cardHeight + 20) + 10;
    
            if (x >= cardLeft && x <= cardLeft + game.cardWidth &&
                y >= cardTop && y <= cardTop + game.cardHeight) {
                game.flipCard(game.cards[i]);
                break;
            }
        }
    });
}

game.createDeck = function() {
    //const images = ['🍎', '🍌', '🍓', '🍊'];

    const images = [
        'images/Makerere.png',
        'images/KTShop.png',
        'images/arushaCity.png',
        'images/Uonairobi_emblem.png',
        'images/churchillhighschool.png',
        'images/MurchisonFalls.jpg',
        'images/arushaCity.png'
       // 'images/Uonairobi_emblem.png'
      ];

      const cardNames = [
        'Makerere University', // Add the card names here
        'K T Shop',
        'Arusha, Tanzania',
        'University of Nairobi Crest',
        'Churchill High School', // Add the card names here
        'Murchison Falls',
        'Arusha, Tanzania'
      //  'University of Nairobi Crest'
    ];
    
    const cardConnections = [
        'Do you remember teaching there?', // Add the card names here
        'Bringing back memories of Dar es Salaam',
        'Do you recognized Mount Meru in the background?',
        'Can you name the elements of the crest?',
        'Your first high school that you taught in. The Bulldog is still in your living room!',
        'A great honeymoon where an elephant almost charged you!',
        'Arusha, Tanzania'
      //  'University of Nairobi Crest'
    ];
    
    for (let i = 0; i < game.numCards / 2; i++) {
        const card1 = new Card(i, images[i], cardNames[i], cardConnections[i]);
        card1.isFlipped = false;
        const card2 = new Card(i, images[i], cardNames[i], cardConnections[i]);
        card2.isFlipped = false;
        
        game.cards.push(card1, card2);
    }
    
    game.cards = game.shuffleArray(game.cards);
}

game.shuffleArray = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

game.renderCards = function() {
    const cardsPerRow = game.isMobile ? 2 : 4;

    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    for (let i = 0; i < game.cards.length; i++) {
        const card = game.cards[i];
        const x = (i % cardsPerRow) * (game.cardWidth + 20) + 10;
        const y = Math.floor(i / cardsPerRow) * (game.cardHeight + 20) + 10;

        const img = new Image();
        img.onload = function() {
            game.ctx.drawImage(img, x, y, game.cardWidth, game.cardHeight);
        }
        img.src = card.isFlipped ? card.imageSrc : 'images/card-back.png';
    }
}


game.flipCard = function(card) {
    if (!card.isFlipped && game.flippedCards.length < 2) {
        card.isFlipped = true;
        game.flippedCards.push(card);

        if (game.flippedCards.length === 2) {
            setTimeout(game.checkMatch, 1000);
        }

        game.renderCards(); // Re-render after flipping
    }
}

game.checkMatch = function() {
    const [card1, card2] = game.flippedCards;

    if (card1.id === card2.id) {
        // Cards match
        game.matches++;
        game.flippedCards = [];
        // Show a popup with information about the matched cards
        const matchedCardInfo = `You matched ${card1.name}! ${card1.personalConnection}`;
        showModal(matchedCardInfo);
    } else {
        // Cards don't match
        card1.isFlipped = false;
        card2.isFlipped = false;
        game.flippedCards = [];
    }

    game.renderCards();

    if (game.matches === game.numCards / 2) {
        console.log('You win!');
    }
}


window.addEventListener("load", function() {
    game.initCanvas();
    game.createDeck();
    game.renderCards(); // Add this line to call renderCards

    // Add event listener to the close button
    const closeBtn = document.getElementById('closeBtn');
    closeBtn.addEventListener('click', hideModal);
});

function showModal(content) {
    const matchInfo = document.getElementById('matchInfo');
    matchInfo.textContent = content;
    const modal = document.getElementById('matchModal');
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('matchModal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('matchModal');
    if (event.target === modal) {
        hideModal();
    }
}