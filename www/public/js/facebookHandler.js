/**
 * facebookHandler.
 *
 * >>Description<<
 *
 * @author Manfred
 * @date 25.04.14 - 16:15
 * @copyright munichDev UG
 */


var facebookHandler = function () {



}


/*

facebookHandler.login = function(){

    FB.login(function(response) {

        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID

            FB.api('/me', function(response) {
                user_email = response.email; //get user email
                alert("!!!")
                // you can store this data into your database
            });

        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'publish_stream,email'
    });
}

*/

facebookHandler.init = function(){

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '467888830036802',
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
        });

        // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
        // for any authentication related change, such as login, logout or session refresh. This means that
        // whenever someone who was previously logged out tries to log in again, the correct case below
        // will be handled.
        FB.Event.subscribe('auth.authResponseChange', function(response) {
            // Here we specify what we do with the response anytime this event occurs.
            if (response.status === 'connected') {
                // The response object is returned with a status field that lets the app know the current
                // login status of the person. In this case, we're handling the situation where they
                // have logged in to the app.
                var loginResponse= response;


                FB.api('/me', function(response) {

                    console.log(JSON.stringify(response));

                    if(!response.email||!response.id||!response.username||!loginResponse.authResponse.accessToken) {

                        FB.logout(function(response) {
                         // user is now logged out
                         });

                    } else{
                        console.log("BBBBBBBBBBBBBBBBB")

                        console.log(JSON.stringify(loginResponse))

                        console.log(loginResponse.authResponse.accessToken)

                        accountController.socialSignIn(response.username, response.email,response.id,1, loginResponse.authResponse.accessToken)


                        /*
                        FB.ui({
                            method: 'share_open_graph',
                            action_type: 'og.likes',
                            action_properties: JSON.stringify({
                                object:'https://developers.facebook.com/docs/dialogs/',
                            })
                        }, function(response){});
                        */




                    }


                });
            } else if (response.status === 'not_authorized') {

              /*  // In this case, the person is logged into Facebook, but not into the app, so we call
                // FB.login() to prompt them to do so.
                // In real-life usage, you wouldn't want to immediately prompt someone to login
                // like this, for two reasons:
                // (1) JavaScript created popup windows are blocked by most browsers unless they
                // result from direct interaction from people using the app (such as a mouse click)
                // (2) it is a bad experience to be continually prompted to login upon page load.




                FB.login(function(response) {
                }, {scope: 'public_profile, email'}); //

              */

            } else {

                /*
                // In this case, the person is not logged into Facebook, so we call the login()
                // function to prompt them to do so. Note that at this stage there is no indication
                // of whether they are logged into the app. If they aren't then they'll see the Login
                // dialog right after they log in to Facebook.
                // The same caveats as above apply to the FB.login() call here.

                FB.login(function(response) {
                }, {scope: 'public_profile, email'});
                */

            }
        });
    };

    // Load the SDK asynchronously
    (function(d){
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

    // Here we run a very simple test of the Graph API after login is successful.
    // This testAPI() function is only called in those cases.






}


/**
 * Update FB Buttons
 */
facebookHandler.updateSongFBButtons = function(){


    if( playbackController.playingSong)
        $("#songfblikeartist").html(preloadhtml.sharefbartist.replace("songbase.fm", "songbase.fm?artist=" +  mediaController.getSongArtist(playbackController.playingSong)));
    else
        $("#songfblikeartist").html(preloadhtml.sharefbartist);

    if( playbackController.playingSong)
        $("#songfblikesong").html(preloadhtml.sharefbsong.replace("songbase.fm", "songbase.fm?play=" + playbackController.getPlayingTitle()));
    else
        $("#songfblikesong").html(preloadhtml.sharefbsong);

    try {
        FB.XFBML.parse();
    } catch (ex) {
    }
}

facebookHandler.postOnFacebook = function () {

    if (playbackController.playingSong)
    {
        mediaController.sendRating("1");
        var song = playbackController.getPlayingSong();
        var fburl =  "http://www.songbase.fm?play="+playbackController.getPlayingTitle() + "&t=" + playbackController.getPlayingTitle();
    }
    else
    {
        fburl = "http://www.songbase.fm&t=songbase.fm - All Your Music";
    }

    mywindow = window.open("http://www.facebook.com/sharer.php?u=" +fburl, "", "");
    mywindow.focus();

}