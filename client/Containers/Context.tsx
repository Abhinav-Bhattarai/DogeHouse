import React from 'react';

const Context = React.createContext({
    userID: '',
    username: '',
    auth_token: '',
    dogeCount: 0
});

export default Context;