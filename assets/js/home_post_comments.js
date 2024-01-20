

class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        console.log("gh");
        //call for all the existing comments
        $(' .delete-comment-button',this.postContainer).each(function(){
            self.deleteComment($(this));
        });

    }

    //method to submit the form data for new comment using AJAX
    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self=this;
            $.ajax({
                type:'post',
                url:'/comments/create',
                data:$(self).serialize(),
                success:function(data){
                    // console.log(postId);
                    // console.log('sd');
                    // console.log(data);
                    let newComment = pSelf.newCommentDom(data.data);
                    
                    $(`#post-comments-${postId}`).prepend(newComment);
                    
                    pSelf.deleteComment($(' .delete-comment-button',newComment));

                    new Noty({
                        theme:'relax',
                        text:'Comment published!!',
                        type:'success',
                        layout:'topRight',
                        timeout:1000
                    }).show();
                    
                    

                },error:function(error){
                    console.log(error.responseText);
                }

            })
        });
    }
    //method to create a comment in DOM
    newCommentDom (data){
        return $(`
        <li id="comment-${data.comment._id}">
            <p>
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/${data.comment._id}">X</a>
                    </small>
                    
                ${ data.comment.content }
                <br>
                <small>
                    ${data.username }
                </small>
            </p>
        </li>
       
                `);
    }
    //method to delete a comment from DOM

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text:'Comment deleted!!',
                        type:'success',
                        layout:'topRight',
                        timeout:1000
                    }).show();
                },error:function(error){
                    console.log(error.responseText);

                }
            });
        });
    }

    

}
// module.exports = PostComments;