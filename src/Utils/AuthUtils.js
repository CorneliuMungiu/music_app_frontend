import axios from 'axios';
import Cookies from 'js-cookie';

export function performHttpRequest(url, onSuccess, onFailure) {
    return function fetchData() {
        const myCookieValue = Cookies.get('MusicAppAccessToken');
        const myCookieRefreshValue = Cookies.get('MusicAppRefreshToken');

        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + myCookieValue,
                'MusicAppRefreshToken': myCookieRefreshValue
            }
        })
        .then(response => {
            onSuccess(response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                axios.post('http://localhost:8080/api/auth/refresh', { refreshToken: myCookieRefreshValue })
                .then(tokenResponse => {
                    const newAccessToken = tokenResponse.data.accessToken;
                    const newRefreshToken = tokenResponse.data.refreshToken;
                    Cookies.set('MusicAppAccessToken', newAccessToken);
                    Cookies.set('MusicAppRefreshToken', newRefreshToken);

                    // Refacem cererea inițială cu noul access token
                    axios.get(url, {
                        headers: {
                            'Authorization': 'Bearer ' + newAccessToken,
                            'MusicAppRefreshToken': newRefreshToken
                        }
                    })
                    .then(retryResponse => {
                        onSuccess(retryResponse.data);
                    })
                    .catch(refreshError => {
                        onFailure();
                        console.error('Error refreshing access token:', refreshError);
                    });
                })
                .catch(refreshError => {
                    onFailure();
                    console.error('Error refreshing access token:', refreshError);
                });
            } else {
                onFailure();
                console.error('Error fetching data:', error);
            }
        });
    };
}
