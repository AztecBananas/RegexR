var React = require('react');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var cookie = require('react-cookie');

var SignInView = React.createClass({
	mixins: [Navigation],

	/* function: signin 
	 * ----------------
	 * This function is invoked when the user presses enter of clicks the signin
	 * button. It takes the username and password from the text boxes and sends
	 * them via ajax request to the server
	*/

	getInitialState: function(){
    return {
      login: true
    };
  },

	signin: function(){
		var username = React.findDOMNode(this.refs.username).value;
		var password = React.findDOMNode(this.refs.password).value;
		var data = [username, password];
		var that = this;

		$.ajax({
			url:window.location.origin + '/signin',
			method: 'POST',
			data: JSON.stringify(data),
			contentType:"application/json",
			dataType: 'json',
			success: function(data){
			  cookie.save('username', username);
			 	that.props.logStatus();
				that.transitionTo('questions');
			},
			error: function(xhr, status, err){
			  console.error(xhr, status, err.message);
			  that.setState({
			    login: false
			  });
			}
		});
	},

	render: function(){
		return (
			<div id='page-content-wrapper'> 
        <div className='container-fluid'>

				<h2>Sign In</h2>

				<form className="form-horizontal">
				  <div className="form-group">
				    <label className="col-sm-2 control-label">Username</label>
				    <div className="col-sm-10">

				      <input ref="username" className="form-control" placeholder="Username"/>

				    </div>
				  </div>
				  <div className="form-group">
				    <label className="col-sm-2 control-label">Password</label>
				    <div className="col-sm-10">
				      <input ref="password" type="password" className="form-control" placeholder="Password"/>

				    </div>
				  </div>
				  <div className="form-group">
				    <div className="col-sm-offset-2 col-sm-10">
				      <button onClick={this.signin} className="btn btn-default">Log In</button>
				    </div>
				  </div>
				 </form>
					{this.state.login === false ? <p className="error-msg">Login incorrect, please try again</p> : null}
				<p>Need an account? Click <Link to='signup'>here.</Link></p>
				</div>
			</div>
		)
	}
});	

module.exports= SignInView;