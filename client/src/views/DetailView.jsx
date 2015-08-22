var React = require('react');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;


var DetailView = React.createClass({
  mixins: [Navigation],

  getInitialState: function(){
    return {
      result: '',
      solved: false,
      hintNo: -1, 
      showHint: false,
      reset: false
    };
  },

  setRegex: function() {
    var value = React.findDOMNode(this.refs.solutionText).value;
    var solved = this.isSolved(value);
    this.setState({
      result: value,
      solved: solved
    });
  },

  checkTestCase: function(testCase, condition) {
    try {
      var regex = new RegExp(this.state.result);
      return regex.test(testCase) === condition ? 'solved' : 'unsolved';
    } catch(e) {
      return 'unsolved';
    }
  },

  displayHint: function(){ 
    var question = this.props.questions[this.props.params.qNumber - 1];
    var hNumber = this.state.hintNo
    var hint = question['hints'][hNumber] || question['hints'][question['hints'].length - 1]
    
    return (
     <span key={hint} className='displayedHint'>{hint}</span>
    )

  },

  countHint: function(){ 
    var temp = this.state.hintNo
    this.setState({ 
      hintNo: temp+1, 
      showHint: true
    })
  },

  displayTestCases: function(string, condition) {
    var question = this.props.questions[this.props.params.qNumber - 1];
    return question[string].map(function(testCase) {
      return (
        <p key={testCase} className={this.checkTestCase(testCase, condition)}>{testCase}</p>
      )
    }.bind(this));
  },

  //TODO: Impliment "next" button or automatically return to menu after question is solved
  returnToMenu: function() {
    this.setState({
      result: '',
      solved: false,
    });

    this.props.goToQuestionMenu();
  },

  isSolved: function(regexString) {
    var question = this.props.questions[this.props.params.qNumber - 1];

    var truthy = question['truthy']
    var falsy = question['falsy'];

    try {
      var regex = new RegExp(regexString);

      var solvedTruthy = truthy.reduce(function(result, current) {
        return result && regex.test(current);
      }, true);

      var solvedFalsy = falsy.reduce(function(result, current) {
        return result && !regex.test(current);
      }, true);

      return solvedTruthy && solvedFalsy;
    } catch(e) {
      return null;
    }
  },

  onTimeChange: function(newTime, pointDecrement, reset) {
    this.setState({
      time: newTime,
      pointDecrement: pointDecrement,
      reset: reset
    });
  },

  onReset: function() {
    this.setState({
      reset: true,
      result: '',
      solved: false,
      hintNo: -1, 
      showHint: false,
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    $(React.findDOMNode(this.refs.submitButton)).prop('disabled', true)
    var solution = React.findDOMNode(this.refs.solutionText).value;
    var question = this.props.questions[this.props.params.qNumber - 1];
    var data = {
      "qNumber": question.qNumber,
      "points": question.points - (this.state.pointDecrement < question.points-1 || question.points - 1),
      "solution": solution,
      "time": this.state.time
    }

    React.findDOMNode(this.refs.solutionText).value = 'Solution Submitted';
    $.ajax({
        url: window.location.origin + '/submitSolution',
        contentType:"application/json",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: function(data) {
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
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

    if (this.props.questions.length > 0 && question === undefined) {
      this.transitionTo('/');
    }

    // makes sure that the questions are loaded from the database before rendering the view
    try {
      question.title;
    } catch(e) {
      return <div></div>;
    }

    return (
      <div id='page-content-wrapper'>
        <div className='container-fluid'>
          <div className="row">
            <div className="col-lg-9">            
              <h2>{question.title}<span className="points">Max Points: {question.points}</span></h2>
            </div>
            <div className="col-lg-3">
              <div className="btn-group" role="group">
                <Link to="questions" className="btn btn-default back">Back</Link>
                {!hasSolvedNextQuestion ? <Link to="question" onClick={this.onReset} params={{qNumber:nextQuestion}} className="btn btn-primary">Next Question</Link>: <Link to="solution" params={{qNumber:nextQuestion}} className="btn btn-success">Next Solution</Link>}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12"> 
              <p onChange={this.onRefresh}>{question.description}</p>
              <Timer stop={this.state.solved} reset={this.state.reset} callbackParent={this.onTimeChange}/>
              {this.state.pointDecrement ? <div className="warning">-{this.state.pointDecrement} point deducted due to time elapsed</div> : null}
            </div>
          </div>

            <form className="form-inline text-center" onSubmit={this.handleSubmit}>
              <span className="input">/<textarea ref="solutionText" onChange={this.setRegex} rows="1" cols="50" type="text" className="regex form-control" placeholder="Regex solution..."></textarea>/</span>
                {this.state.solved ? <p><button ref="submitButton" className="btn btn-success">{'Submit Solution'}</button></p> : null}
                {this.state.solved === null ? <p className="error-msg">Please provide valid regular expression</p> : null}
                {this.state.solved ? <h3 className="success">Success!!! Solved All Test Cases!</h3> : null}
            </form>

            <div className="hints text-center">
              <div className='btn btn-info' onClick={this.countHint}>Hint</div>
              <p>{this.state.showHint ? this.displayHint() : null}</p>
            </div>

            <div className="test-cases">

              <p className="instruction">{'Make all words turn green to complete the challenge'}</p>
              <div className="col-sm-2"></div>
              <div className="col-sm-4 text-center">
                <h3>{'Should match'}</h3>
                {this.displayTestCases('truthy', true)}
              </div>
              <div className="col-sm-4 text-center">
                <h3>{'Should not match'}</h3>
                {this.displayTestCases('falsy', false)}
              </div>
              <div className="col-sm-2"></div>
            </div>  
        </div>
      </div>
    )
  }
});

// timer component for keeping track of how long a user spends on a question

var Timer = React.createClass({
  getInitialState: function() {
    return {
      secondsElapsed: 0,
      time: '00:00',
      pointDecrement: 0
    };
  },
  tick: function() {
    
    if(this.props.stop === true) {
      clearInterval(this.interval);
    } else if (this.props.reset === true) {
      this.setState({
        secondsElapsed: 0,
        time: '00:00',
        pointDecrement: 0
      });
      this.props.callbackParent('00:00', 0, false);
    } else {
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1
      });
      this.setState({
        time: this.stringifyTime(this.state.secondsElapsed),
        pointDecrement: Math.floor(this.state.secondsElapsed / 60)
      });
      this.props.callbackParent(this.state.time, this.state.pointDecrement); // notify detailView that there is a change in time
    }
  },
  stringifyTime: function(seconds) {
    var time = new Date(0);
    time.setSeconds(seconds);
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if(minutes < 10) {
      minutes = '0' + minutes;
    }
    if(seconds < 10) {
      seconds = '0'+ seconds;
    }

    return minutes+':'+seconds;
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div className="time">Time Elapsed: {this.state.time}</div>
    );
  }
});

module.exports = DetailView;
