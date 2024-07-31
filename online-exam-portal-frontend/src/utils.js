import axios from "axios";

export const checkLogin = async () => {
    const token = localStorage.getItem('jwtToken');

    const checkToken = async () => {
        const token = localStorage.getItem('jwtToken');
        let check = false
        const validateUrl = 'http://localhost:8089/auth/validate'
        const jwtToken = JSON.parse(token)
        // console.log('inside if????', jwtToken.token)
        const response = await axios.post(validateUrl,
            {
                'message': jwtToken.message,
                'token': jwtToken.token,

            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
        )

        // console.log('jwt validate res', response.data);
        if (response.data.tokenValid) {
            const userData = { 'id': response.data.id, 'name': response.data.name, 'role': response.data.role }
            // console.log('userdata in util', userData)
            localStorage.setItem('userData', JSON.stringify(userData))
            check = true;
        }
        else {
            // console.log('token invalid ???')
            check = false;
        }

        return check
    }

    if (token === null || token === undefined) {
        // console.log("return due to token")
        // return { 'role': '', 'valid': false };
        return false;
    }
    else {

        const res = await checkToken()
        // console.log('wait response of check token', res)
        // console.log('res', res)
        return res;
    }

}