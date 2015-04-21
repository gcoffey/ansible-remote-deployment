module.exports = function(App)
{
  App.get('/', function(req, res) {
    res.render('index', { title: 'Home' })
  });
  App.get('/status', function(req, res) {
    res.render('status', { title: 'Status' })
  });
  App.get('/deploy', function(req, res) {
    res.render('deploy', { title: 'Deploy' })
  });
  App.get('/config', function(req, res) {
    res.render('config', { title: 'Config' })
  });
}
