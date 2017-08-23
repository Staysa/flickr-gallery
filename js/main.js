var url1 = 'https://api.flickr.com/services/rest?' + 'method=flickr.galleries.getPhotos' + '&api_key=df8019af44a39a25ba7c704537b74214' + '&gallery_id=' + '72157677476597845' + '&format=json' + '&nojsoncallback=1',
    url2 = 'https://api.flickr.com/services/rest?' + 'method=flickr.galleries.getPhotos' + '&api_key=df8019af44a39a25ba7c704537b74214' + '&gallery_id=' + '72157662859243450' + '&format=json' + '&nojsoncallback=1',
    url3 = 'https://api.flickr.com/services/rest?' + 'method=flickr.galleries.getPhotos' + '&api_key=df8019af44a39a25ba7c704537b74214' + '&gallery_id=' + '72157663337771571' + '&format=json' + '&nojsoncallback=1';

startPage(url1);

function startPage(urlG) {
    fetch(urlG)
        .then(function (resp) {
            resp.json()
                .then(function(respObj) {
                    respObj.photos.photo.forEach(function (item, index) {
                        var urlPhotos = "https://api.flickr.com/services/rest?method=flickr.photos.getInfo&format=json&nojsoncallback=1" + "&api_key=df8019af44a39a25ba7c704537b74214" + "&photo_id=" + item.id + "&secret=" + item.secret;
                        fetch(urlPhotos)
                            .then(function (resp) {
                                resp.json()
                                    .then(function (about) {
                                        about = about.photo;

                                        if (document.querySelectorAll('span').length <= 50) {
                                            createList(about);
                                            if (document.getElementById('wrap').children.length == 3) {
                                                document.getElementById('wrap').children[1].children[2].classList.add('active');
                                            }
                                        } else {
                                            return;
                                        }
                                    })
                            })
                    })
                })
    })
}

function createList(about) {
    var urlImg = 'https://farm' + about.farm + '.staticflickr.com/' + about.server +'/' + about.id + '_' + about.secret + '.jpg';
    var wrap = document.getElementById('wrap');
    if (wrap.children.length < 1) {
        createRow();
    } else {
        if (wrap.lastChild.children.length < 5) {
            createSpan(urlImg);
        } else {
            createRow();
            createSpan(urlImg);
        }
    }
}
function createRow() {
    var div = document.createElement('DIV'),
        wrap = document.getElementById('wrap');
    div.classList.add('row');
    wrap.appendChild(div);
}
function createSpan(url) {
    var span = document.createElement('SPAN'),
        wrap = document.getElementById('wrap');
    span.style.backgroundImage = 'url(' + url + ')';
    wrap.lastChild.appendChild(span);
}

var rows = document.querySelectorAll('.row'),
    wrap = document.getElementById('wrap');

wrap.addEventListener('click', function() {
    var block = event.target;
    attachElement(block);
});

function attachElement(e) {
    clearAttach();
    e.classList.toggle('active')
}

function clearAttach() {
    var rows = document.querySelectorAll('.row');
    for (var x = 0; x < rows.length; x++) {
        for (var i = 0; i < rows[x].children.length; i++) {
            rows[x].children[i].classList.remove('active');
        }
    }

}

document.onkeydown = function (e) {
    var block = document.querySelector('.active'),
        previousRow = block.parentNode.previousElementSibling,
        nextRow = block.parentNode.nextElementSibling,
        previousBlock = block.previousElementSibling,
        nextBlock = block.nextElementSibling,
        lastChild = block.parentNode.children.length - 1;
    switch (e.keyCode) {
        case 37: //left
            changeBlock(block, previousBlock, previousRow, lastChild);
            break;
        case 38: //top
            if (previousRow) {
                changeRow(block, previousRow);
                if (previousRow.previousElementSibling) {
                    previousRow.previousElementSibling.scrollIntoView();
                }
            }
            break;
        case 39: //right
            changeBlock(block, nextBlock, nextRow, 0);
            break;
        case 40: //bottom
            changeRow(block, nextRow);
            block.parentNode.scrollIntoView();
            var chldF = block.parentNode.nextElementSibling.nextElementSibling,
                chldL = block.parentNode.previousElementSibling;
            btnLoad(chldF, chldL, url2);
            break;
        default:
            console.log('no senses')

    }
};

function changeBlock(e, change, turn, number) {
    if (change != null) {
        change.classList.add('active');
        e.classList.remove('active');
    } else {
        var now = turn.children[number];
        clearAttach();
        now.classList.add('active');
        now.parentNode.previousElementSibling.scrollIntoView();
        var chldF = now.parentNode.nextElementSibling.nextElementSibling,
            chldL = now.parentNode.previousElementSibling;
        btnLoad(chldF, chldL, url3);
    }
}
function changeRow(e, turn) {
    for (var i = 0; i < e.parentNode.children.length; i++) {
        if (e.parentNode.children[i] == e) {
            var before = e.parentNode.children[i],
                now = turn.children[i];
            now.classList.add('active');
            before.classList.remove('active');
        }
    }
}
function btnLoad(elF, elL, url) {
    if (elF == null || elF.nextElementSibling == null || elF.nextElementSibling.nextElementSibling == null) {
        startPage(url);
    }
    if (elL !== null && elL.previousElementSibling !== null) {
        document.getElementById('wrap').removeChild(elL.previousElementSibling).innerHTML = '';
    }
}

