/**
 * Finds all users for a project and creates filter links to their issue queues.
 */
var filters = [
    {nth: 2, title: 'Assigned to '},
    {nth: 4, title: 'Mentioning '},
]

function extendFilter(){
    $(filters).each(function(key, value) {
        var clones = [],
            clone = [],
            user = '',

            // Find all users.
            users = "div[data-filterable-for=assignee-filter-field] h4:has(span.description)",

            // Find the link.
            link = "#issues_list ul.filter-list:first() > li:nth-child("+value.nth+")",

            // Find the current user's username.
            currentUserName = $("#user-links .name").text().trim();

        if ($(users).length !== 0) {

            // Give the link an ID and append a ul container for our new
            // links to live within.
            $(link).addClass("giu-filter")
                .append("<ul id='giu-filter-links'></ul>");
            // Clone the "Assigned to" link and create a new one for each user.
            $(users).each(function (index, Element) {
                var element = $(Element).clone();
                // Remove the full name which is in a <span> tag.
                $(element).children("span").remove();
                user = $(element).text().trim();

                if (user !== currentUserName) {
                    clones[index] = $(link).clone()
                        .removeClass("giu-filter");

                    // Note: Since 'clones' is a clone(), manipulating 'clone' also
                    // manipulates all of the actual elements within 'clones'.
                    clone = clones[index]
                        .children("a")
                        .removeClass("selected") // github adds unwanted style for this
                        .text(value.title + user)
                        .prepend("<span class='count'></span>"); // No API for counts

                    // Correct the path name of the link.
                    clone[0].pathname = clone[0].pathname
                        .replace(new RegExp(currentUserName + '$'), '') + user;
                }
            });
            $(link+" #giu-filter-links").append(clones);
        }
    });
}

extendFilter();

$(document).on('mousemove', function() {
    if ($('#giu-filter-links').length === 0
        && $("div[data-filterable-for=assignee-filter-field] h4:has(span.description)").length !== 0) {
        extendFilter();
    }
});
