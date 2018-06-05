//backend level of indirection

class Backend {
  login(username, password) {
    return new Promise((resolve, reject) => {
      function meteorLogin(err, validUser) {
        if (err) {
          self.reason = "Error validating user";
        }
        if (validUser) {
          Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
              let reason = "Invalid Login";
              if (_.has(error, 'reason')) {
                reason = error.reason;
              }
              reject(reason);
            }
            else {
              resolve({status: true, response: { userId: Meteor.userId() }});
            }
          });
        }
        else {
          reject('Invalid_ Login');
        }
      }
      Meteor.call('ValidateUser', {username, password}, meteorLogin);
    });
  }

  logout () {
    return new Promise((resolve, reject)=>{
        Meteor.logout((error) =>{
          resolve();
        });
    });
  }
}

export default Backend;
