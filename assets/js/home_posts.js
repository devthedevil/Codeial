// const PostComments = require('./home_post_comments');
// import { PostComments } from './home_post_comments';
{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type:'post',
                url:'/posts/create',
                data:newPostForm.serialize(),
                success:function(data){
                    let newPost = newPostDom(data.data);
                    
                    $('#posts-list-container>ul').prepend(newPost);
                    // console.log($('#posts-list-container>ul').serialize());
                    deletePost($(' .delete-post-button',newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);
                    
                    new Noty({
                        theme: 'relax',
                        text: "Post published!!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },error:function(error){
                    console.log(error.responseText);
                }

            });
        });
    }
    //method to create a post in DOM
    let newPostDom = function (data){
        return $(`
        <li id="post-${data.post._id}">        
        <p>     
            <small>
                <a class="delete-post-button" href="/posts/destroy/${data.post._id}">X</a>
            </small>
            
            ${data.post.content} 
        <br>
        <small>
            ${data.username}
        </small>
        
        </p>
        <div id="post-comments">
            
                <form id="post-${ data.post._id }-comments-form" action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type here to add comment..." required>
                    <input type="hidden" name="post" value="${data.post._id}">
                    <input type="submit" value="Add Comment">
                </form>
    
            
    
            <div class="post-comments-list">
                <ul id="post-comments-${data.post._id}">
                    
                </ul>
            </div>
        </div>
    </li>   
                `);
    }
    //method to delete a post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error:function(error){
                    console.log(error.responseText);

                }
            });
        });
    }
    
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
    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
           
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();


}