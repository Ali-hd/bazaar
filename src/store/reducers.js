import type from './typeActions'
import {message} from 'antd'
import {Redirect} from 'react-router-dom'

const initialState = {
    session: false,
    decoded: null,
    loading: false,
    error: false,
    user: {
        _id: ""
    },
    status: '',
    alert: null,
    loadingPosts: false,
    loadingUserPage: false,
    singlePost: null,
    post: null,
    checkingUsername: false,
    usernameAvailable: true,
    more_posts: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_STATE:
            return {...state, ...action.payload }
        case type.LOGIN_SUCCESS:
            action.rememberMe? localStorage.setItem("token", action.payload.token) : sessionStorage.setItem("token", action.payload.token)
            console.log('login success')
            console.log(action.payload)
            return {...state, ...action.payload, status: 'logged in', loading: false, error: false}
        case type.REGISTER_SUCCESS:
            return {...state, ...action.payload, status: 'registered', loading: false, error: false}
        case type.ERROR:
            message.error(action.payload.msg? action.payload.msg : action.payload == 'Unauthorized' ? 'You need to sign in' : 'error');
            console.log(action.payload)
            return {...state, loading: false, error: true, alert: true, msg: action.payload.msg}
        case type.GET_POSTS_SUCCESS:
            console.log(action.payload)
            const posts = state.posts && state.more_posts && action.payload.previous ? { posts: state.posts.concat(action.payload.results) }  : { posts: action.payload.results }
            return {...state, ...posts, loadingPosts: false, more_posts: action.payload.next? true: false}
        case type.SELL_POST_SUCCESS:
            action.func()
            return {...state, ...action.payload, loading: false}
        case type.GET_USER:
            console.log('get user reducer',action.payload)
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
            if(action.payload.msg === "liked"){
                post.likes = post.likes + 1
            }else if(action.payload.msg === "unliked"){ post.likes = post.likes - 1}
            return {...state, ...post }
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
            console.log(updatePosts)
            return {...state, ...{posts: updatePosts}}
        case type.CHECK_USERNAME:
            let available
            if(action.payload.msg === "username already exist"){ available = false }
            if(action.payload.msg === "username available"){ available = true }        
            return {...state, usernameAvailable: available, checkingUsername: false}
        case type.RATE_USER:
            action.payload.func()
            return state
        default:
            return state
    }
  }

export { initialState, reducer }