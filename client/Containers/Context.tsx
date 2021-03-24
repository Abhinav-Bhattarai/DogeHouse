import React from 'react';

const Context = React.createContext({
    userID: '',
    username: '',
    auth_token: ''
});

export default Context;