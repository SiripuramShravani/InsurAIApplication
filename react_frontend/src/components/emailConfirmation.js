
const EmailConfirmationMessage = ({ user }) => (
    <>
        {/* Your email confirmation has been successfully dispatched to the provided email address. &nbsp; */}
        {user && (
            <a href={`mailto:${user.pol_email}`} style={{ color: 'blue' }}>
                {user.pol_email}
            </a>
        )}
    </>
);

export default EmailConfirmationMessage;
