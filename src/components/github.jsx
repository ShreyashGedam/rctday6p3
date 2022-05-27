import axios from "axios"
import { useEffect, useReducer, useState } from "react"

const initstate = {
    loading : true,
    error : false,
    data : null
}

const githubactions = {
    fetch : "fetch",
    success : "success",
    failure : "failure"
}

const githubreducer = (state , action) =>
{
    switch(action.type){
        case githubactions.fetch : {
            return {
                ...state,
                loading : true,
                error : false,
                data : null
            }
        }
        
        case githubactions.success : {
            return {
                ...state,
                loading : false,
                error : false,
                data : action.payload
            }
        }

        case githubactions.failure : {
            return {
                ...state,
                loading : false,
                error : true
            }
        }

        default : return state
    }

}

export const Github = () =>
{

    const [{loading , error , data } , dispatch] = useReducer(githubreducer , initstate)

    const [search , setSearch] = useState("masai")

    const [pos , setPos] = useState(true)

    useEffect( () => {

        dispatch({
            type : githubactions.fetch
        })

        axios({
            url : "https://api.github.com/search/users",
            method : "GET",
            params : {
                q : search
            }
        })
        .then( (res) =>{
            dispatch({
                type : githubactions.success,
                payload : res.data
            })
            .catch( (err) =>{
                dispatch({
                    type : githubactions.failure
                })
            })
        })
    } , [pos])

    return (
        <div>
            {loading && <div>Loading</div>}
            {error && <div>Errorr</div>}
            <input type="text" placeholder="search user" onChange={ (e) => setSearch(e.target.value)}></input>
            <button onClick={ () => setPos(!pos)}>search</button>
            {data?.items.map( (item) =>(
                <div key={item.id}>{item.login}</div>
            ))}
        </div>
    )

}