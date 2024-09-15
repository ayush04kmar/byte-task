const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/check-google', async (req, res) => {
    if (!req.user || !req.user.accessToken) {
        console.log("not subscribed");
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
            params: {
                part: 'snippet',
                mine: true,
                forChannelId: process.env.YOUR_YOUTUBE_CHANNEL_ID
            },
            headers: {
                Authorization: `Bearer ${req.user.accessToken}`
            }
        });
        console.log('YouTube API Response:', response.data);
        const isSubscribed = response.data.items.length > 0;
        res.json({ isSubscribed });
    } catch (error) {
        console.error('Error checking YouTube subscription:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error checking YouTube subscription', details: error.response ? error.response.data : error.message });
    }
});

router.get('/check-github', async (req, res) => {
    if (!req.user || !req.user.accessToken) {
        console.log("not subscribed");
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const response = await axios.get(`https://api.github.com/user/following/${process.env.YOUR_GITHUB_USERNAME}`, {
            headers: {
                Authorization: `token ${req.user.accessToken}`
            }
        });

        const isFollowing = response.status === 204;
        res.json({ isFollowing });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.json({ isFollowing: false });
        } else {
            console.error('Error checking GitHub following status:', error);
            res.status(500).json({ error: 'Error checking GitHub following status' });
        }
    }
});

module.exports = router;
