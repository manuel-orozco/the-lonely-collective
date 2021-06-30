const sendServerError = (err) => {
    console.error(err.message);
    return res.status(500).send('Server error');
}

module.exports = sendServerError;