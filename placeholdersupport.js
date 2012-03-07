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
    
    initialize: function(){
        if ("placeholder" in document.createElement("input")) return;
        
        window.addEvent('domready', function(){
            $$('input[placeholder]:not([type="password"])').each(function(el) {
                this.setupPlaceholder(el);
            }.bind(this));

            $$('input[placeholder][type="password"]').each(function(el) {
                this.setupPasswords(el);
            }.bind(this));

            $$('form').addEvent('submit', function(e) {
                this.clearPlaceholdersBeforeSubmit(e.target);
            }.bind(this));
        }.bind(this));
    },
    
    setupPlaceholder: function(input) {

		var placeholderText = input.get('placeholder');

		this.setPlaceholderOrFlagChanged(input, placeholderText);
		input.addEvents({
            'focus': function() {
                if (input.get('changed') == 'true') return;
                if (input.value === placeholderText) input.value = '';
            },
            'blur': function() {
                if (input.value === '') input.value = placeholderText;
            },
            'change': function() {
                input.set('changed', input.value !== '');
            }
		});
	},

	setPlaceholderOrFlagChanged: function(input, text) {
		(input.value === '') ? input.value = text : input.set('changed', true);
	},

	setupPasswords: function(input) {
		var passwordPlaceholder = this.createPasswordPlaceholder(input);
		passwordPlaceholder.inject(input, 'after');

		(input.value === '') ? input.hide() : passwordPlaceholder.hide();

		input.addEvent('blur', function() {
			if (input.value !== '') return;
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

	clearPlaceholdersBeforeSubmit: function(form) {
		form.getElements('input[placeholder]').each(function(el) {
			if (el.get('changed') == 'true') return;
			if (el.value === el.get('placeholder')) el.value = '';
		});
	}
});