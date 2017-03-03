describe('Asset', function() {
    var Page = {
        menu: function() {
            return ST.dataView('#menu');
        },
        grid: function() {
            return ST.grid('assetgrid');
        },
        form: function() {
            return ST.component('assetform');
        },
        backButton: function() {
            return ST.button('assetform button[text=Back]');
        },
        saveButton: function() {
            return ST.button('assetform button[reference=save]');  
        },
        deleteButton: function() {
            return ST.button('assetform button[reference=delete]');
        },
        addButton: function() {
            return ST.button('assetgrid button[text=Add New]');
        },
        messageBox: function() {
            return ST.component('messagebox');
        },
        messageBoxOkButton: function() {
            return ST.button('messagebox button[text=OK]');  
        },
        messageBoxYesButton: function() {
            return ST.button('messagebox button[text=Yes]'); 
        },
        messageBoxNoButton: function() {
            return ST.button('messagebox button[text=No]');   
        },
        messageToast: function() {
            return ST.component('sheet[baseCls=x-toast]');  
        },
        
        /*
            Form fields
        */
        nameField: function() {
            return ST.field('assetform textfield[label=Name]');
        },
        descriptionField: function() {
            return ST.field('assetform textareafield[label=Description]');
        },
        typeField: function() {
            return ST.select('assetform selectfield[label=Type]');
        },
        dateField: function() {
            return ST.field('assetform datepickerfield[label=Date]');
        },
        quantityField: function() {
            return ST.field('assetform numberfield[label=Quantity]');  
        },
        costField: function() {
            return ST.field('assetform numberfield[label=Per Unit Cost]');
        },
        
        /*
            Dashboard panels
        */
        assetCountPanel: function() {
            return ST.component('assetcount');  
        },
        assetValuePanel: function() {
            return ST.component('assetvalue');  
        }
    };
    
    var newAsset = {
        name: 'Epson PowerLite Home Cinema 1080p Projector',
        description: '2D and 3D 1080p projector with 3-chip optical engine',
        type: 'Computers',
        quantity: 2,
        cost: 1999
    };
    
    var newAssetRow = null;
    
    it('Should navigate to the Assets view when clicking the Asset icon in menu', function() {
        Page.menu()
            .item('asset')
            .click();
    });
    
    it('Should show a grid of Assets', function() {
        Page.grid()
            .visible();
    });
    
    it('Grid should contain Asset data', function() {
        Page.grid()
            .rowAt(5);
    });
    
    it('Should show the Asset details view when an Asset is clicked in the grid', function() {
        Page.grid()
            .rowAt(2)
            .click();
            
        Page.form()
            .visible();
    });
    
    it('Clicking the Back button should return to the grid of Assets', function() {
        Page.backButton()
            .click();
            
        Page.form()
            .hidden();
            
        Page.grid()
            .visible();
    });
    
    it('Should show the Asset details view when a specific Asset is clicked in the grid', function() {
        Page.grid()
            .rowWith('name', 'Statesman 10-piece conference table and chairs')
            .click();
            
        Page.form()
            .visible();
    });
    
    it('Changing the Asset quantity and saving should update the grid', function() {
        Page.quantityField()
            .setValue(4);
            
        Page.saveButton()
            .click();
        
        Page.grid()
            .wait(1000)
            .rowWith('name', 'Statesman 10-piece conference table and chairs')
            .cellWith('dataIndex', 'quantity').textLike('4');
    });
    
    it('After changing the Asset quantity, the Dashboard value should also be updated', function() {
        Page.menu()
            .item('dashboard')
            .click();
            
        Page.assetCountPanel()
            .text('303 assets');
    });
    
    it('Should return to the Asset view when clicking the Menu item', function() {
        Page.menu()
            .item('asset')
            .click(); 
    });
    
    it('Should show the Asset form when clicking the Add New button', function() {
        Page.addButton()
            .click();
    });
    
    it('Saving an Asset without entering values should show validation message and prevent save', function() {
        Page.saveButton()
            .click();
            
        Page.messageBox()
            .visible()
            .textLike('Validation errors')
            .textLike('Name Must be present')
            .textLike('Description Must be present')
            .textLike('Type Must be present')
            .textLike('Quantity Must be at least 1')
            .textLike('Per Unit Cost Must be at least 0.01');
            
        Page.messageBoxOkButton()
            .click();
            
        Page.messageBox()
            .hidden();
    });
    
    it('Date field should default to the current date for new Asset records', function() {
        // This returns the current date in the format 02/24/2017, for example
        var currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric", 
            month: "2-digit",
            day: "2-digit"
        });
        
        Page.dateField()
            .expect('formattedValue').toEqual(currentDate);
    });
    
    it('Other form fields should be blank for new Asset records', function() {
        Page.nameField()
            .valueEmpty();
            
        Page.descriptionField()
            .valueEmpty();
            
        Page.typeField()
            .valueEmpty();
    });
    
    it('Should allow values to be entered in to all editable form fields', function() {
        Page.nameField()
            .setValue(newAsset.name);
            
        Page.descriptionField()
            .setValue(newAsset.description);
            
        Page.typeField()
            .setValue(newAsset.type);
            
        Page.quantityField()
            .setValue(newAsset.quantity);
            
        Page.costField()
            .setValue(newAsset.cost);
    });
    
    it('Should save the new Asset record when clicking Save button, show a confirmation message, and return to grid', function() {
        Page.saveButton()
            .click();
            
        Page.messageToast()
            .visible()
            .expect('innerText').toContain('Record saved');
            
        Page.form()
            .hidden();
            
        Page.grid()
            .visible();
    });
    
    it('Grid should show the newly added Asset record with correct values shown in each column', function() {
        // Convert the cost value in to a formatted currency value
        var formattedCost = '$' + newAsset.cost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,');
        
        newAssetRow = Page.grid().rowWith('name', newAsset.name);
        
        newAssetRow.cellWith('dataIndex', 'assetTypeName').text(newAsset.type);
        
        newAssetRow.cellWith('dataIndex', 'quantity').text(newAsset.quantity.toString());
            
        newAssetRow.cellWith('dataIndex', 'cost').text(formattedCost);
    });
    
    it('Should show the newly added Asset record when selecting it in the grid', function() {
        newAssetRow.click();
            
        Page.form()
            .visible();
    });
    
    it('Clicking the Delete button should show a message asking the user to confirm the deletion', function() {
        Page.deleteButton()
            .click();
            
        Page.messageBox()
            .visible()
            .textLike('Confirm deletion')
            .expect('innerText').toContain('Are you sure you want to permanently delete this asset?');
    });
    
    it('Clicking on No should not delete the record', function() {
        Page.messageBoxNoButton()
            .click();
            
        Page.messageBox()
            .hidden();
            
        Page.form()
            .visible();
    });
    
    it('Should delete the newly added Asset record when clicking Delete button, show a confirmation message, and return to grid', function() {
        Page.deleteButton()
            .click();
            
        Page.messageBoxYesButton()
            .click();
            
        Page.messageToast()
            .visible()
            .expect('innerText').toContain('Record deleted');
            
        Page.form()
            .hidden();
            
        Page.grid()
            .visible();
    });
    
    it('Deleted record should no longer exist in the grid', function() {
        Page.grid()
            .rowWith('name', newAsset.name)
            .timedout();
    });
});