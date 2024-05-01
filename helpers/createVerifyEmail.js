const { PROJECT_URL } = process.env;

const createVerifyEmail = (email, verificationCode) => {
    const verifyEmail = {
        to: email,
        subject: '<b>Task Pro</> email verification',
        html: `<a target='_blank' href='${PROJECT_URL}/api/users/verify/${verificationCode}'>Verify your email</a>`,
    };

    return verifyEmail;
};

export default createVerifyEmail;
