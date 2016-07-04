/**
 * Custom entries for the project data table
 * @author patrickkerrypei / https://github.com/patrickkerrypei
 */

// Libraries
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import React from 'react/lib/React';
// Self-defined
import CustomModal from '../../CustomModal';
import {formatRightsOrigin} from '../../../../../utils/utils';

export default class ProjectDataTableEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authorization: false,
            hover: false,
            showModal: false
        };
        this.close = this.close.bind(this);
        this.confirm = this.confirm.bind(this);
        this.open = this.open.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
    }

    componentDidMount() {
        this.props.restClient.canUserAuthorize(this.props.ownerId)
            .then(authorization => {
                this.setState({
                    authorization: authorization
                });
            });
    }

    close() {
        this.setState({
            showModal: false
        });
    }

    confirm(event) {
        this.setState({
            showModal: false
        }, this.props.handleRevoke(event));
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    toggleHover() {
        this.setState({
            hover: !this.state.hover
        });
    }

    render() {

        // Building popover
        let userRightsOrigin = [<div key={0}><strong>From User</strong></div>],
            orgsRightsOrigin = [<div key={0}><strong>From Organization</strong></div>];

        if (this.props.userRightsOrigin) {
            userRightsOrigin = userRightsOrigin.concat(formatRightsOrigin(this.props.userRightsOrigin));
        } else {
            userRightsOrigin.push(<div key={1}>None</div>);
        }

        if (this.props.orgsRightsOrigin.length > 0) {
            orgsRightsOrigin = orgsRightsOrigin.concat(formatRightsOrigin(this.props.orgsRightsOrigin));
        } else {
            orgsRightsOrigin.push(<div key={1}>None</div>);
        }

        return <tr role="row" className="odd">

            <CustomModal cancelButtonMessage="Cancel"
                         cancelButtonStyle="default"
                         closeHandler={this.close}
                         confirmButtonMessage="OK"
                         confirmButtonStyle="danger"
                         confirmHandler={this.confirm}
                         confirmId={this.props.name}
                         modalMessage={'Are you sure you want to revoke ' + this.props.name + '\'s rights to ' +
                                       this.props.projectName + 'by ' + this.props.ownerId + '?'}
                         showModal={this.state.showModal}
                         title="Revoke rights"/>

            <td>
                <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={
                        <Popover title="Rights Origin" id="Rights Origin">
                            {userRightsOrigin}
                            <br/>
                            {orgsRightsOrigin}
                        </Popover>}>
                    <div style={{float: "left"}}>
                        <i className={this.props.isOrg ? `fa fa-university` :
                                                         `fa fa-user${this.props.inOrg ? '-times' : ''}`}
                           style={{fontSize: "15px", float: "left"}}/>
                        <span style={{paddingLeft: "8px"}}>
                            {this.props.name}
                        </span>
                    </div>
                </OverlayTrigger>
            </td>

            <td>
                {this.props.rights}
                {/* Only the owner(s) can see the remove option */}
                {this.state.authorization ?
                    this.props.ownerId === this.props.name ?
                        <OverlayTrigger overlay={<Popover id="1"><strong>You are the owner</strong></Popover>}
                                        placement="top"
                                        rootClose={true}
                                        trigger={["click"]}>
                            <i className="fa fa-tag"
                               onMouseEnter={this.toggleHover}
                               onMouseLeave={this.toggleHover}
                               style={{color: this.state.hover ? "green" : "",
                                       cursor: "pointer",
                                       float: "right",
                                       fontSize: "15px"}}/>
                        </OverlayTrigger> :
                        <i className="fa fa-remove"
                           id={this.props.name}
                           onClick={this.open}
                           onMouseEnter={this.toggleHover}
                           onMouseLeave={this.toggleHover}
                           style={{color: this.state.hover ? "red" : "",
                                   cursor: "pointer",
                                   float: "right",
                                   fontSize: "15px"}}/> :
                 null}
            </td>

        </tr>;
    }
}
