function openDetail(evt, cityName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    }

    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;

        if (currentScrollPos > 100) {
            document.querySelector(".navnav").classList.add("hide")
        } else {
            document.querySelector(".navnav").classList.remove("hide")
        }
    }