import type from './typeActions'
import {message} from 'antd'

const initialState = {
    session: false,
    decoded: null,
    loading: false,
    error: false,
    user: {
        _id: ""
    },
    account: null,
    status: '',
    alert: null,
    loadingPosts: false,
    loadingUserPage: false,
    singlePost: null,
    post: null,
    checkingUsername: false,
    usernameAvailable: true,
    more_posts: false,
    conversations: null,
    conversation: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_STATE:
            return {...state, ...action.payload }
        case type.LOGIN_SUCCESS:
            action.rememberMe? localStorage.setItem("token", action.payload.token) : sessionStorage.setItem("token", action.payload.token)
            return {...state, ...action.payload, status: 'logged in', loading: false, error: false}
        case type.REGISTER_SUCCESS:
            return {...state, ...action.payload, status: 'registered', loading: false, error: false}
        case type.GET_ACCOUNT:
            return {...state, ...action.payload}
        case type.ERROR:
            message.error(action.payload.msg? action.payload.msg : action.payload === 'Unauthorized' ? 'You need to sign in' : 'error');
            return {...state, loading: false, error: true, alert: true, msg: action.payload.msg}
        case type.GET_POSTS_SUCCESS:
            const posts = state.posts && state.more_posts && action.payload.previous ? { posts: state.posts.concat(action.payload.results) }  : { posts: action.payload.results }
            return {...state, ...posts, loadingPosts: false, more_posts: action.payload.next? true: false}
        case type.SELL_POST_SUCCESS:
            action.func()
            return {...state, ...action.payload, loading: false}
        case type.GET_USER:
            let user = {...state.user, ...action.payload.user} 
            return {...state, user, loadingUserPage: false}
        case type.GET_SINGLE_POST:
            action.func(action.payload.post.comments)
            return{...state,...action.payload}
        case type.POST_COMMENT:
            action.func(action.payload)
            return {...state, ...action.payload}
        case type.LIKE_POST:
            let post = state.post
            let account = state.account
            if(action.payload.msg === "liked"){
                post.likes = post.likes + 1
                account.liked.push(action.params)
            }else if(action.payload.msg === "unliked"){ 
                post.likes = post.likes - 1
                let likeIndex = account.liked.indexOf(action.params)
                likeIndex > -1 && account.liked.splice(likeIndex, 1)}
            return {...state, ...post, ...account }
        case type.SUBMIT_BID:
            let bidpost = state.post
            bidpost.bids = action.payload
            return {...state, ...bidpost }
        case type.EDIT_PROFILE_PICTURE:
            let editUserPic = state.user
            editUserPic.profileImg = action.payload.profileImg
            return {...state, ...editUserPic }
        case type.EDIT_PROFILE:
            let editedUser = {...state.user,...action.payload.values}
            action.payload.func()
            return {...state, user: editedUser}
        case type.SEARCH_ON_CHANGE:
            let updatePosts = state.posts 
            updatePosts = action.payload.results
            return {...state, ...{posts: updatePosts}}
        case type.CHECK_USERNAME:
            let available
            if(action.payload.msg === "username already exist"){ available = false }
            if(action.payload.msg === "username available"){ available = true }        
            return {...state, usernameAvailable: available, checkingUsername: false}
        case type.RATE_USER:
            action.payload.func()
            return state
        case type.GET_CONVERSATIONS:
            return {...state, ...action.payload}
        case type.START_CHAT:
            message.success('Your message was sent!')
            return {...state, ...action.payload}
        case type.GET_SINGLE_CONVERSATION:
                action.func(action.payload.conversation.messages)
            return {...state, ...action.payload}
        default:
            return state
    }
  }

export { initialState, reducer }