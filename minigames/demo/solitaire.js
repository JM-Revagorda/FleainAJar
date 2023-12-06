function cardSet() {
	
	// Storage for card references
	this.playingCards = [];
	this.massiveImageCache = {};
	this.imagePacks = new imagePacks();

}

cardSet.prototype.defaultCardNames = ['6','7','8','9','10','Jack','Queen','King'];
cardSet.prototype.defaultCardWord = 'Card';

cardSet.prototype.toString = function () { return '[object cardSet]'; };

cardSet.prototype.addCard = function (oSuit,oNumber,oColour) {
	// Add a card to the deck
	this.playingCards[this.playingCards.length] = new playingCard(oSuit,oNumber,oColour,this);
};

cardSet.prototype.addImageCache = function (imUrl) {
	// Add an image into the cache
	if( !this.massiveImageCache[imUrl] ) {
		var oSet = this;
		this.massiveImageCache[imUrl] = new Image();
		this.massiveImageCache[imUrl].onerror = function () {
			if( !oSet.hasAlertedImageError ) {
				oSet.hasAlertedImageError = true;
				if( !window.hideCardGameErrors ) { alert('Warning: Card game image failed\n\nA card image failed to load - the card game may not play correctly:\n'+this.src+'\n\nNo more warnings will be shown for cards in this card set.'); }
			}
		};
		this.massiveImageCache[imUrl].src = imUrl;
	}
};

cardSet.prototype.setImagePack = function (oImageSet,oBackImage,oExtension) {
	// Set card images
	this.cardSet = oImageSet;
	this.imageExtension = oExtension;
	this.backImage = oImageSet+'back'+oBackImage+oExtension;
	this.addImageCache(this.backImage);
	for( var i = 0; i < this.playingCards.length; i++ ) {
		this.playingCards[i].inheritCardDesign();
	}
};

cardSet.prototype.shuffleCards = function (oTimes) {
	// Sorting function - based on the easier Knuth shuffle
	if( !oTimes ) { oTimes = 3; }
	for( var n = 0; n < oTimes; n++ ) {
		// Three times, just in case the browser's random number generator is not very good
		for( var i = 0; i < this.playingCards.length; i++ ) {
			this.playingCards[i].tmpShuffleSortingIndex = Math.random();
		}
		this.playingCards.sort( function (a,b) {
			// OmniWeb and older Safari insists that I return a whole number, not a fraction
			return ( ( b.tmpShuffleSortingIndex - a.tmpShuffleSortingIndex ) > 0 ) ? 1 : -1;
		} );
	}
	// Enable this for debugging
//	for( var i = 0, s=''; i < this.playingCards.length - 1; i++ ) { s+= this.playingCards[i].number + ' ' + this.playingCards[i].suit + '\n'; } alert(s);
};

cardSet.prototype.setCardSize = function (oWidth,oHeight) {
	// Set a nice width for the cards - any CSS width value is allowed
	for( var i = 0; i < this.playingCards.length; i++ ) {
		this.playingCards[i].setCardSize(oWidth,oHeight);
	}
};

cardSet.prototype.redrawCards = function () {
	// Redraws all cards (resets their images and alt text to the correct values)
	for( var i = 0; i < this.playingCards.length; i++ ) {
		this.playingCards[i].redrawCardImage();
	}
};

cardSet.prototype.setCardNames = function (oCardWord,oCardNames) {
	// Change the text representation of the cards
	if( !oCardWord ) { oCardWord = this.defaultCardWord; }
	if( !oCardNames ) { oCardNames = this.defaultCardNames; }
	this.cardWord = oCardWord;
	this.cardNames = oCardNames;
	this.redrawCards();
};

cardSet.prototype.forcePageRedraw = function () {
	// Force full document redraw
	document.body.className = document.body.className ? ( document.body.className + '' ) : '';
};

cardSet.prototype.create52Cards = function (cardSuits) {
	// Create 52 cards
	this.cardSuitNames = cardSuits ? cardSuits : ['spades','hearts','clubs','diamonds']
	for( var i = 0; i < this.cardSuitNames.length; i++ ) {
		for( var n = 1; n < 14; n++ ) {
			this.addCard(this.cardSuitNames[i],n,i%2,this);
		}
	}
}

/*****************************************
 A class representing a visual card stack
 - this can be extended by the game code
*****************************************/

function cardStack(oType,oIndex,oWithDiv,oDivText) {

	this.cardsInStack = [];
	this.type = oType;
	this.index = oIndex;
	if( oWithDiv ) {
		this.hotspot = document.createElement('div');
		this.hotspot.relatedObject = this;
		this.hotspot.className = 'hotspot';
		this.hotspot.style.position = 'absolute';
		if( oDivText ) { this.hotspot.appendChild(document.createTextNode(oDivText)); }
	}
	
};

cardStack.prototype.toString = function () { return '[object cardStack: type '+this.type+', index '+this.index+']'; };

cardStack.prototype.moveToStack = function (oCard) {
	// Moving is actually done in the oposite direction
	oCard.moveToStack(this);
};

cardStack.prototype.truncate = function (oLength) {
	// Truncate the cardsInStack array
	if( typeof(oLength) == typeof(0) ) {
		this.cardsInStack.length = oLength;
	} else {
		while( this.cardsInStack.length && !this.cardsInStack[this.cardsInStack.length-1] ) {
			this.cardsInStack.length--;
		}
	}
};

