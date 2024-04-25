"use strict";
class FeedBack {
    constructor(commentItem) {
        this.commentList = commentItem || [];
    }
    renderFeedBack() {
        const commentListUl = document.querySelector('.list-comment');
        // const form: HTMLFormElement  = document.getElementById("form") as HTMLFormElement;
        let text = "";
        if (commentListUl) {
            commentListUl.innerHTML = "";
            this.commentList.forEach(e => {
                text += `
                    <li class="list-comment-item" id="${e.id}">
                        <div class="left-part">
                            <div class="score-comment">${e.score}</div>
                            <span class="content-comment">${e.name}</span>
                        </div>
                        <div class="right-part">
                            <i class='bx bx-edit-alt edit-comment'></i>
                            <i class='bx bx-trash erase-comment' ></i>
                        </div>
                    </li>

                        `;
            });
            commentListUl.innerHTML = text;
        }
        manageAction();
    }
    createFeedback(name, score = 0) {
        this.commentList.push({
            id: Math.floor(Math.random() * 10000000),
            name: name,
            score: score,
        });
        localStorage.setItem("commentList", JSON.stringify(this.commentList));
        this.renderFeedBack();
    }
    deleteFeedBack(inputId) {
        if (!confirm("Bạn có chắc muốn xóa comment nay ko ?")) {
            return ``;
        }
        let foundIndex = -1;
        let newList = this.commentList.filter(e => {
            return e.id != inputId;
        });
        this.commentList = newList;
        localStorage.setItem("commentList", JSON.stringify(this.commentList));
        this.renderFeedBack();
    }
    editFeedBack(id, name, score) {
        this.commentList.forEach(function (e) {
            if (id == e.id) {
                e.name = name;
                e.score = score;
            }
        });
        localStorage.setItem("commentList", JSON.stringify(this.commentList));
        this.renderFeedBack();
    }
    findEditFeedBack(id) {
        let find = this.commentList.find(e => {
            return id === e.id;
        });
        if (find) {
            return find;
        }
        return undefined;
    }
}
const commentList = new FeedBack(JSON.parse(localStorage.getItem("commentList") || "[]"));
commentList.renderFeedBack();
let inputReview = document.querySelector('.input-review');
let score = document.getElementsByClassName('list-point-item');
let sendBox = document.querySelector('.send-btn');
Array.from(score).forEach(e => {
    e.addEventListener('click', function (event) {
        Array.from(score).forEach(function (e) {
            e.classList.remove('red');
        });
        e.classList.add('red');
    });
});
function resetValue() {
    Array.from(score).find(function (e) {
        e.classList.remove('red');
    });
    inputReview.value = '';
    sendBox.innerText = 'send';
}
let number;
function manageAction() {
    let listCommentItem = document.getElementsByClassName('list-comment-item');
    Array.from(listCommentItem).forEach(e => {
        e.addEventListener('click', function (event) {
            number = parseInt(e.id);
            let target = event.target;
            if (target.classList.contains('erase-comment')) {
                console.log('run');
                commentList.deleteFeedBack(number);
                resetValue();
            }
            if (target.classList.contains('edit-comment')) {
                let object = commentList.findEditFeedBack(number);
                if (object) {
                    inputReview.value = object.name;
                    Array.from(score).forEach(e => {
                        let element = e;
                        if (element.innerText == object.score.toString()) {
                            e.classList.add('red');
                        }
                        else {
                            e.classList.remove('red');
                        }
                    });
                    sendBox.innerText = 'update';
                }
            }
        });
    });
}
manageAction();
sendBox.addEventListener('click', function (e) {
    let findScore = Array.from(score).find((eb) => {
        return eb.classList.contains('red');
    });
    if (findScore && inputReview.value != '') {
        let findScore2 = parseInt(findScore.innerText);
        if (sendBox.innerText == 'send') {
            commentList.createFeedback(inputReview.value.toString(), findScore2);
        }
        if (sendBox.innerText == 'update') {
            commentList.editFeedBack(number, inputReview.value.toString(), findScore2);
        }
        resetValue();
    }
    else {
        alert("Ban chua dien day du thong tin !!!");
    }
});
