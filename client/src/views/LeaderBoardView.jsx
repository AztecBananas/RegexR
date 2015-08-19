var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var LeaderBoardView = React.createClass({
	mixis: [Navigation],

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
					that.setState({scores:data});
				}
			}.bind(this),
			error: function(xhr, status, err){
			  console.error(xhr, status, err.message);
			}
		});
	},



	render: function(){


		//Scores should be returned as an array with each element being an object
		//The object should hold the username and the score
		var scores = this.state.scores.map(function(score){
			return (
				<tr key={score.username} className="question">
					<td><b>{score.username}</b></td>
					<td><b>{score.totalScore}</b></td>
				</tr>
			)
		});

		return (
			<div>
				<h2> Leaderboard </h2>
				<table className = "questionContainer table table-hover">
					<tbody>
						{scores}
					</tbody>
				</table> 
			</div>
		)
	}
});

module.exports = LeaderBoardView;