/**
* Spoofs placeholders in browsers that don't support them (eg Firefox 3)
* 
* [REQUIRES] Element.Shortcuts from Mootools More
* 
* Copyright 2012 Ajimix
* Licensed under the Apache License 2.0
*
* Author: Ajimix [github.com/ajimix]
* Version: 1.0
* Based on jQuery version made by Dan Bentley [github.com/danbentley]
*/
var PlaceholderSupport = new Class({
	
	// Class constructor
	initialize: function(){
		// If the browser supports placeholder, just return
		if ("placeholder" in document.createElement("input")){ return; }
		
		window.addEvent('domready', function(){
			$$('input[placeholder]:not([type="password"])').each(function(el) {
				this.setupPlaceholder(el);
			}.bind(this));

			$$('input[placeholder][type="password"]').each(function(el) {
				this.setupPasswords(el);
			}.bind(this));

			$$('form').addEvent('submit', function(e) {
				// We clear the placeholders before submitting
				this.clearPlaceholdersBeforeSubmit(e.target);
			}.bind(this));
		}.bind(this));
	},
	
	// Adds placeholder to all elements except password tyoe
	setupPlaceholder: function(input) {

		var placeholderText = input.get('placeholder');

		this.setPlaceholderOrFlagChanged(input, placeholderText); // We create the placeholder or flag true that have been changed in case of
		input.addEvents({ // Adding events to all kind of changes
			'focus': function() {
				if (input.get('changed') == 'true'){ return; }
				if (input.value === placeholderText){ input.value = ''; }
			},
			'blur': function() {
				if (input.value === ''){ input.value = placeholderText; }
			},
			'change': function() {
				input.set('changed', input.value !== '');
			}
		});
	},

	setPlaceholderOrFlagChanged: function(input, text) {
		(input.value === '') ? input.value = text : input.set('changed', true);
	},

	// Passwords should be treated different, we create a second input that holds the placeholder so it can be shown
	setupPasswords: function(input) {
		// We create an input that will hold our placeholder text
		var passwordPlaceholder = this.createPasswordPlaceholder(input);
		passwordPlaceholder.inject(input, 'after');

		(input.value === '') ? input.hide() : passwordPlaceholder.hide();

		// Events to show and hide the placeholder and the original input
		input.addEvent('blur', function() {
			if (input.value !== ''){ return; }
			input.hide();
			passwordPlaceholder.show();
		});
			
		passwordPlaceholder.addEvent('focus', function() {
			input.show().focus();
			passwordPlaceholder.hide();
		});
	},

	createPasswordPlaceholder: function(input) {
		return new Element('input', {
			placeholder: input.get('placeholder'),
			value: input.get('placeholder'),
			id: input.get('id'),
			readonly: true,
			'class': input.get('class')
		});
	},

	// We clear all the placeholder texts before submit
	clearPlaceholdersBeforeSubmit: function(form) {
		form.getElements('input[placeholder]').each(function(el) {
			if (el.get('changed') == 'true'){ return; }
			if (el.value === el.get('placeholder')){ el.value = ''; }
		});
	}
});