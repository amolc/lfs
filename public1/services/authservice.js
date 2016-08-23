SampleApplicationModule
  .service('AuthService', [
  'store',  '$location',
  function(store,$location) {
      var userSession = store.get('userSession');
  //    console.log("userSession:",userSession);
      if (userSession) {
        this.isAuthenticated = userSession.login;
      } else {
        this.isAuthenticated = false;
      }
    }
]);
