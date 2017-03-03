describe('Logout', function() {
    var Page = {
        logoutButton: function() {
            return ST.button('[reference=logout]');
        }
    };
    
    it('Logout button should be visible', function() {
        Page.logoutButton()
            .visible();
    });
    
    it('Should logout when clicking the logout button', function() {
        Page.logoutButton()
            .click()
            .wait(2000)
            .getUrl(function(url) {
                expect(url).toContain('Logout.aspx');
            });
    });
    
    it('Should not be possible to return to the app after logging out', function(done) {
        ST.getUrl(function(url) {
            var baseUrl = url.substring(0, url.lastIndexOf('/'));
            
            // Try redirecting to the Default.aspx page
            ST.navigate(baseUrl + '/Default.aspx')
                .wait(1000)
                .getUrl(function(url) {
                    // Should redirect back to the Login page as session is no longer valid
                    expect(url).toContain('Login.aspx');
                    done();
                });
        });
    });
});