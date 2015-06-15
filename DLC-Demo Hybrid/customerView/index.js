'use strict';

app.customerView = kendo.observable({
    onShow: function () { }
});

/*
(function (parent) {

    var jsonArray:Array = JSON.decode("http://54.207.102.124:8980/TesteAWSService/static/mobile/TesteAWSService.json") as Array; 
    var dp:DataProvider = new DataProvider();
    trace(jsonArray);
    combo.dataProvider = dp;
    for (var i=0; i<jsonArray.length; i++) 
    { 
        dp.addItem({Label: "Name="+jsonArray[i].Name});
        trace(jsonArray[i].Name);
    }

    var dataProvider = app.data.defaultProvider,
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Activities',
                dataProvider: dataProvider
            },
            schema: {
                model: {
                    fields: {
                        'Text': {
                            field: 'Text',
                            defaultValue: ''
                        },
                    },
                    icon: function () {
                        var i = 'globe';
                        return kendo.format('km-icon km-{0}', i);
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        customerViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {
                //app.mobileApp.navigate('#customerView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    itemModel = dataSource.getByUid(item);
                customerViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('customerViewModel', customerViewModel);
})(app.customerView);
*/

function customers(CustNum, Name) {
    this.CustNum = CustNum;
    this.Name = Name;
}

(function () {
    var serviceURI = "http://54.207.102.124:8980/TesteAWSService/", catalogURI = serviceURI
            + "/static/mobile/TesteAWSService.json";

    // create a new session object
    var session = new progress.data.Session();
    session.login(serviceURI, "", "");
    session.addCatalog(catalogURI);

    // create a JSDO
    var jsdo = new progress.data.JSDO({
        name: 'dsCustomer'
    });

    jsdo.subscribe('AfterFill', onAfterFillCustomers, this);

    // calling fill reads from the remote OE server
    jsdo.fill();

    // this function is called after data is returned from the server
    function onAfterFillCustomers(jsdo, success, request) {
        // for each customer record returned
        jsdo.ttCustomer.foreach(function (customer) {
            var _customer = new customers(customer.data.CustNum, customer.data.Name);
            // write out some of the customer data to the page
            //document.write(customer.data.CustNum + ' '
            //        + customer.data.Name + '<br>');
        });
    }
})(app.customerView);