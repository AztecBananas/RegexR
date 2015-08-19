var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var OverView = React.createClass({
  getInitialState: function(){
    return {data:null}
  },

  componentDidMount: function() {
    var data = {}
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
            <td><b>{question.title}</b></td>
            <td><p>{question.description}</p></td>
            <td><p className="points">Points:{question.points}</p></td>
            {solvedArray[index] ? <td><Link to="solution" params={{qNumber:question.qNumber}} className="btn btn-success">Complete</Link></td> : <td><Link to="question" params={{qNumber:question.qNumber}} className="btn btn-primary">Solve</Link></td>}
          </tr>

        )
      });
      return (
        <div>
          <table className="questionContainer table table-hover">
            <tbody>
              {questions}
            </tbody>
          </table>
        <div><Link to="signin"  className="btn btn-primary">Signin</Link></div>
        </div>
      );

    } else {
      return (<div>loading</div>);
    }
  }
});

module.exports = OverView;