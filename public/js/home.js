$(document).ready(() => {
    $.get("/api/posts", results => {
        outputPosts(results, $(".msg_container"));
    })
})

function createPostHtml(postData) {

    //var postedBy = postData.postedBy;
    var displayName = String(postData.postedBy);
    var timestamp = formatDate(postData.date);

    return `<div class='post'>

                <div class='message'>
                        <div class='header'>
                            <a href='/profile/${postData.postedBy}' class='displayName'>@${displayName}</a>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                </div>
            </div>`;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}
