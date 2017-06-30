let masterList = [],
    searchList = [],
    studentsPerPage = 10,
    currentPage = 1;

//Make unobtrusive javascript array of list items with class name ".student-item"
function loadList() {
    masterList = [].slice.call(document.querySelectorAll(".student-item"));
    // console.log(masterList)
}
//Determine number of Pages
function getNumberOfPages(students, studentsPerPage) {
    return Math.ceil(students.length / studentsPerPage)
}

function hideAllStart() {
    let hideList = document.querySelectorAll(".student-item");
    for (h = 0; h < hideList.length; h++) {
        hideList[h].style.display = "none";
    }
}

// The showPage Function
// This function builds a list of ten students and displays it on the page. The students displayed depends on the page number passed to this function. It will show all the students on this page and hide the rest.
function showPage(students, currentPage) {
    // first hide all students on the page
    hideAllStart();
    // Create student list page
    let begin = ((currentPage - 1) * studentsPerPage);
    let end = begin + studentsPerPage;
    let pageList = students.slice(begin, end);
    // if student should be on this page number, show the student
    for (j = 0; j < pageList.length; j++) {
        pageList[j].style.display = "block";
    }
}

//remove previously marked "active" link
function removeClicked() {
    let buttons = document.querySelectorAll('a');
    for (a = 0; a < buttons.length; a++) {
        buttons[a].removeAttribute("class", "active");
    }
}

//hide page links for search return none
function hidePageLinks() {
    let links = document.querySelectorAll(".pagination");
    for (l = 0; l < links.length; l++) {
        links[l].style.display = "none";
    }
}

// mark that link as “active”
function clicked(anchor) {
    anchor.setAttribute("class", "active");
}

function getCurrentPage(event, students) {
    if (!searchList.length) {
        students = masterList
    } else {
        students = searchList
    }
    event.preventDefault()
    removeClicked();
    clicked(this)
    currentPage = parseInt(this.innerHTML);
    console.log(currentPage);
    showPage(students, currentPage)
}

//Create searchbar in header
function searchBarHTML() {
    let searchDiv = document.createElement('div');
    searchDiv.setAttribute("class", "student-search");
    let searchButton = document.createElement("BUTTON");
    searchButton.innerHTML = "Search";
    searchButton.addEventListener("click", search)
    let searchField = document.createElement("INPUT");
    searchField.setAttribute("id", "searchText");
    searchField.placeholder = "Search for students...";
    // append search button and input field to div
    searchDiv.appendChild(searchField);
    searchDiv.appendChild(searchButton);
    //  append to header
    let header = document.querySelector(".page-header");
    header.appendChild(searchDiv);
}

function obtainSearchField() {
    let searchInput = document.getElementById("searchText").value
    return searchInput;
}

function searchElements(list, searchInput) {
    if (!searchInput || typeof searchInput != 'string') {
        return;
    }
    list.forEach((li) => {
        // ...obtain the student’s name…
        let name = li.querySelector('h3').innerHTML;
        // ...and the student’s email…
        let email = li.querySelector(".email").innerHTML;
        // if the search value is found inside either email or name…
        // add this student to list of “matched” student
        if (name.includes(searchInput) || email.includes(searchInput)) {
            searchList.push(li);
        }
    });
}
// If there’s no “matched” students display a “no students found” message
function sorryPage(searchList) {
    if (!searchList.length) {
        let sorryPage = document.createElement('h1');
        sorryPage.innerHTML = "Sorry, no students found";
        sorryPage.style.textAlign = "center";
        sorryPage.setAttribute("id", "sorry-text");
        let pageBody = document.querySelector("body")
        pageBody.appendChild(sorryPage);
    }
}
//clear sorry message for new searches
function clearSorry() {
    let x = document.getElementById("sorry-text");
    if (x) {
        x.innerHTML = "";
    }
}

function clearSearch() {
    //clear search list
    document.getElementById("searchText").value = "";
    for (s = searchList.length; s > 0; s--) {
        searchList.pop();
    }
    //clear page links
    let clrPageLnks = document.getElementsByClassName(".pagination");
    console.log(clrPageLnks)
    for (c = clrPageLnks.length; c > 0; c--) {
        clrPageLnks[c].innerHTML = "";
    }
    //remove old page links
    hidePageLinks()
}

function search() {
    // remove the previous page link section
    hideAllStart();
    hidePageLinks()
    removeClicked();
    // Obtain the value of the search input
    let searchInput = obtainSearchField();
    //quick validation search input was entered
    // Loop over the student list, and for each student…
    loadList();
    searchElements(masterList, searchInput);
    sorryPage(searchList);
    //call appendPageLinks with the matched students
    appendPageLinks(searchList);
    // Call showPage to show first ten students of matched list
    showPage(searchList, currentPage);
    if (!searchInput.length) {
        reset()
    }
}

//Create page links for appropriate number of pages
function pageLinks(students) {
    // determine how many pages for this student list
    let numberOfPages = getNumberOfPages(students, studentsPerPage);
    // create a page link section
    let pageLinkDiv = document.createElement("div")
    pageLinkDiv.setAttribute("class", "pagination");
    //create unordered list
    let pageUl = document.createElement("ul");
    // “for” every page
    for (p = 0; p < numberOfPages; p++) {
        let pageLi = document.createElement("li");
        // add a page link to the page link section
        let pageAnchor = document.createElement("a");
        pageAnchor.setAttribute("href", "#");
        pageAnchor.innerHTML = p + 1;
        // append anchor to list item
        pageLi.appendChild(pageAnchor);
        // append list item to unordered list
        pageUl.appendChild(pageLi)
    }
    // append unordered list to div
    pageLinkDiv.appendChild(pageUl);
    // append div to page
    let page = document.querySelector(".page");
    page.appendChild(pageLinkDiv);
    console.log(pageLinkDiv);
}

// append getCurrentPage function to each anchor button.
function addAButtons(students) {
    let abuttons = document.querySelectorAll(".pagination ul li a");
    for (a = 0; a < abuttons.length; a++) {
        abuttons[a].addEventListener("click", getCurrentPage);
    }
}

function appendPageLinks(students) {
    //add pages
    pageLinks(students);
    //add page link buttons to navigate pages
    addAButtons(students)
}

function start() {
    //append search Bar
    searchBarHTML();
    //Get array of students to pass as arguments
    loadList();
    //call appendPageLinks to load site
    appendPageLinks(masterList)
    // Use the showPage function to display the first ten students on page load.
    showPage(masterList, currentPage);
}

function reset() {
    clearSearch()
    clearSorry()
    loadList();
    appendPageLinks(masterList);
    showPage(masterList, currentPage);
}

document.querySelector("body").onload = start();
