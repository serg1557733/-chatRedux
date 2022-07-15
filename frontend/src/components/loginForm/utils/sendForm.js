export const sendForm = async (POST_URL, userData) => {
    console.log('sendform', userData)
        const response = await fetch(POST_URL, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
});
        const json = await response.json();
        return json;
}