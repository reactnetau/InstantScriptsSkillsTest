import React, { useState, useRef } from 'react';
import superagent from 'superagent';
import PopUp from '../layouts/PopUp';
import validator from 'validator';
import objectAssign from 'object-assign';
import PropTypes from 'prop-types';

export const FieldHolder = ({
  children,
  isValid,
  goodClasses,
  badClass,
  ...rest
}) => {
  const currentClasses = isValid ? goodClasses : `${goodClasses} ${badClass}`;
  return (
    <div {...rest} className={currentClasses}>
      {children}
    </div>
  );
};

FieldHolder.propTypes = {
  children: PropTypes.any,
  isValid: PropTypes.bool,
  goodClasses: PropTypes.string.isRequired,
  badClass: PropTypes.string.isRequired,
};

const Contact = () => {
  const [formState, setFormState] = useState({
    unsent: true,
    sending: false,
    sent: false,
    sentErr: false,
    sentAttempt: false,
    nameValid: true,
    emailValid: true,
    subjectValid: true,
    messageValid: true,
  });

  const nameRef = useRef();
  const emailRef = useRef();
  const subjectRef = useRef();
  const messageRef = useRef();

  const checkForm = () => {
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const subject = subjectRef.current.value.trim();
    const message = messageRef.current.value.trim();

    const nameValid = name.length > 0;
    const emailValid = validator.isEmail(email);
    const subjectValid = subject.length > 0;
    const messageValid = message.length > 0;

    setFormState((prev) => ({
      ...prev,
      nameValid,
      emailValid,
      subjectValid,
      messageValid,
    }));

    return nameValid && emailValid && subjectValid && messageValid;
  };

  const checkOnBlur = () => {
    if (!formState.sentAttempt) return;
    checkForm();
  };

  const sendMessage = (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, sentAttempt: true }));

    if (!checkForm()) return;

    setFormState((prev) => ({
      ...prev,
      unsent: false,
      sending: true,
    }));

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const subject = subjectRef.current.value.trim();
    const message = messageRef.current.value.trim();

    superagent
      .post(
        app.settings.ws_conf.loc.SCRIPT_ROOT.u +
          app.settings.ws_conf.loc.SCRIPT__contact_form.u,
      )
      .type('form')
      .send({
        uid: app.settings.isLoggedIn ? app.settings.curr_user.uid : 0,
        login: app.settings.isLoggedIn ? app.settings.curr_user.login : '',
        nam: name,
        eml: email,
        sub: subject,
        mes: message,
      })
      .end((err, res) => {
        setFormState((prev) => ({
          ...prev,
          unsent: false,
          sending: false,
          sent: true,
          sentErr: !!(err || !res.ok),
        }));
      });
  };

  const {
    unsent,
    sending,
    sent,
    sentErr,
    nameValid,
    emailValid,
    subjectValid,
    messageValid,
  } = formState;

  const sendingCopy = (
    <div>I am sending your message over the wire.......... please hold.</div>
  );
  const sendingErr = (
    <div>There was an error sending your request. Please try again</div>
  );
  const sentCopy = (
    <div>
      <strong>
        Okay we got your message, we will be touching base shortly.
      </strong>
    </div>
  );

  const form = (
    <form id="contact_form">
      <FieldHolder
        goodClasses="input_holder left"
        badClass="error"
        isValid={nameValid}
      >
        <label>
          Name <span className="required">is a required field</span>
        </label>
        <input
          ref={nameRef}
          type="text"
          className="input name"
          placeholder="Name"
          onBlur={checkOnBlur}
        />
      </FieldHolder>

      <FieldHolder
        goodClasses="input_holder left"
        badClass="error"
        isValid={emailValid}
      >
        <label>
          Email <span className="required">is a required field</span>
        </label>
        <input
          ref={emailRef}
          type="email"
          className="input name"
          placeholder="Your Email"
          onBlur={checkOnBlur}
        />
      </FieldHolder>

      <FieldHolder
        goodClasses="input_holder select_option"
        badClass="error"
        isValid={subjectValid}
      >
        <label>
          Subject <span className="required">is a required field</span>
        </label>
        <select ref={subjectRef} onChange={checkOnBlur}>
          <option value="">Choose one</option>
          <option>Join / Login</option>
          <option>An issue with the website</option>
          <option>Other</option>
        </select>
      </FieldHolder>

      <FieldHolder
        goodClasses="input_holder clear message"
        badClass="error"
        isValid={messageValid}
      >
        <label>
          Message <span className="required">is a required field</span>
        </label>
        <textarea
          ref={messageRef}
          className="input textarea"
          onBlur={checkOnBlur}
        ></textarea>
      </FieldHolder>

      <button type="submit" onClick={sendMessage} className="button">
        <span>
          SEND <span className="fa fa-caret-right"></span>
        </span>
      </button>

      <p className="disclaimer">
        Any personal information collected in this contact form is so that we
        can send you the information you have requested. It will not be used for
        any other reason.
      </p>
    </form>
  );

  return (
    <PopUp pageTitle="Contact Us">
      {unsent && form}
      {sending && sendingCopy}
      {sent && !sentErr && sentCopy}
      {sent && sentErr && sendingErr}
    </PopUp>
  );
};

export default Contact;
