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
		console.log(selected);
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
				
				<select className="form-control dropdown" ref="leaderDrop" onChange={this.handleChange}>
				  <option value = "points">Points</option>
				  <option value = "upvotes">Upvotes</option>
				  <option value = "solved">Number Solved</option>
				</select>

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