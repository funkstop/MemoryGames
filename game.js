// game.js
const game = {
    canvas: null,
    ctx: null,
    cards: [],
    cardWidth: 200,
    cardHeight: 300,
    numCards: 8,
    matches: 0,
    flippedCards: []
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
    game.canvas.width = 2000; // Increase the width
    game.canvas.height = 1600; // Increase the height


    game.canvas.addEventListener('click', function(event) {
        console.log('Canvas clicked!');

        const rect = game.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        // Check which card was clicked
        for (let i = 0; i < game.cards.length; i++) {
            const card = game.cards[i];
            const cardLeft = i % 4 * (game.cardHeight + 20) + 50;
            const cardRight = cardLeft + game.cardHeight;
            const cardTop = Math.floor(i / 4) * (game.cardWidth + 20) + 50;
            const cardBottom = cardTop + game.cardWidth;
    
            if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
                // Flip the card
                game.flipCard(card);
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
        'images/Uonairobi_emblem.png'
      ];

      const cardNames = [
        'Makerere University', // Add the card names here
        'K T Shop',
        'Arusha, Tanzania',
        'University of Nairobi Crest'
    ];
    
    const cardConnections = [
        'Do you remember teaching there?', // Add the card names here
        'Bringing back memories of Dar es Salaam',
        'How Amazing to have Mount Meru in the background!',
        'Can you name the elements of the crest?'
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
    const cardsPerColumn = 4; // number of cards per row
    const numColumns = Math.ceil(game.cards.length / cardsPerColumn); // calculate the number of rows needed

    // Preload all images
    const images = {};
    for (let i = 0; i < game.cards.length; i++) {
        const card = game.cards[i];
        const img = new Image();
        img.src = card.isFlipped ? card.imageSrc : 'images/card-back.png';
        images[i] = img;
    }

    // Wait for all images to load
    const allImagesLoaded = () => Object.values(images).every(img => img.complete);
    const renderInterval = setInterval(() => {
        if (allImagesLoaded()) {
            clearInterval(renderInterval);

            // Draw the cards
            for (let i = 0; i < game.cards.length; i++) {
                const card = game.cards[i];
                const img = images[i];
                const x = (i % cardsPerColumn) * (game.cardHeight + 20) + 50; // Use card height for x
                const y = Math.floor(i / cardsPerColumn) * (game.cardWidth + 20) + 50; // Use card width for y

                // Only redraw the card if its state has changed
                if (card.isFlipped !== img.isFlipped) {
                    game.ctx.clearRect(x, y, game.cardHeight, game.cardWidth);
                    game.ctx.drawImage(img, x, y, game.cardHeight, game.cardWidth);
                    img.isFlipped = card.isFlipped;
                }
            }
        }
    }, 100); // Check for loaded images every 100ms
}


    


game.flipCard = function(card) {
    console.log('Flipping card:', card);

    if (!card.isFlipped && game.flippedCards.length < 2) {
        card.isFlipped = true;
        game.flippedCards.push(card);

        if (game.flippedCards.length === 2) {
            setTimeout(game.checkMatch, 1000);
        }
    }

    game.renderCards(); // Add this line to re-render after flipping
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