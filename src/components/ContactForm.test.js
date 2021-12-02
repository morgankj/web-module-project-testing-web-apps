import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const fNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(fNameField, "abc");
    // const fNameError = screen.getByText(/firstname must have at least 5 characters/i);
    // expect(fNameError).toBeInTheDocument();
    const errors = await screen.findAllByTestId("error");
    expect(errors).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(() => {
        const errors = screen.queryAllByTestId("error");
        expect(errors).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    const fNameField = screen.getByLabelText(/first name/i);
    const lNameField = screen.getByLabelText(/last name/i);
    const button = screen.getByRole("button");
    userEvent.type(fNameField, "alistair");
    userEvent.type(lNameField, "theirin");
    userEvent.click(button);
    const errors = await screen.findAllByTestId(/error/i);
    expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "invalid email");
    const error = await screen.findByText(/email must be a valid email address/i);
    expect(error).toBeInTheDocument();
});

test('renders "lastName is a required field" if a last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const button = screen.getByRole("button");
    userEvent.click(button);
    const error = await screen.findByText(/lastname is a required field/i);
    expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    const fNameField = screen.getByLabelText(/first name/i);
    const lNameField = screen.getByLabelText(/last name/i);
    const emailField = screen.getByLabelText(/email/i);
    const button = screen.getByRole("button");
    userEvent.type(fNameField, "alistair");
    userEvent.type(lNameField, "theirin");
    userEvent.type(emailField, "dragon@age.com");
    userEvent.click(button);
    await waitFor(() => {
        const submittedFName = screen.queryByText("alistair");
        const submittedLName = screen.queryByText("theirin");
        const submittedEmail = screen.queryByText("dragon@age.com");
        const message = screen.queryByTestId("messageDisplay");
        expect(submittedFName).toBeInTheDocument();
        expect(submittedLName).toBeInTheDocument();
        expect(submittedEmail).toBeInTheDocument();
        expect(message).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const fNameField = screen.getByLabelText(/first name/i);
    const lNameField = screen.getByLabelText(/last name/i);
    const emailField = screen.getByLabelText(/email/i);
    const messageField = screen.getByLabelText(/message/i);
    const button = screen.getByRole("button");
    userEvent.type(fNameField, "alistair");
    userEvent.type(lNameField, "theirin");
    userEvent.type(emailField, "dragon@age.com");
    userEvent.type(messageField, "Alistair is the best romance ever and nobody can tell me otherwise");
    userEvent.click(button);
    await waitFor(() => {
        const submittedFName = screen.queryByText("alistair");
        const submittedLName = screen.queryByText("theirin");
        const submittedEmail = screen.queryByText("dragon@age.com");
        const submittedMessage = screen.queryByText("Alistair is the best romance ever and nobody can tell me otherwise");
        expect(submittedFName).toBeInTheDocument();
        expect(submittedLName).toBeInTheDocument();
        expect(submittedEmail).toBeInTheDocument();
        expect(submittedMessage).toBeInTheDocument();
    })
});