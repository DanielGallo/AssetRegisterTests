describe('Dashboard', function() {
    var Page = {
        /*
            Dashboard screen components
        */
        assetCountPanel: function() {
            return ST.component('assetcount');  
        },
        assetValuePanel: function() {
            return ST.component('assetvalue');  
        },
        assetCategorySpendChart: function() {
            return ST.component('categoryspend');
        },
        assetMonthlySpendChart: function() {
            return ST.component('monthlyspend');
        }
    };
    
    it('Should contain a panel for total count of assets', function() {
        Page.assetCountPanel();
    });
    
    it('Should contain text showing the total count of assets', function() {
        Page.assetCountPanel()
            .text('301 assets');
    });
    
    it('Should contain a panel for total value of assets', function() {
        Page.assetValuePanel(); 
    });
    
    it('Should contain text showing the total value of assets', function() {
        Page.assetValuePanel()
            .text('$205,843 total value');
    });
    
    it('Should contain a pie chart showing spend by Asset Type', function() {
        Page.assetCategorySpendChart();
    });
    
    it('Should contain a column chart showing spend by month for the past 6 months', function() {
        Page.assetMonthlySpendChart(); 
    });
    
    it('Screenshot should match baseline', function() {
        ST.screenshot('Dashboard');
    });
});