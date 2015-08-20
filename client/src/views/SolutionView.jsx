var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var SolutionView = React.createClass({
  mixins: [Navigation],

  getInitialState: function(){
    return {data:null, userData:null}
  },

  getSolutionData: function() {
    var question = this.props.questions[this.props.params.qNumber - 1];
    var data = {
      "qNumber": question.qNumber,
    };
    $.ajax({
        url: window.location.origin + '/getSolutions',
        contentType:"application/json",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },

  getUserData: function() {
    var question = this.props.questions[this.props.params.qNumber - 1];
    var data = {
      "qNumber": question.qNumber,
    };
    $.ajax({
      url: window.location.origin + '/getUserData',
      contentType:"application/json",
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(data) {
        this.setState({userData: data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.getSolutionData();
    this.getUserData();
  },

  upVote: function(i) {
    $(React.findDOMNode(this.refs[i])).prop('disabled', true)
    var question = this.props.questions[this.props.params.qNumber - 1];
    var userId = this.state.data[i]._id
    var data = {"userId": userId, "qNumber": question.qNumber};
    $.ajax({
      url: window.location.origin + '/upVote',
      contentType:"application/json",
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(data) {
        this.getSolutionData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },


  returnToMenu: function() {
    this.props.goToQuestionMenu();
  },

  render: function() {
    var question = this.props.questions[this.props.params.qNumber - 1];
    var nextQuestion = 0;
    var hasSolvedNextQuestion = false;
    if (question.qNumber === this.props.questions.length) {
      nextQuestion = 1;
    } else {
      nextQuestion = question.qNumber+1
    }
    for (var i = 0; i < this.props.userData.questionSolved.length;i++) {
      if (this.props.userData.questionSolved[i].qNumber === nextQuestion) {
        hasSolvedNextQuestion = true;
      }    
    }


    if (this.state.data && this.state.userData) {
      var solutions = this.state.data.map(function(user, index) {
        return (
          <tr>
            <td><p>User: {user.username}</p></td>
            <td><p>Solution: {user.questionSolved.solution}</p></td>
            <td><p>Time Elasped: {user.questionSolved.time}</p></td>
            <td><p>Points Awarded: {user.questionSolved.points}</p></td>
            <td><p>Votes: {user.questionSolved.votes}</p></td>
            <td><p><button onClick={this.upVote.bind(this, index)} ref={index} className="btn btn-primary">Vote</button></p></td>
          </tr>
        )
      }, this);
      var solution = '';
      var time = 0;
      for(var i = 0 ; i < this.state.userData.questionSolved.length;i++) {
        if (this.state.userData.questionSolved[i].qNumber === question.qNumber) {
          solution = this.state.userData.questionSolved[i].solution;
          time = this.state.userData.questionSolved[i].time;
        }
      }

      return (
        <div id='page-content-wrapper'>
          <div className='container-fluid'>
            <div className="row">
              <div className="col-sm-10">
                <h2>{question.title} <span className="points">Points: {question.points}</span></h2>
                <p>{question.description}</p>
              </div>
              <div className="col-sm-2">
                <Link to="questions" className="btn btn-primary back">Back</Link>
                {!hasSolvedNextQuestion ? <Link to="question" params={{qNumber:nextQuestion}} className="btn btn-primary">Next Question</Link>: <Link to="solution" params={{qNumber:nextQuestion}} className="btn btn-success">Next Solution</Link>}
              </div>
       
              <div className="col-sm-12">
                <h4>Your Solution:</h4>
                <p>{solution}</p>
                <p>Time Elapsed: <span className="time">{time}</span></p>
                <h4>Other solutions:</h4>
                <table className="questionContainer table table-hover">
                  <tbody>
                    {solutions}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
});

module.exports = SolutionView;
