interface IFeedback{
    id:number,
    name:string,
    score:number,
}
class FeedBack{
    commentList: IFeedback[];
    constructor(commentItem: IFeedback[]) {
        this.commentList = commentItem || [];
    }
    renderFeedBack():void {
            const commentListUl:HTMLElement= document.querySelector('.list-comment') as HTMLElement;
            // const form: HTMLFormElement  = document.getElementById("form") as HTMLFormElement;
            let text: string = "";
            if (commentListUl) {
                commentListUl.innerHTML = ""; 
                this.commentList.forEach(e=> {
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
    createFeedback(name:string,score:number=0): void{
        this.commentList.push({
            id: Math.floor(Math.random() * 10000000),
            name:name,
            score:score,
        });
        localStorage.setItem("commentList", JSON.stringify(this.commentList));
        this.renderFeedBack();
    }
    deleteFeedBack(inputId: number):unknown{
        if(!confirm("Bạn có chắc muốn xóa comment nay ko ?")){
            return ``;
        }
        let foundIndex = -1
        let newList=this.commentList.filter(e=>{
            return e.id!=inputId;
        })
        this.commentList=newList;
        localStorage.setItem("commentList", JSON.stringify(this.commentList))
        this.renderFeedBack();
    }
    editFeedBack(id:number,name:string,score:number){
        this.commentList.forEach(function(e){
            if(id==e.id){
                e.name=name;
                e.score=score;
            }
        })
        localStorage.setItem("commentList", JSON.stringify(this.commentList))
        this.renderFeedBack();
    }
    findEditFeedBack(id: number):IFeedback|undefined{
       let find:IFeedback|undefined=this.commentList.find(e=>{
        return id===e.id;
       })
       if(find){
        return find;
       }
       return undefined;
    }
}
const commentList = new FeedBack(JSON.parse(localStorage.getItem("commentList")||"[]"));
commentList.renderFeedBack();
let inputReview:HTMLInputElement = document.querySelector('.input-review') as HTMLInputElement;
let score:HTMLCollectionOf<HTMLElement>=document.getElementsByClassName('list-point-item') as HTMLCollectionOf<HTMLElement> ;
let sendBox:HTMLDivElement=document.querySelector('.send-btn') as HTMLDivElement;
Array.from(score).forEach(e=>{
  e.addEventListener('click',function(event){
    Array.from(score).forEach(function(e){
        e.classList.remove('red');
    })
    e.classList.add('red');
  })
});
function resetValue(){
    Array.from(score).find(function(e){
       e.classList.remove('red');
    });
    inputReview.value='';
    sendBox.innerText='send';
}
let number:number;
function manageAction(){
    let listCommentItem :HTMLCollection=document.getElementsByClassName('list-comment-item') as HTMLCollection;
    Array.from(listCommentItem).forEach(e=>{
        e.addEventListener('click',function(event){
            number=parseInt(e.id);
            let target :HTMLElement=event.target as HTMLElement
            if(target.classList.contains('erase-comment')){
                console.log('run');
                commentList.deleteFeedBack(number);
                resetValue();
            }
            if(target.classList.contains('edit-comment')){
                let object:IFeedback|undefined=commentList.findEditFeedBack(number);
                if(object){
                    inputReview.value=object.name;
                    Array.from(score).forEach(e=>{
                        let element:HTMLElement=e as HTMLElement;
                        if(element.innerText==object.score.toString()){
                            e.classList.add('red');
                        }else{
                            e.classList.remove('red');
                        }
                    })
                    sendBox.innerText='update';
                }

            }
        });
    });
}
manageAction();
sendBox.addEventListener('click',function(e){
    let findScore: HTMLElement|undefined = Array.from(score).find((eb) => {
        return eb.classList.contains('red');
    });
    if(findScore &&inputReview.value!=''){
        let findScore2:number=parseInt(findScore.innerText);
        if(sendBox.innerText=='send'){
            commentList.createFeedback(inputReview.value.toString(),findScore2);
        }
        if(sendBox.innerText=='update'){
            commentList.editFeedBack(number,inputReview.value.toString(),findScore2);
        }
        resetValue();
    }else{
        alert("Ban chua dien day du thong tin !!!")
    }
})
