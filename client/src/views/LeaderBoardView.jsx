var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var LeaderBoardView = React.createClass({
	mixins: [Navigation],

	getInitialState: function(){
		return {
			scores:  []
		};
	},

	componentWillMount : function(callback){
		var that = this;
		$.ajax({
			url:window.location.origin + '/leaderboard',
			method: 'GET',
			dataType: 'json',
			success: function(data){
				if(this.isMounted()){
					that.setState({data:data});
					that.setState({scores:data.points});
				}
			}.bind(this),
			error: function(xhr, status, err){
			  console.error(xhr, status, err.message);
			}
		});
	},



	handleChange: function(e){
		var selected = React.findDOMNode(this.refs.leaderDrop).value;
		this.setState({scores:this.state.data[selected]});
	},
	render: function(){
		//Scores should be returned as an array with each element being an object
		//The object should hold the username and the score
		var counter = 0;
		var scores = this.state.scores.map(function(score){
			counter++;
			return (
				<tr key={score.username} className="question">
					<td className="col-md-1 text-center"><b>{counter}</b></td>
					<td className="col-md-2 text-center">{score.username}</td>
					<td className="col-md-2 text-center">{score.points}</td>
					<td className="col-md-2 text-center">{score.questionsSolved}</td>
					<td className="col-md-2 text-center">{score.totalVotes}</td>
				</tr>
			)
		});

		return (

			<div id='page-content-wrapper'>
        <div className='container-fluid'>
				<h2> Leaderboard </h2>
			
				<div className="btn-group">
				  <button type="button" className="btn btn-default">Filter By:</button>
				  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
				    <span className="caret"></span>
				    <span className="sr-only">Toggle Dropdown</span>
				  </button>
				  <ul className="dropdown-menu" ref="leaderDrop" onChange = {this.handleChange}>
				    <li value = "points">Points</li>
				    <li value = "upvotes">Upvotes</li>
				    <li value = "solved">Number Solved</li>
				  </ul>
				</div>
				
				<table className = "questionContainer table table-hover">
					<tbody>
						<tr >
							<th></th>
							<th className="text-center">Username</th>
							<th className="text-center">Points</th>
							<th className="text-center">Questions Solved</th>
							<th className="text-center">Upvotes</th>
						</tr>
						{scores}
					</tbody>
				</table> 
			</div>
			</div>
		)
	}
});

module.exports = LeaderBoardView;