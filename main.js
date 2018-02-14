const Overlay = require('o-overlay');
const expander = require('o-expander');

const consentOverlay = new Overlay('overlay-gdpr-consent', {
	src: '.consent-form-content',
	modal: true
});

consentOverlay.open();

document.addEventListener('oOverlay.ready', function () {
	expander.init();
});
