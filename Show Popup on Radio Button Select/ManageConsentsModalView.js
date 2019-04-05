import React, {Component} from 'react';
import {Modal, ModalUtils} from 'digitalexp-common-components-l9';
import {FormattedMessage} from 'react-intl';
import _uniqueId from 'lodash/uniqueId';
import GenericButtonControlModule, {ExternalizeComponent} from 'digitalexp-generic-button-control-module';
import ClassNames from 'classnames';
import messages from '../../CaptureConsents.i18n';

const {ModalHeader, ModalBody, ModalFooter} = ModalUtils;
const GenericButton = GenericButtonControlModule.Widget;

class ManageConsentsModalView extends Component {

    constructor (props) {
        super(props);
        this.getModalConfig = this.getModalConfig.bind(this);
        this.getHeaderConfig = this.getHeaderConfig.bind(this);
        this.getModalBody = this.getModalBody.bind(this);
        this.getFooterCancelButton = this.getFooterCancelButton.bind(this);
        this.getFooterBody = this.getFooterBody.bind(this);
        const uniqueId = _uniqueId('CreateContactWidget');
        this.externalExecuteMethods = {
            uniqueId,
            handleContactVerificationCancel: `${uniqueId}handleContactVerificationCancel`
        };
    }

    componentDidMount() {
        const {
            handleModalClose
        } = this.props;
        ExternalizeComponent.externalizeComponent(this.externalExecuteMethods.handleContactVerificationCancel, {
            functionCallback: () => {
                return handleModalClose();
            }
        });
    }

    getModalConfig() {
        const config = {
            showOverLay: true,
            dialogBoxClass: 'ds-modal--wrapper__medium'
        };
        return config;
    }

    getHeaderConfig() {
        const titleText = <FormattedMessage {...messages.chq_oppositions_consent_header} />;
        return {
            showCloseButton: true,
            closeButtonClass: 'ds-modal--close',
            showTitle: true,
            titleText
        };
    }

    getModalBody() {
        return (
            <div className="ds-heading">
                <h4><FormattedMessage {...messages.chq_oppositions_consent_header} /></h4>                
                <div className="ds-heading-text"><FormattedMessage {...messages.chq_oppositions_consent_header} /></div>
                <div className="ds-heading-text"><FormattedMessage {...messages.chq_oppositions_consent_header} /></div>
                <div className="ds-heading-text"><FormattedMessage {...messages.chq_oppositions_consent_header} /></div>
            </div>
        );
    }

    getFooterCancelButton() {
        const buttonClass = ClassNames('ds-btn ds-btn--large ds-btn--secondary');
        const {handleContactVerificationCancel} = this.externalExecuteMethods;
        return {
            config: {
                className: buttonClass,
                executemethodKeys: `${handleContactVerificationCancel}`
            },
            children: <FormattedMessage {...messages.chq_oppositions_consent_header} />
        };
    }

    getFooterBody() {
        return (
            <div>
                <GenericButton
                    {...this.getFooterCancelButton()}
                />
            </div>
        );
    }
    
    render () {
        const {handleModalClose} = this.props;
        return (
            <Modal>
                <ModalHeader config={this.getHeaderConfig()} handleButtonClick={handleModalClose} />
                <ModalBody>
                    {this.getModalBody()}
                </ModalBody>
                <ModalFooter>
                    {this.getFooterBody()}
                </ModalFooter>
            </Modal>
        );
    }
}

export default ManageConsentsModalView;
