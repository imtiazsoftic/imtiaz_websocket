import _ from "lodash";

window._ = _;

// import LogRocket from 'logrocket';
// LogRocket.init('lsdyci/bit_deposit');

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import Echo from "laravel-echo";

// window.Pusher = require("pusher-js");

window.Echo = new Echo({
    broadcaster: "pusher",
    key: 'ae1238c8d625f7d212d3',
    cluster: "ap2",
    wsHost: window.location.hostname,
    wsPort: 6001,
    // forceTLS: true,
    forceTLS: false,
    // wssPort: 6001,
    // encrypted: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
});

console.log(window.Echo);

window.Echo.channel("notification-send").listen(
    "PusherNotification",
    (data) => {
        console.log(data);
        prependNotification(data);
    }
);

function prependNotification(notification) {
    var notificationTime = moment(notification?.time);
    var diffInMinutes = moment().diff(notificationTime, "minutes");
    var humanizedTime = moment.duration(diffInMinutes, "minutes").humanize();

    var notificationItem = `
            <li>
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <i class="fa fa-truck p-2" aria-hidden="true" style="color:#2b2b2b;font-weight: bold !important"></i>
                    </div>
                    <div class="flex-grow-1">
                        <p>
                            <a href="${notification?.link || "#"}">
                                <strong style="color:#4094FF;font-weight: bold !important">
                                    ${notification.subject}
                                </strong>
                            </a><br/>
                            <small style="color:#2b2b2b;font-weight: bold !important">
                                ${notification?.message || ""}
                            </small>
                            <span class="pull-right" style="font-size:13px !important;color:black !important">
                                ${humanizedTime} ago
                            </span>
                        </p>
                    </div>
                </div>
            </li>
        `;
    $("#notification_pusher_list").after(notificationItem);
}
