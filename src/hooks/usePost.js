import React from 'react';
import axios from 'axios';

import {UserContext} from '../contexts/UserContext';
import {BASE_URL} from '../config';

export function usePost(endpoint, parameters = {}) {
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    axios
      .post(`${BASE_URL}${endpoint}`, parameters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }, []);
  return data;
}
