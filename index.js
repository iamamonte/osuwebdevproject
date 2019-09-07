var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var session = require('express-session')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('.hjs', handlebars({ extname:'.hjs', defaultLayout:'main-layout'}));
app.set('view engine', '.hjs');
app.set('port', 9290);

app.use(session({
                  secret:'andrewdaOSU2019',
                  cookie: { maxAge: 50000 },
                  saveUninitialized:false}));


app.use(express.static('media'));

app.all('/',function(req,res){
  let context = {};
  
  if(req.session.name)
  {
    context.name = req.session.name;
  }
  else
  {
    // context.name = "Someone3";
  }
  res.render('home', context);
});

app.all('/requirements', function(req,res){
  let context = {};
  
  if(req.session.name)
  {
    context.name = req.session.name;
  }
  res.render('requirements', context);
});

app.all('/site-info', function(req,res){
  let context = {};
  
  if(req.session.name)
  {
    context.name = req.session.name;
  }
  res.render('site-info', context);
});

app.all('/form-page', function(req,res){
  let context = {}
  if(req.session.name) context.name = req.session.name;

  if(req.host == "localhost")
  {
     Object.assign(context, {firstName:"localFirst", lastName:"localLast", email:"local@host.com", age:"9999"});
  }
  res.render('form-page', context);
});




app.get('/showhttp',function(req,res){
  var obj = {requestType:"GET"};
  obj.qParams = req.query;
 
  if(req.query["firstName"]);
  req.session.name = req.query["firstName"];
  obj.name = req.session.name;
  res.render('showhttp', obj);
});

app.all('/downloadresume', function(req,res){
  const file = `${__dirname}/download/resume.docx`;
  res.download(file); 
});

app.post('/showhttp',function(req,res){
  var obj = {requestType:"POST"};
  obj.isPost = true;
  obj.qParams = req.query;
  obj.postParams = [];
  for (var p in req.body){
    obj.postParams.push({'name':p,'value':req.body[p]})
    if(p == "firstName")
    {
      req.session.name = req.body[p];
      obj.name = req.session.name;
    }
  }
  res.render("showhttp", obj);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});