var React = require('react');

var QuestionsView = require('./views/QuestionsView.jsx');
var DetailView = require('./views/DetailView.jsx');
var SignInView = require('./views/SignInView.jsx');
var SignUpView = require('./views/SignUpView.jsx');
var TutorialView = require('./views/RegexTutorialView.jsx');
var SolutionView = require('./views/SolutionView.jsx');
var LeaderBoardView = require('./views/LeaderBoardView.jsx');
var ProfileView = require('./views/ProfileView.jsx');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;
var Navigation = Router.Navigation;

var cookie = require('react-cookie');

var App = React.createClass({
  mixins: [Navigation],

  getInitialState: function(){
    if (cookie.load('username')) {
      this.getUserData();
    }
    return {
      questions: [],
      username: cookie.load('username'),
      loggedIn: cookie.load('username')
    };
  },

  onLogIn: function() {
    this.getUserData();
    this.setState({
      username: cookie.load('username'),
      loggedIn: cookie.load('username')
    });
  },

  onLogout: function() {
    cookie.remove('username');
    this.setState({
      username: '',
      loggedIn: cookie.load('username')
    });
  },

  loadAllQuestions: function(){
    $.ajax({
      url: window.location.origin + '/questions',
      method: 'GET',
      dataType: 'json',
      success: function(data){
        data.sort(function(a, b){
          return a.qNumber - b.qNumber;
        });
        this.setState({questions: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(xhr, status, err.message);
      }
    });
  },

  componentDidMount: function(){
    this.loadAllQuestions();
  },

  getUserData: function() {
    $.ajax({
        url: window.location.origin + '/getUserData',
        dataType: 'json',
        type: 'GET',
        success: function(data) {
          this.setState({userData: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },

  render: function() {

    return (
      <div id='wrapper'>
        <div id='sidebar-wrapper'>
          <ul className='sidebar-nav'>
            <li className='sidebar-brand'>
              <Link to='default' className="logo">/RegexR/</Link>
            </li>
            <li><p className="signedIn">Signed in as: {this.state.username}</p></li>
            <li>
              <Link to='profile'>Profile</Link>
            </li>
            <li>
              <Link to='questions'>Questions</Link>
            </li>
            <li>
              <Link to='leaderboard'>Leaderboard</Link>
            </li>
            <li>
              <Link to='tutorial'>Regex Cheatsheet</Link>
            </li>
             <li>
              {this.state.loggedIn ? <Link onClick={this.onLogout} to='signin'>Logout</Link> : <Link to='signin'>Login</Link> }
            </li>
          </ul>
        </div>
        <RouteHandler userData={this.state.userData} loggedIn={this.state.loggedIn} questions={this.state.questions} logStatus={this.onLogIn}/>
      </div>
    )
  }

});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="tutorial" path="/tutorial" handler={TutorialView}/>
    <Route name="question" path="/question/:qNumber" handler={DetailView}/>
    <Route name="solution" path="/solution/:qNumber" handler={SolutionView}/>
    <Route name="questions" path= "/questions" handler={QuestionsView}/>
    <Route name="signin" path= "/signin" handler = {SignInView}/>
    <Route name="signup" path= "/signup" handler = {SignUpView}/>
    <Route name="profile" path= "/profile" handler = {ProfileView}/>

    <Route name="leaderboard" path= "leaderboard" handler= {LeaderBoardView}/>
    <DefaultRoute name="default" handler={QuestionsView} />



  </Route>
);

Router.run(routes, function(Root){
  React.
  render(<Root />, document.body);
});

