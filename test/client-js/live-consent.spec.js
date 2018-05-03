const stubFetch = require('./helpers/stub-fetch');
const initConsentForm = require('./helpers/init-consent-form');
const $ = require('jquery');
const sinon = require('sinon');

let afterFormSaved = () => { };

describe('Live consent form', () => {
	beforeEach(() => {
		initConsentForm(() => { afterFormSaved(); });
	});

	const radioButton = () => $('#categoryB-channel1-yes');

	it('shows an updated switch value when the form is saved', async done => {
		stubFetch();
		expect(radioButton().prop('checked')).toEqual(false);
		radioButton().click();
		afterFormSaved = () => {
			expect(radioButton().prop('checked')).toEqual(true);
			done();
		};
	});

	it('redirects the page when the user\'s session has expired, and doesn\'t check the selected radio', async done => {
		const redirectLocation = '/login';
		stubFetch({ responseCode: 403 });
		const locationSpy = sinon.spy(window.location, 'assign');
		radioButton().click();
		afterFormSaved = () => {
			expect(locationSpy.calledWith(redirectLocation)).toEqual(true);
			expect(radioButton().prop('checked')).toEqual(false);
			done();
		};
	});
});
