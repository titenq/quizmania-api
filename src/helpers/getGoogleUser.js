const getGoogleUser = async token => {
  const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    params: {
      alt: 'json',
      access_token: token,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = response.data;

  return user;
};

export default getGoogleUser;
