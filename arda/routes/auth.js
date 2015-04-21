var flash = {};

module.exports = function(App)
{
  App.get('/login', function(req, res) {
    res.render('login', { title: 'Login' })
  });
  App.post('/login', function(req, res) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      flash.type = 'alert-danger';
      flash.messages = errors;
      res.render('login', { flash: flash });
    } else {
      flash.type = 'alert-success';
      flash.messages = 'Logged in'
      res.render('index', { flash: flash });
    }
    var username = req.body.username;
    var password = req.body.password;
  });
  App.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('login');
  });
  App.get('/register', function(req, res) {
    res.render('register', { title: 'Register' })
  });
  App.post('/register', function(req, res) {
    req.checkBody('username', 'Username is required').notEmpty();
    if (req.body.email == '') {
      req.checkBody('email', 'Email is required').notEmpty();
    } else {
      req.checkBody('email', 'Not a valid email address').isEmail();
    }

    var errors = req.validationErrors();
    if (errors) {
      flash.type = 'alert-danger';
      flash.messages = errors;
      res.render('register', { flash: flash });
    } else {
      flash.type = 'alert-success';
      flash.messages = 'Validated';
      res.render('register', { flash: flash });
    }
  });
  App.get('/profile', function(req, res) {
    res.redirect('login')
  });
}
