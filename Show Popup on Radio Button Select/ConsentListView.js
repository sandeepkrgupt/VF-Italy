import React, {Component} from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import classnames from 'classnames';
import {FormField} from 'digitalexp-common-components-l9';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Messages from '../../CaptureConsents.i18n';
import {RadioGroupValues, PartyPrivacyType} from '../../CaptureConsents.consts';
import DescriptionModalView from '../modal/DescriptionModalView';
import ManageConsentsModalView from './ManageConsentsModalView';

const {MandatoryField, RadioGroup} = FormField;

class ConsentListView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModal: false,
            modalTitle: null,
            modalDescription: null,
            showManageConsnetsModalView: false        
        };
    }

    getConsentValidValue = (id) => {
        return [
            {
                id: `${id}--yes`,
                name: RadioGroupValues.YES,
                displayName: <FormattedMessage {...Messages.radio_group_yes} />
            },
            {
                id: `${id}--no`,
                name: RadioGroupValues.NO,
                displayName: <FormattedMessage {...Messages.radio_group_no} />
            }
        ];
    };

    getRadioConstraints = () => {
        const radioValidations = {
            presence: {}
        };
        return radioValidations;
    };

    getLongDescription = (event, cObj) => {
        this.setState({
            showModal: true,
            modalTitle: cObj.title,
            modalDescription: cObj.longDescription
        });
    };

    getDescription = (cObj, index) => {
        return (
            <div>
                <FormattedHTMLMessage 
                    {...{id: `consentObj.code_${index}`,
                        defaultMessage: cObj.description
                    }} 
                />
                {!isEmpty(cObj.longDescription) &&
                    <button 
                        className="ds-btn ds-btn--link" 
                        onClick={(event) => { this.getLongDescription(event, cObj, index); }}>
                        <FormattedHTMLMessage {...Messages.read_more} />
                    </button>
                }                
            </div> 
        );
    };

    updateConsentHandler = (event, consent) => {
        const {value} = event;        
        if (isEqual(value, RadioGroupValues.YES)) {
            consent.selectedValue = true;
        } else {
            consent.selectedValue = false;
        }        
        this.props.updateConsent();
    };
    showManageConsnetsModalView() {        
        this.setState({showManageConsnetsModalView: true});
    } 
    showManageConsentModalView = (event) => {
        if (event.value === 'No') {
            this.showManageConsnetsModalView();
        }
    };
    
    handleOpenClick = (e) => {            
        const parentTag = e.currentTarget.parentNode.parentNode;
        if (parentTag.classList.contains('open')) {
            parentTag.classList.remove('open');
        } else {
            parentTag.classList.add('open');
        }
    };

    handleCancelClick = (e) => {            
        const parentTag = e.currentTarget.parentNode.parentNode;
        parentTag.classList.add('edit');
    };

    handleSaveClick = (e) => {  
        const {completeConsentList, updateConsentPost, individualId, productId} = this.props;
        const params = {
            relatedFlow: 'Management',
            relatedEntityType: 'Subscriber',
            productId   
        };
        const promise = new Promise((resolve, reject) => {
            updateConsentPost(individualId, completeConsentList, params).then(() => {
                const parentTag = e.currentTarget.parentNode.parentNode;
                parentTag.classList.add('edit');
            }, (err) => {
                reject(err);
            });
        });
        return promise;
    };

    /**
     * called from modal upon cancel
     */
    closeModal = () => {
        this.setState({showModal: false});        
    }
   
    render() {
        const {consentList} = this.props;
        const vfConsentList = consentList.filter(consent => consent.partyPrivacyType === PartyPrivacyType.VF);
        const oppoConsentList = consentList.filter(consent => consent.partyPrivacyType === PartyPrivacyType.OPPOSITION);
        const etgConsentList = consentList.filter(consent => consent.partyPrivacyType === PartyPrivacyType.ETG);
        const oppWrapperClass = classnames({
            open: !(this.props.collapseOppositionAccordian)
        }, 'ds-payment__div');
        const etgWrapperClass = classnames({
            open: !(this.props.collapseEtgAccordian)
        }, 'ds-payment__div');
        return (
            <div className="consents-all edit">
                <div className="consents-all-edit">
                    {
                        vfConsentList.map((consentObj, index) => {
                            return (
                                <div className="consents">
                                    <div className="consents-text">
                                        <h4>
                                            {<FormattedHTMLMessage 
                                                {...{id: `${consentObj.code}_id`, defaultMessage: consentObj.title}} 
                                            />}
                                        </h4>
                                        <p>
                                            {this.getDescription(consentObj, index)}
                                        </p>
                                    </div>
                                    <div className="consents-action ds-consent">
                                        <MandatoryField
                                            Component={RadioGroup}
                                            name={`${this.props.productId}_${consentObj.code}`}
                                            values={this.getConsentValidValue(consentObj.id)}
                                            validateFieldOn="onChange"
                                            eventListeners={{
                                                onChange: (e) => {
                                                    this.updateConsentHandler(e, consentObj);
                                                    this.showManageConsentModalView(e);
                                                }
                                            }}
                                            constraints={this.getRadioConstraints(consentObj.code)}
                                            displayInlineError={false}
                                        />
                                    </div>                         
                                </div>
                            );
                        })
                    }
                    {this.props.displayOppositionConsents && <div className="divider" />}                
                    {this.props.displayOppositionConsents &&
                        <div className={oppWrapperClass}>
                            <div className="tnc">
                                <span className="tnc--text">
                                    <FormattedMessage {...Messages.chq_oppositions_consent_header} />
                                </span>
                                <button className="ds-open" onClick={e => this.handleOpenClick(e)} />
                            </div>
                            <div className="ds-payment__content">
                                {
                                    oppoConsentList.map((consentObj, index) => {
                                        return (
                                            <div className="consents">
                                                <div className="consents-text">
                                                    <h4>
                                                        {<FormattedHTMLMessage 
                                                            {...{
                                                                id: `${consentObj.code}_id`, 
                                                                defaultMessage: consentObj.title
                                                            }} 
                                                        />}
                                                    </h4>
                                                    <p>
                                                        {this.getDescription(consentObj, index)}
                                                    </p>
                                                </div>
                                                <div className="consents-action ds-consent">
                                                    <MandatoryField
                                                        Component={RadioGroup}
                                                        name={`${this.props.productId}_${consentObj.code}`}
                                                        values={this.getConsentValidValue(consentObj.id)}
                                                        validateFieldOn="onChange"
                                                        eventListeners={{
                                                            onChange: (e) => {
                                                                this.updateConsentHandler(e, consentObj);
                                                                console.log('this is radio button----2');
                                                            }
                                                        }}
                                                        constraints={this.getRadioConstraints(consentObj.code)}
                                                        displayInlineError={false}
                                                    />
                                                </div>                         
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    }
                    {this.props.displayETGConsents && <div className="divider" />}                
                    {this.props.displayETGConsents &&
                        <div className={etgWrapperClass}>
                            <div className="tnc">
                                <span className="tnc--text">
                                    <FormattedMessage {...Messages.chq_etg_consent_header} />
                                </span>
                                <button className="ds-open" onClick={e => this.handleOpenClick(e)} />
                            </div>
                            <div className="ds-payment__content consents-all edit">
                                {
                                    etgConsentList.map((consentObj, index) => {
                                        return (
                                            <div className="consents">
                                                <div className="consents-text">
                                                    <h4>
                                                        {<FormattedHTMLMessage 
                                                            {...{
                                                                id: `${consentObj.code}_id`, 
                                                                defaultMessage: consentObj.title
                                                            }} 
                                                        />}
                                                    </h4>
                                                    <p>
                                                        {this.getDescription(consentObj, index)}
                                                    </p>
                                                </div>
                                                <div className="consents-action ds-consent">
                                                    <MandatoryField
                                                        Component={RadioGroup}
                                                        name={`${this.props.productId}_${consentObj.code}`}
                                                        values={this.getConsentValidValue(consentObj.id)}
                                                        validateFieldOn="onChange"
                                                        eventListeners={{
                                                            onChange: (e) => {
                                                                this.updateConsentHandler(e, consentObj);
                                                                console.log('this is radio button----3');
                                                            }
                                                        }}
                                                        constraints={this.getRadioConstraints(consentObj.code)}
                                                        displayInlineError={false}
                                                    />
                                                </div>                         
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
                <div className="edit-btns">
                    <button 
                        className="ds-btn ds-btn--secondary ds-btn--small"
                        onClick={e => this.handleCancelClick(e)}>
                        <FormattedMessage {...Messages.chq_cancel_label} />
                    </button>
                    <button 
                        className="ds-btn ds-btn--primary ds-btn--small"
                        onClick={e => this.handleSaveClick(e)}>
                        <FormattedMessage {...Messages.chq_save_label} />
                    </button>
                </div>
                {this.state.showModal && (<DescriptionModalView 
                    title={this.state.modalTitle}
                    longDescription={this.state.modalDescription}
                    handleModalClose={this.closeModal}
                />)}
                {this.state.showManageConsnetsModalView && (<ManageConsentsModalView
                />)}
            </div>
        );
    }    
}

export default ConsentListView;
