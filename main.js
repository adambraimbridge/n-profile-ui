const Overlay = require('o-overlay');
const expander = require('o-expander');
const overlayContentSelector = '.consent-form-content';

module.exports = class Reconsent {
	constructor({flag}) {
		if (flag === 'autoload')
			this.overlaySetup();
		else if (flag === 'banner')
			this.bannerSetup();
	}

	bannerSetup() {
		const banner = document.querySelector('.consent-banner__outer');
		banner.classList.add('active');
		document.querySelector('.consent-banner__button').addEventListener('click', () => {
			banner.classList.remove('active');
			this.overlaySetup();
		});
	}

	overlaySetup() {
		this.consentOverlay = new Overlay('overlay-gdpr-consent', {
			src: overlayContentSelector,
			modal: true,
			customclose: '.o-overlay__close'
		});
		this.consentOverlay.open();
		document.addEventListener('oOverlay.ready', () => {
			expander.init();
			const content = document.querySelector(overlayContentSelector);
			content.parentNode.removeChild(content);
			const form = document.querySelector('.reconsent-form');
			this.formSubmitEnable(form);
			this.formSubmitHandler(form);
			this.overlayCloseHandler();
		});
	}

	formSubmitEnable(form) {
		let radiosChecked = 0;
		const radios = form.querySelectorAll('.consent-form__radio-button');
		const submitButton = form.querySelector('.consent-form__submit');
		radios.forEach((radio) => {
			radio.addEventListener('change', () => {
				++radiosChecked;
				if (radiosChecked >= radios.length/2) {
					submitButton.removeAttribute('disabled');
				}
			});
		});
	}

	formSubmitHandler(form) {
		form.addEventListener('submit', (e) => {
			const overlayContentWrapper = document.querySelector('.o-overlay__content');
			overlayContentWrapper.setAttribute('style', `height:auto;width:${overlayContentWrapper.offsetWidth}px`);
			document.querySelector('.reconsent-confirmation').classList.remove('hidden');
			form.classList.add('hidden');
			this.setOverlayCloseCountdown();
			e.preventDefault();
			e.stopPropagation();
		});
	}

	setOverlayCloseCountdown() {
		const countdownEl = document.querySelector('.consent-form__close-timer');
		let secondsLeft = 10;
		countdownEl.innerHTML = secondsLeft;
		const interval = setInterval(() => {
			--secondsLeft;
			if (secondsLeft === 0) {
				this.consentOverlay.close();
				return clearInterval(interval);
			}
			countdownEl.innerHTML = secondsLeft;
		}, 1000);
	}

	overlayCloseHandler() {
		document.querySelector('.consent-form__close').addEventListener('click', () => {
			this.consentOverlay.close();
		});
	}
};