cardStack.prototype.setStyles = function (oLeft,oTop,zIndex,oWidth,oHeight,oFont) {
	// Set the position of the card stack
	this.leftPos = oLeft;
	this.topPos = oTop;
	this.hotspot.style.left = oLeft + 'px';
	this.hotspot.style.top = oTop + 'px';
	this.hotspot.style.zIndex = zIndex;
	this.hotspot.style.width = oWidth;
	this.hotspot.style.height = oHeight;
	this.hotspot.style.fontSize = oFont;
	this.hotspot.style.overflow = 'hidden';
};

/*******************************************************************************
 A class representing a set of available image packs, used to display the cards
*******************************************************************************/
  
function imagePacks() {
	this.availWidths = [];
	this.availHeights = [];
	this.widths = {};
	this.heights = {};
	this.packNames = {};
	this.availCombo = {};
}

imagePacks.prototype.toString = function () { return '[object imagePacks]'; };

imagePacks.prototype.addImagePack = function (oImageSet,oBackImages,oExtension,oWidth,oHeight,oName) {
	// Add an image back with size information
	if( !this.widths[oWidth] ) {
		this.availWidths[this.availWidths.length] = oWidth;
		this.widths[oWidth] = [];
	}
	if( !this.heights[oHeight] ) {
		this.availHeights[this.availHeights.length] = oHeight;
		this.heights[oHeight] = [];
	}
	var oStore = this.widths[oWidth][this.widths[oWidth].length] = this.heights[oHeight][this.heights[oHeight].length] =
		{imageset:oImageSet,backimages:oBackImages,extension:oExtension,width:oWidth,height:oHeight,name:oName,toString:function () { return '[private object imagePack: '+this.imageset+']'; }};
	for( var i = 0; i < oBackImages.length; i++ ) {
		this.availCombo[oWidth+'x'+oHeight+'|'+oImageSet+'|'+oBackImages[i][0]] = oStore;
	}
	var sortFunc = function ( a, b ) { return b - a; };
	this.availWidths.sort(sortFunc);
	this.availHeights.sort(sortFunc);
};

imagePacks.prototype.getFittingImageSize = function (oHeightWidth,oSize) {
	// Get the nearest image set that fits. If none fit, then get the first set up.
	var checkingList = oHeightWidth ? this.availWidths : this.availHeights;
	for( var i = 0; i < checkingList.length; i++ ) {
		if( checkingList[i] <= oSize ) { return checkingList[i]; }
	}
	return checkingList.length ? checkingList[checkingList.length-1] : null;
};

/****************************
 A class representing a card
****************************/

function playingCard(oSuit,oNumber,oColour,oCardSet) {

	// Initialise settings
	this.number = oNumber;
	this.suit = oSuit;
	this.color = oColour;
	this.wayup = false;
	this.cardSet = oCardSet;
	this.cardStack = null;
	this.positionOnStack = 0;

	// Create the card image and placeholder
	this.representation = document.createElement('div');
	this.representation.relatedObject = this;
	this.representation.style.position = 'absolute';
	this.representation.className = 'playingcard';
	this.cardImage = document.createElement('img');
	this.cardImage.style.display = 'block';
	this.representation.appendChild(this.cardImage);

}

playingCard.prototype.toString = function () { return '[object playingCard: '+this.number+' '+this.suit+']'; };

playingCard.prototype.moveToStack = function (oNewStack) {
	// Move onto another card stack
	if( this.cardStack ) {
		this.cardStack.cardsInStack[ this.positionOnStack ] = null;
	}
	this.cardStack = oNewStack;
	this.positionOnStack = oNewStack.cardsInStack.length;
	oNewStack.cardsInStack[this.positionOnStack] = this;
};

playingCard.prototype.nextOnStack = function () {
	// Like nextSibling but related to card stacks
	if( !this.cardStack ) { return null; }
	return this.cardStack.cardsInStack[ this.positionOnStack + 1 ];
};

playingCard.prototype.previousOnStack = function () {
	// Like previousSibling but related to card stacks
	if( !this.cardStack ) { return null; }
	return this.cardStack.cardsInStack[ this.positionOnStack - 1 ];
};

playingCard.prototype.inheritCardDesign = function () {
	// Get the new card set images
	this.faceImage = this.cardSet.cardSet+this.suit+this.number+this.cardSet.imageExtension;
	this.cardSet.addImageCache(this.faceImage);
	this.redrawCardImage();
};

playingCard.prototype.changeCard = function (oSuit,oNumber) {
	this.number = oNumber;
	this.suit = oSuit;
	this.inheritCardDesign();
};

playingCard.prototype.redrawCardImage = function () {
	// Set or change the image showing on the card face
	if( !this.faceImage || !this.cardSet.backImage ) { return; }
	// Bug in Firefox - alt attributes do not change unless they are made _before_ an SRC change
	this.cardImage.setAttribute('alt',this.wayup?(this.cardSet.cardNames[this.number-1]+' '+this.suit):this.cardSet.cardWord);
	this.cardImage.src = this.wayup ? this.faceImage : this.cardSet.backImage;
};

playingCard.prototype.showFace = function (oWhich) {
	// Used to flip a card over
	if( this.redrawNewImage != oWhich ) {
		this.wayup = oWhich;
		this.redrawCardImage();
	}
};

playingCard.prototype.setCardSize = function (oWidth,oHeight) {
	// Set the width of the card image
	this.cardImage.style.width = oWidth;
	this.cardImage.style.height = oHeight;
	this.representation.style.width = oWidth;
	this.representation.style.height = oHeight;
};