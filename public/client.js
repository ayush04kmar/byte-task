function authenticate(provider) {
    localStorage.setItem('authProvider', provider);
    window.location.href = `/auth/${provider}`;
}

async function checkAccess() {
    const provider = localStorage.getItem('authProvider');
    if (!provider) return;

    try {
        // Add a small delay to allow time for the subscription to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch(`/api/check-${provider}`);
        const data = await response.json();

        if (provider === 'google' && !data.isSubscribed) {
            console.log('Not subscribed, redirecting to YouTube');
            window.location.href = `https://www.youtube.com/@BYTE-mait?sub_confirmation=1`;
        } else if (provider === 'github' && !data.isFollowing) {
            console.log('Not following, redirecting to GitHub');
            window.location.href = 'https://github.com/bytemait';
        } else {
            console.log('Access granted');
            document.getElementById('content').style.display = 'block';
        }
    } catch (error) {
        console.error('Error checking access:', error);
        // Display error message to user
        document.getElementById('error-message').textContent = 'An error occurred while checking access. Please try again later.';
    }
}

// Call checkAccess when the dashboard page loads
if (window.location.pathname === '/dashboard') {
    checkAccess();
}
