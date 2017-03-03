/*
    Login.aspx doesn't use any Ext JS components - it's just a standard
    HTML page with input elements, so we use ST.element to reference
    all of the form fields and buttons on the page by their ID.
*/
describe('Login', function() {
    var Page = {
        /*
            Login screen elements
        */
        emailField: function() {
            return ST.element('@email');  
        },
        passwordField: function() {
            return ST.element('@password');  
        },
        submitButton: function() {
            return ST.element('@submit');
        },
        resetButton: function() {
            return ST.element('@reset');  
        },
        registrationLink: function() {
            return ST.element('@register');  
        },
        errorText: function() {
            return ST.element('@errors');
        },
        
        /*
            Registration screen elements
        */
        loginLink: function() {
            return ST.element('@login');  
        }
    };

    var timeToWait = 5000;

    /**
     * Before each test spec, we reset the state of the form, by clicking the form's Reset button
     */
    beforeEach(function() {
        Page.resetButton()
            .click();
    });
    
    it('Screenshot should match baseline', function() {
        ST.screenshot('Login');
    });
    
    it('Should not login without an email address or password specified', function() {
        Page.submitButton()
            .click()
            .wait(timeToWait);
        
        Page.errorText()
            .textLike('Email address is required')
            .textLike('Password is required');
    });
    
    it('Should show an error when the entered email address doesn\'t exist', function() {
        Page.emailField()
            .focus()
            .type('invalidemail@domain.com');
            
        Page.passwordField()
            .focus()
            .type('test');
            
        Page.submitButton()
            .click()
            .wait(timeToWait);
        
        Page.errorText()
            .textLike('User with this email address not found');
    });
    
    it('Should display an error when attempting to login with a valid email but an invalid password', function() {
        Page.emailField()
            .focus()
            .type('youremail@domain.com');
        
        Page.passwordField()
            .focus()
            .type('invalidpassword');
            
        Page.submitButton()
            .click()
            .wait(timeToWait);
        
        Page.errorText()
            .textLike('You entered an invalid password');
    });
    
    it('Should navigate to the Registration screen when the Register link is clicked', function() {
        Page.registrationLink()
            .click()
            .wait(timeToWait)
            .getUrl(function(url) {
                expect(url).toContain('Register.aspx'); 
            });
    });
    
    it('Should navigate back to the Login screen when the Login link is clicked', function() {
        Page.loginLink()
            .click()
            .wait(timeToWait)
            .getUrl(function(url) {
                expect(url).toContain('Login.aspx'); 
            });
    });
    
    it('Should login when valid login credentials have been provided and redirect to the app', function() {
        Page.emailField()
            .focus()
            .type('youremail@domain.com');
        
        Page.passwordField()
            .focus()
            .type('yourpassword');
            
        Page.submitButton()
            .click()
            .wait(timeToWait)
            .getUrl(function(url) {
                expect(url).toContain('Default.aspx'); 
            });
    });
});