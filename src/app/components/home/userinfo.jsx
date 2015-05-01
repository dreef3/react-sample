import React from 'react';

export default class UserInfo extends React.Component {
    render() {
        if (!this.props.username) {
            return null;
        }

        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2 control-label">Username</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">
                            <a href={this.props.profileUrl}>{this.props.username}</a>
                        </p>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.name}</p>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Location</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.location}</p>
                    </div>
                </div>

            </form>
        );
    }
}
