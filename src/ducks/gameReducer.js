import axios from 'axios'

const initialState = {
    game: {}
}


const UPDATE = 'UPDATE'

//using redux here so i can keep header a functional component
export const update = (game_id, title, description, game_picture) => {
    let data = axios.put(`/api/game/update/${game_id}`, {title, description, game_picture}).then(res=>res.data)
    return{
        type:UPDATE,
        payload: data
    }
}

// updateGame = () => {
//     const{game_picture, title, description, game_id} = this.state
    
//     .then(res=>{
//         )
//     }).catch(err=>console.log(err))
// }

export default function reducer(state = initialState, action){
    switch(action.type){
        case update + '_FULFILLED':
            return{...state, game: action.payload}
        default:
            return state
    }
}