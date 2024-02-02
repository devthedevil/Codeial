class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        

        this.createComment(postId);

        let self = this;
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
                data: $(self).serialize(),
                
                success:function(data){
                    // console.log(data);
                    // console.log("comment.user.name",data);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    
                    $(`#post-comments-${postId}`).prepend(newComment);
                    
                    pSelf.deleteComment($(' .delete-comment-button',newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));
                    
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
    newCommentDom (comment){
        return $(`
        <li id="comment-${comment._id}">
            <p>
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                    </small>
                    
                ${ comment.content }
                <br>
                <small>
                    ${comment.user.name }
                </small>
                
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        0Likes
                    </a>
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