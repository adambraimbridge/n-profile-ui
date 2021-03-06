import { ConsentForm } from './consent';
export class LiveUpdateConsent extends ConsentForm {
	constructor (opts) {
		super(opts);
		if (this.submitButton) {
			this.submitButton.style.display = 'none';
		}
	}
	saveSuccess (radioWrapper) {
		if (radioWrapper) {
			radioWrapper.classList.remove('o-forms-input--invalid');
			radioWrapper.classList.remove('o-forms-input--saving');
			radioWrapper.classList.add('o-forms-input--saved');
		}
		this.savedEvent({ success: true });
	}
	saveFail (radioWrapper) {
		if (radioWrapper) {
			radioWrapper.classList.remove('o-forms-input--saving');
			radioWrapper.classList.add('o-forms-input--invalid');
			const unchecked = radioWrapper.querySelector('.consent-form__radio-button:not(:checked)');
			if (unchecked) {
				unchecked.checked = true;
			}
		}
		this.savedEvent({ success: false });
	}
	redirect () {
		window.location.assign(`/login${document.referrer ? `?location=${document.referrer}` : ''}`);
	}
	savedEvent ({ success }) {
		const event = new CustomEvent('consent-form:saved', {
			detail: {
				success
			}
		});
		this.element.dispatchEvent(event);
	}
	onChange (callback) {
		this.radios.forEach((radio) => {
			radio.addEventListener('change', (e) => {
				const consent = this.consentFromRadio(radio);
				const radioWrapper = radio.closest('.o-forms-input');
				if (radioWrapper) {
					radioWrapper.classList.add('o-forms-input--saving');
					radioWrapper.classList.remove('o-forms-input--saved');
					callback(consent, e)
						.then(result => {
							if (result === 'success') {
								return this.saveSuccess(radioWrapper);
							}
							if (result === 'redirect') {
								return this.redirect();
							}
							this.saveFail(radioWrapper);
						})
						.catch(() => {
							this.saveFail(radioWrapper);
						});
				}
			});
		});
	}
}
