var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var cookie = require('react-cookie')

var ProfileView = React.createClass({ 
  mixins: [Navigation],

  getInitialState: function(){ 
    return { 
      user: {
        username: null, 
        points: null, 
        questionSolved: [{
          qNumber: null,
          solved: null, 
          solution: null, 
          points: [], 
          votes: null
        }]  
      }
    }
  },

  getUserData: function() {
    $.ajax({
      url: window.location.origin + '/getUserData',
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.setState({user: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function(){ 
    this.getUserData()
  },  

  render: function(){ 
    if(this.props.questions.length > 0 && this.state.user.username){
      var solutions = this.state.user.questionSolved.map(function(index){ 
        var questionTitle = this.props.questions[index.qNumber -1].title
        return ( 
            <tr>
              <td>{questionTitle}</td>
              <td>{index.solution}</td>
              <td>{index.time}</td>
              <td>{index.votes}</td>
            </tr>
          )

      }, this)
      return(
        <div id='page-content-wrapper'>
          <div className='container-fluid'>
          <h2>{this.state.user.username}</h2>
          <h4>Points: {this.state.user.points}</h4>
          <table className="questionContainer table table-hover">
          <thead> 
            <tr> 
              <th>Question</th>
              <th>Solution</th>
              <th>Time Elasped</th>
              <th>Votes</th>
            </tr> 
          </thead>
            <tbody> 
              {solutions}
            </tbody>
          </table>
        </div>
      </div>
        )
    } else { 
      return ( 
        <div>Loading...</div>
        )
    }
  }

});

module.exports = ProfileView;