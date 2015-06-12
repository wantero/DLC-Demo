'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var provider = app.data.defaultProvider,
        mode = 'signin',
        registerRedirect = 'home',
        signinRedirect = 'home',
        init = function() {
            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;

            if (data && data.result) {
                app.user = data.result;
                app.mobileApp.navigate(redirect + '/view.html');
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            signin: function() {
                var email = authenticationViewModel.email.toLowerCase(),
                    password = authenticationViewModel.password;

                provider.Users.login(email, password, successHandler, init);
            },
            register: function() {
                var email = authenticationViewModel.email.toLowerCase(),
                    password = authenticationViewModel.password,
                    displayName = authenticationViewModel.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                provider.Users.register(email, password, attrs, successHandler, init);
            },
            toggleView: function() {
                mode = mode === 'signin' ? 'register' : 'signin';
                init();
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('onShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);