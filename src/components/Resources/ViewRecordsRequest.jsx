import React, { useReducer, useRef } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
// import ViewRecordsRequestAccordion from "./ViewRecordsRequestAccordion";
import Input from "../UI/Input/Input";
import { useDispatch } from "react-redux";
import {
  addUserToGroup,
  removeUserFromGroup,
} from "../../actions/GroupActions";
import showSnack from "../UI/Snackbar/Snackbar";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.includes("@"),
      grantingAccess: false,
      revokingAccess: false,
    };
  } else if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.includes("@"),
      grantingAccess: false,
      revokingAccess: false,
    };
  } else if (action.type === "IS_GRANTING_ACCESS") {
    return { ...state, grantingAccess: true };
  } else if (action.type === "IS_REVOKING_ACCESS") {
    return { ...state, revokingAccess: true };
  }
  return {
    value: "",
    isValid: null,
    grantingAccess: false,
    revokingAccess: false,
  };
};

const ViewRecordsRequest = () => {
  const dispatch = useDispatch();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    grantingAccess: false,
    revokingAccess: false,
    isValid: null,
  });

  const emailInputRef = useRef();

  const { isValid: emailIsValid } = emailState;

  const grantAccessHandler = (event) => {
    event.preventDefault();

    // Check if email is valid
    if (emailIsValid) {
      // Change email state to currently in the process of granting access
      dispatchEmail({ type: "IS_GRANTING_ACCESS" });

      // Dispatch action to grant access
      dispatch(
        addUserToGroup(
          { id: emailState.value.trim() },
          () => {
            showSnack(
              `${emailState.value.trim()} has been given access to your records.`
            );
            // reset email field
            dispatchEmail({});
          },
          () => {
            // Reset email state
            dispatchEmail({});
          }
        )
      );
    } else {
      // Put focus back on email input if it is invalid
      emailInputRef.current.focus();
    }
  };

  const revokeAccessHandler = (event) => {
    event.preventDefault();

    // Check if we are currently in the process of saving a new resource
    // or if nothing has been entered into the text box.
    if (
      emailState.grantingAccess ||
      emailState.revokingAccess ||
      !emailState.value.trim()
    ) {
      return;
    }

    // Check if email is valid
    if (emailIsValid) {
      // Change email state to currently revoking access
      dispatchEmail({ type: "IS_REVOKING_ACCESS" });

      // Dispatch action to grant access
      dispatch(
        removeUserFromGroup(
          { id: emailState.value.trim() },
          () => {
            showSnack(
              `${emailState.value.trim()} revoked access to your records.`
            );
            // Reset email field
            dispatchEmail({});
          },
          () => {
            // Reset email state
            dispatchEmail({});
          }
        )
      );
    } else {
      // Put focus back on email input
      emailInputRef.current.focus();
    }
  };

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  return (
    <div className="app">
      <Container>
        <h3>Grant Access To Your Records</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formText">
            <Input
              ref={emailInputRef}
              id="email"
              label="no-label"
              type="email"
              placeholder="Email Address of the User To Whom You Want to Grant Access"
              isValid={emailIsValid}
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={validateEmailHandler}
            />
            <Button
              variant="primary"
              type="submit"
              style={{ marginRight: 20 }}
              onClick={grantAccessHandler}
            >
              {emailState.grantingAccess && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                ></Spinner>
              )}
              Grant Access
            </Button>
            <Button
              variant="warning"
              type="submit"
              onClick={revokeAccessHandler}
            >
              {emailState.revokingAccess && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                ></Spinner>
              )}
              Revoke Access
            </Button>
          </Form.Group>
        </Form>

        {/* <hr />
        <h3>View Requests for your Records</h3>
        <h6>
          View, authorize, and reject 3rd party access requests for your medical
          records
        </h6>
        <ViewRecordsRequestAccordion /> */}
      </Container>
    </div>
  );
};

export default ViewRecordsRequest;
