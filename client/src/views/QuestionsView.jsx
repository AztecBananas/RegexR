var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var QuestionsView = React.createClass({
  getInitialState: function(){
    return {data:null}
  },

  componentDidMount: function() {
    $.ajax({
        url: window.location.origin + '/getUserData',
        dataType: 'json',
        type: 'GET',
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },

  render: function() {
    if (this.state.data) {
      var solvedArray = [];
      for (var i = 0; i < this.props.questions.length; i++) {
        for (var j = 0; j < this.state.data.questionSolved.length;j++) {
          if (this.state.data.questionSolved[j].qNumber === i+1 && this.state.data.questionSolved[j].solved) {
            solvedArray[i] = true;
          }
        }
      }
      var questions = this.props.questions.map(function(question, index) {
        return (
          <tr key={question.qNumber} className="question">
            <td className="col-md-2"><b>{question.title}</b></td>
            <td className="col-md-8"><p>{question.description}</p></td>
            <td className="col-md-2"><p className="points">Max Points: {question.points}</p></td>
            {solvedArray[index] ? <td><Link to="solution" params={{qNumber:question.qNumber}} className="btn btn-success">Complete</Link></td> : <td><Link to="question" params={{qNumber:question.qNumber}} className="btn btn-primary">Solve</Link></td>}
          </tr>
        )
      });

    return (
      <div id='page-content-wrapper'>
        <div className='container-fluid'>
          <h2>RegexR Challenges</h2>
          {!this.props.loggedIn ? <p>If you would like to save your scores, <Link to='signin'>Login!</Link></p> : null}
          <table className="questionContainer table table-hover">
            <tbody>
              {questions}
            </tbody>
          </table>
        </div>
      </div>
    );
    } else {
      return (<div>loading</div>);
    }
  }
});

module.exports = QuestionsView;