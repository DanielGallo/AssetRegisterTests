describe('User', function() {
    var Page = {
        menu: function() {
            return ST.dataView('#menu');
        },
        form: function() {
            return ST.component('simpleuserform');
        },
        saveButton: function() {
            return ST.button('simpleuserform button[reference=save]');  
        },
        changePasswordButton: function() {
            return ST.button('simpleuserform button[reference=changepassword]');
        },
        displayName: function() {
            return ST.component('container[reference=displayName]');
        },
        messageBox: function() {
            return ST.component('messagebox');
        },
        messageBoxButton: function() {
            return ST.button('messagebox button[text=OK]');  
        },
        messageToast: function() {
            return ST.component('sheet[baseCls=x-toast]');  
        },
        
        /*
            Form fields
        */
        nameField: function() {
            return ST.field('simpleuserform textfield[label=Name]');
        },
        passwordField: function() {
            return ST.field('simpleuserform passwordfield[reference=password1]');
        },
        confirmPasswordField: function() {
            return ST.field('simpleuserform passwordfield[reference=password2]');
        },
        
        /*
            Hidden fields
        */
        hiddenNameField: function() {
            return ST.element('@username');
        }
    };
    
    // Stores the user's current display name
    var originalName = '';
    
    beforeAll(function() {
        // Get the current user's name from the hidden form field to restore the value later in the test run
        Page.hiddenNameField()
            .get('value')
            .and(function() {
                originalName = this.future.data.value;
            });
    });
    
    it('Should navigate to the User details view when clicking the User icon in menu', function() {
        Page.menu()
            .item('userdetails')
            .click();
    });
    
    it('Should show the User details form', function() {
        Page.form()
            .visible();
    });
    
    it('Changing the display name of the user and saving should update the display name next to the logout button', function() {
        var newName = 'Pied Piper';
        
        Page.nameField()
            .setValue(newName);
            
        Page.saveButton()
            .click();
            
        Page.displayName()
            .textLike(newName);
    });
    
    it('Changing the display name of the user back to the original value updates the display name', function() {
        Page.nameField()
            .setValue(originalName);
            
        Page.saveButton()
            .click();
            
        Page.displayName()
            .textLike(originalName);
    });
    
    it('Clicking the Change Password button shows the two password fields', function() {
        Page.changePasswordButton()
            .click();
            
        Page.passwordField()
            .visible();
            
        Page.confirmPasswordField()
            .visible();
    });
    
    it('Changing the Password to a value fewer than 8 characters should fail', function() {
        Page.passwordField()
            .setValue('test');
            
        Page.confirmPasswordField()
            .setValue('test');
            
        Page.saveButton()
            .click();
            
        Page.messageBox()
            .visible()
            .expect('innerText').toContain('Validation errors')
            .expect('innerText').toContain('Password Does not meet requirements (8 character minimum)');
            
        Page.messageBoxButton()
            .click();
            
        Page.messageBox()
            .hidden();
    });
    
    it('Changing the Password to two values that do not match should fail', function() {
        Page.passwordField()
            .setValue('randompass1');
            
        Page.confirmPasswordField()
            .setValue('randompass2');
            
        Page.saveButton()
            .click();
            
        Page.messageBox()
            .visible()
            .expect('innerText').toContain('Validation errors')
            .expect('innerText').toContain('Password Does not match confirmation password');
            
        Page.messageBoxButton()
            .click();
            
        Page.messageBox()
            .hidden();
    });
    
    it('Changing the Password to a valid value will successfully save', function() {
        Page.passwordField()
            .setValue('senchasencha');
            
        Page.confirmPasswordField()
            .setValue('senchasencha');
            
        Page.saveButton()
            .click();
            
        Page.messageBox()
            .hidden();
            
        Page.messageToast()
            .visible()
            .expect('innerText').toContain('User details saved');
    });
});