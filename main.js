const oOverlay = require('o-overlay');

oOverlay.init(document.querySelector('#overlay-gdpr-consent', {
	src: '.consent-form',
	modal: true,
	fullscreen: true
}));