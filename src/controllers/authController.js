const axios = require('axios');
const User = require('../models/User'); // Adjust path to your User model
const jwt = require('jsonwebtoken');

exports.spotifyCallback = async (req, res) => {
    const { code } = req.query;

    try {
        // 1. Request the Access Token from Spotify
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
            }
        });

        const { access_token, refresh_token } = tokenResponse.data;

        // 2. Get User Profile from Spotify
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        const spotifyData = userResponse.data;

        // 3. Find or Create User in MongoDB
        let user = await User.findOne({ spotifyId: spotifyData.id });

        if (!user) {
            user = new User({
                username: spotifyData.display_name,
                email: spotifyData.email,
                spotifyId: spotifyData.id,
                profileImage: spotifyData.images[0]?.url
            });
        }

        // Update tokens every time they login
        user.spotifyAccessToken = access_token;
        user.spotifyRefreshToken = refresh_token;
        await user.save();

        // 4. Create a JWT for your own App's session
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 5. Redirect to Frontend with the token (or set a cookie)
        // For simplicity, we'll send it as a URL param so the frontend can save it
        res.redirect(`/?token=${token}&login=success`);

    } catch (error) {
        console.error('Detailed Auth Error:', error.response?.data || error.message);
        res.redirect('/?error=auth_failed');
    }
};