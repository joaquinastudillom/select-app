import React from 'react';
import Select from './molecules/Select';

import './assets/styles/global.scss';
import './assets/styles/utilities.scss';

const options = [
    {
        label: 'Strict Black',
        value: 'strict-black',
    },
    {
        label: 'Heavenly Green',
        value: 'heavenly-green',
    },
    {
        label: 'Sweet Pink',
        value: 'pink',
    },
];

const App = () => {
    return (
        <div style={{ padding: '40px' }}>
            <Select options={options} />
        </div>
    );
};

export default App;
